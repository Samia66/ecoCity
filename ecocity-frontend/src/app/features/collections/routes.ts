import { Routes } from '@angular/router';

export const COLLECTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/collection-list/collection-list.component').then((m) => m.CollectionListComponent),
    title: 'Collectes | EcoCity',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/collection-detail/collection-detail.component').then((m) => m.CollectionDetailComponent),
    title: 'Détail de la collecte | EcoCity',
  },
];
