import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpReqDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

export class LoginReqDto {
  @ApiProperty()
  @IsEmail({}, {
    message: JSON.stringify({
      key: 'email',
      message: 'Invalid email address'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      key: 'email',
      message: 'email is required'
    })
  })
  email: string;

  @ApiProperty()
  @IsString({
    message: JSON.stringify({
      key: 'password',
      message: 'password must be a string'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      key: 'password',
      message: 'password is required'
    })
  })
  password: string;
}