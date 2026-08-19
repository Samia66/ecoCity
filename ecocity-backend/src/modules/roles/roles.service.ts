import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SYSTEM_ROLE_NAMES } from '../../common/constants/roles.constant';
import { RolesRepository } from './roles.repository';
import { RolesMapper, RoleDto } from './roles.mapper';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-permissions.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly repository: RolesRepository,
    private readonly mapper: RolesMapper,
  ) {}

  async findAll(): Promise<RoleDto[]> {
    const roles = await this.repository.findMany();
    return this.mapper.toDtoList(roles);
  }

  async findById(id: string): Promise<RoleDto> {
    const role = await this.repository.findById(id);
    if (!role) throw new NotFoundException('Rôle introuvable.');
    return this.mapper.toDto(role);
  }

  async create(dto: CreateRoleDto): Promise<RoleDto> {
    const role = await this.repository.create({
      name: dto.name,
      description: dto.description,
      permissionCodes: dto.permissionCodes ?? [],
    });
    return this.mapper.toDto(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleDto> {
    await this.assertMutable(id);
    const role = await this.repository.update(id, dto);
    return this.mapper.toDto(role);
  }

  async updatePermissions(id: string, dto: UpdateRolePermissionsDto): Promise<RoleDto> {
    await this.assertExists(id);
    const role = await this.repository.setPermissions(id, dto.permissionCodes);
    return this.mapper.toDto(role);
  }

  async remove(id: string): Promise<void> {
    await this.assertMutable(id);
    await this.repository.delete(id);
  }

  private async assertExists(id: string): Promise<void> {
    const role = await this.repository.findById(id);
    if (!role) throw new NotFoundException('Rôle introuvable.');
  }

  private async assertMutable(id: string): Promise<void> {
    const role = await this.repository.findById(id);
    if (!role) throw new NotFoundException('Rôle introuvable.');
    if (SYSTEM_ROLE_NAMES.includes(role.name)) {
      throw new BadRequestException(
        `Le rôle système "${role.name}" ne peut pas être modifié ou supprimé (seules ses permissions sont éditables).`,
      );
    }
  }
}
