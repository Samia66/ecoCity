import { ArrayUnique, IsArray, IsString } from 'class-validator';

export class AssignZonesDto {
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  zoneIds!: string[];
}
