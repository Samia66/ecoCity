import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { PaginatedResponse, QueryParams } from '../../../core/api/api-response.model';
import { AssignInterventionPayload, Intervention } from '../models/intervention.model';

@Injectable({ providedIn: 'root' })
export class InterventionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.interventions}`;

  getAll(params: QueryParams = {}): Observable<PaginatedResponse<Intervention>> {
    return this.http.get<PaginatedResponse<Intervention>>(this.baseUrl, { params: params as any });
  }

  getById(id: string): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.baseUrl}/${id}`);
  }

  assign(payload: AssignInterventionPayload): Observable<Intervention> {
    return this.http.post<Intervention>(this.baseUrl, payload);
  }

  updateStatus(id: string, status: string, comment?: string): Observable<Intervention> {
    return this.http.patch<Intervention>(`${this.baseUrl}/${id}/status`, { status, comment });
  }
}
