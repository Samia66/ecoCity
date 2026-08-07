import { Prisma } from '@prisma/client';

type CategoryWithOrganization =
  Prisma.CategoryGetPayload<{
    include: {
      organization: true;
    };
  }>;

export class CategoriesMapper {
  static toResponse(category: CategoryWithOrganization) {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
      organization: category.organization.name,
      createdAt: category.createdAt,
    };
  }
}