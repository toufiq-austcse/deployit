import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IndexModule } from './index/index.module';
import { AppConfigModule } from '@common/app-config/app-config.module';
import { DatabaseModule } from '@common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { RabbitMQModule } from '@common/rabbit-mq/rabbit-mq.module';
import { ProxyMiddleware } from '../common/middleware/proxy.middleware';
import { HttpClientsModule } from '@common/http-clients/http-clients.module';


@Module({
  imports: [DatabaseModule, RabbitMQModule, AppConfigModule, HttpClientsModule, IndexModule, AuthModule, DeploymentsModule],
  controllers: [],
  providers: []
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProxyMiddleware)
      .forRoutes('*');
  }
}
