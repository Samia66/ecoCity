import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.hasRole(...allowedRoles)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};
