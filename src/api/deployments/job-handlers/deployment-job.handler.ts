import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import * as process from 'process';
import * as fs from 'fs';
import { DeploymentJobDto } from '../dto/job';
import { DEPLOYMENT_STATUS, JOB_NAME } from '@common/utils/constants';
import { spawn } from 'child_process';
import { DeploymentRepository } from '../repositories/deployment.repository';
import { AppConfigService } from '@common/app-config/service/app-config.service';
import { RabbitMqService } from '@common/rabbit-mq/service/rabbitmq.service';
import { Deployment } from '../entities/deployment.entity';
import { DeploymentService } from '../services/deployment.service';
import { terminal } from '@common/utils/terminal';
import { DockerService } from '../services/docker.service';

@Injectable()
export class DeploymentJobHandler {
  constructor(private deploymentRepository: DeploymentRepository,
              private deploymentService: DeploymentService,
              private rabbitMqService: RabbitMqService,
              private dockerService: DockerService) {
  }

  @RabbitSubscribe({
    exchange: process.env.RABBIT_MQ_DEPLOY_IT_EXCHANGE,
    routingKey: process.env.RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY,
    queue: process.env.RABBIT_MQ_DEPLOY_IT_JOB_QUEUE
  })
  public async pubSubHandler(msg: DeploymentJobDto, amqpMsg: ConsumeMessage) {
    this.deploymentJobHandler(msg).then(msg => {
      console.log('deployment completed ', msg);
    }).catch(err => {
      console.log('error in deployment ', err);
    });

  }

  async deploymentJobHandler(msg: DeploymentJobDto) {
    let deployment = await this.deploymentRepository.findOne({ where: { id: msg.deployment_id } });
    if (!deployment) {
      console.log(`Deployment with ${msg.deployment_id} not found`);
      return;
    }
    await this.deploymentRepository.update({
      id: msg.deployment_id
    }, { status: DEPLOYMENT_STATUS.BUILDING });
    switch (msg.name) {
      case JOB_NAME.PULL_REPOSITORY: {
        this.pullRepository(deployment);
        break;
      }
      case JOB_NAME.BUILD_DOCKER_IMG: {
        this.buildDockerImg(deployment);
        break;
      }
      case JOB_NAME.RUN_DOCKER_CONTAINER: {
        this.runDockerContainer(deployment);
        break;
      }
      case JOB_NAME.RESTART_DOCKER_CONTAINER: {
        this.restartDockerContainer(deployment);
        break;
      }
    }
  }

  getDeploymentLocalCloneDir(deployment: Deployment): string {
    return `${AppConfigService.appConfig.REPOSITORIES_LOCAL_DIR_PATH}/${deployment.short_id}`;
  }

  async pullRepository(deployment: Deployment) {
    Logger.log('Pulling Repository', DeploymentJobHandler.name);
    let cloneDir = this.getDeploymentLocalCloneDir(deployment);
    let gitClone = spawn('git', ['clone', deployment.repository_url, cloneDir]);
    gitClone.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    gitClone.stderr.on('data', (data) => {
      console.error(`data: ${data}`);
    });

    gitClone.on('close', async (code) => {
      console.log(`child process exited with code ${code}`);
      if (code !== 0) {
        await this.deploymentRepository.update({ id: deployment.id }, { status: DEPLOYMENT_STATUS.FAILED });
        return;
      }
      Logger.log('Clone completed', DeploymentJobHandler.name);
      let job: DeploymentJobDto = {
        name: JOB_NAME.BUILD_DOCKER_IMG,
        deployment_id: deployment.id
      };
      await this.rabbitMqService.publish(AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_EXCHANGE, AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY, job);


    });
  }

  async buildDockerImg(deployment: Deployment) {
    Logger.log('Building docker img', DeploymentJobHandler.name);
    let deploymentLocalDir = this.getDeploymentLocalCloneDir(deployment);
    let imgTag = this.deploymentService.getDockerImgTag(deployment);
    let dockerImgBuild = spawn('docker', ['build', deploymentLocalDir, '-t', imgTag]);
    dockerImgBuild.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    dockerImgBuild.stderr.on('data', (data) => {
      console.error(`data: ${data}`);
    });

    dockerImgBuild.on('close', async (code) => {
      console.log(`child process exited with code ${code}`);
      if (code !== 0) {
        await this.deploymentRepository.update({ id: deployment.id }, {
          status: DEPLOYMENT_STATUS.FAILED
        });
        return;
      }
      Logger.log('build completed', DeploymentJobHandler.name);
      await this.deploymentRepository.update({ id: deployment.id }, {
        docker_img_tag: imgTag
      });
      let cloneDir = this.getDeploymentLocalCloneDir(deployment);
      fs.rmSync(cloneDir, { force: true, recursive: true });
      Logger.log('Repository deleted', DeploymentJobHandler.name);
      let job: DeploymentJobDto = {
        name: JOB_NAME.RUN_DOCKER_CONTAINER,
        deployment_id: deployment.id
      };
      await this.rabbitMqService.publish(AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_EXCHANGE, AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY, job);


    });
  }

  private async runDockerContainer(deployment: Deployment) {
    Logger.log('Running docker container', DeploymentJobHandler.name);
    try {
      let envVariableCommandString = this.dockerService.getEnvVariablesCommandString(deployment.environment_variables);
      let containerRunCommand = this.dockerService.getContainerRunCommandString(deployment.docker_img_tag, envVariableCommandString);
      let containerId = await terminal(containerRunCommand);
      let mappedPort = await this.dockerService.getMappedPort(containerId);
      await this.deploymentRepository.update({
        id: deployment.id
      }, {
        container_id: containerId,
        mapped_port: mappedPort,
        status: DEPLOYMENT_STATUS.RUNNING,
        last_deployed_at: new Date()
      });

    } catch (e) {
      console.log('error in run docker container ', e);
      await this.deploymentRepository.update({
        id: deployment.id
      }, { status: DEPLOYMENT_STATUS.FAILED });
    }

  }

  private async restartDockerContainer(deployment: Deployment) {
    Logger.log('Restarting docker container', DeploymentJobHandler.name);
    try {
      await this.deploymentRepository.update({ id: deployment.id }, { status: DEPLOYMENT_STATUS.RESTARTING });
      let dockerStopCommand = this.dockerService.getContainerStopCommand(deployment.container_id);
      await terminal(dockerStopCommand);
      let job: DeploymentJobDto = {
        name: JOB_NAME.RUN_DOCKER_CONTAINER,
        deployment_id: deployment.id
      };
      await this.rabbitMqService.publish(AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_EXCHANGE, AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY, job);

    } catch (e) {
      console.log('error in run docker container ', e);
      await this.deploymentRepository.update({
        id: deployment.id
      }, { status: DEPLOYMENT_STATUS.STOPPED });
    }
  }
}