import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GithubGetRepositoryRes } from '@common/http-clients/github/dto/res.dto';
import { AxiosError } from 'axios';
import { AxiosErrorException } from '@common/exceptions/axios-error.exception';
import { AppConfigService } from '@common/app-config/service/app-config.service';

@Injectable()
export class GithubService {
  constructor(private httpService: HttpService) {
  }

  async getRepository(ownerName: string, name: string): Promise<GithubGetRepositoryRes> {
    try {

      let res = await firstValueFrom(this.httpService.get(`${AppConfigService.appConfig.GITHUB_BASE_URL}/repos/${ownerName}/${name}`, {
        headers: {
          Authorization: `Bearer ${AppConfigService.appConfig.GITHUB_API_TOKEN}`
        }
      }));
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AxiosErrorException(error, GithubService.name);
      }
      throw new Error(error as any);
    }
  }
}