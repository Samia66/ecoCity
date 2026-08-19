import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la zone est requis' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
