import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { InterventionService } from '../../services/intervention.service';
import { Intervention, INTERVENTION_STATUS_LABELS } from '../../models/intervention.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'eco-intervention-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatSelectModule, MatFormFieldModule, PageHeaderComponent, CardComponent, StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './intervention-detail.component.html',
  styleUrl: '../../../reports/pages/report-detail/report-detail.component.scss',
})
export class InterventionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private interventionService = inject(InterventionService);

  loading = signal(true);
  intervention = signal<Intervention | null>(null);
  statusOptions = Object.entries(INTERVENTION_STATUS_LABELS);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.interventionService.getById(id).subscribe({
      next: (i) => { this.intervention.set(i); this.loading.set(false); },
      error: () => {
        this.intervention.set({
          id, reportId: '3', reportTitle: 'Nid-de-poule boulevard du Port', reportStatus: 'EN_COURS',
          assignedAgent: 'R. Dansou', assignedAgentId: 'a1', status: 'EN_COURS', createdAt: '2026-08-05T18:00:00Z',
          history: [
            { id: 'h1', status: 'ASSIGNEE', changedBy: 'Admin O. Fanou', changedAt: '2026-08-05T18:00:00Z' },
            { id: 'h2', status: 'EN_COURS', changedBy: 'R. Dansou', changedAt: '2026-08-06T08:00:00Z' },
          ],
        });
        this.loading.set(false);
      },
    });
  }

  updateStatus(status: string): void {
    const intervention = this.intervention();
    if (!intervention) return;
    this.interventionService.updateStatus(intervention.id, status).subscribe({
      next: (updated) => this.intervention.set(updated),
    });
  }
}
