import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StudentModule } from '../student/student.module';
import { Student } from '@/student/entities/student.entity';
import { File } from '@/file/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, File]), StudentModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
