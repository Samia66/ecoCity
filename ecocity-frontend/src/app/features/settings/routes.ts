import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'profile' },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    title: 'Mon profil | EcoCity',
  },
  {
    path: 'security',
    loadComponent: () => import('./pages/security/security.component').then((m) => m.SecurityComponent),
    title: 'Sécurité | EcoCity',
  },
  {
    path: 'preferences',
    loadComponent: () =>
      import('./pages/preferences/preferences.component').then((m) => m.PreferencesComponent),
    title: 'Préférences | EcoCity',
  },
];
