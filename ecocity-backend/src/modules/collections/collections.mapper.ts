import { Injectable } from '@nestjs/common';
import { CollectionWithRelations } from './collections.repository';
import { CollectionStatus, DayOfWeek } from '@prisma/client';

const STATUS_LABELS: Record<CollectionStatus, string> = {
  PLANIFIEE: 'Planifiée',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
  NON_EFFECTUEE: 'Non effectuée',
};

export interface CollectionParticipantDto {
  id: string;
  firstName: string;
  lastName: string;
  role: 'LEADER' | 'AGENT';
}

export interface CollectionAttachmentDto {
  id: string;
  url: string;
  filename: string;
}

export interface CollectionHistoryEntryDto {
  id: string;
  status: CollectionStatus;
  comment?: string | null;
  changedBy: string;
  changedAt: string;
}

/** Correspond à `Collection` côté Angular / Flutter (mission de collecte). */
export interface CollectionDto {
  id: string;
  teamId: string;
  teamName: string;
  zoneId: string;
  zoneName: string;
  scheduledDate: string;
  dayOfWeek: DayOfWeek;
  status: CollectionStatus;
  statusLabel: string;
  startedAt?: string | null;
  completedAt?: string | null;
  comment?: string | null;
  problemDescription?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  participants: CollectionParticipantDto[];
  attachments: CollectionAttachmentDto[];
  history: CollectionHistoryEntryDto[];
  createdAt: string;
}

@Injectable()
export class CollectionsMapper {
  toDto(collection: CollectionWithRelations): CollectionDto {
    return {
      id: collection.id,
      teamId: collection.teamId,
      teamName: collection.team.name,
      zoneId: collection.zoneId,
      zoneName: collection.zone.name,
      scheduledDate: collection.scheduledDate.toISOString(),
      dayOfWeek: collection.dayOfWeek,
      status: collection.status,
      statusLabel: STATUS_LABELS[collection.status],
      startedAt: collection.startedAt?.toISOString() ?? null,
      completedAt: collection.completedAt?.toISOString() ?? null,
      comment: collection.comment,
      problemDescription: collection.problemDescription,
      latitude: collection.latitude,
      longitude: collection.longitude,
      participants: collection.team.members.map((m) => {
        const [firstName, ...rest] = m.agentName.split(' ');
        return { id: m.agentId, firstName: firstName ?? m.agentName, lastName: rest.join(' '), role: m.role };
      }),
      attachments: collection.attachments.map((a) => ({ id: a.id, url: a.url, filename: a.filename })),
      history: collection.history.map((h) => ({
        id: h.id,
        status: h.status,
        comment: h.comment,
        changedBy: h.changedByName,
        changedAt: h.createdAt.toISOString(),
      })),
      createdAt: collection.createdAt.toISOString(),
    };
  }

  toDtoList(collections: CollectionWithRelations[]): CollectionDto[] {
    return collections.map((c) => this.toDto(c));
  }
}
