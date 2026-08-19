import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { AuthenticatedUser } from '../../modules/auth/strategies/jwt.strategy';

function buildContext(user: Partial<AuthenticatedUser> | undefined): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  let reflector: Reflector;
  let guard: PermissionsGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  it('allows access when the route declares no required permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(buildContext(undefined))).toBe(true);
  });

  it('allows access when the user has every required permission', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['reports:read', 'reports:write']);
    const context = buildContext({ permissions: ['reports:read', 'reports:write', 'zones:read'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws ForbiddenException when at least one permission is missing', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['reports:read', 'reports:delete']);
    const context = buildContext({ permissions: ['reports:read'] });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when the user has no permissions at all', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['reports:read']);
    const context = buildContext({ permissions: undefined });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
