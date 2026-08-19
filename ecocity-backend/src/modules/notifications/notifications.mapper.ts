import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';

export interface NotificationDto {
  id: string;
  type: string;
  title: string;
  message: string;
  reportId?: string | null;
  read: boolean;
  createdAt: string;
}

@Injectable()
export class NotificationsMapper {
  toDto(n: Notification): NotificationDto {
    return {
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      reportId: n.reportId,
      read: !!n.readAt,
      createdAt: n.createdAt.toISOString(),
    };
  }

  toDtoList(list: Notification[]): NotificationDto[] {
    return list.map((n) => this.toDto(n));
  }
}
