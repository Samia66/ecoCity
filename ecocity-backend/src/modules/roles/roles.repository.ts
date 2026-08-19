import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const WITH_RELATIONS = {
  permissions: true,
  _count: { select: { users: true } },
} satisfies Prisma.RoleInclude;

export type RoleWithRelations = Prisma.RoleGetPayload<{ include: typeof WITH_RELATIONS }>;

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(): Promise<RoleWithRelations[]> {
    return this.prisma.role.findMany({ orderBy: { createdAt: 'asc' }, include: WITH_RELATIONS });
  }

  findById(id: string): Promise<RoleWithRelations | null> {
    return this.prisma.role.findUnique({ where: { id }, include: WITH_RELATIONS });
  }

  findByName(name: string): Promise<RoleWithRelations | null> {
    return this.prisma.role.findUnique({ where: { name }, include: WITH_RELATIONS });
  }

  create(data: { name: string; description?: string; permissionCodes: string[] }): Promise<RoleWithRelations> {
    return this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: { connect: data.permissionCodes.map((code) => ({ code })) },
      },
      include: WITH_RELATIONS,
    });
  }

  update(
    id: string,
    data: { name?: string; description?: string; permissionCodes?: string[] },
  ): Promise<RoleWithRelations> {
    return this.prisma.role.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.permissionCodes !== undefined
          ? { permissions: { set: data.permissionCodes.map((code) => ({ code })) } }
          : {}),
      },
      include: WITH_RELATIONS,
    });
  }

  setPermissions(id: string, permissionCodes: string[]): Promise<RoleWithRelations> {
    return this.prisma.role.update({
      where: { id },
      data: { permissions: { set: permissionCodes.map((code) => ({ code })) } },
      include: WITH_RELATIONS,
    });
  }

  delete(id: string): Promise<void> {
    return this.prisma.role.delete({ where: { id } }).then(() => undefined);
  }
}
