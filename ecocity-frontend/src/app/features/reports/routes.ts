import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/report-list/report-list.component').then((m) => m.ReportListComponent),
    title: 'Signalements | EcoCity',
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/report-form/report-form.component').then((m) => m.ReportFormComponent),
    title: 'Nouveau signalement | EcoCity',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/report-detail/report-detail.component').then((m) => m.ReportDetailComponent),
    title: 'Détail du signalement | EcoCity',
  },
];
