import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CategoriesRepository } from './repositories/categories.repository';

import { CategoriesMapper } from './mappers/categories.mapper';

import { CATEGORY_ERRORS } from './constants/categories.constants';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repository: CategoriesRepository,
  ) {}

  async findAll(query: QueryCategoriesDto) {
    const skip = (query.page - 1) * query.limit;

    const isActive =
      query.isActive !== undefined
        ? query.isActive === 'true'
        : undefined;

    const [categories, total] = await Promise.all([
      this.repository.findAll({
        skip,
        take: query.limit,
        search: query.search,
        isActive,
      }),

      this.repository.count({
        search: query.search,
        isActive,
      }),
    ]);

    return {
      data: categories.map(
        CategoriesMapper.toResponse,
      ),

      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(
          total / query.limit,
        ),
      },
    };
  }

  async findById(id: string) {
    const category =
      await this.repository.findById(id);

    if (!category) {
      throw new NotFoundException(
        CATEGORY_ERRORS.NOT_FOUND,
      );
    }

    return CategoriesMapper.toResponse(
      category,
    );
  }

  async create(dto: CreateCategoryDto) {
    const exists =
      await this.repository.findByName(
        dto.name,
        dto.organizationId,
      );

    if (exists) {
      throw new BadRequestException(
        CATEGORY_ERRORS.NAME_EXISTS,
      );
    }

    const category =
      await this.repository.create({
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
        color: dto.color,
        isActive: dto.isActive ?? true,

        organization: {
          connect: {
            id: dto.organizationId,
          },
        },
      });

    return CategoriesMapper.toResponse(
      category,
    );
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ) {
    await this.findById(id);

    const category =
      await this.repository.update(
        id,
        dto,
      );

    return CategoriesMapper.toResponse(
      category,
    );
  }

  async activate(id: string) {
    await this.findById(id);

    const category =
      await this.repository.activate(id);

    return CategoriesMapper.toResponse(
      category,
    );
  }

  async deactivate(id: string) {
    await this.findById(id);

    const category =
      await this.repository.deactivate(id);

    return CategoriesMapper.toResponse(
      category,
    );
  }

  async delete(id: string) {
    await this.findById(id);

    await this.repository.delete(id);

    return {
      message:
        'Category deleted successfully',
    };
  }
}