import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidateRepositoryResDto } from '../dto/res/repository-res.dto';
import { GithubService } from '@common/http-clients/github/services/github.service';

@Injectable()
export class RepositoryService {
  constructor(private githubService: GithubService) {
  }

  async validateRepository(repoUrl: string): Promise<ValidateRepositoryResDto> {
    let isValid = false;
    let repoFullName = null;
    if (!repoUrl.endsWith('.git')) {
      throw new BadRequestException('Invalid repository url');
    }
    let repoDetails = await this.githubService.getRepository(repoUrl);
    isValid = repoDetails.isValid;
    repoFullName = repoDetails.repository.full_name;

    return {
      is_valid: isValid,
      repo_full_name: repoFullName
    };
  }
}