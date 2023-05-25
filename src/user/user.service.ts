import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Result } from '../common/resutl/result';
import { Student } from '@/student/entities/student.entity';
import { File } from '@/file/entities/file.entity';
type QueryUserDto = {
  username: string;
  type: number;
  currentPage: number;
  pageSize: number;
};
@Injectable()
export class UserService {
  constructor(
    // 注入 数据库操作Repo
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Student) private readonly student: Repository<Student>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  // 认证使用
  findOneByUserName(username: string) {
    return this.user.findOne({
      where: { username },
      relations: {
        student: true,
      },
    });
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

  async findAll(query: QueryUserDto) {
    const { username = '', type = '', currentPage = 1, pageSize = 12 } = query;
    const where: FindOptionsWhere<User> = {
      username: Like(`%${username}%`),
    };
    if (type) {
      where.type = type;
    }
    const [data, total] = await this.user.findAndCount({
      where,
      order: {
        id: 'desc',
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    });
    return new Result({
      success: true,
      data: {
        data,
        total,
      },
      message: '',
    });
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

  async updateAvatar(id: number, avatar: { avatarId: number }) {
    const data = await this.user.findOne({
      where: { id },
      relations: {
        student: true,
      },
    });
    if (!data) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const fileItem = await this.fileRepository.findOne({
      where: { id: avatar.avatarId },
    });
    if (!fileItem) {
      throw new HttpException('头像文件不存在', HttpStatus.BAD_REQUEST);
    }
    await this.user.save({
      ...data,
      ...avatar,
      avatarImg: fileItem.serverFileName,
    });
    return new Result({ success: true, message: '头像修改成功' });
  }
}
