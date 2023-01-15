import { Injectable, Logger } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  TransactionCommitEvent,
  UpdateEvent
} from 'typeorm';
import { EnvironmentVariable } from '../entities/environment-variable.entity';

@Injectable()
@EventSubscriber()
export class EnvironmentVariableEntitySubscriber implements EntitySubscriberInterface<EnvironmentVariable> {
  constructor(private dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
    Logger.log('Initialized', EnvironmentVariableEntitySubscriber.name);
  }

  listenTo() {
    return EnvironmentVariable;
  }

  afterInsert(event: InsertEvent<EnvironmentVariable>) {
    console.log('afterInsert', event.entity);
    return;

  }

  afterUpdate(event: UpdateEvent<EnvironmentVariable>) {
    console.log('afterUpdate', event);
    return;
  }

  afterTransactionCommit(event: TransactionCommitEvent): Promise<any> | void {
  }

}