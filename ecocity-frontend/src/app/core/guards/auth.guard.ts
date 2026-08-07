import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (authStore.isAuthenticated() || tokenService.hasValidSession()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
