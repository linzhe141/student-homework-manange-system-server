import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Result } from '../common/resutl/result';
import { File } from './entities/file.entity';
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}
  async create(file: Express.Multer.File) {
    const pwd = process.cwd();
    const serverFileName = new Date().getTime() + file.originalname;
    const serverPath = '/upload/' + serverFileName;
    const filePath = join(pwd, serverPath);
    await fs.writeFile(filePath, file.buffer);
    const fileItem = new File();
    fileItem.originalname = file.originalname;
    fileItem.serverFileName = serverFileName;
    fileItem.serverPath = serverPath;
    fileItem.path = filePath;
    const data = await this.fileRepository.save(fileItem);
    return new Result({ message: '上传成功', success: true, data: data.id });
  }
}
