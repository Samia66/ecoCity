import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { QueryOrganizationsDto } from './dto/query-organizations.dto';
import { OrganizationsRepository } from './repositories/organization.repository';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly repository: OrganizationsRepository,
  ) {}

  async findAll(query: QueryOrganizationsDto) {
    const skip = (query.page - 1) * query.limit;

    const [organizations, total] = await Promise.all([
      this.repository.findAll({
        skip,
        take: query.limit,
        search: query.search,
      }),
      this.repository.count(query.search),
    ]);

    return {
      data: organizations,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findById(id: string) {
    const organization = await this.repository.findById(id);

    if (!organization) {
      throw new NotFoundException(
        'Organization not found',
      );
    }

    return organization;
  }

  async create(dto: CreateOrganizationDto) {
    const existing =
      await this.repository.findByCode(dto.code);

    if (existing) {
      throw new BadRequestException(
        'Organization code already exists',
      );
    }

    return this.repository.create({
      name: dto.name,
      code: dto.code,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      city: dto.city,
      country: dto.country,
      website: dto.website,
      logo: dto.logo,
      description: dto.description,
    });
  }

  async update(
    id: string,
    dto: UpdateOrganizationDto,
  ) {
    await this.findById(id);

    return this.repository.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);

    await this.repository.delete(id);

    return {
      message: 'Organization deleted successfully',
    };
  }
}