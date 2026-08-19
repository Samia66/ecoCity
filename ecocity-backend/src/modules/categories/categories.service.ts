import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { CategoriesRepository } from './categories.repository';
import { CategoriesMapper, CategoryDto } from './categories.mapper';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repository: CategoriesRepository,
    private readonly mapper: CategoriesMapper,
  ) {}

  async findAll(requester: AuthenticatedUser): Promise<CategoryDto[]> {
    const categories = await this.repository.findMany(requester.organizationId);
    return this.mapper.toDtoList(categories);
  }

  async create(dto: CreateCategoryDto, requester: AuthenticatedUser): Promise<CategoryDto> {
    const category = await this.repository.create({
      name: dto.name,
      icon: dto.icon ?? 'category',
      organization: { connect: { id: requester.organizationId } },
    });
    return this.mapper.toDto(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryDto> {
    await this.assertExists(id);
    const category = await this.repository.update(id, dto);
    return this.mapper.toDto(category);
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    await this.repository.softDelete(id);
  }

  private async assertExists(id: string): Promise<void> {
    const category = await this.repository.findById(id);
    if (!category || category.deletedAt) {
      throw new NotFoundException('Catégorie introuvable.');
    }
  }
}
