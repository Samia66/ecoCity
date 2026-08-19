import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const WITH_COUNT = {
  _count: { select: { reports: true } },
} satisfies Prisma.CategoryInclude;

export type CategoryWithCount = Prisma.CategoryGetPayload<{ include: typeof WITH_COUNT }>;

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(organizationId?: string): Promise<CategoryWithCount[]> {
    return this.prisma.category.findMany({
      where: {
        deletedAt: null,
        OR: [{ organizationId }, { organizationId: null }],
      },
      orderBy: { name: 'asc' },
      include: WITH_COUNT,
    });
  }

  findById(id: string): Promise<CategoryWithCount | null> {
    return this.prisma.category.findUnique({ where: { id }, include: WITH_COUNT });
  }

  create(data: Prisma.CategoryCreateInput): Promise<CategoryWithCount> {
    return this.prisma.category.create({ data, include: WITH_COUNT });
  }

  update(id: string, data: Prisma.CategoryUpdateInput): Promise<CategoryWithCount> {
    return this.prisma.category.update({ where: { id }, data, include: WITH_COUNT });
  }

  softDelete(id: string): Promise<CategoryWithCount> {
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: WITH_COUNT,
    });
  }
}
