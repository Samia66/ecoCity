import { IsNotEmpty, IsString } from 'class-validator';

export class AddTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  agentId!: string;
}
