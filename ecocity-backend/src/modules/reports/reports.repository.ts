import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export const REPORT_DETAIL_INCLUDE = {
  category: true,
  author: true,
  assignedTo: true,
  zone: true,
  attachments: { orderBy: { createdAt: 'asc' } },
  comments: { orderBy: { createdAt: 'asc' }, include: { author: true } },
  history: { orderBy: { createdAt: 'asc' } },
  intervention: true,
} satisfies Prisma.ReportInclude;

export const REPORT_LIST_INCLUDE = {
  category: true,
  author: true,
  assignedTo: true,
  zone: true,
} satisfies Prisma.ReportInclude;

export type ReportDetail = Prisma.ReportGetPayload<{ include: typeof REPORT_DETAIL_INCLUDE }>;
export type ReportListItem = Prisma.ReportGetPayload<{ include: typeof REPORT_LIST_INCLUDE }>;

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(params: {
    where: Prisma.ReportWhereInput;
    skip: number;
    take: number;
    orderBy?: Prisma.ReportOrderByWithRelationInput;
  }): Promise<ReportListItem[]> {
    return this.prisma.report.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy ?? { createdAt: 'desc' },
      include: REPORT_LIST_INCLUDE,
    });
  }

  findManyFlat(where: Prisma.ReportWhereInput): Promise<ReportListItem[]> {
    return this.prisma.report.findMany({ where, orderBy: { createdAt: 'desc' }, include: REPORT_LIST_INCLUDE });
  }

  count(where: Prisma.ReportWhereInput): Promise<number> {
    return this.prisma.report.count({ where });
  }

  findById(id: string): Promise<ReportDetail | null> {
    return this.prisma.report.findUnique({ where: { id }, include: REPORT_DETAIL_INCLUDE });
  }

  create(data: Prisma.ReportCreateInput): Promise<ReportDetail> {
    return this.prisma.report.create({ data, include: REPORT_DETAIL_INCLUDE });
  }

  update(id: string, data: Prisma.ReportUpdateInput): Promise<ReportDetail> {
    return this.prisma.report.update({ where: { id }, data, include: REPORT_DETAIL_INCLUDE });
  }

  softDelete(id: string): Promise<void> {
    return this.prisma.report
      .update({ where: { id }, data: { deletedAt: new Date() } })
      .then(() => undefined);
  }

  addAttachment(data: Prisma.ReportAttachmentCreateInput) {
    return this.prisma.reportAttachment.create({ data });
  }

  addComment(data: Prisma.ReportCommentCreateInput) {
    return this.prisma.reportComment.create({ data, include: { author: true } });
  }

  addStatusHistory(data: Prisma.ReportStatusHistoryCreateInput) {
    return this.prisma.reportStatusHistory.create({ data });
  }

  // --- Agrégations pour le dashboard --------------------------------------

  countByStatus(where: Prisma.ReportWhereInput) {
    return this.prisma.report.groupBy({
      by: ['status'],
      where,
      _count: { _all: true },
    });
  }

  countByCategory(where: Prisma.ReportWhereInput) {
    return this.prisma.report.groupBy({
      by: ['categoryId'],
      where,
      _count: { _all: true },
    });
  }
}
