import { RoleName } from '@prisma/client';

export class JwtPayloadDto {
    sub!: string;
    email!: string;
    role!: RoleName;
    organizationId!: string;
}