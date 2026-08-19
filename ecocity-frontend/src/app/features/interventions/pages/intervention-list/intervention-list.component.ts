import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { InterventionService } from '../../services/intervention.service';
import { Intervention } from '../../models/intervention.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { DataTableComponent } from '../../../../shared/ui/data-table/data-table.component';
import { EcoTableColumn } from '../../../../shared/ui/data-table/data-table.model';

@Component({
  selector: 'eco-intervention-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './intervention-list.component.html',
})
export class InterventionListComponent implements OnInit {
  private interventionService = inject(InterventionService);

  loading = signal(true);
  interventions = signal<Intervention[]>([]);

  columns: EcoTableColumn<Intervention>[] = [
    { key: 'reportTitle', label: 'Signalement', sortable: true },
    { key: 'assignedAgent', label: 'Agent assigné', sortable: true },
    { key: 'status', label: 'Statut intervention', sortable: true },
    { key: 'reportStatus', label: 'Statut signalement', type: 'badge-status' },
    { key: 'createdAt', label: 'Créée le', type: 'date', sortable: true },
  ];

  private readonly MOCK: Intervention[] = [
    { id: 'i1', reportId: '3', reportTitle: 'Nid-de-poule boulevard du Port', reportStatus: 'EN_COURS', assignedAgent: 'R. Dansou', assignedAgentId: 'a1', status: 'EN_COURS', createdAt: '2026-08-05T18:00:00Z' },
    { id: 'i2', reportId: '2', reportTitle: 'Éclairage défectueux avenue Centrale', reportStatus: 'ASSIGNE', assignedAgent: 'M. Sossou', assignedAgentId: 'a2', status: 'ASSIGNEE', createdAt: '2026-08-06T09:00:00Z' },
    { id: 'i3', reportId: '4', reportTitle: 'Caniveau bouché quartier Nord', reportStatus: 'RESOLU', assignedAgent: 'M. Sossou', assignedAgentId: 'a2', status: 'TERMINEE', createdAt: '2026-08-05T10:00:00Z' },
  ];

  ngOnInit(): void {
    this.interventionService.getAll().subscribe({
      next: (res) => { this.interventions.set(res); this.loading.set(false); },
      error: () => { this.interventions.set(this.MOCK); this.loading.set(false); },
    });
  }
}
