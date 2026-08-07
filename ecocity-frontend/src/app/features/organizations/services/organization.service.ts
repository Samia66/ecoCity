import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { PaginatedResponse, QueryParams } from '../../../core/api/api-response.model';
import { CreateOrganizationPayload, Organization } from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.organizations}`;

  getAll(params: QueryParams = {}): Observable<PaginatedResponse<Organization>> {
    return this.http.get<PaginatedResponse<Organization>>(this.baseUrl, { params: params as any });
  }

  getById(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateOrganizationPayload): Observable<Organization> {
    return this.http.post<Organization>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<CreateOrganizationPayload>): Observable<Organization> {
    return this.http.patch<Organization>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
