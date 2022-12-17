import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { LoginReqDto, SignUpReqDto } from '../dto/req/auth-req.dto';
import { AccessTokenPayload, LoginResDto, SignUpResDto } from '../dto/res/auth-res.dto';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { checkPassword } from '@common/utils/index';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private repository: UserRepository, private jwtService: JwtService) {
  }

  getAccessTokenPayload(user: User): AccessTokenPayload {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email
    };
  }

  async createUser(user: DeepPartial<User>): Promise<User> {
    let newUserObj = await this.repository.create({ ...user });
    return this.repository.save(newUserObj);
  }

  createUserObjFromSignUpReqDto(dto: SignUpReqDto): DeepPartial<User> {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password
    };
  }

  async signUp(dto: SignUpReqDto): Promise<SignUpResDto> {
    let currentUser = await this.repository.findOne({ where: { email: dto.email } });
    if (currentUser) {
      throw new BadRequestException('Email already exists');
    }
    let newUserObj = await this.createUserObjFromSignUpReqDto(dto);
    let user = await this.createUser(newUserObj);
    let accessTokenPayload = this.getAccessTokenPayload(user);
    let token = await this.jwtService.signAsync(accessTokenPayload);
    return plainToInstance(SignUpResDto, {
      token: { accessToken: token },
      user
    }, { excludeExtraneousValues: true, enableImplicitConversion: true });
  }

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    let user = await this.repository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    let isPasswordMatched = await checkPassword(user.password, dto.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Wrong password');
    }
    let accessTokenPayload = this.getAccessTokenPayload(user);
    let token = await this.jwtService.signAsync(accessTokenPayload);

    return plainToInstance(LoginResDto, {
      token: { accessToken: token },
      user
    }, { excludeExtraneousValues: true, enableImplicitConversion: true });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.repository.findOne({ where: { email } });
  }
}