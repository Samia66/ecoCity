import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const WITH_RELATIONS = {
  team: true,
  zone: true,
} satisfies Prisma.CollectionScheduleInclude;

export type ScheduleWithRelations = Prisma.CollectionScheduleGetPayload<{ include: typeof WITH_RELATIONS }>;

@Injectable()
export class CollectionSchedulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByZone(zoneId: string): Promise<ScheduleWithRelations[]> {
    return this.prisma.collectionSchedule.findMany({
      where: { zoneId },
      orderBy: [{ dayOfWeek: 'asc' }],
      include: WITH_RELATIONS,
    });
  }

  findById(id: string): Promise<ScheduleWithRelations | null> {
    return this.prisma.collectionSchedule.findUnique({ where: { id }, include: WITH_RELATIONS });
  }

  findExisting(zoneId: string, teamId: string, dayOfWeek: Prisma.CollectionScheduleWhereInput['dayOfWeek']) {
    return this.prisma.collectionSchedule.findFirst({ where: { zoneId, teamId, dayOfWeek } });
  }

  create(data: Prisma.CollectionScheduleCreateInput): Promise<ScheduleWithRelations> {
    return this.prisma.collectionSchedule.create({ data, include: WITH_RELATIONS });
  }

  update(id: string, data: Prisma.CollectionScheduleUpdateInput): Promise<ScheduleWithRelations> {
    return this.prisma.collectionSchedule.update({ where: { id }, data, include: WITH_RELATIONS });
  }

  remove(id: string): Promise<void> {
    return this.prisma.collectionSchedule.delete({ where: { id } }).then(() => undefined);
  }
}
