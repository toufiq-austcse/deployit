import { Module } from '@nestjs/common';
import { IndexController } from './controller/index.controller';
import { DeploymentsModule } from '../deployments/deployments.module';
import { IndexService } from './services/index.service';

@Module({
  imports: [DeploymentsModule],
  controllers: [IndexController],
  providers: [IndexService]
})
export class IndexModule {
}
