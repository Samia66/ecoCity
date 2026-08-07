import { Injectable, inject } from '@angular/core';
import { TokenService } from './token.service';
import { AuthStore } from '../store/auth.store';

/**
 * Restaure la session utilisateur (si un token valide est présent en storage)
 * au démarrage de l'application.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private tokenService = inject(TokenService);
  private authStore = inject(AuthStore);

  bootstrap(): void {
    const user = this.tokenService.getCurrentUser();
    if (user && this.tokenService.getAccessToken()) {
      this.authStore.setSession(user);
    }
  }

  terminate(): void {
    this.tokenService.clear();
    this.authStore.clearSession();
  }
}
