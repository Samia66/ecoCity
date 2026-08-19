import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TeamStatus } from '@prisma/client';

/** Champs modifiables directement — le chef, les agents et les zones passent par leurs endpoints dédiés. */
export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Le nom de l'équipe est requis" })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TeamStatus, { message: 'Statut invalide' })
  status?: TeamStatus;
}
