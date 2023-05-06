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
  @IsNumber({}, {
    message: JSON.stringify({
      key: 'deployment_type_id',
      message: 'deployment_type_id should be a number'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      key: 'deployment_type_id',
      message: 'deployment_type_id is required'
    })
  })
  deployment_type_id: number;

  @ApiProperty()
  @IsString({
    message: JSON.stringify({
      key: 'name',
      message: 'name must be a string'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      key: 'name',
      message: 'name is required'
    })
  })
  name: string;

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
  @Validate(IsValidGitUrl)
  repository_url: string;

  @ApiPropertyOptional()
  @IsString({
    message: JSON.stringify({
      key: 'branch_name',
      message: 'branch_name must be a string'
    })
  })
  @IsOptional()
  branch_name: string = 'master';

  @ApiPropertyOptional()
  @IsString({
    message: JSON.stringify({
      key: 'root_dir',
      message: 'root_dir must be a string'
    })
  })
  @IsOptional()
  root_dir: string = null;

  @ApiPropertyOptional({ type: Object })
  @IsObject({
    message: JSON.stringify({
      key: 'environment_variables',
      message: 'environment_variables must be an object'
    })
  })
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