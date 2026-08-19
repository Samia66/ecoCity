import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';

/** Correspond à `Permission` côté Angular. */
export interface PermissionDto {
  id: string;
  code: string;
  label: string;
  module: string;
}

@Injectable()
export class PermissionsMapper {
  toDto(permission: Permission): PermissionDto {
    return {
      id: permission.id,
      code: permission.code,
      label: permission.label,
      module: permission.module,
    };
  }

  toDtoList(permissions: Permission[]): PermissionDto[] {
    return permissions.map((p) => this.toDto(p));
  }
}
