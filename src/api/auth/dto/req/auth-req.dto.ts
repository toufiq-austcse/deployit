import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpReqDto {
  @ApiProperty()
  @IsEmail({}, {
    message: JSON.stringify({
      key: 'email',
      message: 'invalid email address'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      key: 'email',
      message: 'email is required'
    })
  })
  email: string;

  @ApiPropertyOptional()
  @IsString({
    message: JSON.stringify({
      key: 'name',
      message: 'name must be a string'
    })
  })
  @IsOptional()
  name: string;

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
  @MinLength(5, {
    message: JSON.stringify({
      key: 'password',
      message: 'password must be at least 5 characters'
    })
  })
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