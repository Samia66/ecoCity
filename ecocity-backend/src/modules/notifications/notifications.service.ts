import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsMapper, NotificationDto } from './notifications.mapper';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly repository: NotificationsRepository,
    private readonly mapper: NotificationsMapper,
  ) {}

  async findMine(userId: string): Promise<{ notifications: NotificationDto[]; unreadCount: number }> {
    const [list, unreadCount] = await Promise.all([
      this.repository.findMany(userId),
      this.repository.countUnread(userId),
    ]);
    return { notifications: this.mapper.toDtoList(list), unreadCount };
  }

  async markRead(id: string, userId: string): Promise<void> {
    await this.repository.markRead(id, userId);
  }

  async markAllRead(userId: string): Promise<void> {
    await this.repository.markAllRead(userId);
  }

  /** Utilitaire interne pour les autres modules (ex : notifier un agent assigné). */
  async notify(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    reportId?: string;
  }): Promise<void> {
    await this.repository.create({
      user: { connect: { id: params.userId } },
      type: params.type,
      title: params.title,
      message: params.message,
      ...(params.reportId ? { report: { connect: { id: params.reportId } } } : {}),
    });
  }
}
