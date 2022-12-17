import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  canActivate(context: ExecutionContext) {
    let req = context.switchToHttp().getRequest<Request>();
    if (!req.headers.authorization.startsWith('Bearer ')) {
      req.headers.authorization = `Bearer ${req.headers.authorization}`;
    }
    return super.canActivate(context);
  }

}
