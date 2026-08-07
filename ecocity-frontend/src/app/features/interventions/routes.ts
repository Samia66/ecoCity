import { Routes } from '@angular/router';

export const INTERVENTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/intervention-list/intervention-list.component').then((m) => m.InterventionListComponent),
    title: 'Interventions | EcoCity',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/intervention-detail/intervention-detail.component').then(
        (m) => m.InterventionDetailComponent,
      ),
    title: "Détail de l'intervention | EcoCity",
  },
];
