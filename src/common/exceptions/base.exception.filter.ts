import type { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { isObject } from '@/utils';

// 拦截所有的异常
// TODO 处理其他异常
// @Catch()
@Catch(HttpException)
export class BaseExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseData = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    };
    // ?TODO ValidationPipe验证异常
    if (isObject(exception.getResponse())) {
      const message = (exception.getResponse() as any).message;
      if (Array.isArray(message)) {
        responseData.message = message.join(',');
      }
    }
    response.status(status).send(responseData);
  }
}
