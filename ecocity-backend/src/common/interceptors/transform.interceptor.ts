import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiEnvelope<T> {
  data: T;
  success: true;
}

/**
 * Enveloppe uniforme `{ data, success: true }` consommée par le client
 * Flutter (`response.data['data']`) et par le frontend Angular (services
 * `.pipe(map(unwrap))`).
 *
 * Exception : les réponses déjà paginées (`{ data: T[], meta }`, produites
 * par `paginate()`) sont laissées telles quelles — Angular les consomme en
 * `PaginatedResponse<T>` directement, sans double-enveloppe.
 *
 * Typé en `unknown` côté sortie : le payload réel dépend de chaque route
 * (objet simple vs déjà-paginé), une union stricte n'apporterait rien ici.
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor<unknown, unknown> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload: unknown) => {
        if (this.isAlreadyPaginated(payload)) {
          return payload;
        }
        return { data: payload, success: true as const };
      }),
    );
  }

  private isAlreadyPaginated(payload: unknown): payload is { data: unknown; meta: unknown } {
    return (
      !!payload &&
      typeof payload === 'object' &&
      'meta' in (payload as Record<string, unknown>) &&
      'data' in (payload as Record<string, unknown>)
    );
  }
}
