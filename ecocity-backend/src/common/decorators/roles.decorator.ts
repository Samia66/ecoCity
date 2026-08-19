import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../constants/roles.constant';

export const ROLES_KEY = 'roles';

/** Restreint une route à une liste de rôles "système" (garde-fou haut niveau). */
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
