import { Module } from '@nestjs/common';
import { IndexModule } from './index/index.module';

import { DatabaseModule } from '@common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { RabbitMQModule } from '@common/rabbit-mq/rabbit-mq.module';
import { AppConfigModule } from '../common/app-config/app-config.module';


@Module({
  imports: [DatabaseModule, RabbitMQModule, AppConfigModule, IndexModule, AuthModule, DeploymentsModule],
  controllers: [],
  providers: []
})
export class ApiModule {

}
