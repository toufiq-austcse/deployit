import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, Validate } from 'class-validator';
import { IsValidGitUrl } from '@common/validators/index';

export class ValidateRepositoryQueryDto {
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  @Validate(IsValidGitUrl)
  repository_url: string;
}