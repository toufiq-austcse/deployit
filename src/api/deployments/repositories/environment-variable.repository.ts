import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EnvironmentVariable } from '../entities/environment-variable.entity';

@Injectable()
export class EnvironmentVariableRepository extends Repository<EnvironmentVariable> {
  constructor(datasource: DataSource) {
    super(EnvironmentVariable, datasource.manager);
  }
}