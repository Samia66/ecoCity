import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleName } from '../../../common/constants/roles.constant';

/**
 * Création d'un compte "staff" (ADMIN / TEAM_LEADER / AGENT) par un
 * supérieur hiérarchique. Le mot de passe est généré automatiquement côté
 * serveur — jamais fourni par le créateur.
 */
export class CreateStaffUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  lastName!: string;

  @IsEmail({}, { message: 'Adresse email invalide' })
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsIn([RoleName.ADMIN, RoleName.TEAM_LEADER, RoleName.AGENT], {
    message: 'Rôle invalide pour une création par un supérieur hiérarchique',
  })
  role!: RoleName.ADMIN | RoleName.TEAM_LEADER | RoleName.AGENT;

  /** Requis uniquement si le créateur est SUPER_ADMIN (peut créer dans n'importe quelle organisation). */
  @IsOptional()
  @IsString()
  organizationId?: string;
}
