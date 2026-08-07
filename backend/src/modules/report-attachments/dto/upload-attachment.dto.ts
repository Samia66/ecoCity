import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UploadAttachmentDto {
  @IsUUID()
  reportId: string;

  @IsString()
  fileName: string;

  @IsString()
  originalName: string;

  @IsString()
  mimeType: string;

  @IsOptional()
  @IsString()
  extension?: string;

  @IsInt()
  @Min(1)
  size: number;

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  url?: string;
}