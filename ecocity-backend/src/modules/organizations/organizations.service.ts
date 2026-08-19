import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginate, toSkipTake, PaginatedResult } from '../../common/utils/pagination.util';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationsMapper, OrganizationDto } from './organizations.mapper';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly repository: OrganizationsRepository,
    private readonly mapper: OrganizationsMapper,
  ) {}

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<OrganizationDto>> {
    const { skip, take } = toSkipTake(query.page, query.limit);
    const where: Prisma.OrganizationWhereInput = {
      deletedAt: null,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { city: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [orgs, total] = await Promise.all([
      this.repository.findMany({ where, skip, take }),
      this.repository.count(where),
    ]);

    return paginate(this.mapper.toDtoList(orgs), total, query.page, query.limit);
  }

  async findById(id: string): Promise<OrganizationDto> {
    const org = await this.repository.findById(id);
    if (!org || org.deletedAt) {
      throw new NotFoundException('Organisation introuvable.');
    }
    return this.mapper.toDto(org);
  }

  async create(dto: CreateOrganizationDto): Promise<OrganizationDto> {
    const org = await this.repository.create(dto);
    return this.mapper.toDto(org);
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<OrganizationDto> {
    await this.assertExists(id);
    const org = await this.repository.update(id, dto);
    return this.mapper.toDto(org);
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    await this.repository.softDelete(id);
  }

  private async assertExists(id: string): Promise<void> {
    const org = await this.repository.findById(id);
    if (!org || org.deletedAt) {
      throw new NotFoundException('Organisation introuvable.');
    }
  }
}
