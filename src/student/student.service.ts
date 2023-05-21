import { HttpException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from '@/common/resutl/result';
import { User } from '@/user/entities/user.entity';
import { UserType } from '../enum/user';

type QueryStudentDto = {
  studentNum: string;
  studentName: string;
  currentPage: number;
  pageSize: number;
};
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private readonly student: Repository<Student>,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    return await this.student.manager.transaction(async () => {
      const { studentNum, studentName } = createStudentDto;
      const isExistStudent = await this.student.findOne({
        where: { studentNum },
      });
      if (isExistStudent) {
        throw new HttpException('学号不可重复', 400);
      }
      const isExistUser = await this.user.findOne({
        where: { username: studentNum },
      });
      if (isExistUser) {
        throw new HttpException('已存在该学号的用户', 400);
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
    const {
      studentNum = '',
      studentName = '',
      currentPage = 1,
      pageSize = 10,
    } = query;
    const [data, total] = await this.student.findAndCount({
      where: {
        studentNum: Like(`%${studentNum}%`),
        studentName: Like(`%${studentName}%`),
      },
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

  async findOne(id: number) {
    const student = await this.student.findOne({ where: { id } });
    if (!student) {
      throw new HttpException('该学生不存在', 400);
    }
    return new Result({ success: true, data: student, message: '' });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.student.findOne({ where: { id } });
    if (!student) {
      throw new HttpException('该学生不存在', 400);
    }
    await this.student.save({ ...student, ...updateStudentDto });
    return new Result({ success: true, message: '修改成功' });
  }

  async remove(id: number) {
    const student = await this.student.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!student) {
      throw new HttpException('该学生不存在', 400);
    }
    return await this.student.manager.transaction(async () => {
      await this.student.remove(student);
      const user = await this.user.findOne({ where: { id: student.user?.id } });
      await this.user.remove(user);
      return new Result({ success: true, message: '删除成功' });
    });
  }
}
