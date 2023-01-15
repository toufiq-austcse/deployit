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
import { EnvironmentVariableService } from './services/env-variable.service';
import { EnvironmentVariableEntitySubscriber } from './entity-subscribers/environment-variable-entity.subscriber';
import { DockerService } from './services/docker.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment, DeploymentType, EnvironmentVariable])],
  providers: [DeploymentRepository, DeploymentTypeRepository, EnvironmentVariableRepository, DeploymentService,
    EnvironmentVariableService, DeploymentEntitySubscriber, EnvironmentVariableEntitySubscriber, DeploymentJobHandler,
    DockerService],
  controllers: [DeploymentController]
})
export class DeploymentsModule {
}
