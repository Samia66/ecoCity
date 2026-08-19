import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InterventionsService } from './interventions.service';
import { InterventionsRepository, InterventionDetail } from './interventions.repository';
import { ReportsRepository } from '../reports/reports.repository';
import { InterventionsMapper } from './interventions.mapper';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

function buildIntervention(overrides: Partial<InterventionDetail> = {}): InterventionDetail {
  return {
    id: 'itv-1',
    reportId: 'report-1',
    agentId: 'agent-1',
    status: 'ASSIGNEE',
    assignedById: 'admin-1',
    assignedByName: 'admin@example.com',
    startedAt: null,
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    report: { organizationId: 'org-1' } as any,
    agent: {} as any,
    attachments: [],
    comments: [],
    history: [],
    ...overrides,
  } as InterventionDetail;
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

describe('InterventionsService', () => {
  let service: InterventionsService;
  let repository: jest.Mocked<InterventionsRepository>;
  let reportsRepository: jest.Mocked<ReportsRepository>;

  beforeEach(() => {
    repository = {
      findMany: jest.fn(),
      findById: jest.fn(),
      findByReportId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      addHistory: jest.fn(),
      addComment: jest.fn(),
      addAttachment: jest.fn(),
    } as unknown as jest.Mocked<InterventionsRepository>;

    reportsRepository = {
      findById: jest.fn(),
      findManyFlat: jest.fn(),
      update: jest.fn(),
      addStatusHistory: jest.fn(),
    } as unknown as jest.Mocked<ReportsRepository>;

    const mapper = { toDto: jest.fn((d) => d), toDtoList: jest.fn((d) => d) } as unknown as InterventionsMapper;
    const configService = { get: jest.fn().mockReturnValue({ publicUrl: 'http://localhost:3000' }) } as unknown as ConfigService;

    service = new InterventionsService(repository, reportsRepository, mapper, configService);
  });

  describe('findById (access control)', () => {
    it('allows an agent to view their own intervention', async () => {
      const intervention = buildIntervention();
      repository.findById.mockResolvedValue(intervention);
      await expect(service.findById('itv-1', buildRequester())).resolves.toBeDefined();
    });

    it('forbids an agent from viewing another agent intervention', async () => {
      repository.findById.mockResolvedValue(buildIntervention({ agentId: 'someone-else' }));
      await expect(service.findById('itv-1', buildRequester())).rejects.toThrow(ForbiddenException);
    });

    it('forbids staff from another organization', async () => {
      repository.findById.mockResolvedValue(buildIntervention({ report: { organizationId: 'org-2' } as any }));
      const requester = buildRequester({ roleName: RoleName.ADMIN, organizationId: 'org-1' });
      await expect(service.findById('itv-1', requester)).rejects.toThrow(ForbiddenException);
    });

    it('lets SUPER_ADMIN view any intervention', async () => {
      repository.findById.mockResolvedValue(buildIntervention({ report: { organizationId: 'org-2' } as any }));
      const requester = buildRequester({ roleName: RoleName.SUPER_ADMIN, organizationId: 'org-1' });
      await expect(service.findById('itv-1', requester)).resolves.toBeDefined();
    });

    it('throws NotFoundException when the intervention does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findById('missing', buildRequester())).rejects.toThrow(NotFoundException);
    });
  });

  describe('assign', () => {
    it('rejects an AGENT trying to assign an intervention', async () => {
      await expect(
        service.assign('report-1', { agentId: 'agent-2' } as any, buildRequester({ roleName: RoleName.AGENT })),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when the target report does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      reportsRepository.findById.mockResolvedValue(null);
      const requester = buildRequester({ roleName: RoleName.ADMIN });
      await expect(service.assign('report-1', { agentId: 'agent-2' } as any, requester)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('creates a new intervention when the report has none yet', async () => {
      repository.findById.mockResolvedValue(null);
      reportsRepository.findById.mockResolvedValue({ id: 'report-1', organizationId: 'org-1', deletedAt: null } as any);
      repository.findByReportId.mockResolvedValue(null);
      const created = buildIntervention();
      repository.create.mockResolvedValue(created);
      repository.findById.mockResolvedValueOnce(null).mockResolvedValue(created);

      const requester = buildRequester({ roleName: RoleName.TEAM_LEADER, userId: 'tl-1', email: 'tl@example.com' });
      await service.assign('report-1', { agentId: 'agent-1' } as any, requester);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          report: { connect: { id: 'report-1' } },
          agent: { connect: { id: 'agent-1' } },
          status: 'ASSIGNEE',
          assignedById: 'tl-1',
        }),
      );
      expect(reportsRepository.update).toHaveBeenCalledWith(
        'report-1',
        expect.objectContaining({ status: 'ASSIGNE' }),
      );
    });
  });

  describe('updateStatus', () => {
    it('rejects an invalid transition attempted by an AGENT', async () => {
      repository.findById.mockResolvedValue(buildIntervention({ status: 'TERMINEE' }));
      await expect(
        service.updateStatus('itv-1', { status: 'EN_COURS' } as any, buildRequester()),
      ).rejects.toThrow(BadRequestException);
    });

    it('accepts a valid transition for the assigned AGENT', async () => {
      const intervention = buildIntervention({ status: 'ASSIGNEE' });
      repository.findById.mockResolvedValueOnce(intervention).mockResolvedValueOnce(intervention);
      await service.updateStatus('itv-1', { status: 'ACCEPTEE' } as any, buildRequester());
      expect(repository.update).toHaveBeenCalledWith('itv-1', expect.objectContaining({ status: 'ACCEPTEE' }));
    });

    it('is not restricted by ALLOWED_TRANSITIONS for non-AGENT roles', async () => {
      const intervention = buildIntervention({ status: 'TERMINEE', agentId: 'agent-1' });
      repository.findById.mockResolvedValueOnce(intervention).mockResolvedValueOnce(intervention);
      const requester = buildRequester({ roleName: RoleName.ADMIN, userId: 'admin-1' });
      await expect(
        service.updateStatus('itv-1', { status: 'ACCEPTEE' } as any, requester),
      ).resolves.toBeDefined();
    });

    it('stamps completedAt and resolves the linked report when moving to TERMINEE', async () => {
      const intervention = buildIntervention({ status: 'EN_COURS' });
      repository.findById.mockResolvedValueOnce(intervention).mockResolvedValueOnce(intervention);
      await service.updateStatus('itv-1', { status: 'TERMINEE' } as any, buildRequester());

      expect(repository.update).toHaveBeenCalledWith(
        'itv-1',
        expect.objectContaining({ status: 'TERMINEE', completedAt: expect.any(Date) }),
      );
      expect(reportsRepository.update).toHaveBeenCalledWith('report-1', expect.objectContaining({ status: 'RESOLU' }));
    });

    it('reopens the report to VALIDE and unassigns it when the agent rejects', async () => {
      const intervention = buildIntervention({ status: 'ACCEPTEE' });
      repository.findById.mockResolvedValueOnce(intervention).mockResolvedValueOnce(intervention);
      await service.updateStatus('itv-1', { status: 'REJETEE' } as any, buildRequester());

      expect(reportsRepository.update).toHaveBeenCalledWith(
        'report-1',
        expect.objectContaining({ status: 'VALIDE', assignedTo: { disconnect: true } }),
      );
    });

    it('forbids an agent from updating an intervention assigned to someone else', async () => {
      repository.findById.mockResolvedValue(buildIntervention({ agentId: 'other-agent' }));
      await expect(
        service.updateStatus('itv-1', { status: 'ACCEPTEE' } as any, buildRequester()),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addComment', () => {
    it('forbids commenting on an intervention that is not the agent’s own', async () => {
      repository.findById.mockResolvedValue(buildIntervention({ agentId: 'other-agent' }));
      await expect(
        service.addComment('itv-1', { message: 'hello' } as any, buildRequester()),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
