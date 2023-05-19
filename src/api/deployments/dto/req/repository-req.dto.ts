import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, Validate } from 'class-validator';
import { IsValidGitUrl } from '@common/validators/index';

export class ValidateRepositoryQueryDto {
  @ApiProperty()
  @IsUrl({}, {
    message: JSON.stringify({
      key: 'repository_url',
      message: 'repository_url should be a valid url'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      key: 'repository_url',
      message: 'repository_url is required'
    })
  })
  @Validate(IsValidGitUrl, {
    message: JSON.stringify({
      key: 'repository_url',
      message: 'repository_url should be a valid git url'
    })
  })
  repository_url: string;
}