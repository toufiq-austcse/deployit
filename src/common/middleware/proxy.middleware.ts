import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as httpProxy from 'http-proxy';

let proxy = httpProxy.default.createProxyServer();

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Called ProxyMiddleware');
    let hostname = req.hostname;
    console.log('hostname: ', hostname);
    if (hostname.startsWith('www.') || hostname.startsWith('api.') || hostname === 'localhost') {
      next();
    } else {
      console.log(req.originalUrl, req.baseUrl, req.url);
      proxy.web(req, res, { target: `http://localhost:3001/${req.originalUrl}` }, err => {
        console.log('Proxy error: ', err);
        next();
      });
    }


  }
}
