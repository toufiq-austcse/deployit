import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidGitUrl } from '@common/validators/index';

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

  @ApiPropertyOptional({ type: Object })
  @IsObject()
  @IsOptional()
  environment_variables: any = null;
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
    type: Object
  })
  @IsNotEmpty()
  @IsObject()
  environment_variables: Object;


}