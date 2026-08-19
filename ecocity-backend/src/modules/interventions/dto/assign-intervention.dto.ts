import { IsNotEmpty, IsString } from 'class-validator';

export class AssignInterventionDto {
  @IsString()
  @IsNotEmpty()
  agentId!: string;
}
