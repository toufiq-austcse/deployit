import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from './entities/deployment.entity';
import { DeploymentType } from './entities/deployment-type.entity';
import { EnvironmentVariable } from './entities/environment-variable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment, DeploymentType, EnvironmentVariable])]
})
export class DeploymentsModule {
}
