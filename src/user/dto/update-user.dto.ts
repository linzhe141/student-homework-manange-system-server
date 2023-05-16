import { UserType } from '@/enum/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class UpdateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '类型 1学生', enum: UserType })
  @IsEnum(UserType)
  @IsNotEmpty({ message: '类型不能为空' })
  type: number;
}
