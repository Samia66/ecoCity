import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { CreateRolePayload, Permission, Role } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.roles}`;
  private permissionsUrl = `${environment.apiUrl}${ENDPOINTS.permissions}`;

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl);
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.permissionsUrl);
  }

  create(payload: CreateRolePayload): Observable<Role> {
    return this.http.post<Role>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<CreateRolePayload>): Observable<Role> {
    return this.http.patch<Role>(`${this.baseUrl}/${id}`, payload);
  }

  updatePermissions(id: string, permissionCodes: string[]): Observable<Role> {
    return this.http.patch<Role>(`${this.baseUrl}/${id}/permissions`, { permissionCodes });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
