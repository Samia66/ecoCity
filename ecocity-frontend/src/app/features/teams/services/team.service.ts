import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/api-response.model';
import { unwrap } from '../../../core/api/unwrap-response.operator';
import { CreateTeamPayload, Team, TeamMember } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}${ENDPOINTS.teams}`;

  getAll(): Observable<Team[]> {
    return this.http.get<ApiResponse<Team[]>>(this.baseUrl).pipe(unwrap());
  }

  getById(id: string): Observable<Team> {
    return this.http.get<ApiResponse<Team>>(`${this.baseUrl}/${id}`).pipe(unwrap());
  }

  create(payload: CreateTeamPayload): Observable<Team> {
    return this.http.post<ApiResponse<Team>>(this.baseUrl, payload).pipe(unwrap());
  }

  update(id: string, payload: Partial<CreateTeamPayload>): Observable<Team> {
    return this.http.patch<ApiResponse<Team>>(`${this.baseUrl}/${id}`, payload).pipe(unwrap());
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // --- Membres -------------------------------------------------------

  getMembers(teamId: string): Observable<TeamMember[]> {
    return this.http.get<ApiResponse<TeamMember[]>>(`${this.baseUrl}/${teamId}/members`).pipe(unwrap());
  }

  addMember(teamId: string, agentId: string): Observable<Team> {
    return this.http
      .post<ApiResponse<Team>>(`${this.baseUrl}/${teamId}/members`, { agentId })
      .pipe(unwrap());
  }

  removeMember(teamId: string, agentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${teamId}/members/${agentId}`);
  }

  // --- Affectation de zone ---------------------------------------------

  assignZone(teamId: string, zoneId: string): Observable<Team> {
    return this.http.post<ApiResponse<Team>>(`${this.baseUrl}/${teamId}/zone`, { zoneId }).pipe(unwrap());
  }

  unassignZone(teamId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${teamId}/zone`);
  }
}
