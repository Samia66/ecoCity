import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { Permission } from '../../roles/models/role.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.permissions}`;

  getAll(): Observable<Permission[]> {
    return this.http.get<ApiResponse<Permission[]>>(this.baseUrl).pipe(unwrap());
  }

  create(payload: { code: string; label: string; module: string }): Observable<Permission> {
    return this.http.post<ApiResponse<Permission>>(this.baseUrl, payload).pipe(unwrap());
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
