import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { RoleName } from '../constants/roles.constant';
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

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows access when the route declares no required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(buildContext(undefined))).toBe(true);
  });

  it('allows access when the required roles list is empty', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    expect(guard.canActivate(buildContext(undefined))).toBe(true);
  });

  it('allows access when the user role is in the required list', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleName.ADMIN, RoleName.SUPER_ADMIN]);
    const context = buildContext({ roleName: RoleName.ADMIN });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws ForbiddenException when the user role is not in the required list', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleName.SUPER_ADMIN]);
    const context = buildContext({ roleName: RoleName.CITIZEN });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when there is no authenticated user', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleName.ADMIN]);
    expect(() => guard.canActivate(buildContext(undefined))).toThrow(ForbiddenException);
  });
});
