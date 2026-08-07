import { Injectable } from '@nestjs/common';

import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly repository: DashboardRepository,
  ) {}

  async overview() {
    const [
      totalReports,
      totalUsers,
      totalAgents,
      totalCitizens,
      totalInterventions,
      reportsByStatus,
      reportsByPriority,
      reportsByCity,
      reportsByCategory,
      interventionsByStatus,
    ] = await Promise.all([
      this.repository.totalReports(),
      this.repository.totalUsers(),
      this.repository.totalAgents(),
      this.repository.totalCitizens(),
      this.repository.totalInterventions(),
      this.repository.reportsByStatus(),
      this.repository.reportsByPriority(),
      this.repository.reportsByCity(),
      this.repository.reportsByCategory(),
      this.repository.interventionsByStatus(),
    ]);

    return {
      totalReports,
      totalUsers,
      totalAgents,
      totalCitizens,
      totalInterventions,
      reportsByStatus,
      reportsByPriority,
      reportsByCity,
      reportsByCategory,
      interventionsByStatus,
    };
  }
}