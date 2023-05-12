import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, isNotEmpty } from 'class-validator';
export class CreateStudentDto {
  @ApiProperty({ description: '学号' })
  @IsString()
  @IsNotEmpty({ message: '学号不能为空' })
  studentNum: string;

  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  studentName: string;
}
