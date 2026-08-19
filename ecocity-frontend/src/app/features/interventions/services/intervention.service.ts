import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { QueryParams, ApiResponse } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { AssignInterventionPayload, Intervention } from '../models/intervention.model';

@Injectable({ providedIn: 'root' })
export class InterventionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.interventions}`;

  /** Le backend renvoie une liste plate (pas de pagination serveur pour cette ressource). */
  getAll(params: QueryParams = {}): Observable<Intervention[]> {
    return this.http
      .get<ApiResponse<Intervention[]>>(this.baseUrl, { params: params as any })
      .pipe(unwrap());
  }

  getById(id: string): Observable<Intervention> {
    return this.http.get<ApiResponse<Intervention>>(`${this.baseUrl}/${id}`).pipe(unwrap());
  }

  assign(payload: AssignInterventionPayload): Observable<Intervention> {
    return this.http
      .post<ApiResponse<Intervention>>(`${this.baseUrl}/${payload.reportId}/assign`, { agentId: payload.agentId })
      .pipe(unwrap());
  }

  updateStatus(id: string, status: string, comment?: string): Observable<Intervention> {
    return this.http
      .patch<ApiResponse<Intervention>>(`${this.baseUrl}/${id}/status`, { status, comment })
      .pipe(unwrap());
  }
}
