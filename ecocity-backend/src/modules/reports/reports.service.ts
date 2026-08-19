import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, ReportStatus } from '@prisma/client';
import { AppConfig } from '../../config/configuration';
import { paginate, toSkipTake, PaginatedResult } from '../../common/utils/pagination.util';
import { toPublicFileUrl } from '../../common/utils/file-storage.util';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ReportsRepository } from './reports.repository';
import { ReportsMapper, ReportDto } from './reports.mapper';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { QueryReportDto } from './dto/query-report.dto';
import { PrismaService } from '@prisma/prisma.service';

const STATUS_LABELS: Record<string, string> = {
  NOUVEAU: 'Nouveau',
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validé',
  ASSIGNE: 'Assigné',
  EN_COURS: 'En cours',
  RESOLU: 'Résolu',
  REJETE: 'Rejeté',
  ARCHIVE: 'Archivé',
};

@Injectable()
export class ReportsService {
  private readonly appConfig: AppConfig;

  constructor(
    private readonly repository: ReportsRepository,
    private readonly mapper: ReportsMapper,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.appConfig = this.configService.get<AppConfig>('app')!;
  }

  async findAll(query: QueryReportDto, requester: AuthenticatedUser): Promise<PaginatedResult<ReportDto>> {
    const { skip, take } = toSkipTake(query.page, query.limit);
    const where = this.buildScopedWhere(requester, query);

    const [reports, total] = await Promise.all([
      this.repository.findMany({ where, skip, take }),
      this.repository.count(where),
    ]);

    return paginate(this.mapper.toListDtoList(reports), total, query.page, query.limit);
  }

  /** Liste plate des signalements du citoyen connecté (Flutter `/reports/me`). */
  async findMine(requester: AuthenticatedUser): Promise<ReportDto[]> {
    const reports = await this.repository.findManyFlat({ authorId: requester.userId, deletedAt: null });
    return this.mapper.toListDtoList(reports);
  }

  async findById(id: string, requester: AuthenticatedUser): Promise<ReportDto> {
    const report = await this.repository.findById(id);
    if (!report || report.deletedAt) {
      throw new NotFoundException('Signalement introuvable.');
    }
    this.assertCanView(report, requester);
    return this.mapper.toDetailDto(report);
  }

  async create(
    dto: CreateReportDto,
    requester: AuthenticatedUser,
    photo?: Express.Multer.File,
  ): Promise<ReportDto> {

    // Recherche de la catégorie par son nom
    const category = await this.prisma.category.findFirst({
      where: {
        name: dto.category,
        organizationId: requester.organizationId,
      },
    });

    if (!category) {
      throw new BadRequestException('Catégorie introuvable');
    }

    const report = await this.repository.create({
      title: dto.title,
      description: dto.description,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      priority: dto.priority ?? 'MOYENNE',
      status: 'NOUVEAU',

      category: {
        connect: { id: category.id },
      },

      organization: {
        connect: { id: requester.organizationId },
      },

      author: {
        connect: { id: requester.userId },
      },
    });

    return this.mapper.toDetailDto(report);
  }

  async update(
    id: string,
    dto: UpdateReportDto,
    requester: AuthenticatedUser,
  ): Promise<ReportDto> {

    const report = await this.repository.findById(id);

    if (!report || report.deletedAt) {
      throw new NotFoundException('Signalement introuvable.');
    }

    this.assertCanManage(report, requester);

    // Construction des données à mettre à jour
    const data: Prisma.ReportUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.address !== undefined ? { address: dto.address } : {}),
      ...(dto.latitude !== undefined ? { latitude: dto.latitude } : {}),
      ...(dto.longitude !== undefined ? { longitude: dto.longitude } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
    };

    // Gestion de la catégorie par son nom
    if (dto.category !== undefined) {
      const category = await this.prisma.category.findFirst({
        where: {
          name: dto.category,
          organizationId: requester.organizationId,
        },
      });

      if (!category) {
        throw new BadRequestException('Catégorie introuvable');
      }

      data.category = {
        connect: { id: category.id },
      };
    }

    const updated = await this.repository.update(id, data);

    return this.mapper.toDetailDto(report);
  }

  async updateStatus(id: string, dto: UpdateReportStatusDto, requester: AuthenticatedUser): Promise<ReportDto> {
    const report = await this.repository.findById(id);
    if (!report || report.deletedAt) throw new NotFoundException('Signalement introuvable.');
    this.assertCanManage(report, requester);
    this.assertValidTransition(report.status, dto.status);

    const updated = await this.repository.update(id, { status: dto.status });
    await this.repository.addStatusHistory({
      report: { connect: { id } },
      status: dto.status,
      comment: dto.comment,
      changedById: requester.userId,
      changedByName: requester.email,
    });

    const refreshed = await this.repository.findById(id);
    return this.mapper.toDetailDto(refreshed!);
  }

  async addComment(id: string, dto: AddCommentDto, requester: AuthenticatedUser): Promise<ReportDto> {
    const report = await this.repository.findById(id);
    if (!report || report.deletedAt) throw new NotFoundException('Signalement introuvable.');
    this.assertCanView(report, requester);

    await this.repository.addComment({
      report: { connect: { id } },
      author: { connect: { id: requester.userId } },
      message: dto.message,
    });

    const refreshed = await this.repository.findById(id);
    return this.mapper.toDetailDto(refreshed!);
  }

  async uploadAttachment(id: string, requester: AuthenticatedUser, file: Express.Multer.File): Promise<ReportDto> {
    const report = await this.repository.findById(id);
    if (!report || report.deletedAt) throw new NotFoundException('Signalement introuvable.');
    this.assertCanView(report, requester);

    await this.repository.addAttachment({
      report: { connect: { id } },
      url: toPublicFileUrl(this.appConfig.publicUrl, 'reports', file.filename),
      filename: file.originalname,
      mimeType: file.mimetype,
      sizeKb: Math.round(file.size / 1024),
    });

    const refreshed = await this.repository.findById(id);
    return this.mapper.toDetailDto(refreshed!);
  }

  async remove(id: string, requester: AuthenticatedUser): Promise<void> {
    const report = await this.repository.findById(id);
    if (!report || report.deletedAt) throw new NotFoundException('Signalement introuvable.');
    this.assertCanManage(report, requester);
    await this.repository.softDelete(id);
  }

  // --------------------------------------------------------------------

  private buildScopedWhere(
    requester: AuthenticatedUser,
    query: QueryReportDto,
  ): Prisma.ReportWhereInput {

    const base: Prisma.ReportWhereInput = {
      deletedAt: null,

      ...(query.status
        ? { status: query.status }
        : {}),

      ...(query.priority
        ? { priority: query.priority }
        : {}),

      // ✅ Filtre par ID
      ...(query.categoryId
        ? {
          category: {
            id: query.categoryId,
          },
        }
        : {}),

      ...(query.assignedToId
        ? { assignedToId: query.assignedToId }
        : {}),

      ...(query.zoneId
        ? { zoneId: query.zoneId }
        : {}),

      ...(query.search
        ? {
          OR: [
            {
              title: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              address: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          ],
        }
        : {}),
    };

    switch (requester.roleName) {
      case RoleName.SUPER_ADMIN:
        return base;

      case RoleName.CITIZEN:
        return {
          ...base,
          authorId: requester.userId,
        };

      case RoleName.AGENT:
        return {
          ...base,
          organizationId: requester.organizationId,
          assignedToId: requester.userId,
        };

      default:
        return {
          ...base,
          organizationId: requester.organizationId,
        };
    }
  }

  private assertCanView(report: { authorId: string; assignedToId: string | null; organizationId: string }, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (requester.roleName === RoleName.CITIZEN && report.authorId !== requester.userId) {
      throw new ForbiddenException("Vous n'avez pas accès à ce signalement.");
    }
    if (report.organizationId !== requester.organizationId && requester.roleName !== RoleName.CITIZEN) {
      throw new ForbiddenException("Vous n'avez pas accès à ce signalement.");
    }
  }

  private assertCanManage(report: { organizationId: string; authorId: string }, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (requester.roleName === RoleName.CITIZEN) {
      throw new ForbiddenException('Action réservée au personnel municipal.');
    }
    if (report.organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à ce signalement.");
    }
  }

  private assertValidTransition(current: ReportStatus, next: ReportStatus): void {
    if (current === 'ARCHIVE') {
      throw new ForbiddenException('Un signalement archivé ne peut plus changer de statut.');
    }
    if (current === next) return;
    // Transitions permissives : le back-office peut avancer/reculer le
    // statut librement (cas d'usage réel : correction d'une erreur de
    // qualification). On bloque seulement la sortie d'un état terminal.
    void STATUS_LABELS; // conservé pour un futur mapping de libellés si besoin
  }
}
