import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { Category, CreateCategoryPayload } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.categories}`;

  getAll(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.baseUrl).pipe(unwrap());
  }

  create(payload: CreateCategoryPayload): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.baseUrl, payload).pipe(unwrap());
  }

  update(id: string, payload: Partial<CreateCategoryPayload>): Observable<Category> {
    return this.http.patch<ApiResponse<Category>>(`${this.baseUrl}/${id}`, payload).pipe(unwrap());
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
