import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { UserService } from 'src/user/services/user.service';
import { usersProvider } from 'src/user/providers/user.providers';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { jwtSecret } from '../config';
import { VkStrategy } from './strategies/vk.strategy';
import { VKAuthController } from './vkauth.controller';

@Module({
  providers: [AuthService, VKAuthController, LocalStrategy, UserService, JwtStrategy, VkStrategy, RefreshJwtStrategy, ...usersProvider],
  controllers: [AuthController, VKAuthController],
  imports: [
    JwtModule.register({
      secret: `${jwtSecret}`,
      signOptions: { expiresIn: '24h' }
    })
  ]
})
export class AuthModule { }
