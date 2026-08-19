import { IsNotEmpty, IsString } from 'class-validator';

export class AssignTeamZoneDto {
  @IsString()
  @IsNotEmpty()
  zoneId!: string;
}
