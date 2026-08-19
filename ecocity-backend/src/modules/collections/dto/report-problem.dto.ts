import { IsNotEmpty, IsString } from 'class-validator';

export class ReportProblemDto {
  @IsString()
  @IsNotEmpty({ message: 'La description du problème est requise' })
  problemDescription!: string;
}
