import { Injectable } from '@nestjs/common';
import {
  PrismaService,
} from '../../../infrastructure/prisma/prisma.service';

import {
  RoleName,
} from '@prisma/client';

@Injectable()
export class DashboardRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async totalReports() {
    return this.prisma.report.count({
      where: {
        deletedAt: null,
      },
    });
  }

  async totalUsers() {
    return this.prisma.user.count({
      where: {
        deletedAt: null,
      },
    });
  }

  async totalAgents() {
    return this.prisma.user.count({
      where: {
        deletedAt: null,
        role: {
          name: RoleName.AGENT,
        },
      },
    });
  }

  async totalCitizens() {
    return this.prisma.user.count({
      where: {
        deletedAt: null,
        role: {
          name: RoleName.CITIZEN,
        },
      },
    });
  }

  async totalInterventions() {
    return this.prisma.intervention.count();
  }

  async reportsByStatus() {
    return this.prisma.report.groupBy({
      by: ['status'],

      _count: {
        status: true,
      },
    });
  }

  async reportsByPriority() {
    return this.prisma.report.groupBy({
      by: ['priority'],

      _count: {
        priority: true,
      },
    });
  }

  async reportsByCity() {
    return this.prisma.report.groupBy({
      by: ['city'],

      _count: {
        city: true,
      },
    });
  }

  async reportsByCategory() {
    return this.prisma.report.groupBy({
      by: ['categoryId'],

      _count: {
        categoryId: true,
      },
    });
  }

  async interventionsByStatus() {
    return this.prisma.intervention.groupBy({
      by: ['status'],

      _count: {
        status: true,
      },
    });
  }
}