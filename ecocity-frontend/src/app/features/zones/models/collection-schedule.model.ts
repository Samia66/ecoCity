import { DayOfWeek } from '../../teams/models/team.model';

export interface CollectionSchedule {
  id: string;
  zoneId: string;
  zoneName: string;
  teamId: string;
  teamName: string;
  dayOfWeek: DayOfWeek;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSchedulePayload {
  teamId: string;
  dayOfWeek: DayOfWeek;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface UpdateSchedulePayload {
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}
