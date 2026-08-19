import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReportsService } from './reports.service';
import { ReportsRepository, ReportDetail } from './reports.repository';
import { ReportsMapper } from './reports.mapper';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

function buildReport(overrides: Partial<ReportDetail> = {}): ReportDetail {
  return {
    id: 'report-1',
    title: 'Lampadaire cassé',
    description: 'Le lampadaire ne fonctionne plus',
    categoryId: 'cat-1',
    priority: 'MOYENNE',
    status: 'NOUVEAU',
    address: '12 rue de la Paix',
    latitude: null,
    longitude: null,
    organizationId: 'org-1',
    authorId: 'citizen-1',
    assignedToId: null,
    zoneId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    category: {} as any,
    author: {} as any,
    assignedTo: null,
    zone: null,
    attachments: [],
    comments: [],
    history: [],
    intervention: null,
    ...overrides,
  } as ReportDetail;
}

function buildRequester(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    userId: 'citizen-1',
    email: 'citizen@example.com',
    organizationId: 'org-1',
    roleId: 'role-citizen',
    roleName: RoleName.CITIZEN,
    permissions: [],
    ...overrides,
  };
}

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: jest.Mocked<ReportsRepository>;
  let prisma: { category: { findFirst: jest.Mock } };

  beforeEach(() => {
    repository = {
      findMany: jest.fn(),
      findManyFlat: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      addAttachment: jest.fn(),
      addComment: jest.fn(),
      addStatusHistory: jest.fn(),
    } as unknown as jest.Mocked<ReportsRepository>;

    prisma = { category: { findFirst: jest.fn().mockResolvedValue({ id: 'cat-1' }) } };

    const mapper = {
      toDetailDto: jest.fn((r) => r),
      toListDtoList: jest.fn((r) => r),
    } as unknown as ReportsMapper;
    const configService = { get: jest.fn().mockReturnValue({ publicUrl: 'http://localhost:3000' }) } as unknown as ConfigService;

    service = new ReportsService(repository, mapper, configService, prisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('attaches the uploaded photo to the newly created report', async () => {
      const created = buildReport();
      repository.create.mockResolvedValue(created);
      const withPhoto = buildReport({ attachments: [{ id: 'att-1' } as any] });
      repository.findById.mockResolvedValue(withPhoto);

      const photo = { filename: 'photo.jpg', originalname: 'photo.jpg', mimetype: 'image/jpeg', size: 2048 } as Express.Multer.File;
      const result = await service.create({ category: 'Voirie' } as any, buildRequester(), photo);

      expect(repository.addAttachment).toHaveBeenCalledWith(
        expect.objectContaining({ report: { connect: { id: 'report-1' } }, filename: 'photo.jpg' }),
      );
      expect(result).toBe(withPhoto);
    });

    it('does not touch attachments when no photo is provided', async () => {
      const created = buildReport();
      repository.create.mockResolvedValue(created);

      await service.create({ category: 'Voirie' } as any, buildRequester());

      expect(repository.addAttachment).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when the category name does not resolve', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      await expect(service.create({ category: 'Inconnu' } as any, buildRequester())).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('returns the freshly persisted report, not the pre-update snapshot', async () => {
      repository.findById.mockResolvedValue(buildReport({ title: 'Ancien titre' }));
      const updated = buildReport({ title: 'Nouveau titre' });
      repository.update.mockResolvedValue(updated);

      const requester = buildRequester({ roleName: RoleName.ADMIN });
      const result = await service.update('report-1', { title: 'Nouveau titre' } as any, requester);

      expect(result).toBe(updated);
    });

    it('forbids a citizen from updating someone else’s report', async () => {
      repository.findById.mockResolvedValue(buildReport({ authorId: 'other-citizen' }));
      await expect(
        service.update('report-1', { title: 'x' } as any, buildRequester()),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when the report is missing or soft-deleted', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.update('missing', {} as any, buildRequester())).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('rejects any transition once the report is archived', async () => {
      repository.findById.mockResolvedValue(buildReport({ status: 'ARCHIVE', organizationId: 'org-1' }));
      const requester = buildRequester({ roleName: RoleName.ADMIN });
      await expect(
        service.updateStatus('report-1', { status: 'VALIDE' } as any, requester),
      ).rejects.toThrow(ForbiddenException);
    });

    it('forbids a CITIZEN from changing the status (staff-only action)', async () => {
      repository.findById.mockResolvedValue(buildReport());
      await expect(
        service.updateStatus('report-1', { status: 'VALIDE' } as any, buildRequester()),
      ).rejects.toThrow(ForbiddenException);
    });

    it('persists the new status and refetches the detail DTO', async () => {
      repository.findById
        .mockResolvedValueOnce(buildReport({ status: 'NOUVEAU', organizationId: 'org-1' }))
        .mockResolvedValueOnce(buildReport({ status: 'VALIDE', organizationId: 'org-1' }));
      const requester = buildRequester({ roleName: RoleName.ADMIN });

      await service.updateStatus('report-1', { status: 'VALIDE' } as any, requester);

      expect(repository.update).toHaveBeenCalledWith('report-1', { status: 'VALIDE' });
      expect(repository.addStatusHistory).toHaveBeenCalled();
    });
  });
});
