import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthUser } from '../../features/auth/models/auth.model';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private tokenService = inject(TokenService);

  private readonly _currentUser = signal<AuthUser | null>(this.tokenService.getCurrentUser());
  private readonly _isAuthenticated = signal<boolean>(this.tokenService.hasValidSession());

  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly fullName = computed(() => {
    const user = this._currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });
  readonly role = computed(() => this._currentUser()?.role ?? null);
  readonly permissions = computed(() => this._currentUser()?.permissions ?? []);

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasRole(...roles: string[]): boolean {
    const role = this.role();
    return !!role && roles.includes(role);
  }

  setSession(user: AuthUser): void {
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }

  updateUser(user: AuthUser): void {
    this.tokenService.setCurrentUser(user);
    this._currentUser.set(user);
  }

  clearSession(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }

  
}
