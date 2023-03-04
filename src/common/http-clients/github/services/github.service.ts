import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GithubGetRepositoryRes } from '@common/http-clients/github/dto/res.dto';
import { AxiosError } from 'axios';
import { AxiosErrorException } from '@common/exceptions/axios-error.exception';
import { AppConfigService } from '@common/app-config/service/app-config.service';
import { parseRepoUrl } from '@common/utils/index';

@Injectable()
export class GithubService {
  constructor(private httpService: HttpService) {
  }

  async getRepository(repoUrl: string): Promise<{ isValid: boolean, repository: GithubGetRepositoryRes }> {
    try {
      let { repoOwner, repoName } = parseRepoUrl(repoUrl);
      let res = await firstValueFrom(this.httpService.get(`${AppConfigService.appConfig.GITHUB_BASE_URL}/repos/${repoOwner}/${repoName}`, {
        headers: {
          Authorization: `Bearer ${AppConfigService.appConfig.GITHUB_API_TOKEN}`
        }
      }));
      return {
        isValid: true,
        repository: res.data
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status >= 500) {
          throw new AxiosErrorException(error, GithubService.name);
        }
        return {
          isValid: false,
          repository: null
        };
      }
      throw new Error(error as any);
    }
  }


}