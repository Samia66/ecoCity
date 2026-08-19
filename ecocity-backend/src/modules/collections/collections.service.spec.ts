import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CollectionsService } from './collections.service';
import { CollectionsRepository, CollectionWithRelations } from './collections.repository';
import { CollectionsMapper } from './collections.mapper';
import { TeamsRepository } from '../teams/teams.repository';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

function buildCollection(overrides: Partial<CollectionWithRelations> = {}): CollectionWithRelations {
  return {
    id: 'col-1',
    teamId: 'team-1',
    zoneId: 'zone-1',
    scheduleId: 'sched-1',
    scheduledDate: new Date('2026-08-19T00:00:00.000Z'),
    dayOfWeek: 'MERCREDI',
    status: 'PLANIFIEE',
    startedAt: null,
    completedAt: null,
    comment: null,
    problemDescription: null,
    latitude: null,
    longitude: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    team: {
      id: 'team-1',
      name: 'Équipe Zongo',
      organizationId: 'org-1',
      members: [
        { id: 'm-1', teamId: 'team-1', agentId: 'leader-1', agentName: 'Marcel Sossou', agentEmail: 'm@example.com', role: 'LEADER', createdAt: new Date() },
        { id: 'm-2', teamId: 'team-1', agentId: 'agent-1', agentName: 'Roland Dansou', agentEmail: 'r@example.com', role: 'AGENT', createdAt: new Date() },
      ],
    } as any,
    zone: { id: 'zone-1', name: 'Zongo Nord' } as any,
    attachments: [],
    history: [],
    ...overrides,
  } as CollectionWithRelations;
}

function buildRequester(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    userId: 'agent-1',
    email: 'agent@example.com',
    organizationId: 'org-1',
    roleId: 'role-agent',
    roleName: RoleName.AGENT,
    permissions: [],
    ...overrides,
  };
}

describe('CollectionsService', () => {
  let service: CollectionsService;
  let repository: jest.Mocked<CollectionsRepository>;
  let teamsRepository: jest.Mocked<TeamsRepository>;

  beforeEach(() => {
    repository = {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findById: jest.fn(),
      update: jest.fn(),
      addHistory: jest.fn(),
      addAttachment: jest.fn(),
      findActiveSchedules: jest.fn().mockResolvedValue([]),
      ensureCollectionForSchedule: jest.fn(),
    } as unknown as jest.Mocked<CollectionsRepository>;

    teamsRepository = {
      findByMemberAgentId: jest.fn(),
    } as unknown as jest.Mocked<TeamsRepository>;

    const configService = { get: jest.fn().mockReturnValue({ publicUrl: 'http://localhost:3000' }) } as unknown as ConfigService;

    service = new CollectionsService(repository, new CollectionsMapper(), teamsRepository, configService);
  });

  describe('access control', () => {
    it('allows SUPER_ADMIN to view any collection', async () => {
      repository.findById.mockResolvedValue(buildCollection({ team: { ...buildCollection().team, organizationId: 'other-org' } as any }));
      const requester = buildRequester({ roleName: RoleName.SUPER_ADMIN, organizationId: 'org-1' });
      await expect(service.findById('col-1', requester)).resolves.toBeDefined();
    });

    it('forbids an ADMIN from another organization', async () => {
      repository.findById.mockResolvedValue(buildCollection({ team: { ...buildCollection().team, organizationId: 'other-org' } as any }));
      await expect(service.findById('col-1', buildRequester({ roleName: RoleName.ADMIN }))).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('allows an AGENT who is a member of the owning team', async () => {
      repository.findById.mockResolvedValue(buildCollection());
      await expect(service.findById('col-1', buildRequester())).resolves.toBeDefined();
    });

    it('forbids an AGENT who is not a member of the owning team', async () => {
      repository.findById.mockResolvedValue(buildCollection());
      const requester = buildRequester({ userId: 'someone-else' });
      await expect(service.findById('col-1', requester)).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when the collection does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findById('missing', buildRequester())).rejects.toThrow(NotFoundException);
    });
  });

  describe('transitions', () => {
    it('starts a PLANIFIEE collection for a team member', async () => {
      repository.findById.mockResolvedValue(buildCollection({ status: 'PLANIFIEE' }));
      await service.start('col-1', buildRequester());
      expect(repository.update).toHaveBeenCalledWith(
        'col-1',
        expect.objectContaining({ status: 'EN_COURS', startedAt: expect.any(Date) }),
      );
    });

    it('rejects starting a collection that is already TERMINEE (AGENT)', async () => {
      repository.findById.mockResolvedValue(buildCollection({ status: 'TERMINEE' }));
      await expect(service.start('col-1', buildRequester())).rejects.toThrow(BadRequestException);
    });

    it('lets ADMIN force a transition outside the normal AGENT rules', async () => {
      repository.findById.mockResolvedValue(buildCollection({ status: 'TERMINEE', team: { ...buildCollection().team, organizationId: 'org-1' } as any }));
      const requester = buildRequester({ roleName: RoleName.ADMIN });
      await expect(service.start('col-1', requester)).resolves.toBeDefined();
    });

    it('completes an EN_COURS collection and records the comment', async () => {
      repository.findById.mockResolvedValue(buildCollection({ status: 'EN_COURS' }));
      await service.complete('col-1', { comment: 'Tout va bien' } as any, buildRequester());
      expect(repository.update).toHaveBeenCalledWith(
        'col-1',
        expect.objectContaining({ status: 'TERMINEE', comment: 'Tout va bien', completedAt: expect.any(Date) }),
      );
    });
  });

  describe('reportProblem', () => {
    it('marks a PLANIFIEE collection as NON_EFFECTUEE and records the problem', async () => {
      repository.findById.mockResolvedValue(buildCollection({ status: 'PLANIFIEE' }));
      await service.reportProblem('col-1', { problemDescription: 'Camion en panne' } as any, buildRequester());

      expect(repository.update).toHaveBeenCalledWith(
        'col-1',
        expect.objectContaining({ status: 'NON_EFFECTUEE', problemDescription: 'Camion en panne' }),
      );
    });

    it('does not un-terminate an already TERMINEE collection', async () => {
      repository.findById.mockResolvedValue(buildCollection({ status: 'TERMINEE' }));
      await service.reportProblem('col-1', { problemDescription: 'Oubli mineur' } as any, buildRequester());

      expect(repository.update).toHaveBeenCalledWith(
        'col-1',
        expect.objectContaining({ status: 'TERMINEE' }),
      );
    });
  });

  describe('findToday', () => {
    it('scopes results to the caller’s own team for AGENT/TEAM_LEADER', async () => {
      teamsRepository.findByMemberAgentId.mockResolvedValue({ id: 'team-1' } as any);
      await service.findToday(buildRequester());

      expect(repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ teamId: 'team-1' }) }),
      );
    });

    it('returns an empty list when the agent belongs to no team', async () => {
      teamsRepository.findByMemberAgentId.mockResolvedValue(null);
      const result = await service.findToday(buildRequester());
      expect(result).toEqual([]);
    });

    it('does not restrict by team for ADMIN (organization-wide)', async () => {
      await service.findToday(buildRequester({ roleName: RoleName.ADMIN }));
      const call = repository.findMany.mock.calls[0][0];
      expect(call.where).not.toHaveProperty('teamId');
      expect(teamsRepository.findByMemberAgentId).not.toHaveBeenCalled();
    });
  });
});
