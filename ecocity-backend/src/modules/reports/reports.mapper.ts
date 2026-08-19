import { Injectable } from '@nestjs/common';
import { ReportDetail, ReportListItem } from './reports.repository';

export interface ReportAttachmentDto {
  id: string;
  url: string;
  filename: string;
}

export interface ReportCommentDto {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface ReportHistoryEntryDto {
  id: string;
  status: string;
  comment?: string | null;
  changedBy: string;
  changedAt: string;
}

/** Correspond exactement à `Report` côté Angular (`features/reports/models/report.model.ts`). */
export interface ReportDto {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string;
  priority: string;
  status: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  attachments: ReportAttachmentDto[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  history: ReportHistoryEntryDto[];
  comments: ReportCommentDto[];
  interventionId?: string | null;
  assignedTo?: string | null;
  assignedToId?: string | null;
  zoneId?: string | null;
}

@Injectable()
export class ReportsMapper {
  toListDto(report: ReportListItem): ReportDto {
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      category: report.category.name,
      categoryId: report.categoryId,
      priority: report.priority,
      status: report.status,
      address: report.address,
      latitude: report.latitude,
      longitude: report.longitude,
      attachments: [],
      createdBy: `${report.author.firstName} ${report.author.lastName}`,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      history: [],
      comments: [],
      assignedTo: report.assignedTo ? `${report.assignedTo.firstName} ${report.assignedTo.lastName}` : null,
      assignedToId: report.assignedToId,
      zoneId: report.zoneId,
    };
  }

  toDetailDto(report: ReportDetail): ReportDto {
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      category: report.category.name,
      categoryId: report.categoryId,
      priority: report.priority,
      status: report.status,
      address: report.address,
      latitude: report.latitude,
      longitude: report.longitude,
      attachments: report.attachments.map((a) => ({ id: a.id, url: a.url, filename: a.filename })),
      createdBy: `${report.author.firstName} ${report.author.lastName}`,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      history: report.history.map((h) => ({
        id: h.id,
        status: h.status,
        comment: h.comment,
        changedBy: h.changedByName,
        changedAt: h.createdAt.toISOString(),
      })),
      comments: report.comments.map((c) => ({
        id: c.id,
        author: `${c.author.firstName} ${c.author.lastName}`,
        message: c.message,
        createdAt: c.createdAt.toISOString(),
      })),
      interventionId: report.intervention?.id ?? null,
      assignedTo: report.assignedTo ? `${report.assignedTo.firstName} ${report.assignedTo.lastName}` : null,
      assignedToId: report.assignedToId,
      zoneId: report.zoneId,
    };
  }

  toListDtoList(reports: ReportListItem[]): ReportDto[] {
    return reports.map((r) => this.toListDto(r));
  }
}
