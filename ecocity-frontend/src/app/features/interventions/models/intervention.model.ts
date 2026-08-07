import { ReportStatus } from '../../../core/constants/app.constants';

export type InterventionStatus = 'ASSIGNEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';

export interface InterventionHistoryEntry {
  id: string;
  status: InterventionStatus;
  comment?: string;
  changedBy: string;
  changedAt: string;
}

export interface Intervention {
  id: string;
  reportId: string;
  reportTitle: string;
  reportStatus: ReportStatus;
  assignedAgent: string;
  assignedAgentId: string;
  status: InterventionStatus;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  history?: InterventionHistoryEntry[];
}

export interface AssignInterventionPayload {
  reportId: string;
  agentId: string;
}

export const INTERVENTION_STATUS_LABELS: Record<InterventionStatus, string> = {
  ASSIGNEE: 'Assignée',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
};
