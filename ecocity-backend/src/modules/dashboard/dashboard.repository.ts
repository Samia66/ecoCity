import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  countReports(where: Prisma.ReportWhereInput): Promise<number> {
    return this.prisma.report.count({ where });
  }

  countUsers(where: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  reportsByStatus(where: Prisma.ReportWhereInput) {
    return this.prisma.report.groupBy({ by: ['status'], where, _count: { _all: true } });
  }

  reportsByCategory(where: Prisma.ReportWhereInput) {
    return this.prisma.report.groupBy({ by: ['categoryId'], where, _count: { _all: true } });
  }

  interventionsByStatus(where: Prisma.InterventionWhereInput) {
    return this.prisma.intervention.groupBy({ by: ['status'], where, _count: { _all: true } });
  }

  recentReports(where: Prisma.ReportWhereInput, take = 5) {
    return this.prisma.report.findMany({
      where,
      take,
      orderBy: { createdAt: 'desc' },
      include: { category: true, author: true },
    });
  }

  reportsWithCoordinates(where: Prisma.ReportWhereInput, take = 100) {
    return this.prisma.report.findMany({
      where: { ...where, latitude: { not: null }, longitude: { not: null } },
      take,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, status: true, latitude: true, longitude: true },
    });
  }

  /** Nombre d'agents (d'une liste donnée) n'ayant aucune intervention active en ce moment. */
  async countAvailableAgents(agentIds: string[]): Promise<number> {
    if (agentIds.length === 0) return 0;
    const busyAgentIds = await this.prisma.intervention.findMany({
      where: { agentId: { in: agentIds }, status: { in: ['ASSIGNEE', 'ACCEPTEE', 'EN_COURS'] } },
      select: { agentId: true },
      distinct: ['agentId'],
    });
    return agentIds.length - busyAgentIds.length;
  }

  /** Charge de travail par agent (nombre d'interventions actives), pour une liste d'agents donnée. */
  async agentLoad(agents: { id: string; name: string }[]): Promise<{ agentName: string; assignedCount: number }[]> {
    const counts = await this.prisma.intervention.groupBy({
      by: ['agentId'],
      where: { agentId: { in: agents.map((a) => a.id) }, status: { in: ['ASSIGNEE', 'ACCEPTEE', 'EN_COURS'] } },
      _count: { _all: true },
    });
    const countByAgent = new Map<string, number>(counts.map((c) => [c.agentId, c._count._all as number]));
    return agents.map((a) => ({ agentName: a.name, assignedCount: countByAgent.get(a.id) ?? 0 }));
  }

  /** Interventions actives depuis plus de `hours` heures (retard). */
  countLateInterventions(agentIds: string[], hours = 48): Promise<number> {
    if (agentIds.length === 0) return Promise.resolve(0);
    return this.prisma.intervention.count({
      where: {
        agentId: { in: agentIds },
        status: { in: ['ASSIGNEE', 'ACCEPTEE', 'EN_COURS'] },
        createdAt: { lt: new Date(Date.now() - hours * 3_600_000) },
      },
    });
  }

  /** Tendance hebdomadaire des interventions résolues, sur les `weeks` dernières semaines. */
  async weeklyResolvedTrend(agentIds: string[], weeks = 6): Promise<{ weekLabel: string; resolvedCount: number }[]> {
    if (agentIds.length === 0) return [];
    const rows: { week: string; resolved: bigint }[] = await this.prisma.$queryRaw`
      SELECT to_char(date_trunc('week', "completedAt"), 'IYYY-"S"IW') as week,
             count(*) as resolved
      FROM "Intervention"
      WHERE "agentId" = ANY(${agentIds})
        AND status = 'TERMINEE'
        AND "completedAt" >= now() - (${weeks}::int || ' weeks')::interval
      GROUP BY 1
      ORDER BY 1 ASC;
    `;
    return rows.map((r) => ({ weekLabel: r.week, resolvedCount: Number(r.resolved) }));
  }

  recentReportHistory(organizationId: string, take = 6) {
    return this.prisma.reportStatusHistory.findMany({
      where: { report: { organizationId } },
      take,
      orderBy: { createdAt: 'desc' },
      include: { report: { select: { title: true } } },
    });
  }

  recentInterventionHistory(organizationId: string, take = 6) {
    return this.prisma.interventionStatusHistory.findMany({
      where: { intervention: { report: { organizationId } } },
      take,
      orderBy: { createdAt: 'desc' },
      include: { intervention: { select: { report: { select: { title: true } } } } },
    });
  }

  categoryNames(): Promise<{ id: string; name: string }[]> {
    return this.prisma.category.findMany({ select: { id: true, name: true } });
  }

  /** Nombre de signalements créés par mois sur les 6 derniers mois (agrégation SQL brute). */
  monthlyReportCounts(organizationId: string | null): Promise<{ month: string; reports: bigint; resolved: bigint }[]> {
    if (organizationId) {
      return this.prisma.$queryRaw`
        SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') as month,
               count(*) as reports,
               count(*) FILTER (WHERE status = 'RESOLU') as resolved
        FROM "Report"
        WHERE "organizationId" = ${organizationId}
          AND "createdAt" >= now() - interval '6 months'
          AND "deletedAt" IS NULL
        GROUP BY 1
        ORDER BY 1 ASC;
      `;
    }
    return this.prisma.$queryRaw`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') as month,
             count(*) as reports,
             count(*) FILTER (WHERE status = 'RESOLU') as resolved
      FROM "Report"
      WHERE "createdAt" >= now() - interval '6 months'
        AND "deletedAt" IS NULL
      GROUP BY 1
      ORDER BY 1 ASC;
    `;
  }

  averageResolutionHours(where: Prisma.ReportWhereInput): Promise<number | null> {
    return this.prisma.report
      .findMany({
        where: { ...where, status: 'RESOLU' },
        select: { createdAt: true, updatedAt: true },
        take: 200,
        orderBy: { updatedAt: 'desc' },
      })
      .then((rows) => {
        if (rows.length === 0) return null;
        const totalHours = rows.reduce(
          (sum, r) => sum + (r.updatedAt.getTime() - r.createdAt.getTime()) / 3_600_000,
          0,
        );
        return Math.round(totalHours / rows.length);
      });
  }
}
