import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse, PaginatedResponse, QueryParams } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { Collection } from '../models/collection.model';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.collections}`;

  /** Historique/liste paginée (ADMIN/SUPER_ADMIN uniquement). */
  getAll(params: QueryParams = {}): Observable<PaginatedResponse<Collection>> {
    return this.http.get<PaginatedResponse<Collection>>(this.baseUrl, { params: params as any });
  }

  getToday(): Observable<Collection[]> {
    return this.http.get<ApiResponse<Collection[]>>(`${this.baseUrl}/today`).pipe(unwrap());
  }

  getMyTeam(): Observable<Collection[]> {
    return this.http.get<ApiResponse<Collection[]>>(`${this.baseUrl}/my-team`).pipe(unwrap());
  }

  getById(id: string): Observable<Collection> {
    return this.http.get<ApiResponse<Collection>>(`${this.baseUrl}/${id}`).pipe(unwrap());
  }

  start(id: string): Observable<Collection> {
    return this.http.post<ApiResponse<Collection>>(`${this.baseUrl}/${id}/start`, {}).pipe(unwrap());
  }

  complete(id: string, comment?: string): Observable<Collection> {
    return this.http.post<ApiResponse<Collection>>(`${this.baseUrl}/${id}/complete`, { comment }).pipe(unwrap());
  }

  reportProblem(id: string, problemDescription: string): Observable<Collection> {
    return this.http
      .post<ApiResponse<Collection>>(`${this.baseUrl}/${id}/problem`, { problemDescription })
      .pipe(unwrap());
  }
}
