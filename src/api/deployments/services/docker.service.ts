import { Injectable } from '@nestjs/common';
import { terminal } from '@common/utils/terminal';

@Injectable()
export class DockerService {
  private PORT = 4000;


  getEnvVariablesCommandString(envVariables: Record<string, string>): string {
    let command = ` -e PORT=${this.PORT}`;
    for (let key of Object.keys(envVariables)) {
      if (key.toLowerCase() === 'port') {
        continue;
      }
      command += ` -e ${key}=${envVariables[key]}`;
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

  async getMappedPort(containerId: string): Promise<string> {
    let dockerPortCommand = this.getPortCommand(containerId);
    let terminalOutput = await terminal(dockerPortCommand);
    let lines = terminalOutput.split('\n');
    for (let line of lines) {
      let parts = line.split('->');
      for (let part of parts) {
        part = part.trim();
        if (part.startsWith('0.0.0.0')) {
          return part.split(':')[1].trim();
        }
      }
    }
    return null;
  }
}