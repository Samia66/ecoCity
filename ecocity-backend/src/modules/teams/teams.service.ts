import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { UsersRepository } from '../users/users.repository';
import { UsersMapper, UserItemDto } from '../users/users.mapper';
import { InterventionsRepository } from '../interventions/interventions.repository';
import { TeamsRepository, TeamWithRelations } from './teams.repository';
import { TeamsMapper, TeamDto, TeamMemberDto, TeamZoneDto } from './teams.mapper';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

/** Une équipe de terrain compte un chef + 1 à 2 agents (2 à 3 membres au total). */
export const TEAM_MIN_MEMBERS = 2;
export const TEAM_MAX_MEMBERS = 3;

export interface AgentWithWorkloadDto extends UserItemDto {
  assignedCount: number;
  inProgressCount: number;
  averageResolutionMinutes: number;
  isOnline: boolean;
}

@Injectable()
export class TeamsService {
  constructor(
    private readonly repository: TeamsRepository,
    private readonly mapper: TeamsMapper,
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
    private readonly interventionsRepository: InterventionsRepository,
  ) {}

  async findAll(requester: AuthenticatedUser): Promise<TeamDto[]> {
    // Un AGENT ou un TEAM_LEADER ne consulte que sa propre équipe ; le reste du staff voit toute l'organisation.
    if (requester.roleName === RoleName.AGENT || requester.roleName === RoleName.TEAM_LEADER) {
      const team = await this.repository.findByMemberAgentId(requester.organizationId, requester.userId);
      return team ? [await this.toDtoWithSchedule(team)] : [];
    }

    const teams = await this.repository.findMany(requester.organizationId);
    return Promise.all(teams.map((t) => this.toDtoWithSchedule(t)));
  }

  async findById(id: string, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertTeamAccess(team, requester);
    return this.toDtoWithSchedule(team);
  }

  async create(dto: CreateTeamDto, requester: AuthenticatedUser): Promise<TeamDto> {
    const memberIds = [dto.leaderId, ...dto.agentIds];
    if (new Set(memberIds).size !== memberIds.length) {
      throw new BadRequestException("Le chef d'équipe et les agents doivent être des personnes distinctes.");
    }

    const leader = await this.usersRepository.findById(dto.leaderId);
    if (!leader || leader.deletedAt || leader.role.name !== RoleName.TEAM_LEADER) {
      throw new NotFoundException("Chef d'équipe introuvable.");
    }
    if (leader.organizationId !== requester.organizationId) {
      throw new BadRequestException("Le chef d'équipe doit appartenir à votre organisation.");
    }
    const leaderAlreadyLeading = await this.repository.findExistingMembershipForAgent(leader.id);
    if (leaderAlreadyLeading) {
      throw new BadRequestException(
        `Ce chef d'équipe dirige déjà l'équipe active "${leaderAlreadyLeading.team.name}".`,
      );
    }

    const agents = await Promise.all(dto.agentIds.map((id) => this.usersRepository.findById(id)));
    for (const [index, agent] of agents.entries()) {
      if (!agent || agent.deletedAt || agent.role.name !== RoleName.AGENT) {
        throw new NotFoundException(`Agent introuvable (${dto.agentIds[index]}).`);
      }
      if (agent.organizationId !== requester.organizationId) {
        throw new BadRequestException("Tous les agents doivent appartenir à votre organisation.");
      }
      const existingMembership = await this.repository.findExistingMembershipForAgent(agent.id);
      if (existingMembership) {
        throw new BadRequestException(
          `L'agent ${agent.firstName} ${agent.lastName} fait déjà partie de l'équipe active "${existingMembership.team.name}".`,
        );
      }
    }

    const team = await this.repository.create({
      name: dto.name,
      description: dto.description,
      status: dto.status,
      organization: { connect: { id: requester.organizationId } },
      createdById: requester.userId,
      createdByName: requester.email,
      members: {
        create: [
          { agentId: leader.id, agentName: `${leader.firstName} ${leader.lastName}`, agentEmail: leader.email, role: 'LEADER' },
          ...agents.map((agent) => ({
            agentId: agent!.id,
            agentName: `${agent!.firstName} ${agent!.lastName}`,
            agentEmail: agent!.email,
            role: 'AGENT' as const,
          })),
        ],
      },
      ...(dto.zoneIds && dto.zoneIds.length > 0
        ? { teamZones: { create: dto.zoneIds.map((zoneId) => ({ zone: { connect: { id: zoneId } } })) } }
        : {}),
    });

    return this.toDtoWithSchedule(team);
  }

  async update(id: string, dto: UpdateTeamDto, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertManages(team, requester);

    const updated = await this.repository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    });
    return this.toDtoWithSchedule(updated);
  }

  async remove(id: string, requester: AuthenticatedUser): Promise<void> {
    const team = await this.getTeamOrThrow(id);
    this.assertManages(team, requester);
    await this.repository.softDelete(id);
  }

  // --- Membres -------------------------------------------------------

  async getMembers(id: string, requester: AuthenticatedUser): Promise<TeamMemberDto[]> {
    const team = await this.getTeamOrThrow(id);
    this.assertTeamAccess(team, requester);
    return team.members.map((m) => this.mapper.toMemberDto(m));
  }

  async addMember(id: string, agentId: string, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertManages(team, requester);

    if (team.members.length >= TEAM_MAX_MEMBERS) {
      throw new BadRequestException(`Une équipe ne peut pas dépasser ${TEAM_MAX_MEMBERS} membres (chef inclus).`);
    }

    const agent = await this.usersRepository.findById(agentId);
    if (!agent || agent.deletedAt || agent.role.name !== RoleName.AGENT) {
      throw new NotFoundException('Agent introuvable.');
    }
    if (agent.organizationId !== team.organizationId) {
      throw new BadRequestException("Cet agent n'appartient pas à votre organisation.");
    }

    const alreadyMember = team.members.some((m) => m.agentId === agentId);
    if (alreadyMember) {
      throw new BadRequestException('Cet agent fait déjà partie de cette équipe.');
    }

    const existingMembership = await this.repository.findExistingMembershipForAgent(agentId, id);
    if (existingMembership) {
      throw new BadRequestException(
        `Cet agent fait déjà partie de l'équipe active "${existingMembership.team.name}".`,
      );
    }

    await this.repository.addMember({
      team: { connect: { id } },
      agentId: agent.id,
      agentName: `${agent.firstName} ${agent.lastName}`,
      agentEmail: agent.email,
      role: 'AGENT',
    });

    const refreshed = await this.getTeamOrThrow(id);
    return this.toDtoWithSchedule(refreshed);
  }

  async removeMember(id: string, agentId: string, requester: AuthenticatedUser): Promise<void> {
    const team = await this.getTeamOrThrow(id);
    this.assertManages(team, requester);

    const member = team.members.find((m) => m.agentId === agentId);
    if (member?.role === 'LEADER') {
      throw new BadRequestException(
        "Impossible de retirer le chef d'équipe : affectez d'abord un nouveau chef.",
      );
    }

    await this.repository.removeMember(id, agentId);
  }

  // --- Chef d'équipe ---------------------------------------------------

  async assignLeader(id: string, agentId: string, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertManages(team, requester);

    const newLeader = await this.usersRepository.findById(agentId);
    if (!newLeader || newLeader.deletedAt || newLeader.role.name !== RoleName.TEAM_LEADER) {
      throw new NotFoundException("La cible n'est pas un chef d'équipe valide.");
    }
    if (newLeader.organizationId !== team.organizationId) {
      throw new BadRequestException("Le chef d'équipe doit appartenir à votre organisation.");
    }

    const currentMembership = team.members.find((m) => m.agentId === agentId);
    if (!currentMembership) {
      const existingMembership = await this.repository.findExistingMembershipForAgent(agentId, id);
      if (existingMembership) {
        throw new BadRequestException(
          `Ce chef d'équipe dirige déjà l'équipe active "${existingMembership.team.name}".`,
        );
      }
      if (team.members.length >= TEAM_MAX_MEMBERS) {
        throw new BadRequestException(`Une équipe ne peut pas dépasser ${TEAM_MAX_MEMBERS} membres (chef inclus).`);
      }
    }

    const previousLeader = team.members.find((m) => m.role === 'LEADER');
    if (previousLeader && previousLeader.agentId !== agentId) {
      await this.repository.removeMember(id, previousLeader.agentId);
    }

    if (currentMembership) {
      await this.repository.removeMember(id, agentId);
    }
    await this.repository.addMember({
      team: { connect: { id } },
      agentId: newLeader.id,
      agentName: `${newLeader.firstName} ${newLeader.lastName}`,
      agentEmail: newLeader.email,
      role: 'LEADER',
    });

    const refreshed = await this.getTeamOrThrow(id);
    return this.toDtoWithSchedule(refreshed);
  }

  // --- Zones -------------------------------------------------------------

  async addZone(id: string, zoneId: string, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertManages(team, requester);

    const existing = await this.repository.findZoneAssignment(id, zoneId);
    if (existing) {
      throw new BadRequestException('Cette zone est déjà affectée à cette équipe.');
    }

    await this.repository.addZone(id, zoneId);
    const refreshed = await this.getTeamOrThrow(id);
    return this.toDtoWithSchedule(refreshed);
  }

  async removeZone(id: string, zoneId: string, requester: AuthenticatedUser): Promise<void> {
    const team = await this.getTeamOrThrow(id);
    this.assertManages(team, requester);
    await this.repository.removeZone(id, zoneId);
  }

  // --- Vue "mon équipe" (consommée par l'app Flutter, rôle TEAM_LEADER) ---

  /** Agents de l'équipe du chef connecté (hors lui-même), enrichis de leur charge de travail. */
  async getMyAgents(requester: AuthenticatedUser): Promise<AgentWithWorkloadDto[]> {
    const team = await this.repository.findByMemberAgentId(requester.organizationId, requester.userId);
    if (!team) return [];

    const agentMembers = team.members.filter((m) => m.role === 'AGENT');
    const agents = await Promise.all(agentMembers.map((m) => this.usersRepository.findById(m.agentId)));
    const validAgents = agents.filter((a): a is NonNullable<typeof a> => !!a && !a.deletedAt);

    return Promise.all(validAgents.map((agent) => this.withWorkload(agent)));
  }

  async getMyAgentDetail(requester: AuthenticatedUser, agentId: string): Promise<UserItemDto> {
    const team = await this.repository.findByMemberAgentId(requester.organizationId, requester.userId);
    const isMember = team?.members.some((m) => m.agentId === agentId && m.role === 'AGENT');
    if (!team || !isMember) {
      throw new NotFoundException("Cet agent ne fait pas partie de votre équipe.");
    }
    const agent = await this.usersRepository.findById(agentId);
    if (!agent || agent.deletedAt) {
      throw new NotFoundException('Agent introuvable.');
    }
    return this.usersMapper.toItem(agent);
  }

  async getMyStats(requester: AuthenticatedUser): Promise<{ totalAgents: number; activeAgents: number }> {
    const team = await this.repository.findByMemberAgentId(requester.organizationId, requester.userId);
    if (!team) return { totalAgents: 0, activeAgents: 0 };

    const agentMembers = team.members.filter((m) => m.role === 'AGENT');
    const agents = await Promise.all(agentMembers.map((m) => this.usersRepository.findById(m.agentId)));
    const validAgents = agents.filter((a): a is NonNullable<typeof a> => !!a && !a.deletedAt);
    return {
      totalAgents: validAgents.length,
      activeAgents: validAgents.filter((a) => a.status === 'ACTIVE').length,
    };
  }

  /** Zones de l'équipe du membre connecté (chef ou agent) — `GET /team/zones` côté mobile. */
  async getMyZones(requester: AuthenticatedUser): Promise<TeamZoneDto[]> {
    const team = await this.repository.findByMemberAgentId(requester.organizationId, requester.userId);
    if (!team) return [];
    return team.teamZones.map((tz) => ({ id: tz.zone.id, name: tz.zone.name }));
  }

  private async withWorkload(agent: NonNullable<Awaited<ReturnType<UsersRepository['findById']>>>): Promise<AgentWithWorkloadDto> {
    const [active, inProgress, avgMinutes] = await Promise.all([
      this.interventionsRepository.countByStatus({
        agentId: agent.id,
        status: { in: ['ASSIGNEE', 'ACCEPTEE', 'EN_COURS'] },
      }),
      this.interventionsRepository.countByStatus({ agentId: agent.id, status: 'EN_COURS' }),
      this.interventionsRepository.averageResolutionMinutes(agent.id),
    ]);
    const sum = (rows: { _count: { _all: number } }[]) => rows.reduce((s, r) => s + r._count._all, 0);
    const recentlyActive = !!agent.lastLoginAt && Date.now() - agent.lastLoginAt.getTime() < 15 * 60_000;

    return {
      ...this.usersMapper.toItem(agent),
      assignedCount: sum(active),
      inProgressCount: sum(inProgress),
      averageResolutionMinutes: avgMinutes,
      isOnline: recentlyActive,
    };
  }

  // --------------------------------------------------------------------

  private async toDtoWithSchedule(team: TeamWithRelations): Promise<TeamDto> {
    const scheduleDays = await this.repository.findActiveScheduleDays(team.id);
    return this.mapper.toDto(team, scheduleDays);
  }

  private async getTeamOrThrow(id: string): Promise<TeamWithRelations> {
    const team = await this.repository.findById(id);
    if (!team || team.deletedAt) {
      throw new NotFoundException('Équipe introuvable.');
    }
    return team;
  }

  /**
   * Contrôle d'accès en lecture : SUPER_ADMIN voit tout, ADMIN reste dans son
   * organisation, TEAM_LEADER/AGENT ne voient que l'équipe dont ils sont
   * membres. Appliqué côté backend indépendamment de ce que montre Angular.
   */
  private assertTeamAccess(team: TeamWithRelations, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;

    if (requester.roleName === RoleName.TEAM_LEADER || requester.roleName === RoleName.AGENT) {
      const isMember = team.members.some((m) => m.agentId === requester.userId);
      if (!isMember) {
        throw new ForbiddenException("Vous n'avez pas accès à cette équipe.");
      }
      return;
    }

    if (team.organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette équipe.");
    }
  }

  /** Gestion (mutations) : réservée à SUPER_ADMIN/ADMIN de l'organisation — jamais à TEAM_LEADER/AGENT. */
  private assertManages(team: TeamWithRelations, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (requester.roleName !== RoleName.ADMIN || team.organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à gérer cette équipe.");
    }
  }
}
