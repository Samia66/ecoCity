import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/routes').then((m) => m.REPORTS_ROUTES),
      },
      {
        path: 'interventions',
        loadChildren: () => import('./features/interventions/routes').then((m) => m.INTERVENTIONS_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: 'organizations',
        loadChildren: () => import('./features/organizations/routes').then((m) => m.ORGANIZATIONS_ROUTES),
      },
      {
        path: 'categories',
        loadChildren: () => import('./features/categories/routes').then((m) => m.CATEGORIES_ROUTES),
      },
      {
        path: 'teams',
        loadComponent: () =>
          import('./features/teams/pages/team-list-page.component').then((m) => m.TeamListPageComponent),
        canActivate: [permissionGuard('teams.view')],
        title: 'Équipes | EcoCity',
      },
      {
        path: 'zones',
        loadChildren: () => import('./features/zones/routes').then((m) => m.ZONES_ROUTES),
        canActivate: [permissionGuard('zones.view')],
      },
      {
        path: 'collections',
        loadChildren: () => import('./features/collections/routes').then((m) => m.COLLECTIONS_ROUTES),
        canActivate: [permissionGuard('collections.view')],
      },
      {
        path: 'roles',
        loadChildren: () => import('./features/roles/routes').then((m) => m.ROLES_ROUTES),
      },
      {
        path: 'permissions',
        loadChildren: () => import('./features/permissions/routes').then((m) => m.PERMISSIONS_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/routes').then((m) => m.SETTINGS_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
