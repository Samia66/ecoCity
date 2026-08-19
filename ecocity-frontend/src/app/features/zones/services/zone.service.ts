import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { CreateZonePayload, Zone } from '../models/zone.model';

@Injectable({ providedIn: 'root' })
export class ZoneService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.zones}`;

  getAll(): Observable<Zone[]> {
    return this.http.get<ApiResponse<Zone[]>>(this.baseUrl).pipe(unwrap());
  }

  getById(id: string): Observable<Zone> {
    return this.http.get<ApiResponse<Zone>>(`${this.baseUrl}/${id}`).pipe(unwrap());
  }

  create(payload: CreateZonePayload): Observable<Zone> {
    return this.http.post<ApiResponse<Zone>>(this.baseUrl, payload).pipe(unwrap());
  }

  update(id: string, payload: Partial<CreateZonePayload>): Observable<Zone> {
    return this.http.patch<ApiResponse<Zone>>(`${this.baseUrl}/${id}`, payload).pipe(unwrap());
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
