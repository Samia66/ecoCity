import {
  IsOptional,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  ReportStatus,
} from '@prisma/client';

export class QueryReportsDto {

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  search?: string;

}