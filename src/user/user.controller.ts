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
import { UserType } from '../enum/user';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth('access-token')
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
  @ApiQuery({
    name: 'type',
    enum: UserType,
    description: '类型 1 管理员 2 学生 ',
    required: false,
  })
  @ApiQuery({ name: 'currentPage', description: '当前页', required: false })
  @ApiQuery({ name: 'pageSize', description: '每页数目', required: false })
  findAll(
    @Query('username') username: string,
    @Query('type') type: number,
    @Query('currentPage') currentPage: number,
    @Query('pageSize') pageSize: number,
  ) {
    const query = { username, currentPage, pageSize, type };
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '详情' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  findOne(@Param('id') id: string) {
    // +id 转为number
    return this.userService.findOneById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch(':id/updateAvatar')
  @ApiOperation({ summary: '修改头像' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  updateAvatar(@Param('id') id: string, @Body() avatar: { avatarId: number }) {
    return this.userService.updateAvatar(+id, avatar);
  }
}
