import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  lastName!: string;

  @IsEmail({}, { message: 'Adresse email invalide' })
  email!: string;

  @IsString()
  @MinLength(6, { message: '6 caractères minimum' })
  password!: string;

  /** Optionnel : si absent, l'utilisateur est rattaché à l'organisation par défaut. */
  @IsOptional()
  @IsString()
  organizationId?: string;
}
