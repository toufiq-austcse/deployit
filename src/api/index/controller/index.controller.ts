import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Index')
@Controller()
export class IndexController {

  @Get()
  index() {
    return {
      app: 'DeployIt is running.....'
    };
  }
}