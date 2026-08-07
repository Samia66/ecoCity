import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/role-list/role-list.component').then((m) => m.RoleListComponent),
    title: 'Rôles | EcoCity',
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('./pages/permission-matrix/permission-matrix.component').then((m) => m.PermissionMatrixComponent),
    title: 'Matrice des permissions | EcoCity',
  },
];
