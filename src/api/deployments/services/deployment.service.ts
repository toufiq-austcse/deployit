import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { DeploymentTypeRepository } from '../repositories/deployment-type.repository';
import { DEPLOYMENT_STATUS, DEPLOYMENT_TYPE_STATUS, JOB_NAME } from '@common/utils/constants';
import { DeploymentResDto, ListDeploymentResDto, ListDeploymentTypeResDto } from '../dto/res/deployment-res.dto';
import { plainToInstance } from 'class-transformer';
import { CreateDeploymentReqDto, ListDeploymentQueryDto } from '../dto/req/deployment-req.dto';
import { User } from '../../auth/entities/user.entity';
import { DeepPartial, In } from 'typeorm';
import { Deployment } from '../entities/deployment.entity';
import { DeploymentRepository } from '../repositories/deployment.repository';
import { DeploymentType } from '../entities/deployment-type.entity';
import { GetDeploymentsFilterDto } from '../dto/db-query/get-deployments-filter.dto';
import { DeploymentJobDto } from '../dto/job';

import { AppConfigService } from '@common/app-config/service/app-config.service';
import { EnvironmentVariable } from '../entities/environment-variable.entity';
import dataSource from '../../../../ormconfig';
import { GithubService } from '@common/http-clients/github/services/github.service';
import { RabbitMqService } from '@common/rabbit-mq/service/rabbitmq.service';
import { EnvironmentVariableRepository } from '../repositories/environment-variable.repository';

@Injectable()
export class DeploymentService {
  constructor(private deploymentTypesRepository: DeploymentTypeRepository,
              private envRepository: EnvironmentVariableRepository,
              private repository: DeploymentRepository,
              private githubService: GithubService,
              private rabbitMqService: RabbitMqService) {
  }

  async listDeploymentTypes(): Promise<ListDeploymentTypeResDto[]> {
    let deploymentTypes = await this.deploymentTypesRepository.find({ where: { status: DEPLOYMENT_TYPE_STATUS.ENABLED } });
    return plainToInstance(ListDeploymentTypeResDto, deploymentTypes, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });
  }

  async insertNewDeployment(data: DeepPartial<Deployment>, environmentVariablesData: DeepPartial<EnvironmentVariable[]>):
    Promise<{ deployment: Deployment, environmentVariables: EnvironmentVariable[] }> {
    return dataSource.transaction(async transactionalEntityManager => {
      let deploymentRepository = transactionalEntityManager.getRepository(Deployment);
      let environmentVariableRepository = transactionalEntityManager.getRepository(EnvironmentVariable);

      let newDeploymentObj = deploymentRepository.create({ ...data });
      let deployment = await deploymentRepository.save(newDeploymentObj);

      let newEnvironmentVariables: DeepPartial<EnvironmentVariable>[] = [];
      for (let environmentVariable of environmentVariablesData) {
        newEnvironmentVariables.push({
          deployment_id: deployment.id,
          key: environmentVariable.key,
          value: environmentVariable.value
        });
      }
      let environmentVariables = await environmentVariableRepository.save(newEnvironmentVariables);
      return {
        deployment,
        environmentVariables
      };

    });

  }

  createDeploymentObjFromCreateReqDto(dto: CreateDeploymentReqDto, fullName: string, deploymentType: DeploymentType, user: User): DeepPartial<Deployment> {
    return {
      name: dto.name,
      deployment_type_id: deploymentType.id,
      root_dir: dto.root_dir,
      status: DEPLOYMENT_STATUS.QUEUED,
      repository_url: dto.repository_url,
      branch_name: dto.branch_name,
      user_id: user.id,
      repository_full_name: fullName
    };
  }

  async createDeployment(dto: CreateDeploymentReqDto, user: User): Promise<DeploymentResDto> {
    let deploymentType = await this.deploymentTypesRepository.findOne({ where: { id: dto.deployment_type_id } });
    if (!deploymentType) {
      throw new BadRequestException('Invalid deployment type');
    }
    if (deploymentType.status === DEPLOYMENT_TYPE_STATUS.DISABLED) {
      throw new NotAcceptableException('This deployment type is currently disabled');
    }
    let oldDeployment = await this.repository.findOne({
      where: {
        name: dto.name,
        user_id: user.id
      }
    });
    if (oldDeployment) {
      throw new BadRequestException('Deployment with this name already exists');
    }
    let { isValid, repository } = await this.githubService.getRepository(dto.repository_url);
    if (!isValid) {
      throw new BadRequestException('Invalid repository url');
    }
    let newDeploymentObj = this.createDeploymentObjFromCreateReqDto(dto, repository.full_name, deploymentType, user);
    let {
      deployment,
      environmentVariables
    } = await this.insertNewDeployment(newDeploymentObj, dto.environment_variables);
    return plainToInstance(DeploymentResDto, { ...deployment, environmentVariables }, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });

  }

  async showDeployment(id: number, user: User): Promise<DeploymentResDto> {
    let deployment = await this.repository.findOne({
      where: {
        id,
        user_id: user.id
      },
      relations: ['deployment_type']
    });
    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }
    let environmentVariables = await this.envRepository.find({
      where: {
        deployment_id: deployment.id
      }
    });
    return plainToInstance(DeploymentResDto, { ...deployment, environmentVariables }, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });

  }

  async listDeployments(query: ListDeploymentQueryDto, user: User): Promise<ListDeploymentResDto> {
    let filter = this.buildGetDeploymentsFilter(query, user);
    let { items, meta } = await this.repository.getDeployments(filter, { page: query.page, limit: query.limit });
    await this.mapDeploymentType(items);
    return plainToInstance(ListDeploymentResDto, {
      items, meta
    }, { enableImplicitConversion: true, excludeExtraneousValues: true });
  }

  private buildGetDeploymentsFilter(query: ListDeploymentQueryDto, user?: User): GetDeploymentsFilterDto {
    let filter: GetDeploymentsFilterDto = Object.create({});
    if (user) {
      filter.user_id = user.id;
    }
    return filter;

  }

  async mapDeploymentType(deployments: Deployment[]): Promise<Deployment[]> {
    let deploymentTypeIds = deployments.map(deployment => deployment.deployment_type_id);
    let deploymentTypes = await this.deploymentTypesRepository.find({
      where: {
        id: In(deploymentTypeIds)
      }
    });
    deployments.forEach(deployment => {
      let deploymentTypeIndex = deploymentTypes.findIndex(deploymentType => deploymentType.id === deployment.deployment_type_id);
      if (deploymentTypeIndex >= 0) {
        deployment.deployment_type = deploymentTypes[deploymentTypeIndex];
      }
    });
    return deployments;

  }

  async sendPullRepositoryJob(id: number) {
    let job: DeploymentJobDto = { name: JOB_NAME.PULL_REPOSITORY, deployment_id: id };
    this.rabbitMqService.publish(AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_EXCHANGE, AppConfigService.appConfig.RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY, job);
  }

  getDockerImgTag(deployment: Deployment): string {
    return deployment.sub_domain_name.toLowerCase();
  }

  async getDeploymentById(id: number, userId: number) {
    return this.repository.findOne({
      where: {
        id: id,
        user_id: userId
      }
    });
  }

  async getDeploymentBySubDomain(subDomainName: string): Promise<Deployment> {
    return await this.repository.findOne({
      where: {
        sub_domain_name: subDomainName
      }
    });
  }
}