import { Component, Input } from '@angular/core';
import { ReportPriority, ReportStatus } from '../../../core/constants/app.constants';
import { priorityColor, priorityLabel, statusColor, statusLabel } from '../../utils/status.util';

@Component({
  selector: 'eco-status-badge',
  standalone: true,
  template: `
    <span class="eco-badge" [style.background]="bg" [style.color]="color">{{ label }}</span>
  `,
})
export class StatusBadgeComponent {
  private _status?: ReportStatus;
  private _priority?: ReportPriority;

  label = '';
  bg = '#F1F5F9';
  color = '#64748B';

  @Input() set status(value: ReportStatus | undefined) {
    this._status = value;
    if (value) {
      this.label = statusLabel(value);
      const c = statusColor(value);
      this.bg = c.bg;
      this.color = c.text;
    }
  }

  @Input() set priority(value: ReportPriority | undefined) {
    this._priority = value;
    if (value) {
      this.label = priorityLabel(value);
      const c = priorityColor(value);
      this.bg = c.bg;
      this.color = c.text;
    }
  }
}
