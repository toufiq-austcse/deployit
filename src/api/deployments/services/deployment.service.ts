import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { DeploymentTypeRepository } from '../repositories/deployment-type.repository';
import { DEPLOYMENT_STATUS, DEPLOYMENT_TYPE_STATUS } from '@common/utils/constants';
import { DeploymentResDto, ListDeploymentTypeResDto } from '../dto/res/deployment-res.dto';
import { plainToInstance } from 'class-transformer';
import { CreateDeploymentReqDto } from '../dto/req/deployment-req.dto';
import { User } from '../../auth/entities/user.entity';
import { DeepPartial } from 'typeorm';
import { Deployment } from '../entities/deployment.entity';
import { DeploymentRepository } from '../repositories/deployment.repository';
import { DeploymentType } from '../entities/deployment-type.entity';

@Injectable()
export class DeploymentService {
  constructor(private deploymentTypesRepository: DeploymentTypeRepository, private repository: DeploymentRepository) {
  }

  async listDeploymentTypes(): Promise<ListDeploymentTypeResDto[]> {
    let deploymentTypes = await this.deploymentTypesRepository.find({ where: { status: DEPLOYMENT_TYPE_STATUS.ENABLED } });
    return plainToInstance(ListDeploymentTypeResDto, deploymentTypes, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });
  }

  async insertNewDeployment(data: DeepPartial<Deployment>): Promise<Deployment> {
    let newDeploymentObj = this.repository.create({ ...data });
    return this.repository.save(newDeploymentObj);
  }

  createDeploymentObjFromCreateReqDto(dto: CreateDeploymentReqDto, deploymentType: DeploymentType, user: User): DeepPartial<Deployment> {
    return {
      name: dto.name,
      deployment_type_id: deploymentType.id,
      root_dir: dto.root_dir,
      status: DEPLOYMENT_STATUS.QUEUED,
      repository_link: dto.repository_link,
      branch_name: dto.branch_name,
      user_id: user.id
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
    let newDeploymentObj = this.createDeploymentObjFromCreateReqDto(dto, deploymentType, user);
    let deployment = await this.insertNewDeployment(newDeploymentObj);
    return plainToInstance(DeploymentResDto, deployment, {
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
    return plainToInstance(DeploymentResDto, deployment, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });

  }
}