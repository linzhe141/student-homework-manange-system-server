import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export const initDoc = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('项目接口文档')
    .setDescription('xxxxxxxxxxxxxxxxxx')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);
};
