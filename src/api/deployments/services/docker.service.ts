import { Injectable } from '@nestjs/common';
import { EnvironmentVariable } from '../entities/environment-variable.entity';

@Injectable()
export class DockerService {
  private PORT = 4000;


  getEnvVariablesCommandString(envVariables: EnvironmentVariable[]): string {
    let command = '';
    for (let envVariable of envVariables) {
      if (envVariable.key === 'PORT') {
        envVariable.value = this.PORT.toString();
      }
      command += ` -e ${envVariable.key}=${envVariable.value}`;
    }
    return command;
  }

  getContainerRunCommandString(imgTag: string, envVariableString: string): string {
    return `docker run -p :${this.PORT} -d ${envVariableString} ${imgTag}`;
  }

  getPortCommand(containerId: string): string {
    return `docker port ${containerId}`;
  }

  getContainerStopCommand(container_id: string): string {
    return `docker stop ${container_id}`;
  }
}