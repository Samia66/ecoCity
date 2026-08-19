import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InterventionStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryInterventionDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(InterventionStatus)
  status?: InterventionStatus;

  @IsOptional()
  @IsString()
  agentId?: string;
}
