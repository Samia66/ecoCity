import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { RoleName } from '@prisma/client/wasm';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
;

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleName[]) =>
    SetMetadata(
        ROLES_KEY,
        roles,
    );