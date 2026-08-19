import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsMapper, PermissionDto } from './permissions.mapper';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly repository: PermissionsRepository,
    private readonly mapper: PermissionsMapper,
  ) {}

  async findAll(): Promise<PermissionDto[]> {
    const permissions = await this.repository.findMany();
    return this.mapper.toDtoList(permissions);
  }

  async create(dto: CreatePermissionDto): Promise<PermissionDto> {
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException('Une permission avec ce code existe déjà.');
    }
    const permission = await this.repository.create(dto);
    return this.mapper.toDto(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.repository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission introuvable.');
    }
    await this.repository.delete(id);
  }
}
