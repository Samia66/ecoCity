import { IsOptional, IsString } from 'class-validator';

export class CompleteCollectionDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
