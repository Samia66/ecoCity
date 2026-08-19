import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const WITH_RELATIONS = {
  members: { orderBy: { agentName: 'asc' } },
  zone: true,
} satisfies Prisma.TeamInclude;

export type TeamWithRelations = Prisma.TeamGetPayload<{ include: typeof WITH_RELATIONS }>;

@Injectable()
export class TeamsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(organizationId: string): Promise<TeamWithRelations[]> {
    return this.prisma.team.findMany({
      where: { organizationId, deletedAt: null },
      orderBy: { name: 'asc' },
      include: WITH_RELATIONS,
    });
  }

  /** Équipe dont `agentId` est membre (un agent appartient à au plus une équipe). */
  findByMemberAgentId(organizationId: string, agentId: string): Promise<TeamWithRelations | null> {
    return this.prisma.team.findFirst({
      where: { organizationId, deletedAt: null, members: { some: { agentId } } },
      include: WITH_RELATIONS,
    });
  }

  findById(id: string): Promise<TeamWithRelations | null> {
    return this.prisma.team.findUnique({ where: { id }, include: WITH_RELATIONS });
  }

  create(data: Prisma.TeamCreateInput): Promise<TeamWithRelations> {
    return this.prisma.team.create({ data, include: WITH_RELATIONS });
  }

  update(id: string, data: Prisma.TeamUpdateInput): Promise<TeamWithRelations> {
    return this.prisma.team.update({ where: { id }, data, include: WITH_RELATIONS });
  }

  softDelete(id: string): Promise<void> {
    return this.prisma.team
      .update({ where: { id }, data: { deletedAt: new Date() } })
      .then(() => undefined);
  }

  addMember(data: Prisma.TeamMemberCreateInput) {
    return this.prisma.teamMember.create({ data });
  }

  removeMember(teamId: string, agentId: string): Promise<void> {
    return this.prisma.teamMember
      .deleteMany({ where: { teamId, agentId } })
      .then(() => undefined);
  }

  /** Toute équipe (autre que `excludeTeamId`) dont cet agent est déjà membre. */
  findExistingMembershipForAgent(agentId: string, excludeTeamId?: string) {
    return this.prisma.teamMember.findFirst({
      where: { agentId, ...(excludeTeamId ? { teamId: { not: excludeTeamId } } : {}) },
      include: { team: true },
    });
  }
}
