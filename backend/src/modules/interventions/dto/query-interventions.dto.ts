import {
    IsEnum,
    IsInt,
    IsOptional,
    Max,
    Min,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { InterventionStatus } from '@prisma/client';

export class QueryInterventionsDto {
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    page = 1;

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 10;

    @IsOptional()
    @IsEnum(InterventionStatus)
    status?: InterventionStatus;
}