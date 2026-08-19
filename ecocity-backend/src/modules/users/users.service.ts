import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { AppConfig } from '../../config/configuration';
import { hashPassword } from '../../common/utils/hash.util';
import { generateTempPassword } from '../../common/utils/password-generator.util';
import { paginate, toSkipTake, PaginatedResult } from '../../common/utils/pagination.util';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { InterventionsRepository } from '../interventions/interventions.repository';
import { UsersRepository } from './users.repository';
import { UsersMapper, UserItemDto } from './users.mapper';
import { CreateStaffUserDto } from './dto/create-staff-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { AssignTeamLeaderDto } from './dto/assign-team-leader.dto';
import { AssignZonesDto } from './dto/assign-zones.dto';

/** Qui peut créer quel rôle "staff" — hiérarchie stricte. */
const CREATION_HIERARCHY: Record<string, RoleName[]> = {
  [RoleName.SUPER_ADMIN]: [RoleName.ADMIN, RoleName.TEAM_LEADER, RoleName.AGENT],
  [RoleName.ADMIN]: [RoleName.TEAM_LEADER, RoleName.AGENT],
  [RoleName.TEAM_LEADER]: [RoleName.AGENT],
};

export interface CreateStaffUserResult {
  user: UserItemDto;
  temporaryPassword: string;
}

@Injectable()
export class UsersService {
  private readonly appConfig: AppConfig;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
    private readonly interventionsRepository: InterventionsRepository,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.get<AppConfig>('app')!;
  }

  async findAll(query: QueryUserDto, requester: AuthenticatedUser): Promise<PaginatedResult<UserItemDto>> {
    const { skip, take } = toSkipTake(query.page, query.limit);

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(requester.roleName !== RoleName.SUPER_ADMIN ? { organizationId: requester.organizationId } : {}),
      ...(query.organizationId ? { organizationId: query.organizationId } : {}),
      ...(query.status ? { status: query.status as Prisma.EnumUserStatusFilter['equals'] } : {}),
      ...(query.role ? { role: { name: query.role } } : {}),
      ...(query.search
        ? {
            OR: [
              { firstName: { contains: query.search, mode: 'insensitive' } },
              { lastName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      this.usersRepository.findMany({ where, skip, take }),
      this.usersRepository.count(where),
    ]);

    return paginate(this.usersMapper.toItemList(users), total, query.page, query.limit);
  }

  async findById(id: string, requester: AuthenticatedUser): Promise<UserItemDto> {
    const user = await this.usersRepository.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    this.assertSameOrganization(user.organizationId, requester);
    return this.usersMapper.toItem(user);
  }

  async createStaff(dto: CreateStaffUserDto, requester: AuthenticatedUser): Promise<CreateStaffUserResult> {
    const allowedRoles = CREATION_HIERARCHY[requester.roleName] ?? [];
    if (!allowedRoles.includes(dto.role)) {
      throw new ForbiddenException(
        `Un utilisateur ${requester.roleName} ne peut pas créer de compte ${dto.role}.`,
      );
    }

    const existing = await this.usersRepository.findByEmail(dto.email.toLowerCase().trim());
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cette adresse email.');
    }

    const role = await this.usersRepository.findRoleByName(dto.role);
    if (!role) {
      throw new NotFoundException(`Le rôle ${dto.role} n'est pas configuré. Lancez le seed.`);
    }

    // SUPER_ADMIN peut créer dans n'importe quelle organisation ; les autres
    // créateurs restent cantonnés à la leur.
    const organizationId =
      requester.roleName === RoleName.SUPER_ADMIN && dto.organizationId
        ? dto.organizationId
        : requester.organizationId;

    const temporaryPassword = generateTempPassword();
    const hashedPassword = await hashPassword(temporaryPassword, this.appConfig.bcryptSaltRounds);

    const user = await this.usersRepository.create({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email.toLowerCase().trim(),
      phone: dto.phone,
      password: hashedPassword,
      mustChangePassword: true,
      organization: { connect: { id: organizationId } },
      role: { connect: { id: role.id } },
    });

    return { user: this.usersMapper.toItem(user), temporaryPassword };
  }

  async update(id: string, dto: UpdateUserDto, requester: AuthenticatedUser): Promise<UserItemDto> {
    const existing = await this.usersRepository.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    this.assertSameOrganization(existing.organizationId, requester);

    const updated = await this.usersRepository.update(id, {
      ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
      ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    });

    return this.usersMapper.toItem(updated);
  }

  async remove(id: string, requester: AuthenticatedUser): Promise<void> {
    const existing = await this.usersRepository.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    this.assertSameOrganization(existing.organizationId, requester);

    if (existing.id === requester.userId) {
      throw new BadRequestException('Vous ne pouvez pas supprimer votre propre compte.');
    }

    await this.usersRepository.softDelete(id);
    await this.usersRepository.removeTeamMembership(id);
  }

  async assignTeamLeader(agentId: string, dto: AssignTeamLeaderDto, requester: AuthenticatedUser): Promise<void> {
    const [agent, teamLeader] = await Promise.all([
      this.usersRepository.findById(agentId),
      this.usersRepository.findById(dto.teamLeaderId),
    ]);

    if (!agent || agent.role.name !== RoleName.AGENT) {
      throw new NotFoundException('Agent introuvable.');
    }
    if (!teamLeader || teamLeader.role.name !== RoleName.TEAM_LEADER) {
      throw new BadRequestException("La cible n'est pas un chef d'équipe valide.");
    }
    this.assertSameOrganization(agent.organizationId, requester);
    if (agent.organizationId !== teamLeader.organizationId) {
      throw new BadRequestException("L'agent et le chef d'équipe doivent appartenir à la même organisation.");
    }

    await this.usersRepository.upsertTeamMembership({
      agentId: agent.id,
      agentName: `${agent.firstName} ${agent.lastName}`,
      teamLeaderId: teamLeader.id,
      teamLeaderName: `${teamLeader.firstName} ${teamLeader.lastName}`,
      organizationId: agent.organizationId,
    });
  }

  async assignZones(agentId: string, dto: AssignZonesDto, requester: AuthenticatedUser): Promise<void> {
    const agent = await this.usersRepository.findById(agentId);
    if (!agent || agent.role.name !== RoleName.AGENT) {
      throw new NotFoundException('Agent introuvable.');
    }
    this.assertSameOrganization(agent.organizationId, requester);

    await this.usersRepository.replaceZoneAssignments(
      agent.id,
      `${agent.firstName} ${agent.lastName}`,
      dto.zoneIds,
    );
  }

  // --- Vue "mon équipe" (TEAM_LEADER) -------------------------------------

  async getMyTeamAgents(teamLeaderId: string): Promise<UserItemDto[]> {
    const memberships = await this.usersRepository.findTeamMembersOf(teamLeaderId);
    const agents = await Promise.all(memberships.map((m) => this.usersRepository.findById(m.agentId)));
    return agents.filter((a): a is NonNullable<typeof a> => !!a && !a.deletedAt).map((a) => this.usersMapper.toItem(a));
  }

  /**
   * Vue enrichie pour l'écran "Mon équipe" de l'app Flutter : ajoute la
   * charge de travail (interventions actives/en cours) et le temps moyen de
   * résolution de chaque agent. `isOnline` et `latitude`/`longitude` ne sont
   * pas suivis par ce backend (pas de géolocalisation temps réel en base) —
   * renvoyés en valeurs par défaut, à câbler plus tard si besoin.
   */
  async getMyTeamAgentsWithStats(teamLeaderId: string): Promise<
    Array<UserItemDto & { assignedCount: number; inProgressCount: number; averageResolutionMinutes: number; isOnline: boolean }>
  > {
    const memberships = await this.usersRepository.findTeamMembersOf(teamLeaderId);
    const agents = await Promise.all(memberships.map((m) => this.usersRepository.findById(m.agentId)));
    const validAgents = agents.filter((a): a is NonNullable<typeof a> => !!a && !a.deletedAt);

    return Promise.all(
      validAgents.map(async (agent) => {
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
      }),
    );
  }

  async getMyTeamAgentDetail(teamLeaderId: string, agentId: string): Promise<UserItemDto> {
    const membership = await this.usersRepository.findTeamMembership(agentId);
    if (!membership || membership.teamLeaderId !== teamLeaderId) {
      throw new NotFoundException("Cet agent ne fait pas partie de votre équipe.");
    }
    const agent = await this.usersRepository.findById(agentId);
    if (!agent || agent.deletedAt) {
      throw new NotFoundException('Agent introuvable.');
    }
    return this.usersMapper.toItem(agent);
  }

  async getMyTeamStats(teamLeaderId: string): Promise<{ totalAgents: number; activeAgents: number }> {
    const memberships = await this.usersRepository.findTeamMembersOf(teamLeaderId);
    const agents = await Promise.all(memberships.map((m) => this.usersRepository.findById(m.agentId)));
    const validAgents = agents.filter((a): a is NonNullable<typeof a> => !!a && !a.deletedAt);
    return {
      totalAgents: validAgents.length,
      activeAgents: validAgents.filter((a) => a.status === 'ACTIVE').length,
    };
  }

  // --------------------------------------------------------------------

  private assertSameOrganization(organizationId: string, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette organisation.");
    }
  }
}
