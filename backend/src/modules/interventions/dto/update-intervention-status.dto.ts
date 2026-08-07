import { IsEnum } from 'class-validator';
import { InterventionStatus } from '@prisma/client';

export class UpdateInterventionStatusDto {
  @IsEnum(InterventionStatus)
  status: InterventionStatus;
}