import { Injectable } from '@nestjs/common';
import { CategoryWithCount } from './categories.repository';

/** Correspond à `Category` côté Angular. */
export interface CategoryDto {
  id: string;
  name: string;
  icon: string;
  reportsCount: number;
  createdAt: string;
}

@Injectable()
export class CategoriesMapper {
  toDto(category: CategoryWithCount): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      reportsCount: category._count.reports,
      createdAt: category.createdAt.toISOString(),
    };
  }

  toDtoList(categories: CategoryWithCount[]): CategoryDto[] {
    return categories.map((c) => this.toDto(c));
  }
}
