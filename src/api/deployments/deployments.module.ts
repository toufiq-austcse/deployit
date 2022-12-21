import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from './entities/deployment.entity';
import { DeploymentType } from './entities/deployment-type.entity';
import { EnvironmentVariable } from './entities/environment-variable.entity';
import { DeploymentRepository } from './repositories/deployment.repository';
import { DeploymentTypeRepository } from './repositories/deployment-type.repository';
import { EnvironmentVariableRepository } from './repositories/environment-variable.repository';
import { DeploymentController } from './controllers/deployment.controller';
import { DeploymentService } from './services/deployment.service';
import { DeploymentEntitySubscriber } from './entity-subscribers/deployment-entity.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment, DeploymentType, EnvironmentVariable])],
  providers: [DeploymentRepository, DeploymentTypeRepository, EnvironmentVariableRepository, DeploymentService, DeploymentEntitySubscriber],
  controllers: [DeploymentController]
})
export class DeploymentsModule {
}
