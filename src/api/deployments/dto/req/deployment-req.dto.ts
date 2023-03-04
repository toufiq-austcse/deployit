import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Validate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { sanitizeEnvVariable } from '@common/utils/index';
import { IsValidGitUrl } from '../../../../common/validators';

export class EnvironmentVariableReqDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateDeploymentReqDto {

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  deployment_type_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  @Validate(IsValidGitUrl)
  repository_url: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  branch_name: string = 'master';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  root_dir: string = null;

  @ApiPropertyOptional({ type: [EnvironmentVariableReqDto] })
  @IsArray()
  @IsOptional()
  @Transform(obj => sanitizeEnvVariable(obj))
  environment_variables: EnvironmentVariableReqDto[] = [];
}

export class ListDeploymentQueryDto {

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 20;
}


export class CreateEnvReqDto {
  @ApiProperty({
    type: [EnvironmentVariableReqDto]
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => EnvironmentVariableReqDto)
  @Transform(obj => sanitizeEnvVariable(obj))
  environment_variables: EnvironmentVariableReqDto[];


}