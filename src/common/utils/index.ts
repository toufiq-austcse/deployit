import * as bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid/async';
import { EnvironmentVariableReqDto } from '../../api/deployments/dto/req/deployment-req.dto';
import { TransformFnParams } from 'class-transformer';


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
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', len);
  return nanoid();
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