import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/auth-user.dto';

import { JwtService } from '@nestjs/jwt';
import { Result } from '../common/resutl/result';
import { UserService } from '../user/user.service';
import { StudentService } from '@/student/student.service';
import { UserType } from '@/enum/user';

@Injectable()
export class AuthService {
  constructor(
    // 注入user服务类
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private jwtService: JwtService,
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const { username, password, type } = loginUserDto;
    const user = await this.userService.findOneByUserName(username);
    if (user?.password !== password) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    let userInfo = null;
    if (type === UserType.ADMIN) {
      userInfo = {
        type: UserType.ADMIN,
        avatarImg: user.avatarImg,
      };
    }
    if (type === UserType.STUDENT) {
      const { data } = await this.studentService.findOne(user.student.id);
      userInfo = {
        type: UserType.STUDENT,
        avatarImg: user.avatarImg,
        studentName: data.studentName,
        studentNum: data.studentNum,
      };
    }
    const accessToken = await this.jwtService.signAsync({
      username,
      sub: user.id,
    });
    return new Result({
      success: true,
      message: '登录成功',
      data: {
        accessToken: accessToken,
        userInfo,
      },
    });
  }
}
