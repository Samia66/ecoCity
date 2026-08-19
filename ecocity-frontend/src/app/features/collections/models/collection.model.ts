import { DayOfWeek } from '../../teams/models/team.model';

export type CollectionStatus = 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE' | 'NON_EFFECTUEE';

export interface CollectionParticipant {
  id: string;
  firstName: string;
  lastName: string;
  role: 'LEADER' | 'AGENT';
}

export interface CollectionAttachment {
  id: string;
  url: string;
  filename: string;
}

export interface CollectionHistoryEntry {
  id: string;
  status: CollectionStatus;
  comment?: string;
  changedBy: string;
  changedAt: string;
}

export interface Collection {
  id: string;
  teamId: string;
  teamName: string;
  zoneId: string;
  zoneName: string;
  scheduledDate: string;
  dayOfWeek: DayOfWeek;
  status: CollectionStatus;
  statusLabel: string;
  startedAt?: string;
  completedAt?: string;
  comment?: string;
  problemDescription?: string;
  latitude?: number;
  longitude?: number;
  participants: CollectionParticipant[];
  attachments: CollectionAttachment[];
  history: CollectionHistoryEntry[];
  createdAt: string;
}

export const COLLECTION_STATUS_LABELS: Record<CollectionStatus, string> = {
  PLANIFIEE: 'Planifiée',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
  NON_EFFECTUEE: 'Non effectuée',
};
