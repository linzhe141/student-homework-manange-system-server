import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initDoc } from './doc';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { BaseExceptionsFilter } from './common/exceptions/base.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger
  initDoc(app);
  //版本控制
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  //全局前缀
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new BaseExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3010);
}
bootstrap();
