import { Injectable } from '@nestjs/common';
import { InterventionDetail } from './interventions.repository';
import { INTERVENTION_STATUS_LABELS } from '../../common/constants/intervention-status.constant';

export interface InterventionAttachmentDto {
  id: string;
  url: string;
  filename: string;
  phase: 'AVANT' | 'APRES';
}

export interface InterventionCommentDto {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface InterventionHistoryEntryDto {
  id: string;
  status: string;
  comment?: string | null;
  changedBy: string;
  changedAt: string;
}

/** Correspond à `Intervention` côté Angular (`features/interventions/models`). */
export interface InterventionDto {
  id: string;
  reportId: string;
  reportTitle: string;
  reportStatus: string;
  category: string;
  assignedAgent: string;
  assignedAgentId: string;
  status: string;
  statusLabel: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  attachments: InterventionAttachmentDto[];
  comments: InterventionCommentDto[];
  history: InterventionHistoryEntryDto[];
}

@Injectable()
export class InterventionsMapper {
  toDto(intervention: InterventionDetail): InterventionDto {
    return {
      id: intervention.id,
      reportId: intervention.reportId,
      reportTitle: intervention.report.title,
      reportStatus: intervention.report.status,
      category: intervention.report.category.name,
      assignedAgent: `${intervention.agent.firstName} ${intervention.agent.lastName}`,
      assignedAgentId: intervention.agentId,
      status: intervention.status,
      statusLabel: INTERVENTION_STATUS_LABELS[intervention.status] ?? intervention.status,
      latitude: intervention.report.latitude,
      longitude: intervention.report.longitude,
      address: intervention.report.address,
      startedAt: intervention.startedAt?.toISOString() ?? null,
      completedAt: intervention.completedAt?.toISOString() ?? null,
      createdAt: intervention.createdAt.toISOString(),
      attachments: intervention.attachments.map((a) => ({
        id: a.id,
        url: a.url,
        filename: a.filename,
        phase: a.phase,
      })),
      comments: intervention.comments.map((c) => ({
        id: c.id,
        author: c.authorName,
        message: c.message,
        createdAt: c.createdAt.toISOString(),
      })),
      history: intervention.history.map((h) => ({
        id: h.id,
        status: h.status,
        comment: h.comment,
        changedBy: h.changedByName,
        changedAt: h.createdAt.toISOString(),
      })),
    };
  }

  toDtoList(interventions: InterventionDetail[]): InterventionDto[] {
    return interventions.map((i) => this.toDto(i));
  }
}
