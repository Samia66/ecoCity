import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    const request =
      ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const error =
        exception.getResponse();

      if (typeof error === 'string') {
        message = error;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
      ) {
        const value = (
          error as {
            message: string | string[];
          }
        ).message;

        message = Array.isArray(value)
          ? value.join(', ')
          : value;
      }
    }

    response.status(status).json({
      success: false,

      statusCode: status,

      message,

      path: request.url,

      timestamp:
        new Date().toISOString(),
    });
  }
}