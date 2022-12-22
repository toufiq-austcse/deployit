import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Deployment } from '../entities/deployment.entity';
import { GetDeploymentsFilterDto } from '../dto/db-query/get-deployments-filter.dto';
import { IPaginationMeta, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class DeploymentRepository extends Repository<Deployment> {
  constructor(dataSource: DataSource) {
    super(Deployment, dataSource.manager);
  }

  async getDeployments(filter: GetDeploymentsFilterDto, pagination: { page: number, limit: number }): Promise<{ items: Deployment[]; meta: IPaginationMeta }> {
    let queryBuilder = this.createQueryBuilder('deployments');
    if (filter.user_id) {
      queryBuilder.where('deployments.user_id=:user_id', { user_id: filter.user_id });
    }
    if (filter.deployment_type_id) {
      queryBuilder.andWhere('deployments.deployment_type_id=:deployment_type_id', { deployment_type_id: filter.deployment_type_id });
    }
    if (filter.status) {
      queryBuilder.andWhere('deployments.status=:status', { status: filter.status });
    }
    queryBuilder.orderBy('deployments.createdAt', 'DESC');
    return paginate(queryBuilder, { page: pagination.page, limit: pagination.limit });
  }
}