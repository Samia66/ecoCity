import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

/**
 * Protège une route derrière une permission précise (`AuthStore.hasPermission`),
 * plutôt qu'un rôle générique — complète `roleGuard` pour les cas où l'accès
 * dépend de la matrice de permissions plutôt que du rôle système.
 */
export const permissionGuard = (permission: string): CanActivateFn => {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.hasPermission(permission)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};
