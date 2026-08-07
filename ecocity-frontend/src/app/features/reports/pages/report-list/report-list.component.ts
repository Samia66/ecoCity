import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { ReportService } from '../../services/report.service';
import { Report } from '../../models/report.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { DataTableComponent } from '../../../../shared/ui/data-table/data-table.component';
import { EcoTableColumn } from '../../../../shared/ui/data-table/data-table.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { REPORT_TYPES } from '../../../../core/constants/app.constants';

@Component({
  selector: 'eco-report-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    PageHeaderComponent,
    DataTableComponent,
    ButtonComponent,
  ],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.scss',
})
export class ReportListComponent implements OnInit {
  private reportService = inject(ReportService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  loading = signal(true);
  reports = signal<Report[]>([]);
  categoryFilter = '';
  readonly categories = REPORT_TYPES;

  columns: EcoTableColumn<Report>[] = [
    { key: 'title', label: 'Signalement', sortable: true },
    { key: 'category', label: 'Catégorie', sortable: true },
    { key: 'address', label: 'Adresse' },
    { key: 'priority', label: 'Priorité', type: 'badge-priority', sortable: true },
    { key: 'status', label: 'Statut', type: 'badge-status', sortable: true },
    { key: 'createdAt', label: 'Créé le', type: 'date', sortable: true },
  ];

  private readonly MOCK: Report[] = [
    { id: '1', title: 'Dépôt sauvage rue des Palmiers', description: '', category: 'Dépôts sauvages de déchets', priority: 'HAUTE', status: 'EN_ATTENTE', address: 'Rue des Palmiers, Cotonou', latitude: 6.36, longitude: 2.42, attachments: [], createdBy: 'A. Kouassi', createdAt: '2026-08-06T10:12:00Z', updatedAt: '2026-08-06T10:12:00Z' },
    { id: '2', title: 'Éclairage défectueux avenue Centrale', description: '', category: 'Éclairage public défectueux', priority: 'MOYENNE', status: 'ASSIGNE', address: 'Avenue Centrale, Cotonou', latitude: 6.37, longitude: 2.39, attachments: [], createdBy: 'M. Dossou', createdAt: '2026-08-06T08:40:00Z', updatedAt: '2026-08-06T08:40:00Z' },
    { id: '3', title: 'Nid-de-poule boulevard du Port', description: '', category: 'Nids-de-poule', priority: 'CRITIQUE', status: 'EN_COURS', address: 'Boulevard du Port, Cotonou', latitude: 6.35, longitude: 2.43, attachments: [], createdBy: 'S. Adjovi', createdAt: '2026-08-05T17:05:00Z', updatedAt: '2026-08-05T17:05:00Z' },
    { id: '4', title: 'Caniveau bouché quartier Nord', description: '', category: 'Caniveaux bouchés', priority: 'BASSE', status: 'RESOLU', address: 'Quartier Nord, Cotonou', latitude: 6.35, longitude: 2.40, attachments: [], createdBy: 'R. Toko', createdAt: '2026-08-05T09:22:00Z', updatedAt: '2026-08-05T09:22:00Z' },
  ];

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.reportService.getAll({ category: this.categoryFilter || undefined }).subscribe({
      next: (res) => { this.reports.set(res.data); this.loading.set(false); },
      error: () => { this.reports.set(this.MOCK); this.loading.set(false); },
    });
  }

  openReport(report: Report): void {
    this.router.navigate(['/reports', report.id]);
  }

  createReport(): void {
    this.router.navigate(['/reports/new']);
  }

  deleteReport(report: Report, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer le signalement', message: `Confirmez-vous la suppression de "${report.title}" ?`, danger: true },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.reportService.delete(report.id).subscribe({
          complete: () => this.fetch(),
        });
      }
    });
  }
}
