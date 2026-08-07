import { ReportPriority, ReportStatus } from '../../../core/constants/app.constants';

export interface ReportAttachment {
  id: string;
  url: string;
  filename: string;
}

export interface ReportHistoryEntry {
  id: string;
  status: ReportStatus;
  comment?: string;
  changedBy: string;
  changedAt: string;
}

export interface ReportComment {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: ReportPriority;
  status: ReportStatus;
  address: string;
  latitude: number;
  longitude: number;
  attachments: ReportAttachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  history?: ReportHistoryEntry[];
  comments?: ReportComment[];
  interventionId?: string;
}

export interface CreateReportPayload {
  title: string;
  description: string;
  category: string;
  priority: ReportPriority;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface ReportFilters {
  status?: ReportStatus;
  priority?: ReportPriority;
  category?: string;
  search?: string;
}
