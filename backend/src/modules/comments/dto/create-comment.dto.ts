import {
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  reportId: string;

  @IsString()
  @MinLength(2)
  message: string;
}