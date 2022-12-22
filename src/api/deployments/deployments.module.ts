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
import { DeploymentJobHandler } from './job-handlers/deployment-job.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment, DeploymentType, EnvironmentVariable])],
  providers: [DeploymentRepository, DeploymentTypeRepository, EnvironmentVariableRepository, DeploymentService, DeploymentEntitySubscriber, DeploymentJobHandler],
  controllers: [DeploymentController]
})
export class DeploymentsModule {
}
