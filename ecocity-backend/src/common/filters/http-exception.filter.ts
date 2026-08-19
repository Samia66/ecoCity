import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

/**
 * Filtre global : uniformise le format d'erreur JSON pour tous les clients
 * (Angular / Flutter) et traduit les erreurs Prisma connues en réponses HTTP
 * cohérentes plutôt que de laisser fuiter une trace serveur brute.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message, error } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} -> ${status}`, (exception as Error)?.stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolve(exception: unknown): { status: number; message: string | string[]; error?: string } {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'object' && body !== null) {
        const anyBody = body as { message?: string | string[]; error?: string };
        return {
          status: exception.getStatus(),
          message: anyBody.message ?? exception.message,
          error: anyBody.error,
        };
      }
      return { status: exception.getStatus(), message: exception.message };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.resolvePrismaError(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Une erreur interne est survenue. Veuillez réessayer.',
    };
  }

  private resolvePrismaError(exception: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (exception.code) {
      case 'P2002': {
        const target = (exception.meta?.target as string[])?.join(', ') ?? 'champ';
        return { status: HttpStatus.CONFLICT, message: `Une ressource avec ce ${target} existe déjà.` };
      }
      case 'P2025':
        return { status: HttpStatus.NOT_FOUND, message: 'Ressource introuvable.' };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Référence invalide : la ressource liée est introuvable.',
        };
      default:
        return { status: HttpStatus.BAD_REQUEST, message: 'Requête invalide.' };
    }
  }
}
