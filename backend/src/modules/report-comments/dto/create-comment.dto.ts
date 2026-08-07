import {
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCommentDto {

  @IsUUID()
  reportId: string;

  @IsUUID()
  authorId: string;

  @IsString()
  content: string;

}