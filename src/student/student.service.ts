import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from '@/common/resutl/result';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private readonly student: Repository<Student>,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    return await this.student.manager.transaction(async () => {
      const { studentNum } = createStudentDto;
      await this.user.save({
        username: studentNum,
        password: studentNum,
      });
      await this.student.save(createStudentDto);
      return new Result({ success: true, message: '学生新增成功' });
    });
  }

  async findAll(query: { studentNum: string; studentName: string }) {
    const { studentNum = '', studentName = '' } = query;
    const data = await this.student.find({
      where: {
        studentNum: Like(`%${studentNum}%`),
        studentName: Like(`%${studentName}%`),
      },
    });
    return new Result({ success: true, data, message: '' });
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
