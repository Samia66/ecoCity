import { IsNotEmpty, IsString } from 'class-validator';

export class AssignLeaderDto {
  @IsString()
  @IsNotEmpty()
  agentId!: string;
}
