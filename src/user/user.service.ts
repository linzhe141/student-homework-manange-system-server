import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Result } from '../common/resutl/result';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async create({ username, password }: CreateUserDto) {
    await this.user.save({ username, password });
    return new Result({ success: true, message: '用户新增成功' });
  }

  async findAll(query: { username: string }) {
    const { username = '' } = query;
    const data = await this.user.find({
      where: { username: Like(`%${username}%`) },
    });
    return new Result({ success: true, data, message: '' });
  }

  async findOne(id: number) {
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
    const data = await this.user.findOne({ where: { id } });
    if (!data) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    await this.user.remove(data);
    return new Result({ success: true, message: '用户已删除' });
  }
}
