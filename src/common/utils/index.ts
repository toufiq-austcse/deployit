import * as bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid/async';
import { EnvironmentVariableReqDto } from '../../api/deployments/dto/req/deployment-req.dto';
import { TransformFnParams } from 'class-transformer';
import { AppConfigService } from '@common/app-config/service/app-config.service';


export function concatObject(obj: Object, separator: string = ', ') {
  return Object.keys(obj)
    .map(function(key, index) {
      return (obj as any)[key];
    })
    .join(separator);
}


export function getHashedPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, 5);
}

export function checkPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function getNanoID(len: number): Promise<string> {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', len);
  return nanoid();
}

export function getServiceUrl(subDomainName: string): string {
  return `https://${subDomainName}.${AppConfigService.appConfig.DOMAIN_NAME}`;
}

export function parseRepoUrl(repoUrl: string): { repoName: string, repoOwner: string } {
  return {
    repoName: repoUrl.split('/').pop().replace('.git', ''),
    repoOwner: repoUrl.split('/').slice(-2)[0]
  };
}

export function sanitizeEnvVariable(obj: TransformFnParams): EnvironmentVariableReqDto[] {
  let variables = obj.value;
  let envObj: any = {};
  variables.forEach((variable: { key: string; value: any; }) => {
    envObj[variable.key] = variable.value;
  });
  let finalArr: EnvironmentVariableReqDto[] = [];

  Object.keys(envObj).forEach((key) => {
    finalArr.push({
      key,
      value: envObj[key]
    });
  });
  return finalArr;
}