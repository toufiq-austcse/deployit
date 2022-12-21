import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Deployment } from '../entities/deployment.entity';

@Injectable()
export class DeploymentRepository extends Repository<Deployment> {
  constructor(dataSource: DataSource) {
    super(Deployment, dataSource.manager);
  }
}