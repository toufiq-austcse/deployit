import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Index')
@Controller()
export class IndexController {
  constructor() {
  }

  @Get()
  index() {
    console.log('api index');
    //return this.indexService.redirectToService(req, res);
    return 'DeployIt is running...';
  }
}