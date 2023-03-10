import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LoadEvent,
  RecoverEvent,
  RemoveEvent, SoftRemoveEvent, TransactionCommitEvent, TransactionRollbackEvent, TransactionStartEvent, UpdateEvent
} from 'typeorm';
import { Deployment } from '../entities/deployment.entity';
import { Injectable, Logger } from '@nestjs/common';
import { getNanoID } from '@common/utils/index';
import { DEFAULT_BRANCH_NAME, DEPLOYMENT_STATUS } from '@common/utils/constants';
import { DeploymentService } from '../services/deployment.service';

@Injectable()
@EventSubscriber()
export class DeploymentEntitySubscriber implements EntitySubscriberInterface<Deployment> {
  constructor(private datasource: DataSource, private deploymentService: DeploymentService) {
    this.datasource.subscribers.push(this);
    Logger.log('Initialized', DeploymentEntitySubscriber.name);
  }

  listenTo() {
    return Deployment;
  }

  async afterInsert(event: InsertEvent<Deployment>) {
    if (event.entity.status === DEPLOYMENT_STATUS.QUEUED) {
      try {
        await this.deploymentService.sendPullRepositoryJob(event.entity.id);
      } catch (e) {
        console.log('error in pull repository job ', e);
      }

    }
    return;
  }

  afterLoad(entity: Deployment, event?: LoadEvent<Deployment>): Promise<any> | void {
    return undefined;
  }

  afterRecover(event: RecoverEvent<Deployment>): Promise<any> | void {
    return undefined;
  }

  afterRemove(event: RemoveEvent<Deployment>): Promise<any> | void {
    return undefined;
  }

  afterSoftRemove(event: SoftRemoveEvent<Deployment>): Promise<any> | void {
    return undefined;
  }

  afterTransactionCommit(event: TransactionCommitEvent): Promise<any> | void {
    return undefined;
  }

  afterTransactionRollback(event: TransactionRollbackEvent): Promise<any> | void {
    return undefined;
  }

  afterTransactionStart(event: TransactionStartEvent): Promise<any> | void {
    return undefined;
  }

  afterUpdate(event: UpdateEvent<Deployment>):void {
    let updatedColumns = event.updatedColumns.map((column) => column.propertyName);
    if (updatedColumns.includes('environment_variables')) {
      console.log('environment_variables updated');
    }
    return;
  }

  async beforeInsert(event: InsertEvent<Deployment>): Promise<void> {
    Logger.log('Before Insert called');
    let shortId = (await getNanoID(7)).toLowerCase();
    if (!event.entity.short_id) {
      event.entity.short_id = shortId;
    }
    if (!event.entity.sub_domain_name) {
      event.entity.sub_domain_name = `${event.entity.name}-${shortId}`.toLowerCase();
    }
    if (!event.entity.branch_name) {
      event.entity.branch_name = DEFAULT_BRANCH_NAME;
    }
    return;
  }

  beforeRecover(event: RecoverEvent<Deployment>): Promise<any> | void {
    return undefined;
  }

  beforeRemove(event: RemoveEvent<Deployment>): Promise<any> | void {
    return undefined;
  }

  beforeSoftRemove(event: SoftRemoveEvent<Deployment>): Promise<any> | void {
    return undefined;
  }

  beforeTransactionCommit(event: TransactionCommitEvent): Promise<any> | void {
    return undefined;
  }

  beforeTransactionRollback(event: TransactionRollbackEvent): Promise<any> | void {
    return undefined;
  }

  beforeTransactionStart(event: TransactionStartEvent): Promise<any> | void {
    return undefined;
  }

  beforeUpdate(event: UpdateEvent<Deployment>): Promise<any> | void {
    return undefined;
  }


}