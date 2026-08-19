import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const WITH_COUNTS = {
  _count: { select: { users: true, reports: true } },
} satisfies Prisma.OrganizationInclude;

export type OrganizationWithCounts = Prisma.OrganizationGetPayload<{ include: typeof WITH_COUNTS }>;

@Injectable()
export class OrganizationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(params: { where: Prisma.OrganizationWhereInput; skip: number; take: number }) {
    return this.prisma.organization.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
      include: WITH_COUNTS,
    });
  }

  count(where: Prisma.OrganizationWhereInput): Promise<number> {
    return this.prisma.organization.count({ where });
  }

  findById(id: string): Promise<OrganizationWithCounts | null> {
    return this.prisma.organization.findUnique({ where: { id }, include: WITH_COUNTS });
  }

  create(data: Prisma.OrganizationCreateInput): Promise<OrganizationWithCounts> {
    return this.prisma.organization.create({ data, include: WITH_COUNTS });
  }

  update(id: string, data: Prisma.OrganizationUpdateInput): Promise<OrganizationWithCounts> {
    return this.prisma.organization.update({ where: { id }, data, include: WITH_COUNTS });
  }

  softDelete(id: string): Promise<OrganizationWithCounts> {
    return this.prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
      include: WITH_COUNTS,
    });
  }

  findFirst() {
    return this.prisma.organization.findFirst({ orderBy: { createdAt: 'asc' } });
  }
}
