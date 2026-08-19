import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { CreateRolePayload, Permission, Role } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.roles}`;
  private permissionsUrl = `${environment.apiUrl}${ENDPOINTS.permissions}`;

  getAll(): Observable<Role[]> {
    return this.http.get<ApiResponse<Role[]>>(this.baseUrl).pipe(unwrap());
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<ApiResponse<Permission[]>>(this.permissionsUrl).pipe(unwrap());
  }

  create(payload: CreateRolePayload): Observable<Role> {
    return this.http.post<ApiResponse<Role>>(this.baseUrl, payload).pipe(unwrap());
  }

  update(id: string, payload: Partial<CreateRolePayload>): Observable<Role> {
    return this.http.patch<ApiResponse<Role>>(`${this.baseUrl}/${id}`, payload).pipe(unwrap());
  }

  updatePermissions(id: string, permissionCodes: string[]): Observable<Role> {
    return this.http
      .patch<ApiResponse<Role>>(`${this.baseUrl}/${id}/permissions`, { permissionCodes })
      .pipe(unwrap());
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
