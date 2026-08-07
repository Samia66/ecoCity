import { ApiResponse } from './api-response';
import { PaginatedResponse } from './paginated-response';
import { PaginationMeta } from './pagination-meta';

export class ResponseHelper {
  static success<T>(
    message: string,
    data: T,
  ) {
    return new ApiResponse(
      true,
      message,
      data,
    );
  }

  static paginated<T>(
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number,
  ) {
    return new PaginatedResponse(
      message,
      data,
      new PaginationMeta(
        page,
        limit,
        total,
      ),
    );
  }
}