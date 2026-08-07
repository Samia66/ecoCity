export class DashboardOverviewDto {
  totalReports: number;

  totalUsers: number;

  totalAgents: number;

  totalCitizens: number;

  totalInterventions: number;

  reportsByStatus: unknown[];

  reportsByPriority: unknown[];

  reportsByCity: unknown[];

  reportsByCategory: unknown[];

  interventionsByStatus: unknown[];
}