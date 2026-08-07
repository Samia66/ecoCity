import { ApiResponse } from './api-response';
import { PaginationMeta } from './pagination-meta';

export class PaginatedResponse<T>
  extends ApiResponse<T[]>
{
  constructor(
    message: string,
    data: T[],
    meta: PaginationMeta,
  ) {
    super(
      true,
      message,
      data,
    );
  }
}