import { ReportPriority, ReportStatus } from '../../../core/constants/app.constants';

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  activeAgents: number;
  reportsTrend?: number;
  pendingTrend?: number;
  resolvedTrend?: number;
  agentsTrend?: number;
  avgResolutionTimeHours: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
}

export interface InterventionBreakdown {
  status: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  reports: number;
  resolved: number;
}

export interface RecentReport {
  id: string;
  title: string;
  category: string;
  status: ReportStatus;
  priority: ReportPriority;
  citizen: string;
  createdAt: string;
}

export interface RecentActivity {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  icon: string;
}

export interface MapIncident {
  id: string;
  title: string;
  status: ReportStatus;
  lat: number;
  lng: number;
}

export interface DashboardSummary {
  stats: DashboardStats;
  categoryBreakdown: CategoryBreakdown[];
  interventionBreakdown: InterventionBreakdown[];
  monthlyTrend: MonthlyTrend[];
  recentReports: RecentReport[];
  recentActivities: RecentActivity[];
  mapIncidents: MapIncident[];
}
