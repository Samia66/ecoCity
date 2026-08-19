import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CollectionStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryCollectionDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(CollectionStatus)
  status?: CollectionStatus;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsString()
  zoneId?: string;
}
