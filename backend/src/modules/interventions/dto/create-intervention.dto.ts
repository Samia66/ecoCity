import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateInterventionDto {
  @IsUUID()
  reportId: string;

  @IsUUID()
  agentId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}