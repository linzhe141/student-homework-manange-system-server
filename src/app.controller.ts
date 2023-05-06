import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // throw new HttpException('fdasfas', HttpStatus.BAD_REQUEST);
    // throw 1;
    throw new Error('fdasfadsfd');
    return this.appService.getHello();
  }
}
