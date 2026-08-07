import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { PaginatedResponse, QueryParams } from '../../../core/api/api-response.model';
import { CreateReportPayload, Report, ReportFilters } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.reports}`;

  getAll(params: QueryParams & ReportFilters = {}): Observable<PaginatedResponse<Report>> {
    return this.http.get<PaginatedResponse<Report>>(this.baseUrl, { params: params as any });
  }

  getById(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateReportPayload): Observable<Report> {
    return this.http.post<Report>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<CreateReportPayload>): Observable<Report> {
    return this.http.patch<Report>(`${this.baseUrl}/${id}`, payload);
  }

  updateStatus(id: string, status: string, comment?: string): Observable<Report> {
    return this.http.patch<Report>(`${this.baseUrl}/${id}/status`, { status, comment });
  }

  uploadAttachment(id: string, file: File): Observable<Report> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Report>(`${this.baseUrl}/${id}/attachments`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addComment(id: string, message: string): Observable<Report> {
    return this.http.post<Report>(`${this.baseUrl}/${id}/comments`, { message });
  }
}
