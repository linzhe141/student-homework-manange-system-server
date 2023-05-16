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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('student')
@ApiBearerAuth('access-token')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: '新增' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: '查询' })
  @ApiQuery({ name: 'studentNum', description: '学号', required: false })
  @ApiQuery({ name: 'studentName', description: '姓名', required: false })
  findAll(
    @Query('studentName') studentName: string,
    @Query('studentNum') studentNum: string,
  ) {
    const query = { studentName, studentNum };
    return this.studentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '详情' })
  @ApiParam({ name: 'id', description: '学生id', required: true })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改' })
  @ApiParam({ name: 'id', description: '学生id', required: true })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', description: '学生id', required: true })
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
