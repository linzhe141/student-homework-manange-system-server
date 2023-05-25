import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/common/guard/auth.guard';
import { FileModule } from './file/file.module';
@Module({
  imports: [DatabaseModule, UserModule, StudentModule, AuthModule, FileModule],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局jwt认证guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
