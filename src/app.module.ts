import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UserModule, StudentModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
