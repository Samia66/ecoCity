import { IsNotEmpty, IsString } from 'class-validator';

export class AssignTeamLeaderDto {
  @IsString()
  @IsNotEmpty()
  teamLeaderId!: string;
}
