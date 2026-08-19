import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ZonesRepository } from './zones.repository';
import { ZonesMapper, ZoneDto } from './zones.mapper';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZonesService {
  constructor(
    private readonly repository: ZonesRepository,
    private readonly mapper: ZonesMapper,
  ) {}

  async findAll(requester: AuthenticatedUser): Promise<ZoneDto[]> {
    const zones = await this.repository.findMany(requester.organizationId);
    return this.mapper.toDtoList(zones);
  }

  async findById(id: string): Promise<ZoneDto> {
    const zone = await this.repository.findById(id);
    if (!zone || zone.deletedAt) throw new NotFoundException('Zone introuvable.');
    return this.mapper.toDto(zone);
  }

  async create(dto: CreateZoneDto, requester: AuthenticatedUser): Promise<ZoneDto> {
    const zone = await this.repository.create({
      name: dto.name,
      description: dto.description,
      organization: { connect: { id: requester.organizationId } },
    });
    return this.mapper.toDto(zone);
  }

  async update(id: string, dto: UpdateZoneDto): Promise<ZoneDto> {
    await this.assertExists(id);
    const zone = await this.repository.update(id, dto);
    return this.mapper.toDto(zone);
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    await this.repository.softDelete(id);
  }

  private async assertExists(id: string): Promise<void> {
    const zone = await this.repository.findById(id);
    if (!zone || zone.deletedAt) throw new NotFoundException('Zone introuvable.');
  }
}
