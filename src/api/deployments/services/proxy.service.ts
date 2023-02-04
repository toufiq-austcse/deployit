import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as httpProxy from 'http-proxy';

let proxy = httpProxy.default.createProxyServer();

@Injectable()
export class ProxyService {
  constructor() {
  }

  getSubDomainFromHostname(hostname: string) {
    return hostname.split('.')[0];
  }

  async proxyToDeployment(req: Request, res: Response, mappedPort: string) {
    let port= mappedPort.split(':')[1];
    return new Promise((resolve, reject) => {
      proxy.web(req, res, { target: `http://localhost:${port}` }, (err, message) => {
        if (err) {
          return reject(err);
        }
        resolve(message);
      });
    });
  }
}