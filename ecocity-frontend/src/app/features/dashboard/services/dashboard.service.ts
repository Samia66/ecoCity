import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getSummary(): Observable<DashboardSummary> {
    return this.http
      .get<any>(`${this.baseUrl}${ENDPOINTS.dashboard}`)
      .pipe(
        map((res) => {
          const d = res.data;

          return {
            stats: {
              totalReports: d.totalReports ?? 0,
              pendingReports: 0,
              resolvedReports: 0,
              activeAgents: d.totalAgents ?? 0,
              reportsTrend: 0,
              pendingTrend: 0,
              resolvedTrend: 0,
              agentsTrend: 0,
              avgResolutionTimeHours: 0,
            },

            categoryBreakdown: (d.reportsByCategory ?? []).map((item: any) => ({
              category: item.category,
              count: item.count,
            })),

            interventionBreakdown: (d.interventionsByStatus ?? []).map((item: any) => ({
              status: item.status,
              count: item.count,
            })),

            monthlyTrend: [],
            recentReports: [],
            recentActivities: [],
            mapIncidents: [],
          } as DashboardSummary;
        }),
      );
  }
}
