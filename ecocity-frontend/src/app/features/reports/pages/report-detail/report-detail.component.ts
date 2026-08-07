import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ReportService } from '../../services/report.service';
import { Report } from '../../models/report.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { STATUS_LABELS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'eco-report-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeaderComponent,
    CardComponent,
    StatusBadgeComponent,
    ButtonComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss',
})
export class ReportDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reportService = inject(ReportService);

  loading = signal(true);
  report = signal<Report | null>(null);
  newComment = '';
  statusOptions = Object.entries(STATUS_LABELS);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.reportService.getById(id).subscribe({
      next: (r) => { this.report.set(r); this.loading.set(false); },
      error: () => {
        this.report.set({
          id,
          title: 'Dépôt sauvage rue des Palmiers',
          description: "Amoncellement de déchets ménagers visible depuis 3 jours, attire des nuisibles et bloque partiellement le trottoir.",
          category: 'Dépôts sauvages de déchets',
          priority: 'HAUTE',
          status: 'EN_ATTENTE',
          address: 'Rue des Palmiers, Cotonou',
          latitude: 6.36,
          longitude: 2.42,
          attachments: [],
          createdBy: 'A. Kouassi',
          createdAt: '2026-08-06T10:12:00Z',
          updatedAt: '2026-08-06T10:12:00Z',
          history: [
            { id: 'h1', status: 'NOUVEAU', changedBy: 'A. Kouassi', changedAt: '2026-08-06T10:12:00Z' },
            { id: 'h2', status: 'EN_ATTENTE', changedBy: 'Système', changedAt: '2026-08-06T10:15:00Z' },
          ],
          comments: [],
        });
        this.loading.set(false);
      },
    });
  }

  updateStatus(status: string): void {
    const report = this.report();
    if (!report) return;
    this.reportService.updateStatus(report.id, status).subscribe({
      next: (updated) => this.report.set(updated),
    });
  }

  addComment(): void {
    const report = this.report();
    if (!report || !this.newComment.trim()) return;
    this.reportService.addComment(report.id, this.newComment).subscribe({
      next: (updated) => { this.report.set(updated); this.newComment = ''; },
    });
  }
}
