import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RolesRepository } from './repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(
    private readonly repository: RolesRepository,
  ) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const role =
      await this.repository.findById(id);

    if (!role) {
      throw new NotFoundException(
        'Role not found',
      );
    }

    return role;
  }

  async assignPermission(
    roleId: string,
    permissionId: string,
  ) {
    await this.repository.assignPermission(
      roleId,
      permissionId,
    );

    return {
      message:
        'Permission assigned successfully',
    };
  }

  async removePermission(
    roleId: string,
    permissionId: string,
  ) {
    await this.repository.removePermission(
      roleId,
      permissionId,
    );

    return {
      message:
        'Permission removed successfully',
    };
  }
}