import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/auth-user.dto';

import { JwtService } from '@nestjs/jwt';
import { Result } from '../common/resutl/result';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    // 注入user服务类
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.userService.findOneByUserName(username);
    if (user?.password !== password) {
      throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
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
      },
    });
  }
}
