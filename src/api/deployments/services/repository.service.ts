import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ValidateRepositoryResDto } from '../dto/res/repository-res.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RepositoryService {
  constructor(private httpService: HttpService) {
  }

  async validateRepository(url: string): Promise<ValidateRepositoryResDto> {
    let isValidRepo = false;
    let repoNameWithOwner = null;
    try {
      let res = await firstValueFrom(this.httpService.get(url));
      if (res.status === HttpStatus.OK) {
        isValidRepo = true;
        repoNameWithOwner = url.split('/').slice(-2).join('/');
      }
    } catch (e) {
      console.log(e);
    }
    return {
      is_valid: isValidRepo,
      repo_name_with_owner: repoNameWithOwner
    };
  }
}