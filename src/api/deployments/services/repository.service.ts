import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidateRepositoryResDto } from '../dto/res/repository-res.dto';
import { GithubService } from '@common/http-clients/github/services/github.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RepositoryService {
  constructor(private githubService: GithubService) {
  }

  async validateRepository(repoUrl: string): Promise<ValidateRepositoryResDto> {
    let repoFullName = null;
    if (!repoUrl.endsWith('.git')) {
      throw new BadRequestException(JSON.stringify({
        key: 'repository_url',
        message: 'repository url is invalid'
      }));
    }
    let repoDetails = await this.githubService.getRepository(repoUrl);
    if (!repoDetails.isValid) {
      throw new BadRequestException(JSON.stringify({
        key: 'repository_url',
        message: 'repository url is invalid'
      }));
    }
    repoFullName = repoDetails.repository.full_name;

    return plainToInstance(ValidateRepositoryResDto, {
      repo_full_name: repoFullName
    }, { excludeExtraneousValues: true, enableImplicitConversion: true });
  }
}