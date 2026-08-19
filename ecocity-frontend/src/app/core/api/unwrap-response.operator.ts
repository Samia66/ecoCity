import { OperatorFunction, map } from 'rxjs';
import { ApiResponse } from './api-response.model';

/**
 * Le backend EcoCity enveloppe toutes les réponses non paginées dans
 * `{ data, success: true }` (convention partagée avec l'app Flutter, qui lit
 * `response.data['data']`). Cet opérateur extrait `.data` côté Angular.
 *
 * Ne pas utiliser sur les endpoints paginés : ceux-ci renvoient directement
 * `{ data: T[], meta }` sans enveloppe supplémentaire.
 */
export function unwrap<T>(): OperatorFunction<ApiResponse<T>, T> {
  return map((res) => res.data);
}
