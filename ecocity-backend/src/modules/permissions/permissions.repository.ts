import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { label: 'asc' }] });
  }

  findByCode(code: string) {
    return this.prisma.permission.findUnique({ where: { code } });
  }

  findById(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  create(data: Prisma.PermissionCreateInput) {
    return this.prisma.permission.create({ data });
  }

  delete(id: string): Promise<void> {
    return this.prisma.permission.delete({ where: { id } }).then(() => undefined);
  }
}
