import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus, { message: 'Statut invalide' })
  status!: ReportStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
