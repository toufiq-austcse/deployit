export interface EnvironmentVariables {

  RABBIT_MQ_URL: string;
  DOMAIN_NAME: string;
  REPOSITORIES_LOCAL_DIR_PATH: string;
  RABBIT_MQ_DEPLOY_IT_JOB_ROUTING_KEY: string;
  RABBIT_MQ_DEPLOY_IT_JOB_QUEUE: string;
  RABBIT_MQ_DEPLOY_IT_EXCHANGE: string;
  PORT: number;

  SWAGGER_TITLE: string;
  SWAGGER_DESCRIPTION: string;
  SWAGGER_VERSION: string;
  SWAGGER_SERVER_BASE_URL: string;
  SWAGGER_SERVER_BASE_URL_DESCRIPTION: string;

  SWAGGER_USERNAME: string;
  SWAGGER_PASSWORD: string;
  DB_DRIVER: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_MIGRATE: string;
  JWT_SECRET: string;

  GITHUB_BASE_URL: string;
  GITHUB_API_TOKEN: string;
}
