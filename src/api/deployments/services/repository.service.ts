import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ValidateRepositoryResDto } from '../dto/res/repository-res.dto';
import { GithubService } from '@common/http-clients/github/services/github.service';

@Injectable()
export class RepositoryService {
  constructor(private githubService: GithubService) {
  }

  parseRepoUrl(repoUrl: string): { repoName: string, repoOwner: string } {
    return {
      repoName: repoUrl.split('/').pop().replace('.git', ''),
      repoOwner: repoUrl.split('/').slice(-2)[0]
    };
  }

  async validateRepository(repoUrl: string): Promise<ValidateRepositoryResDto> {
    let isValid = false;
    let repoFullName = null;
    if (!repoUrl.endsWith('.git')) {
      throw new BadRequestException('Invalid repository url');
    }
    let parsedRepoUrl = this.parseRepoUrl(repoUrl);
    try {
      let repoDetails = await this.githubService.getRepository(parsedRepoUrl.repoOwner, parsedRepoUrl.repoName);
      isValid = true;
      repoFullName = repoDetails.full_name;
    } catch (e) {
      Logger.log(e, 'RepositoryService.validateRepository');
    }
    return {
      is_valid: isValid,
      repo_full_name: repoFullName
    };
  }
}