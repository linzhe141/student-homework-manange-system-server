import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './config/swagger.config';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { BaseExceptionsFilter } from './common/exceptions/base.exception.filter';
import { PORT, STATIC_ASSETS } from './config/app.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 静态资源，和这些配置顺序有关系
  app.useStaticAssets(join(__dirname, '..', 'upload'), {
    prefix: STATIC_ASSETS,
  });
  // swagger
  initSwagger(app);
  //版本控制 v1
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  //全局前缀
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new BaseExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  console.log();
  console.log(`> App started at port ${PORT}`);
  console.log(`swagger > http://localhost:${PORT}/api-docs`);
}
bootstrap();
