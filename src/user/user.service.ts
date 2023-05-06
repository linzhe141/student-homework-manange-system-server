import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const addUser = new User();
    addUser.name = createUserDto.name;
    addUser.age = createUserDto.age;
    return this.user.save(addUser);
  }

  async findAll(query: { name: string; age: number }) {
    const { name, age } = query;
    // return `This action returns all user`;
    const where: any = { name: Like(`%${name}%`) };
    age && (where.age = age);
    const data = await this.user.find({
      where,
    });
    return data;
  }

  async findOne(id: number) {
    const data = await this.user.findOne({ where: { id } });
    return data;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
