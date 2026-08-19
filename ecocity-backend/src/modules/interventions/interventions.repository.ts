import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export const INTERVENTION_DETAIL_INCLUDE = {
  report: { include: { category: true, author: true, zone: true } },
  agent: true,
  attachments: { orderBy: { createdAt: 'asc' } },
  comments: { orderBy: { createdAt: 'asc' } },
  history: { orderBy: { createdAt: 'asc' } },
} satisfies Prisma.InterventionInclude;

export type InterventionDetail = Prisma.InterventionGetPayload<{ include: typeof INTERVENTION_DETAIL_INCLUDE }>;

@Injectable()
export class InterventionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(where: Prisma.InterventionWhereInput): Promise<InterventionDetail[]> {
    return this.prisma.intervention.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: INTERVENTION_DETAIL_INCLUDE,
    });
  }

  findById(id: string): Promise<InterventionDetail | null> {
    return this.prisma.intervention.findUnique({ where: { id }, include: INTERVENTION_DETAIL_INCLUDE });
  }

  findByReportId(reportId: string): Promise<InterventionDetail | null> {
    return this.prisma.intervention.findUnique({ where: { reportId }, include: INTERVENTION_DETAIL_INCLUDE });
  }

  create(data: Prisma.InterventionCreateInput): Promise<InterventionDetail> {
    return this.prisma.intervention.create({ data, include: INTERVENTION_DETAIL_INCLUDE });
  }

  update(id: string, data: Prisma.InterventionUpdateInput): Promise<InterventionDetail> {
    return this.prisma.intervention.update({ where: { id }, data, include: INTERVENTION_DETAIL_INCLUDE });
  }

  addHistory(data: Prisma.InterventionStatusHistoryCreateInput) {
    return this.prisma.interventionStatusHistory.create({ data });
  }

  addComment(data: Prisma.InterventionCommentCreateInput) {
    return this.prisma.interventionComment.create({ data });
  }

  addAttachment(data: Prisma.InterventionAttachmentCreateInput) {
    return this.prisma.interventionAttachment.create({ data });
  }

  countByStatus(where: Prisma.InterventionWhereInput) {
    return this.prisma.intervention.groupBy({ by: ['status'], where, _count: { _all: true } });
  }

  countResolvedToday(agentId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return this.prisma.intervention.count({
      where: { agentId, status: 'TERMINEE', completedAt: { gte: startOfDay } },
    });
  }

  async averageResolutionMinutes(agentId: string): Promise<number> {
    const rows = await this.prisma.intervention.findMany({
      where: { agentId, status: 'TERMINEE', completedAt: { not: null } },
      select: { createdAt: true, completedAt: true },
      take: 200,
      orderBy: { completedAt: 'desc' },
    });
    if (rows.length === 0) return 0;
    const totalMinutes = rows.reduce(
      (sum, r) => sum + (r.completedAt!.getTime() - r.createdAt.getTime()) / 60_000,
      0,
    );
    return Math.round(totalMinutes / rows.length);
  }

  countUrgent(agentId: string): Promise<number> {
    return this.prisma.intervention.count({
      where: {
        agentId,
        status: { in: ['ASSIGNEE', 'ACCEPTEE', 'EN_COURS'] },
        report: { priority: 'CRITIQUE' },
      },
    });
  }
}
