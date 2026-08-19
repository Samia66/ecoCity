import { Injectable } from '@nestjs/common';
import { ScheduleWithRelations } from './collection-schedules.repository';
import { DayOfWeek } from '@prisma/client';

export interface CollectionScheduleDto {
  id: string;
  zoneId: string;
  zoneName: string;
  teamId: string;
  teamName: string;
  dayOfWeek: DayOfWeek;
  startTime?: string | null;
  endTime?: string | null;
  isActive: boolean;
  createdAt: string;
}

@Injectable()
export class CollectionSchedulesMapper {
  toDto(schedule: ScheduleWithRelations): CollectionScheduleDto {
    return {
      id: schedule.id,
      zoneId: schedule.zoneId,
      zoneName: schedule.zone.name,
      teamId: schedule.teamId,
      teamName: schedule.team.name,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isActive: schedule.isActive,
      createdAt: schedule.createdAt.toISOString(),
    };
  }

  toDtoList(schedules: ScheduleWithRelations[]): CollectionScheduleDto[] {
    return schedules.map((s) => this.toDto(s));
  }
}
