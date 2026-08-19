import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { AuthStore } from '../store/auth.store';
import { TokenService } from '../services/token.service';

describe('authGuard', () => {
  let authStore: jasmine.SpyObj<AuthStore>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authStore = jasmine.createSpyObj<AuthStore>('AuthStore', ['isAuthenticated']);
    tokenService = jasmine.createSpyObj<TokenService>('TokenService', ['hasValidSession']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStore },
        { provide: TokenService, useValue: tokenService },
        { provide: Router, useValue: router },
      ],
    });
  });

  function runAuthGuard() {
    return TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
  }

  function runGuestGuard() {
    return TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
  }

  it('allows navigation when the store reports the user is authenticated', () => {
    authStore.isAuthenticated.and.returnValue(true);
    tokenService.hasValidSession.and.returnValue(false);

    expect(runAuthGuard()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('allows navigation when a valid session exists in storage even if the store signal lags', () => {
    authStore.isAuthenticated.and.returnValue(false);
    tokenService.hasValidSession.and.returnValue(true);

    expect(runAuthGuard()).toBe(true);
  });

  it('redirects to /login and blocks navigation when there is no session', () => {
    authStore.isAuthenticated.and.returnValue(false);
    tokenService.hasValidSession.and.returnValue(false);

    expect(runAuthGuard()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('guestGuard lets anonymous users through', () => {
    authStore.isAuthenticated.and.returnValue(false);
    expect(runGuestGuard()).toBe(true);
  });

  it('guestGuard redirects an already-authenticated user to /dashboard', () => {
    authStore.isAuthenticated.and.returnValue(true);
    expect(runGuestGuard()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
