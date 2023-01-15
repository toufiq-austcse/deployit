import { Injectable } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { CreateEnvReqDto } from '../dto/req/deployment-req.dto';
import { User } from '../../auth/entities/user.entity';
import { DeepPartial } from 'typeorm';
import { EnvironmentVariable } from '../entities/environment-variable.entity';
import { EnvironmentVariableRepository } from '../repositories/environment-variable.repository';
import { EnvironmentVariableResDto } from '../dto/res/deployment-res.dto';
import { plainToInstance } from 'class-transformer';
import { DeploymentJobDto } from '../dto/job';
import { JOB_NAME } from '@common/utils/constants';
import { RabbitMqService } from '@common/rabbit-mq/service/rabbitmq.service';
import { AppConfigService } from '@common/app-config/service/app-config.service';

@Injectable()
export class EnvironmentVariableService {
  constructor(private deploymentService: DeploymentService,
              private rabbitMqService: RabbitMqService,
              private repository: EnvironmentVariableRepository) {
  }

  async createEnvVariable(data: DeepPartial<EnvironmentVariable[]>): Promise<EnvironmentVariable[]> {
    let newEnvVariables = [];
    for (let envVariable of data) {
      let newEnvVariableObj = this.repository.create(envVariable);
      newEnvVariables.push(newEnvVariableObj);
    }
    return this.repository.save(newEnvVariables);

  }


  async createDeploymentEnvVariable(deploymentId: number, dto: CreateEnvReqDto, user: User): Promise<EnvironmentVariableResDto[]> {
    let deployment = await this.deploymentService.getDeploymentById(deploymentId, user.id);
    if (!deployment) throw new Error('Deployment not found');
    let envVariables: DeepPartial<EnvironmentVariable[]> = dto.environment_variables.map(envVariable => {
      return {
        key: envVariable.key,
        value: envVariable.value,
        deployment_id: deployment.id
      };
    });
    let newEnvironmentVariables = await this.createEnvVariable(envVariables);
    let job: DeploymentJobDto = {
      name: JOB_NAME.RESTART_DOCKER_CONTAINER,
      deployment_id: deployment.id
    };
    this.rabbitMqService.publish(AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_EXCHANGE, AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY, job);

    return plainToInstance(EnvironmentVariableResDto, newEnvironmentVariables, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });
  }

  async listDeploymentEnvVariable(deploymentId: number, user: User): Promise<EnvironmentVariableResDto[]> {
    let deployment = await this.deploymentService.getDeploymentById(deploymentId, user.id);
    if (!deployment) throw new Error('Deployment not found');
    let envVariables = await this.repository.find({ where: { deployment_id: deployment.id } });
    return plainToInstance(EnvironmentVariableResDto, envVariables, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });
  }

  async getEnvVariables(id: number): Promise<EnvironmentVariable[]> {
    return this.repository.find({ where: { deployment_id: id } });
  }

  async updateDeploymentEnvVariable(id: number, dto: CreateEnvReqDto, user: User): Promise<EnvironmentVariableResDto[]> {
    return [];

  }
}