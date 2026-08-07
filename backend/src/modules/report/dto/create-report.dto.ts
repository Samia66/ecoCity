import {
  IsString,
  IsUUID,
  IsOptional,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateReportDto {

  @IsUUID()
authorId: string;

  @IsUUID()
  organizationId: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  city?: string;
}