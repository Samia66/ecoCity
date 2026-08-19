import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty({ message: "Le nom de l'équipe est requis" })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
