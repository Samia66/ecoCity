import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { permissionGuard } from './permission.guard';
import { AuthStore } from '../store/auth.store';

describe('permissionGuard', () => {
  let authStore: jasmine.SpyObj<AuthStore>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authStore = jasmine.createSpyObj<AuthStore>('AuthStore', ['hasPermission']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStore },
        { provide: Router, useValue: router },
      ],
    });
  });

  function run(permission: string) {
    return TestBed.runInInjectionContext(() => permissionGuard(permission)({} as any, {} as any));
  }

  it('allows access when the user holds the required permission', () => {
    authStore.hasPermission.and.returnValue(true);

    expect(run('reports:write')).toBe(true);
    expect(authStore.hasPermission).toHaveBeenCalledWith('reports:write');
  });

  it('redirects to /dashboard when the permission is missing', () => {
    authStore.hasPermission.and.returnValue(false);

    expect(run('reports:write')).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
