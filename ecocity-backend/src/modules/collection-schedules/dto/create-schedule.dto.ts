import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty({ message: "L'équipe responsable est requise" })
  teamId!: string;

  @IsEnum(DayOfWeek, { message: 'Jour de la semaine invalide' })
  dayOfWeek!: DayOfWeek;

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
