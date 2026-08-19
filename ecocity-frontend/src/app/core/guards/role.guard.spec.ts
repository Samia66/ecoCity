import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthStore } from '../store/auth.store';

describe('roleGuard', () => {
  let authStore: jasmine.SpyObj<AuthStore>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authStore = jasmine.createSpyObj<AuthStore>('AuthStore', ['hasRole']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStore },
        { provide: Router, useValue: router },
      ],
    });
  });

  function run(allowedRoles: string[]) {
    return TestBed.runInInjectionContext(() => roleGuard(allowedRoles)({} as any, {} as any));
  }

  it('allows access when the user has one of the allowed roles', () => {
    authStore.hasRole.and.returnValue(true);

    expect(run(['ADMIN', 'SUPER_ADMIN'])).toBe(true);
    expect(authStore.hasRole).toHaveBeenCalledWith('ADMIN', 'SUPER_ADMIN');
  });

  it('redirects to /dashboard and blocks access otherwise', () => {
    authStore.hasRole.and.returnValue(false);

    expect(run(['ADMIN'])).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
