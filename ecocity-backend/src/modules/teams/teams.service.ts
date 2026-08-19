import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { UsersRepository } from '../users/users.repository';
import { TeamsRepository } from './teams.repository';
import { TeamsMapper, TeamDto, TeamMemberDto } from './teams.mapper';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AssignTeamZoneDto } from './dto/assign-team-zone.dto';

/** Une équipe de terrain doit compter entre 2 et 3 agents (le maximum est une règle dure). */
export const TEAM_MAX_MEMBERS = 3;

@Injectable()
export class TeamsService {
  constructor(
    private readonly repository: TeamsRepository,
    private readonly mapper: TeamsMapper,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAll(requester: AuthenticatedUser): Promise<TeamDto[]> {
    // Un AGENT ne consulte que sa propre équipe ; le reste du staff voit toute l'organisation.
    if (requester.roleName === RoleName.AGENT) {
      const team = await this.repository.findByMemberAgentId(requester.organizationId, requester.userId);
      return team ? [this.mapper.toDto(team)] : [];
    }

    const teams = await this.repository.findMany(requester.organizationId);
    return this.mapper.toDtoList(teams);
  }

  async findById(id: string, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertSameOrganization(team.organizationId, requester);
    return this.mapper.toDto(team);
  }

  async create(dto: CreateTeamDto, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.repository.create({
      name: dto.name,
      description: dto.description,
      organization: { connect: { id: requester.organizationId } },
      createdById: requester.userId,
      createdByName: requester.email,
    });
    return this.mapper.toDto(team);
  }

  async update(id: string, dto: UpdateTeamDto, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertSameOrganization(team.organizationId, requester);

    const updated = await this.repository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
    });
    return this.mapper.toDto(updated);
  }

  async remove(id: string, requester: AuthenticatedUser): Promise<void> {
    const team = await this.getTeamOrThrow(id);
    this.assertSameOrganization(team.organizationId, requester);
    await this.repository.softDelete(id);
  }

  // --- Membres -------------------------------------------------------

  async getMembers(id: string, requester: AuthenticatedUser): Promise<TeamMemberDto[]> {
    const team = await this.getTeamOrThrow(id);
    this.assertSameOrganization(team.organizationId, requester);
    return team.members.map((m) => this.mapper.toMemberDto(m));
  }

  async addMember(id: string, agentId: string, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertSameOrganization(team.organizationId, requester);

    if (team.members.length >= TEAM_MAX_MEMBERS) {
      throw new BadRequestException(`Une équipe ne peut pas dépasser ${TEAM_MAX_MEMBERS} agents.`);
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
        `Cet agent fait déjà partie de l'équipe "${existingMembership.team.name}".`,
      );
    }

    await this.repository.addMember({
      team: { connect: { id } },
      agentId: agent.id,
      agentName: `${agent.firstName} ${agent.lastName}`,
      agentEmail: agent.email,
    });

    const refreshed = await this.getTeamOrThrow(id);
    return this.mapper.toDto(refreshed);
  }

  async removeMember(id: string, agentId: string, requester: AuthenticatedUser): Promise<void> {
    const team = await this.getTeamOrThrow(id);
    this.assertSameOrganization(team.organizationId, requester);
    await this.repository.removeMember(id, agentId);
  }

  // --- Affectation de zone ---------------------------------------------

  async assignZone(id: string, dto: AssignTeamZoneDto, requester: AuthenticatedUser): Promise<TeamDto> {
    const team = await this.getTeamOrThrow(id);
    this.assertSameOrganization(team.organizationId, requester);

    const updated = await this.repository.update(id, {
      zone: { connect: { id: dto.zoneId } },
    });
    return this.mapper.toDto(updated);
  }

  async unassignZone(id: string, requester: AuthenticatedUser): Promise<void> {
    const team = await this.getTeamOrThrow(id);
    this.assertSameOrganization(team.organizationId, requester);

    await this.repository.update(id, { zone: { disconnect: true } });
  }

  // --------------------------------------------------------------------

  private async getTeamOrThrow(id: string) {
    const team = await this.repository.findById(id);
    if (!team || team.deletedAt) {
      throw new NotFoundException('Équipe introuvable.');
    }
    return team;
  }

  private assertSameOrganization(organizationId: string, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette équipe.");
    }
  }
}
