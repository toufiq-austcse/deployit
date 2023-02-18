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
    try {
      let res = await firstValueFrom(this.httpService.get(url));
      if (res.status === HttpStatus.OK) {
        isValidRepo = true;
      }
    } catch (e) {
      console.log(e);
    }
    return {
      is_valid: isValidRepo
    };
  }
}