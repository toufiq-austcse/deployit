import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from '@common/http-clients/github/services/github.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [GithubService],
  exports: [GithubService]
})
export class HttpClientsModule {

}
