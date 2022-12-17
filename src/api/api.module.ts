import { Module } from '@nestjs/common';
import { IndexModule } from './index/index.module';
import { AppConfigModule } from '@common/app-config/app-config.module';
import { DatabaseModule } from '@common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { DeploymentsModule } from './deployments/deployments.module';


@Module({
  imports: [DatabaseModule, AppConfigModule, IndexModule, AuthModule, DeploymentsModule],
  controllers: [],
  providers: []
})
export class ApiModule {

}
