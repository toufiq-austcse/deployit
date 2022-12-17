import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '@common/app-config/service/app-config.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserTblSubscriber } from './subscribers/user-tbl.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.registerAsync({
    inject: [AppConfigService],
    useFactory: () => {
      return {
        secret: AppConfigService.appConfig.JWT_SECRET
      };
    }
  })],
  controllers: [AuthController],
  providers: [UserRepository, AuthService, UserTblSubscriber, JwtStrategy]
})
export class AuthModule {
}
