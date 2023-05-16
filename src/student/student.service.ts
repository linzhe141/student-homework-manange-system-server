import { HttpException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from '@/common/resutl/result';
import { User } from '@/user/entities/user.entity';
import { UserType } from '../enum/user';

type QueryStudentDto = { studentNum: string; studentName: string };
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private readonly student: Repository<Student>,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    return await this.student.manager.transaction(async () => {
      const { studentNum, studentName } = createStudentDto;
      const isExist = await this.student.findOne({ where: { studentNum } });
      if (isExist) {
        throw new HttpException('学号不可重复', 400);
      }
      const user = new User();
      user.username = studentNum;
      user.password = studentNum;
      user.type = UserType.STUDENT;
      const student = new Student();
      student.studentName = studentName;
      student.studentNum = studentNum;
      student.user = user;
      // 先建立一个user
      await this.user.save(user);
      await this.student.save(student);
      return new Result({ success: true, message: '学生新增成功' });
    });
  }

  async findAll(query: QueryStudentDto) {
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
