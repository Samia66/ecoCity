import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const request =
      ctx.getRequest<Request>();

    const response =
      ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let message = 'Internal server error';

    if (
      typeof exceptionResponse === 'string'
    ) {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object'
    ) {
      message =
        (exceptionResponse as any).message ??
        message;
    }

    response.status(status).json({
      success: false,

      statusCode: status,

      message,

      path: request.url,

      timestamp: new Date().toISOString(),
    });
  }
}