import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ListDeploymentTypeResDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: string;
}

export class DeploymentType {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DeploymentResDto {

  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  deployment_type: DeploymentType;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  sub_domain_name: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  last_deployed_at: string;

  @ApiProperty()
  @Expose()
  repository_link: string;

  @ApiProperty()
  @Expose()
  branch_name: string;

  @ApiProperty()
  @Expose()
  root_dir: string;
}

