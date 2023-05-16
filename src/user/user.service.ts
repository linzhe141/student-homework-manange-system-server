import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Result } from '../common/resutl/result';
import { LoginUserDto } from '../auth/dto/auth-user.dto';
import { Student } from '@/student/entities/student.entity';

@Injectable()
export class UserService {
  constructor(
    // 注入 数据库操作Repo
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Student) private readonly student: Repository<Student>,
  ) {}

  // 认证使用
  findOneByUserName(username: string) {
    return this.user.findOne({ where: { username } });
  }

  async login({ username, password }: LoginUserDto) {
    const isExist = await this.user.findOne({ where: { username, password } });
    if (!isExist) {
      throw new HttpException('用户名或密码错误', 400);
    }
    return new Result({ success: true, message: '登录成功' });
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, type } = createUserDto;
    const isExist = await this.user.findOne({ where: { username } });
    if (isExist) {
      throw new HttpException('用户名不可重复', 400);
    }
    await this.user.save({ username, password, type });
    return new Result({ success: true, message: '用户新增成功' });
  }

  async findAll(query: { username: string }) {
    const { username = '' } = query;
    const data = await this.user.find({
      where: { username: Like(`%${username}%`) },
    });
    return new Result({ success: true, data, message: '' });
  }

  async findOneById(id: number) {
    const data = await this.user.findOne({ where: { id } });
    if (!data) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = await this.user.findOne({ where: { id } });
    if (!data) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const { username, password } = updateUserDto;
    await this.user.save({ id, username, password });
    return new Result({ success: true, message: '用户修改成功' });
  }

  async remove(id: number) {
    const data = await this.user.findOne({
      where: { id },
      relations: {
        student: true,
      },
    });
    console.log(data);
    if (!data) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return await this.user.manager.transaction(async () => {
      // 删除用户时，需要删除对应绑定的学生
      const student = await this.student.findOne({
        where: { id: data.student?.id },
      });
      if (student) {
        await this.student.remove(student);
      }
      await this.user.remove(data);
      return new Result({ success: true, message: '用户已删除' });
    });
  }
}
