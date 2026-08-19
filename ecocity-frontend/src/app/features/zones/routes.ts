import { Routes } from '@angular/router';

/** Lecture ouverte à tout le staff (ADMIN/TEAM_LEADER/AGENT) — le backend scope
 * automatiquement chaque rôle à ses propres zones/équipes ; seuls les boutons
 * de gestion sont conditionnés à `zones.manage`/`collection-schedules.manage`
 * dans les templates. */
export const ZONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/zone-list-page.component').then((m) => m.ZoneListPageComponent),
    title: 'Zones | EcoCity',
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/zone-detail-page.component').then((m) => m.ZoneDetailPageComponent),
    title: 'Détail de la zone | EcoCity',
  },
];
