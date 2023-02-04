import { Injectable, NestMiddleware, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DeploymentService } from '../../api/deployments/services/deployment.service';
import { DEPLOYMENT_STATUS } from '@common/utils/constants';
import { ProxyService } from '../../api/deployments/services/proxy.service';


@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(private deploymentService: DeploymentService, private proxyService: ProxyService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Called ProxyMiddleware');
    let hostname = req.hostname;
    console.log('hostname: ', hostname);
    if (hostname.startsWith('www.') || hostname.startsWith('api.') || hostname === 'localhost') {
      next();
    } else {
      let subdomain = this.proxyService.getSubDomainFromHostname(hostname);
      console.log('subdomain: ', subdomain);
      let deployment = await this.deploymentService.getDeploymentBySubDomain(subdomain);
      if (!deployment) {
        throw new NotFoundException('Deployment not found');
      }
      if (deployment.status !== DEPLOYMENT_STATUS.RUNNING) {
        throw new UnprocessableEntityException('Deployment is not running');
      }
      try {
        let proxyRes = await this.proxyService.proxyToDeployment(req, res, deployment.mapped_port);
        console.log('proxyRes: ', proxyRes);
      } catch (e) {
        console.log('proxy err: ', e);
        throw new UnprocessableEntityException('Error while proxying to deployment');
      }

    }

  }
}
