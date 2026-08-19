import { Injectable } from '@nestjs/common';
import { RoleWithRelations } from './roles.repository';

/** Correspond à `Role` côté Angular. */
export interface RoleDto {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissionCodes: string[];
  createdAt: string;
}

@Injectable()
export class RolesMapper {
  toDto(role: RoleWithRelations): RoleDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description ?? '',
      usersCount: role._count.users,
      permissionCodes: role.permissions.map((p) => p.code),
      createdAt: role.createdAt.toISOString(),
    };
  }

  toDtoList(roles: RoleWithRelations[]): RoleDto[] {
    return roles.map((r) => this.toDto(r));
  }
}
