import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TeamsService, TEAM_MAX_MEMBERS } from './teams.service';
import { TeamsRepository, TeamWithRelations } from './teams.repository';
import { TeamsMapper } from './teams.mapper';
import { UsersRepository, UserWithRelations } from '../users/users.repository';
import { UsersMapper } from '../users/users.mapper';
import { InterventionsRepository } from '../interventions/interventions.repository';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

function buildUser(overrides: Partial<UserWithRelations> = {}): UserWithRelations {
  return {
    id: 'user-1',
    organizationId: 'org-1',
    roleId: 'role-1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@example.com',
    phone: null,
    password: 'hash',
    mustChangePassword: false,
    avatarUrl: null,
    status: 'ACTIVE',
    isEmailVerified: true,
    emailVerifiedAt: null,
    lastLoginAt: null,
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    role: { id: 'role-1', name: RoleName.TEAM_LEADER, description: null, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
    organization: { id: 'org-1', name: 'Cotonou', city: 'Cotonou', address: null, phone: null, email: null, logoUrl: null, active: true, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
    ...overrides,
  } as UserWithRelations;
}

function buildTeam(overrides: Partial<TeamWithRelations> = {}): TeamWithRelations {
  return {
    id: 'team-1',
    name: 'Équipe Zongo',
    description: null,
    status: 'ACTIVE',
    organizationId: 'org-1',
    createdById: 'admin-1',
    createdByName: 'admin@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    members: [
      { id: 'm-1', teamId: 'team-1', agentId: 'leader-1', agentName: 'Marcel Sossou', agentEmail: 'marcel@example.com', role: 'LEADER', createdAt: new Date() },
      { id: 'm-2', teamId: 'team-1', agentId: 'agent-1', agentName: 'Roland Dansou', agentEmail: 'roland@example.com', role: 'AGENT', createdAt: new Date() },
    ],
    teamZones: [],
    ...overrides,
  } as TeamWithRelations;
}

function buildRequester(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    userId: 'admin-1',
    email: 'admin@example.com',
    organizationId: 'org-1',
    roleId: 'role-admin',
    roleName: RoleName.ADMIN,
    permissions: [],
    ...overrides,
  };
}

describe('TeamsService', () => {
  let service: TeamsService;
  let repository: jest.Mocked<TeamsRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    repository = {
      findMany: jest.fn(),
      findByMemberAgentId: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      addMember: jest.fn(),
      removeMember: jest.fn(),
      findExistingMembershipForAgent: jest.fn().mockResolvedValue(null),
      addZone: jest.fn(),
      removeZone: jest.fn(),
      findZoneAssignment: jest.fn(),
      findActiveScheduleDays: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<TeamsRepository>;

    usersRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    const usersMapper = new UsersMapper();
    const interventionsRepository = {} as InterventionsRepository;

    service = new TeamsService(repository, new TeamsMapper(), usersRepository, usersMapper, interventionsRepository);
  });

  describe('create', () => {
    it('rejects when the leader and an agent are the same person', async () => {
      await expect(
        service.create({ name: 'X', leaderId: 'u-1', agentIds: ['u-1', 'u-2'] } as any, buildRequester()),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when the leader is not a TEAM_LEADER', async () => {
      usersRepository.findById.mockResolvedValue(buildUser({ id: 'u-1', role: { ...buildUser().role, name: RoleName.AGENT } }));
      await expect(
        service.create({ name: 'X', leaderId: 'u-1', agentIds: ['u-2', 'u-3'] } as any, buildRequester()),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a leader already leading another active team', async () => {
      usersRepository.findById.mockResolvedValue(buildUser({ id: 'u-1' }));
      repository.findExistingMembershipForAgent.mockResolvedValueOnce({
        team: { name: 'Équipe Alpha' },
      } as any);

      await expect(
        service.create({ name: 'X', leaderId: 'u-1', agentIds: ['u-2'] } as any, buildRequester()),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects when an agent already belongs to another active team', async () => {
      usersRepository.findById.mockImplementation((id: string) =>
        Promise.resolve(
          id === 'leader-1'
            ? buildUser({ id: 'leader-1', role: { ...buildUser().role, name: RoleName.TEAM_LEADER } })
            : buildUser({ id, role: { ...buildUser().role, name: RoleName.AGENT } }),
        ),
      );
      repository.findExistingMembershipForAgent.mockImplementation(((agentId: string) =>
        Promise.resolve(agentId === 'agent-1' ? { team: { name: 'Équipe Beta' } } : null)) as any);

      await expect(
        service.create({ name: 'X', leaderId: 'leader-1', agentIds: ['agent-1'] } as any, buildRequester()),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates the team with leader + agents + zones on success', async () => {
      usersRepository.findById.mockImplementation((id: string) =>
        Promise.resolve(
          id === 'leader-1'
            ? buildUser({ id: 'leader-1', firstName: 'Marcel', role: { ...buildUser().role, name: RoleName.TEAM_LEADER } })
            : buildUser({ id, firstName: 'Roland', role: { ...buildUser().role, name: RoleName.AGENT } }),
        ),
      );
      const created = buildTeam();
      repository.create.mockResolvedValue(created);

      const result = await service.create(
        { name: 'Équipe Zongo', leaderId: 'leader-1', agentIds: ['agent-1'], zoneIds: ['zone-1'] } as any,
        buildRequester(),
      );

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Équipe Zongo',
          members: {
            create: [
              expect.objectContaining({ agentId: 'leader-1', role: 'LEADER' }),
              expect.objectContaining({ agentId: 'agent-1', role: 'AGENT' }),
            ],
          },
          teamZones: { create: [{ zone: { connect: { id: 'zone-1' } } }] },
        }),
      );
      // Le mapper dérive le chef à partir du membre `role: LEADER` renvoyé par le repository.
      expect(result.leaderName).toBe('Marcel Sossou');
    });
  });

  describe('access control (findById)', () => {
    it('allows SUPER_ADMIN to view any team', async () => {
      repository.findById.mockResolvedValue(buildTeam({ organizationId: 'other-org' }));
      const requester = buildRequester({ roleName: RoleName.SUPER_ADMIN, organizationId: 'org-1' });
      await expect(service.findById('team-1', requester)).resolves.toBeDefined();
    });

    it('forbids ADMIN from another organization', async () => {
      repository.findById.mockResolvedValue(buildTeam({ organizationId: 'other-org' }));
      await expect(service.findById('team-1', buildRequester())).rejects.toThrow(ForbiddenException);
    });

    it('allows a TEAM_LEADER who leads this exact team', async () => {
      repository.findById.mockResolvedValue(buildTeam());
      const requester = buildRequester({ roleName: RoleName.TEAM_LEADER, userId: 'leader-1' });
      await expect(service.findById('team-1', requester)).resolves.toBeDefined();
    });

    it('forbids a TEAM_LEADER who is not a member of this team', async () => {
      repository.findById.mockResolvedValue(buildTeam());
      const requester = buildRequester({ roleName: RoleName.TEAM_LEADER, userId: 'someone-else' });
      await expect(service.findById('team-1', requester)).rejects.toThrow(ForbiddenException);
    });

    it('allows an AGENT who is a member of this team', async () => {
      repository.findById.mockResolvedValue(buildTeam());
      const requester = buildRequester({ roleName: RoleName.AGENT, userId: 'agent-1' });
      await expect(service.findById('team-1', requester)).resolves.toBeDefined();
    });

    it('throws NotFoundException for a soft-deleted team', async () => {
      repository.findById.mockResolvedValue(buildTeam({ deletedAt: new Date() }));
      await expect(service.findById('team-1', buildRequester())).rejects.toThrow(NotFoundException);
    });
  });

  describe('management (mutations restricted to ADMIN/SUPER_ADMIN)', () => {
    it('forbids a TEAM_LEADER from updating their own team', async () => {
      repository.findById.mockResolvedValue(buildTeam());
      const requester = buildRequester({ roleName: RoleName.TEAM_LEADER, userId: 'leader-1' });
      await expect(service.update('team-1', { name: 'x' } as any, requester)).rejects.toThrow(ForbiddenException);
    });

    it('forbids removing the LEADER via removeMember (must reassign leader instead)', async () => {
      repository.findById.mockResolvedValue(buildTeam());
      await expect(service.removeMember('team-1', 'leader-1', buildRequester())).rejects.toThrow(BadRequestException);
    });

    it('rejects addMember once the team already has TEAM_MAX_MEMBERS members', async () => {
      const fullTeam = buildTeam({
        members: Array.from({ length: TEAM_MAX_MEMBERS }, (_, i) => ({
          id: `m-${i}`,
          teamId: 'team-1',
          agentId: `agent-${i}`,
          agentName: `Agent ${i}`,
          agentEmail: `agent${i}@example.com`,
          role: i === 0 ? 'LEADER' : 'AGENT',
          createdAt: new Date(),
        })) as any,
      });
      repository.findById.mockResolvedValue(fullTeam);
      await expect(service.addMember('team-1', 'new-agent', buildRequester())).rejects.toThrow(BadRequestException);
    });
  });

  describe('addZone', () => {
    it('rejects a zone already assigned to the team', async () => {
      repository.findById.mockResolvedValue(buildTeam());
      repository.findZoneAssignment.mockResolvedValue({ id: 'tz-1' } as any);
      await expect(service.addZone('team-1', 'zone-1', buildRequester())).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll (role scoping)', () => {
    it('returns only the caller’s own team for AGENT/TEAM_LEADER', async () => {
      repository.findByMemberAgentId.mockResolvedValue(buildTeam());
      const requester = buildRequester({ roleName: RoleName.AGENT, userId: 'agent-1' });
      const result = await service.findAll(requester);
      expect(result).toHaveLength(1);
      expect(repository.findMany).not.toHaveBeenCalled();
    });

    it('returns every team in the organization for ADMIN', async () => {
      repository.findMany.mockResolvedValue([buildTeam()]);
      const result = await service.findAll(buildRequester());
      expect(result).toHaveLength(1);
      expect(repository.findByMemberAgentId).not.toHaveBeenCalled();
    });
  });
});
