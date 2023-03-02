import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../environment';

@Injectable()
export class AppConfigService {
  public static appConfig: EnvironmentVariables;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    let port = this.configService.get('PORT', 3000, { infer: true });
    AppConfigService.appConfig = {
      PORT: port,
      DOMAIN_NAME: this.configService.get('DOMAIN_NAME', 'toufiq.live'),
      RABBIT_MQ_DEPLOY_IT_EXCHANGE: this.configService.get('RABBIT_MQ_DEPLOY_IT_EXCHANGE'),
      REPOSITORIES_LOCAL_DIR_PATH: this.configService.get('REPOSITORIES_LOCAL_DIR_PATH'),
      RABBIT_MQ_URL: this.configService.get('RABBIT_MQ_URL'),
      RABBIT_MQ_DEPLOY_IT_JOB_QUEUE: this.configService.get('RABBIT_MQ_DEPLOY_IT_JOB_QUEUE'),
      RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY: this.configService.get('RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY'),
      JWT_SECRET: this.configService.get('JWT_SECRET'),
      SWAGGER_SERVER_BASE_URL: this.configService.get('SWAGGER_SERVER_BASE_URL', `http://localhost:${port}`),
      SWAGGER_SERVER_BASE_URL_DESCRIPTION: this.configService.get('SWAGGER_SERVER_BASE_URL_DESCRIPTION', 'Swagger Server Base URL'),
      SWAGGER_TITLE: this.configService.get('SWAGGER_TITLE', 'NEST BOILERPLATE'),
      SWAGGER_DESCRIPTION: this.configService.get('SWAGGER_DESCRIPTION', 'NEST BOILERPLATE API'),
      SWAGGER_VERSION: this.configService.get('SWAGGER_VERSION', '1.0'),
      DB_DRIVER: this.configService.get('DB_DRIVER', { infer: true }),
      DB_HOST: this.configService.get('DB_HOST', { infer: true }),
      DB_MIGRATE: this.configService.get('DB_MIGRATE', 'false', { infer: true }),
      DB_NAME: this.configService.get('DB_NAME', { infer: true }),
      DB_PASSWORD: this.configService.get('DB_PASSWORD', { infer: true }),
      DB_PORT: this.configService.get('DB_PORT', { infer: true }),
      DB_USER: this.configService.get('DB_USER', { infer: true }),
      SWAGGER_USERNAME: this.configService.get('SWAGGER_USERNAME'),
      SWAGGER_PASSWORD: this.configService.get('SWAGGER_PASSWORD'),
      GITHUB_API_TOKEN: this.configService.getOrThrow('GITHUB_API_TOKEN'),
      GITHUB_BASE_URL: this.configService.get('GITHUB_BASE_URL', 'https://api.github.com')

    };
  }
}
