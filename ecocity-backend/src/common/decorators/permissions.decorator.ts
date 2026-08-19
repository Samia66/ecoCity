import { SetMetadata } from '@nestjs/common';
import { PermissionCode } from '../constants/permissions.constant';

export const PERMISSIONS_KEY = 'permissions';

/** Restreint une route aux utilisateurs dont le rôle porte TOUTES ces permissions. */
export const RequirePermissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
