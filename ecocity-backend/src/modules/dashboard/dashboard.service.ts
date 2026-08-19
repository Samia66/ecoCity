import { Injectable } from '@nestjs/common';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { UsersRepository } from '../users/users.repository';
import { InterventionsRepository } from '../interventions/interventions.repository';
import { InterventionsMapper } from '../interventions/interventions.mapper';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly repository: DashboardRepository,
    private readonly usersRepository: UsersRepository,
    private readonly interventionsRepository: InterventionsRepository,
    private readonly interventionsMapper: InterventionsMapper,
  ) {}

  // ------------------------------------------------------------------
  // CITIZEN — { total, pending, inProgress, resolved, lastReport? }
  // ------------------------------------------------------------------
  async getCitizenDashboard(requester: AuthenticatedUser) {
    const where = { authorId: requester.userId, deletedAt: null };
    const [total, pending, inProgress, resolved, recent] = await Promise.all([
      this.repository.countReports(where),
      this.repository.countReports({ ...where, status: { in: ['NOUVEAU', 'EN_ATTENTE', 'VALIDE'] } }),
      this.repository.countReports({ ...where, status: { in: ['ASSIGNE', 'EN_COURS'] } }),
      this.repository.countReports({ ...where, status: 'RESOLU' }),
      this.repository.recentReports(where, 1),
    ]);

    const last = recent[0];

    return {
      total,
      pending,
      inProgress,
      resolved,
      lastReport: last
        ? {
            id: last.id,
            title: last.title,
            description: '',
            category: last.category.name,
            categoryId: last.categoryId,
            priority: last.priority,
            status: last.status,
            address: '',
            latitude: null,
            longitude: null,
            attachments: [],
            createdBy: `${last.author.firstName} ${last.author.lastName}`,
            createdAt: last.createdAt.toISOString(),
            updatedAt: last.updatedAt.toISOString(),
            history: [],
            comments: [],
          }
        : null,
    };
  }

  // ------------------------------------------------------------------
  // AGENT — { assignedCount, inProgressCount, urgentCount, resolvedTodayCount,
  //           averageResolutionMinutes, upcoming[], recentUpdates[] }
  // ------------------------------------------------------------------
  async getAgentDashboard(requester: AuthenticatedUser) {
    const [assigned, accepted, inProgress, urgentCount, resolvedTodayCount, averageResolutionMinutes, upcomingRaw, recentRaw] =
      await Promise.all([
        this.interventionsRepository.countByStatus({ agentId: requester.userId, status: 'ASSIGNEE' }),
        this.interventionsRepository.countByStatus({ agentId: requester.userId, status: 'ACCEPTEE' }),
        this.interventionsRepository.countByStatus({ agentId: requester.userId, status: 'EN_COURS' }),
        this.interventionsRepository.countUrgent(requester.userId),
        this.interventionsRepository.countResolvedToday(requester.userId),
        this.interventionsRepository.averageResolutionMinutes(requester.userId),
        this.interventionsRepository.findMany({
          agentId: requester.userId,
          status: { in: ['ASSIGNEE', 'ACCEPTEE', 'EN_COURS'] },
        }),
        this.interventionsRepository.findMany({ agentId: requester.userId }),
      ]);

    const sum = (rows: { _count: { _all: number } }[]) => rows.reduce((s, r) => s + r._count._all, 0);
    const inProgressCount = sum(inProgress);

    return {
      assignedCount: sum(assigned) + sum(accepted),
      inProgressCount,
      urgentCount,
      resolvedTodayCount,
      averageResolutionMinutes,
      upcoming: this.interventionsMapper.toDtoList(upcomingRaw.slice(0, 10)),
      recentUpdates: this.interventionsMapper.toDtoList(
        recentRaw
          .slice()
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .slice(0, 10),
      ),
    };
  }

  // ------------------------------------------------------------------
  // TEAM_LEADER — { activeAgents, availableAgents, unassignedCount,
  //                 criticalCount, lateCount, resolutionRate,
  //                 statusBreakdown[], agentLoad[], weeklyTrend[] }
  // ------------------------------------------------------------------
  async getTeamLeaderDashboard(requester: AuthenticatedUser) {
    const memberships = await this.usersRepository.findTeamMembersOf(requester.userId);
    const agentIds = memberships.map((m) => m.agentId);
    const agents = memberships.map((m) => ({ id: m.agentId, name: m.agentName }));

    const [activeAgents, availableAgents, unassignedCount, criticalCount, lateCount, statusBreakdownRaw, agentLoad, weeklyTrend] =
      await Promise.all([
        this.usersRepository.count({ id: { in: agentIds }, status: 'ACTIVE' }),
        this.repository.countAvailableAgents(agentIds),
        this.repository.countReports({
          organizationId: requester.organizationId,
          assignedToId: null,
          status: { in: ['VALIDE', 'EN_ATTENTE'] },
          deletedAt: null,
        }),
        this.repository.countReports({
          organizationId: requester.organizationId,
          assignedToId: null,
          status: { in: ['VALIDE', 'EN_ATTENTE'] },
          priority: 'CRITIQUE',
          deletedAt: null,
        }),
        this.repository.countLateInterventions(agentIds),
        agentIds.length > 0
          ? this.interventionsRepository.countByStatus({ agentId: { in: agentIds } })
          : Promise.resolve([]),
        this.repository.agentLoad(agents),
        this.repository.weeklyResolvedTrend(agentIds),
      ]);

    const totalInterventions = statusBreakdownRaw.reduce((s, r) => s + r._count._all, 0);
    const resolvedInterventions = statusBreakdownRaw.find((r) => r.status === 'TERMINEE')?._count._all ?? 0;

    return {
      activeAgents,
      availableAgents,
      unassignedCount,
      criticalCount,
      lateCount,
      resolutionRate: totalInterventions > 0 ? Number((resolvedInterventions / totalInterventions).toFixed(2)) : 0,
      statusBreakdown: statusBreakdownRaw.map((row) => ({ status: row.status, count: row._count._all })),
      agentLoad,
      weeklyTrend,
    };
  }

  // ------------------------------------------------------------------
  // OVERVIEW (ADMIN / SUPER_ADMIN / TEAM_LEADER) — matches Angular DashboardSummary
  // ------------------------------------------------------------------
  async getOverview(requester: AuthenticatedUser) {
    const isGlobal = requester.roleName === RoleName.SUPER_ADMIN;
    const orgFilter = isGlobal ? {} : { organizationId: requester.organizationId };

    const [
      totalReports,
      pendingReports,
      resolvedReports,
      activeAgents,
      statusBreakdown,
      categoryBreakdown,
      interventionBreakdown,
      recentReports,
      mapIncidents,
      monthly,
      avgResolutionHours,
      categories,
      reportActivity,
      interventionActivity,
    ] = await Promise.all([
      this.repository.countReports({ ...orgFilter, deletedAt: null }),
      this.repository.countReports({ ...orgFilter, deletedAt: null, status: { in: ['NOUVEAU', 'EN_ATTENTE'] } }),
      this.repository.countReports({ ...orgFilter, deletedAt: null, status: 'RESOLU' }),
      this.usersRepository.count({
        ...orgFilter,
        deletedAt: null,
        status: 'ACTIVE',
        role: { name: RoleName.AGENT },
      }),
      this.repository.reportsByStatus({ ...orgFilter, deletedAt: null }),
      this.repository.reportsByCategory({ ...orgFilter, deletedAt: null }),
      this.interventionsRepository.countByStatus(isGlobal ? {} : { report: { organizationId: requester.organizationId } }),
      this.repository.recentReports({ ...orgFilter, deletedAt: null }, 5),
      this.repository.reportsWithCoordinates({ ...orgFilter, deletedAt: null }, 100),
      this.repository.monthlyReportCounts(isGlobal ? null : requester.organizationId),
      this.repository.averageResolutionHours({ ...orgFilter, deletedAt: null }),
      this.repository.categoryNames(),
      this.repository.recentReportHistory(requester.organizationId, 6),
      this.repository.recentInterventionHistory(requester.organizationId, 6),
    ]);

    const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

    const activities = [
      ...reportActivity.map((h) => ({
        id: h.id,
        actor: h.changedByName,
        action: `a changé le statut en ${h.status}`,
        target: h.report.title,
        timestamp: h.createdAt.toISOString(),
        icon: 'update',
      })),
      ...interventionActivity.map((h) => ({
        id: h.id,
        actor: h.changedByName,
        action: `a mis à jour une intervention (${h.status})`,
        target: h.intervention.report.title,
        timestamp: h.createdAt.toISOString(),
        icon: 'engineering',
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);

    return {
      stats: {
        totalReports,
        pendingReports,
        resolvedReports,
        activeAgents,
        avgResolutionTimeHours: avgResolutionHours ?? 0,
      },
      categoryBreakdown: categoryBreakdown.map((row) => ({
        category: categoryNameById.get(row.categoryId) ?? 'Autre',
        count: row._count._all,
      })),
      interventionBreakdown: interventionBreakdown.map((row) => ({
        status: row.status,
        count: row._count._all,
      })),
      statusBreakdown: statusBreakdown.map((row) => ({ status: row.status, count: row._count._all })),
      monthlyTrend: monthly.map((row) => ({
        month: row.month,
        reports: Number(row.reports),
        resolved: Number(row.resolved),
      })),
      recentReports: recentReports.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category.name,
        status: r.status,
        priority: r.priority,
        citizen: `${r.author.firstName} ${r.author.lastName}`,
        createdAt: r.createdAt.toISOString(),
      })),
      recentActivities: activities,
      mapIncidents: mapIncidents.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        lat: r.latitude,
        lng: r.longitude,
      })),
    };
  }
}
