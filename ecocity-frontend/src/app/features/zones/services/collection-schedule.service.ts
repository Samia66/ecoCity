import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { CollectionSchedule, CreateSchedulePayload, UpdateSchedulePayload } from '../models/collection-schedule.model';

@Injectable({ providedIn: 'root' })
export class CollectionScheduleService {
  private http = inject(HttpClient);
  private zonesBaseUrl = `${environment.apiUrl}${ENDPOINTS.zones}`;
  private schedulesBaseUrl = `${environment.apiUrl}${ENDPOINTS.schedules}`;

  getByZone(zoneId: string): Observable<CollectionSchedule[]> {
    return this.http
      .get<ApiResponse<CollectionSchedule[]>>(`${this.zonesBaseUrl}/${zoneId}/schedules`)
      .pipe(unwrap());
  }

  create(zoneId: string, payload: CreateSchedulePayload): Observable<CollectionSchedule> {
    return this.http
      .post<ApiResponse<CollectionSchedule>>(`${this.zonesBaseUrl}/${zoneId}/schedules`, payload)
      .pipe(unwrap());
  }

  update(id: string, payload: UpdateSchedulePayload): Observable<CollectionSchedule> {
    return this.http
      .patch<ApiResponse<CollectionSchedule>>(`${this.schedulesBaseUrl}/${id}`, payload)
      .pipe(unwrap());
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.schedulesBaseUrl}/${id}`);
  }
}
