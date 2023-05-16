import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateStudentDto {
  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  studentName: string;
}
