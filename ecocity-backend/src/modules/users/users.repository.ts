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

  // --- Team membership (AGENT -> TEAM_LEADER) -----------------------------

  upsertTeamMembership(params: {
    agentId: string;
    agentName: string;
    teamLeaderId: string;
    teamLeaderName: string;
    organizationId: string;
  }) {
    return this.prisma.teamMembership.upsert({
      where: { agentId: params.agentId },
      create: params,
      update: {
        teamLeaderId: params.teamLeaderId,
        teamLeaderName: params.teamLeaderName,
      },
    });
  }

  removeTeamMembership(agentId: string) {
    return this.prisma.teamMembership.deleteMany({ where: { agentId } });
  }

  findTeamMembersOf(teamLeaderId: string) {
    return this.prisma.teamMembership.findMany({ where: { teamLeaderId }, orderBy: { agentName: 'asc' } });
  }

  findTeamMembership(agentId: string) {
    return this.prisma.teamMembership.findUnique({ where: { agentId } });
  }

  // --- Zone assignment -----------------------------------------------------

  async replaceZoneAssignments(agentId: string, agentName: string, zoneIds: string[]): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.zoneAssignment.deleteMany({ where: { agentId } }),
      ...zoneIds.map((zoneId) =>
        this.prisma.zoneAssignment.create({ data: { zoneId, agentId, agentName } }),
      ),
    ]);
  }

  findZoneAssignmentsOf(agentId: string) {
    return this.prisma.zoneAssignment.findMany({ where: { agentId }, include: { zone: true } });
  }
}
