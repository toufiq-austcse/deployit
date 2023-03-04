import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from './entities/deployment.entity';
import { DeploymentType } from './entities/deployment-type.entity';
import { DeploymentRepository } from './repositories/deployment.repository';
import { DeploymentTypeRepository } from './repositories/deployment-type.repository';
import { DeploymentController } from './controllers/deployment.controller';
import { DeploymentService } from './services/deployment.service';
import { DeploymentEntitySubscriber } from './entity-subscribers/deployment-entity.subscriber';
import { DeploymentJobHandler } from './job-handlers/deployment-job.handler';
import { DockerService } from './services/docker.service';
import { ProxyService } from './services/proxy.service';
import { RepositoryController } from './controllers/repository.controller';
import { RepositoryService } from './services/repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment, DeploymentType])],
  providers: [DeploymentRepository, DeploymentTypeRepository, DeploymentService,
    DeploymentEntitySubscriber, DeploymentJobHandler,
    DockerService, ProxyService, RepositoryService],
  controllers: [DeploymentController, RepositoryController],
  exports: [DeploymentService, ProxyService]
})
export class DeploymentsModule {
}
