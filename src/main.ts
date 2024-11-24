import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //setup custom global logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  //Add prefix
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

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  logger.log(`Application is running on http://localhost:${PORT}`, 'Bootstrap');
}
bootstrap();
