import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InterventionStatus } from '@prisma/client';

export class UpdateInterventionStatusDto {
  @IsEnum(InterventionStatus, { message: 'Statut invalide' })
  status!: InterventionStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
