import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { databaseErrorHandler } from '../utils/database-error.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      // Check if it's a validation error and modify its message
      if (
        typeof exceptionResponse === 'object' &&
        (exceptionResponse as any).message &&
        Array.isArray((exceptionResponse as any).message)
      ) {
        // Transform validation error messages
        message =
          'Validation failed: ' +
          (exceptionResponse as any).message
            .map((item: any) => Object.values(item.constraints).join(', '))
            .join('. ');
      } else {
        message = exception.message || 'Internal Server Error';
      }
    } else if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientInitializationError
    ) {
      // Use the database error handler
      status = HttpStatus.BAD_REQUEST;
      message = databaseErrorHandler(exception);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    const errorResponse: any = {
      success: false,
      message,
      data: null,
    };

    // Add stack trace only in development
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.stack = exception instanceof Error ? exception.stack : null;
    }

    response.status(status).json(errorResponse);
  }
}
