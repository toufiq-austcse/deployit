import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Index')
@Controller()
export class IndexController {

  @Get()
  index(@Req() req: Request) {
    console.log('host name ', req.hostname);
    console.log('host base url ', req.baseUrl);
    console.log('host url ', req.url);
    console.log('host original url ', req.originalUrl);
    console.log('host path ', req.path);
    console.log('host protocol ', req.protocol);
    console.log('host secure ', req.secure);
    console.log('host ip ', req.ip);
    return {
      app: 'DeployIt is running.....'
    };
  }
}