import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

export class UpdateScheduleDto {
  @IsOptional()
  @IsEnum(DayOfWeek, { message: 'Jour de la semaine invalide' })
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
