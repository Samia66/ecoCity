import { Injectable } from '@nestjs/common';
import { Prisma, DayOfWeek } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const WITH_RELATIONS = {
  team: { include: { members: true } },
  zone: true,
  attachments: { orderBy: { createdAt: 'asc' } },
  history: { orderBy: { createdAt: 'asc' } },
} satisfies Prisma.CollectionInclude;

export type CollectionWithRelations = Prisma.CollectionGetPayload<{ include: typeof WITH_RELATIONS }>;

@Injectable()
export class CollectionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(params: {
    where: Prisma.CollectionWhereInput;
    skip?: number;
    take?: number;
  }): Promise<CollectionWithRelations[]> {
    return this.prisma.collection.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: [{ scheduledDate: 'desc' }, { createdAt: 'desc' }],
      include: WITH_RELATIONS,
    });
  }

  count(where: Prisma.CollectionWhereInput): Promise<number> {
    return this.prisma.collection.count({ where });
  }

  findById(id: string): Promise<CollectionWithRelations | null> {
    return this.prisma.collection.findUnique({ where: { id }, include: WITH_RELATIONS });
  }

  update(id: string, data: Prisma.CollectionUpdateInput): Promise<CollectionWithRelations> {
    return this.prisma.collection.update({ where: { id }, data, include: WITH_RELATIONS });
  }

  addHistory(data: Prisma.CollectionStatusHistoryCreateInput) {
    return this.prisma.collectionStatusHistory.create({ data });
  }

  addAttachment(data: Prisma.CollectionAttachmentCreateInput) {
    return this.prisma.collectionAttachment.create({ data });
  }

  /**
   * Plannings actifs de l'organisation pour un jour donné — sert de base à
   * la génération idempotente des collectes du jour.
   */
  findActiveSchedules(organizationId: string, dayOfWeek: DayOfWeek) {
    return this.prisma.collectionSchedule.findMany({
      where: { isActive: true, dayOfWeek, team: { organizationId, deletedAt: null, status: 'ACTIVE' } },
    });
  }

  /** Crée la collecte du jour pour ce planning si elle n'existe pas encore (idempotent). */
  async ensureCollectionForSchedule(schedule: {
    id: string;
    teamId: string;
    zoneId: string;
    dayOfWeek: DayOfWeek;
  }, scheduledDate: Date): Promise<void> {
    await this.prisma.collection.upsert({
      where: { scheduleId_scheduledDate: { scheduleId: schedule.id, scheduledDate } },
      create: {
        schedule: { connect: { id: schedule.id } },
        team: { connect: { id: schedule.teamId } },
        zone: { connect: { id: schedule.zoneId } },
        scheduledDate,
        dayOfWeek: schedule.dayOfWeek,
      },
      update: {},
    });
  }
}
