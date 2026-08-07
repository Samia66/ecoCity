import { Routes } from '@angular/router';

export const ORGANIZATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/organization-list/organization-list.component').then((m) => m.OrganizationListComponent),
    title: 'Organisations | EcoCity',
  },
];
