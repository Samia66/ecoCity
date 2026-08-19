import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const WITH_RELATIONS = {
  assignments: true,
  _count: { select: { reports: true, assignments: true, teams: true } },
} satisfies Prisma.ZoneInclude;

export type ZoneWithRelations = Prisma.ZoneGetPayload<{ include: typeof WITH_RELATIONS }>;

@Injectable()
export class ZonesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(organizationId: string): Promise<ZoneWithRelations[]> {
    return this.prisma.zone.findMany({
      where: { organizationId, deletedAt: null },
      orderBy: { name: 'asc' },
      include: WITH_RELATIONS,
    });
  }

  findById(id: string): Promise<ZoneWithRelations | null> {
    return this.prisma.zone.findUnique({ where: { id }, include: WITH_RELATIONS });
  }

  create(data: Prisma.ZoneCreateInput): Promise<ZoneWithRelations> {
    return this.prisma.zone.create({ data, include: WITH_RELATIONS });
  }

  update(id: string, data: Prisma.ZoneUpdateInput): Promise<ZoneWithRelations> {
    return this.prisma.zone.update({ where: { id }, data, include: WITH_RELATIONS });
  }

  softDelete(id: string): Promise<ZoneWithRelations> {
    return this.prisma.zone.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: WITH_RELATIONS,
    });
  }
}
