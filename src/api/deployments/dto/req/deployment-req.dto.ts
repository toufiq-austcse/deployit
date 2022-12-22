import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

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
  repository_link: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  branch_name: string = 'master';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  root_dir: string = null;
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