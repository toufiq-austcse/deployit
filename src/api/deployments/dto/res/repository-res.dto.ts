import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ValidateRepositoryResDto {
  @ApiProperty()
  @Expose()
  is_valid: boolean;
}