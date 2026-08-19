import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportPriority, ReportStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryReportDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(ReportPriority)
  priority?: ReportPriority;

  // ✅ Filtre par ID de catégorie
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsString()
  zoneId?: string;


}