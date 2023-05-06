import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return { success: true, message: '用户新增成功' };
    } catch (e) {
      throw new HttpException('用户新增失败', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Query() query: { name: string; age: number }) {
    try {
      const data = await this.userService.findAll(query);
      return { success: true, message: '', data };
    } catch (e) {
      throw new HttpException('用户查询失败', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findOne(+id);
    if (data) {
      return data;
    }
    throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
