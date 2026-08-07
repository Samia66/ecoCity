import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  ReportPriority,
  ReportStatus,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../../core/constants/app.constants';

export function statusLabel(status: ReportStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function statusColor(status: ReportStatus): { bg: string; text: string } {
  return STATUS_COLORS[status] ?? { bg: '#F1F5F9', text: '#64748B' };
}

export function priorityLabel(priority: ReportPriority): string {
  return PRIORITY_LABELS[priority] ?? priority;
}

export function priorityColor(priority: ReportPriority): { bg: string; text: string } {
  return PRIORITY_COLORS[priority] ?? { bg: '#F1F5F9', text: '#64748B' };
}
