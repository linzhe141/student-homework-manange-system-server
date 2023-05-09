import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '新增' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '查询' })
  @ApiQuery({ name: 'username', description: '用户名', required: false })
  findAll(@Query() query: { username: string }) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '详情' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  findOne(@Param('id') id: string) {
    // +id 转为number
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: '用户id', required: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: '用户id', required: true })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
