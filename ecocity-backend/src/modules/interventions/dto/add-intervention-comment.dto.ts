import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AddInterventionCommentDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  message!: string;
}
