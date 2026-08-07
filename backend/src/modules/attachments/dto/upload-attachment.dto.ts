import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UploadAttachmentDto {
  @IsString()
  reportId: string;

  @IsOptional()
  @IsString()
  description?: string;
}