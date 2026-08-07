import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class PermissionsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.permission.findMany({
      orderBy: {
        code: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.permission.findUnique({
      where: {
        id,
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.permission.findUnique({
      where: {
        code,
      },
    });
  }
}