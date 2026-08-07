import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PermissionsRepository } from './repositories/permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly repository: PermissionsRepository,
  ) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const permission =
      await this.repository.findById(id);

    if (!permission) {
      throw new NotFoundException(
        'Permission not found',
      );
    }

    return permission;
  }
}