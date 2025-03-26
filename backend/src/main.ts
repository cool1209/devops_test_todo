import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);
  
  app.enableCors({
    origin: ['http://localhost:3000', 'http://18.220.68.141', 'http://18.220.68.141:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
