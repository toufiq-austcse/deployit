import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@common/app-config/service/app-config.service';


export async function setupSwagger(app: INestApplication, port: number) {

  let swaggerDocPath = '/api-doc';

  const config = new DocumentBuilder()
    .setTitle(AppConfigService.appConfig.SWAGGER_TITLE)
    .setDescription(AppConfigService.appConfig.SWAGGER_DESCRIPTION)
    .setVersion(AppConfigService.appConfig.SWAGGER_VERSION)
    .addApiKey(
      { type: 'apiKey', name: 'Authorization', in: 'header', scheme: 'bearer', bearerFormat: 'Bearer' },
      'auth'
    )
    .addServer(AppConfigService.appConfig.SWAGGER_SERVER_BASE_URL, AppConfigService.appConfig.SWAGGER_SERVER_BASE_URL_DESCRIPTION)
    .build();

  const document = SwaggerModule.createDocument(app, config);



  SwaggerModule.setup(swaggerDocPath, app, document, {
    swaggerOptions: { persistAuthorization: true, ignoreGlobalPrefix: true }
  });
}