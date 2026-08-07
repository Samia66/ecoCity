import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { PaginatedResponse, QueryParams } from '../../../core/api/api-response.model';
import { CreateUserPayload, UserItem } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.users}`;

  getAll(params: QueryParams = {}): Observable<PaginatedResponse<UserItem>> {
    return this.http.get<PaginatedResponse<UserItem>>(this.baseUrl, { params: params as any });
  }

  getById(id: string): Observable<UserItem> {
    return this.http.get<UserItem>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateUserPayload): Observable<UserItem> {
    return this.http.post<UserItem>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<CreateUserPayload>): Observable<UserItem> {
    return this.http.patch<UserItem>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
