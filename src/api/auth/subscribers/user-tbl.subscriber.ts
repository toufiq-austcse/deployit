import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, LoadEvent } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { getHashedPassword } from '@common/utils/index';

@Injectable()
@EventSubscriber()
export class UserTblSubscriber implements EntitySubscriberInterface<User> {

  constructor(private datasource: DataSource, authService: AuthService) {
    this.datasource.subscribers.push(this);
    Logger.log('initialized', UserTblSubscriber.name);
  }

  listenTo() {
    return User;
  }

  async afterLoad(entity: User, event?: LoadEvent<User>) {

  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.password = await getHashedPassword(event.entity.password);
  }
}