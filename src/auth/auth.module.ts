import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { secret, expiresIn } from '@/config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../common/guard/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: secret,
      signOptions: { expiresIn },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
