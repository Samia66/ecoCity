import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TeamStatus } from '@prisma/client';

/** Une équipe compte un chef + 1 à 2 agents (2 à 3 membres au total). */
export class CreateTeamDto {
  @IsString()
  @IsNotEmpty({ message: "Le nom de l'équipe est requis" })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: "Le chef d'équipe est requis" })
  leaderId!: string;

  @IsArray()
  @ArrayMinSize(1, { message: "Une équipe doit compter au moins 1 agent en plus du chef" })
  @ArrayMaxSize(2, { message: "Une équipe ne peut pas compter plus de 2 agents en plus du chef" })
  @ArrayUnique()
  @IsString({ each: true })
  agentIds!: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  zoneIds?: string[];

  @IsOptional()
  @IsEnum(TeamStatus, { message: 'Statut invalide' })
  status?: TeamStatus;
}
