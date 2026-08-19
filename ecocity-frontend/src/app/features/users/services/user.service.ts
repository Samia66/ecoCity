import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { PaginatedResponse, QueryParams, ApiResponse } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { CreateStaffUserResult, CreateUserPayload, UserItem } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.users}`;

  getAll(params: QueryParams = {}): Observable<PaginatedResponse<UserItem>> {
    return this.http.get<PaginatedResponse<UserItem>>(this.baseUrl, { params: params as any });
  }

  getById(id: string): Observable<UserItem> {
    return this.http.get<ApiResponse<UserItem>>(`${this.baseUrl}/${id}`).pipe(unwrap());
  }

  /** Le mot de passe temporaire n'est renvoyé qu'une seule fois, à la création. */
  create(payload: CreateUserPayload): Observable<CreateStaffUserResult> {
    return this.http.post<ApiResponse<CreateStaffUserResult>>(this.baseUrl, payload).pipe(unwrap());
  }

  update(id: string, payload: Partial<CreateUserPayload>): Observable<UserItem> {
    return this.http.patch<ApiResponse<UserItem>>(`${this.baseUrl}/${id}`, payload).pipe(unwrap());
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
