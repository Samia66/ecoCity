import { Type } from 'class-transformer';
import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ReportPriority } from '@prisma/client';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  title!: string;

  @IsString()
  @MinLength(10, { message: '10 caractères minimum' })
  description!: string;

  @IsString()
  @IsNotEmpty({ message: 'La catégorie est requise' })
  category!: string;

  @IsOptional()
  @IsEnum(ReportPriority)
  priority?: ReportPriority;

  @IsString()
  @IsNotEmpty({ message: "L'adresse est requise" })
  address!: string;

  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;
}
