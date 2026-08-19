import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export const USER_LIST_INCLUDE = {
  role: true,
  organization: true,
} satisfies Prisma.UserInclude;

export type UserWithRelations = Prisma.UserGetPayload<{ include: typeof USER_LIST_INCLUDE }>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    where: Prisma.UserWhereInput;
    skip: number;
    take: number;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserWithRelations[]> {
    return this.prisma.user.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy ?? { createdAt: 'desc' },
      include: USER_LIST_INCLUDE,
    });
  }

  count(where: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  findById(id: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({ where: { id }, include: USER_LIST_INCLUDE });
  }

  findByEmail(email: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({ where: { email }, include: USER_LIST_INCLUDE });
  }

  findRoleByName(name: string) {
    return this.prisma.role.findUnique({ where: { name } });
  }

  findRoleById(id: string) {
    return this.prisma.role.findUnique({ where: { id } });
  }

  create(data: Prisma.UserCreateInput): Promise<UserWithRelations> {
    return this.prisma.user.create({ data, include: USER_LIST_INCLUDE });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<UserWithRelations> {
    return this.prisma.user.update({ where: { id }, data, include: USER_LIST_INCLUDE });
  }

  softDelete(id: string): Promise<UserWithRelations> {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
      include: USER_LIST_INCLUDE,
    });
  }

  /** Retire cet utilisateur de toute équipe (chef ou agent) — appelé à la suppression d'un compte. */
  removeFromAllTeams(agentId: string): Promise<void> {
    return this.prisma.teamMember.deleteMany({ where: { agentId } }).then(() => undefined);
  }
}
