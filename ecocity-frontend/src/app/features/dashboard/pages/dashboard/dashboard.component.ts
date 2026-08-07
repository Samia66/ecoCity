import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard.model';
import { AuthStore } from '../../../../core/store/auth.store';
import { StatsCardComponent } from '../../../../shared/ui/stats-card/stats-card.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { IncidentMapComponent } from '../../components/incident-map/incident-map.component';

const MOCK_SUMMARY: DashboardSummary = {
  stats: {
    totalReports: 1284,
    pendingReports: 168,
    resolvedReports: 1042,
    activeAgents: 34,
    reportsTrend: 8.2,
    pendingTrend: -3.1,
    resolvedTrend: 12.4,
    agentsTrend: 2,
    avgResolutionTimeHours: 36,
  },
  categoryBreakdown: [
    { category: 'Dépôts sauvages', count: 312 },
    { category: 'Éclairage public', count: 245 },
    { category: 'Nids-de-poule', count: 198 },
    { category: "Fuites d'eau", count: 143 },
    { category: 'Espaces verts', count: 121 },
    { category: 'Autres', count: 265 },
  ],
  interventionBreakdown: [
    { status: 'Assignées', count: 58 },
    { status: 'En cours', count: 44 },
    { status: 'Résolues', count: 312 },
    { status: 'Rejetées', count: 12 },
  ],
  monthlyTrend: [],
  recentReports: [
    { id: '1', title: 'Dépôt sauvage rue des Palmiers', category: 'Dépôts sauvages', status: 'EN_ATTENTE', priority: 'HAUTE', citizen: 'A. Kouassi', createdAt: '2026-08-06T10:12:00Z' },
    { id: '2', title: 'Éclairage défectueux avenue Centrale', category: 'Éclairage public', status: 'ASSIGNE', priority: 'MOYENNE', citizen: 'M. Dossou', createdAt: '2026-08-06T08:40:00Z' },
    { id: '3', title: 'Nid-de-poule boulevard du Port', category: 'Nids-de-poule', status: 'EN_COURS', priority: 'CRITIQUE', citizen: 'S. Adjovi', createdAt: '2026-08-05T17:05:00Z' },
    { id: '4', title: 'Caniveau bouché quartier Nord', category: 'Caniveaux bouchés', status: 'RESOLU', priority: 'BASSE', citizen: 'R. Toko', createdAt: '2026-08-05T09:22:00Z' },
    { id: '5', title: 'Fuite d\u2019eau rue des Cocotiers', category: "Fuites d'eau", status: 'NOUVEAU', priority: 'HAUTE', citizen: 'J. Houessou', createdAt: '2026-08-04T14:00:00Z' },
  ],
  recentActivities: [
    { id: '1', actor: 'Agent M. Sossou', action: 'a résolu', target: 'Éclairage public - Zone 4', timestamp: 'Il y a 12 min', icon: 'check_circle' },
    { id: '2', actor: 'Admin O. Fanou', action: 'a assigné', target: 'Nid-de-poule - Bd du Port', timestamp: 'Il y a 47 min', icon: 'person_add' },
    { id: '3', actor: 'Citoyen A. Kouassi', action: 'a signalé', target: 'Dépôt sauvage - Rue des Palmiers', timestamp: 'Il y a 1h', icon: 'report' },
    { id: '4', actor: 'Agent R. Dansou', action: 'a mis à jour', target: 'Fuite d\u2019eau - Rue des Cocotiers', timestamp: 'Il y a 3h', icon: 'update' },
  ],
  mapIncidents: [
    { id: '1', title: 'Dépôt sauvage', status: 'EN_ATTENTE', lat: 6.3654, lng: 2.4183 },
    { id: '2', title: 'Éclairage défectueux', status: 'ASSIGNE', lat: 6.3703, lng: 2.3912 },
    { id: '3', title: 'Nid-de-poule', status: 'EN_COURS', lat: 6.3582, lng: 2.4295 },
    { id: '4', title: 'Caniveau bouché', status: 'RESOLU', lat: 6.3491, lng: 2.4021 },
  ],
};

@Component({
  selector: 'eco-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    BaseChartDirective,
    StatsCardComponent,
    CardComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    ButtonComponent,
    IncidentMapComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authStore = inject(AuthStore);

  readonly firstName = this.authStore.currentUser()?.firstName ?? '';
  loading = signal(true);
  summary = signal<DashboardSummary>(MOCK_SUMMARY);

  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } },
  };

  doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 16 } } },
    cutout: '65%',
  };

  ngOnInit(): void {
    this.fetchSummary();
  }

  fetchSummary(): void {

  this.loading.set(true);

  this.dashboardService.getSummary().subscribe({

    next: (summary) => {

      this.summary.set(summary);

      this.buildCharts(summary);

      this.loading.set(false);

    },

    error: () => {

      this.summary.set(MOCK_SUMMARY);

      this.buildCharts(MOCK_SUMMARY);

      this.loading.set(false);

    },

  });

}

  private buildCharts(data: DashboardSummary): void {

  const categoryBreakdown = data?.categoryBreakdown ?? [];

  this.barChartData = {
    labels: categoryBreakdown.map(c => c.category),
    datasets: [
      {
        data: categoryBreakdown.map(c => c.count),
        backgroundColor: '#16A34A',
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };
}
}
