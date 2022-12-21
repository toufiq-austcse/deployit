import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DeploymentType } from '../entities/deployment-type.entity';

@Injectable()
export class DeploymentTypeRepository extends Repository<DeploymentType> {
  constructor(dataSource: DataSource) {
    super(DeploymentType, dataSource.manager);
  }
}