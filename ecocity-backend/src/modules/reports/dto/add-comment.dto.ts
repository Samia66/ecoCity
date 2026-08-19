import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AddCommentDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  message!: string;
}
