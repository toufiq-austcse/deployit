import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Index')
@Controller()
export class IndexController {

  @Get()
  index(@Req() req: Request) {
    console.log(req);
    return {
      app: 'DeployIt is running.....'
    };
  }
}