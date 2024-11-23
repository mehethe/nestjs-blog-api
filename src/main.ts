import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const whitelist = [''];

  app.setGlobalPrefix('api', { exclude: whitelist });

  // Enable CORS
  app.enableCors();
  // Global validation pipe setup
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable transformation
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  // Global exception filter setup
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
