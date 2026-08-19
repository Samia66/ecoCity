import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { AppConfig } from '../../config/configuration';
import { toPublicFileUrl } from '../../common/utils/file-storage.util';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ReportsRepository } from '../reports/reports.repository';
import { InterventionsRepository, InterventionDetail } from './interventions.repository';
import { InterventionsMapper, InterventionDto } from './interventions.mapper';
import { AssignInterventionDto } from './dto/assign-intervention.dto';
import { UpdateInterventionStatusDto } from './dto/update-intervention-status.dto';
import { AddInterventionCommentDto } from './dto/add-intervention-comment.dto';
import { QueryInterventionDto } from './dto/query-intervention.dto';
import { ReportStatus } from '@prisma/client';

export interface UnassignedReportDto {
  reportId: string;
  title: string;
  category: string;
  priority: string;
  address: string;
  createdAt: string;
}

/** Transitions autorisées pour l'agent assigné (boutons Accepter / Démarrer / Suspendre / Rejeter / Résoudre). */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  ASSIGNEE: ['ACCEPTEE', 'REJETEE'],
  ACCEPTEE: ['EN_COURS', 'REJETEE'],
  EN_COURS: ['TERMINEE', 'ACCEPTEE'],
  TERMINEE: [],
  REJETEE: [],
  ANNULEE: [],
};

@Injectable()
export class InterventionsService {
  private readonly appConfig: AppConfig;

  constructor(
    private readonly repository: InterventionsRepository,
    private readonly reportsRepository: ReportsRepository,
    private readonly mapper: InterventionsMapper,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.get<AppConfig>('app')!;
  }

  async findAll(query: QueryInterventionDto, requester: AuthenticatedUser): Promise<InterventionDto[]> {
    const where: Prisma.InterventionWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.agentId ? { agentId: query.agentId } : {}),
      ...(requester.roleName === RoleName.AGENT ? { agentId: requester.userId } : {}),
      report: { organizationId: requester.organizationId },
    };
    const interventions = await this.repository.findMany(where);
    return this.mapper.toDtoList(interventions);
  }

  /** Interventions de l'agent connecté (Flutter `/interventions/me`). */
  async findMine(requester: AuthenticatedUser): Promise<InterventionDto[]> {
    const interventions = await this.repository.findMany({ agentId: requester.userId });
    return this.mapper.toDtoList(interventions);
  }

  /** Signalements validés en attente d'affectation (Flutter `/interventions/unassigned`). */
  async findUnassigned(requester: AuthenticatedUser): Promise<UnassignedReportDto[]> {
    const reports = await this.reportsRepository.findManyFlat({
      organizationId: requester.organizationId,
      assignedToId: null,
      status: { in: ['VALIDE', 'EN_ATTENTE'] },
      deletedAt: null,
    });

    return reports.map((r) => ({
      reportId: r.id,
      title: r.title,
      category: r.category.name,
      priority: r.priority,
      address: r.address,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async findById(id: string, requester: AuthenticatedUser): Promise<InterventionDto> {
    const intervention = await this.resolveIntervention(id);
    this.assertCanView(intervention, requester);
    return this.mapper.toDto(intervention);
  }

  /**
   * Affecte un agent à un signalement. `id` accepte indifféremment un id
   * d'intervention existante (réaffectation) ou un id de signalement
   * (première affectation) — l'app mobile n'a pas d'id d'intervention avant
   * la toute première affectation.
   */
  async assign(id: string, dto: AssignInterventionDto, requester: AuthenticatedUser): Promise<InterventionDto> {
    if (![RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEAM_LEADER].includes(requester.roleName as RoleName)) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à affecter une intervention.");
    }

    const existingIntervention = await this.repository.findById(id);
    const reportId = existingIntervention?.reportId ?? id;

    const report = await this.reportsRepository.findById(reportId);
    if (!report || report.deletedAt) {
      throw new NotFoundException('Signalement introuvable.');
    }
    if (report.organizationId !== requester.organizationId && requester.roleName !== RoleName.SUPER_ADMIN) {
      throw new ForbiddenException("Vous n'avez pas accès à ce signalement.");
    }

    let intervention = existingIntervention ?? (await this.repository.findByReportId(reportId));

    if (intervention) {
      intervention = await this.repository.update(intervention.id, {
        agent: { connect: { id: dto.agentId } },
        status: 'ASSIGNEE',
        startedAt: null,
        completedAt: null,
      });
    } else {
      intervention = await this.repository.create({
        report: { connect: { id: reportId } },
        agent: { connect: { id: dto.agentId } },
        status: 'ASSIGNEE',
        assignedById: requester.userId,
        assignedByName: requester.email,
      });
    }

    await this.repository.addHistory({
      intervention: { connect: { id: intervention.id } },
      status: 'ASSIGNEE',
      changedById: requester.userId,
      changedByName: requester.email,
    });

    await this.reportsRepository.update(reportId, {
      status: 'ASSIGNE',
      assignedTo: { connect: { id: dto.agentId } },
    });
    await this.reportsRepository.addStatusHistory({
      report: { connect: { id: reportId } },
      status: 'ASSIGNE',
      changedById: requester.userId,
      changedByName: requester.email,
    });

    const refreshed = await this.repository.findById(intervention.id);
    return this.mapper.toDto(refreshed!);
  }

  async updateStatus(
    id: string,
    dto: UpdateInterventionStatusDto,
    requester: AuthenticatedUser,
  ): Promise<InterventionDto> {
    const intervention = await this.resolveIntervention(id);
    this.assertOwnsOrManages(intervention, requester);

    const allowed = ALLOWED_TRANSITIONS[intervention.status] ?? [];
    if (!allowed.includes(dto.status) && requester.roleName === RoleName.AGENT) {
      throw new BadRequestException(
        `Transition invalide : ${intervention.status} → ${dto.status}.`,
      );
    }

    const updateData: Prisma.InterventionUpdateInput = { status: dto.status };
    if (dto.status === 'EN_COURS' && !intervention.startedAt) {
      updateData.startedAt = new Date();
    }
    if (dto.status === 'TERMINEE') {
      updateData.completedAt = new Date();
    }

    await this.repository.update(intervention.id, updateData);
    await this.repository.addHistory({
      intervention: { connect: { id: intervention.id } },
      status: dto.status,
      comment: dto.comment,
      changedById: requester.userId,
      changedByName: requester.email,
    });

    // Répercute certains statuts sur le signalement lié.
    const statusMap: Record<string, ReportStatus> = {
      TERMINEE: ReportStatus.RESOLU,
      REJETEE: ReportStatus.VALIDE,
    };

    const mappedReportStatus: ReportStatus | undefined =
      statusMap[dto.status];
    if (mappedReportStatus) {
      await this.reportsRepository.update(intervention.reportId, {
        status: mappedReportStatus,
        ...(mappedReportStatus === ReportStatus.VALIDE
          ? { assignedTo: { disconnect: true } }
          : {}),
      });

      await this.reportsRepository.addStatusHistory({
        report: { connect: { id: intervention.reportId } },
        status: mappedReportStatus,
        comment: dto.comment,
        changedById: requester.userId,
        changedByName: requester.email,
      });
    }
    const refreshed = await this.repository.findById(intervention.id);
    return this.mapper.toDto(refreshed!);
  }

  async addComment(id: string, dto: AddInterventionCommentDto, requester: AuthenticatedUser): Promise<InterventionDto> {
    const intervention = await this.resolveIntervention(id);
    this.assertOwnsOrManages(intervention, requester);

    await this.repository.addComment({
      intervention: { connect: { id: intervention.id } },
      authorId: requester.userId,
      authorName: requester.email,
      message: dto.message,
    });

    const refreshed = await this.repository.findById(intervention.id);
    return this.mapper.toDto(refreshed!);
  }

  async addPhoto(
    id: string,
    phase: 'AVANT' | 'APRES',
    requester: AuthenticatedUser,
    file: Express.Multer.File,
  ): Promise<InterventionDto> {
    const intervention = await this.resolveIntervention(id);
    this.assertOwnsOrManages(intervention, requester);

    await this.repository.addAttachment({
      intervention: { connect: { id: intervention.id } },
      url: toPublicFileUrl(this.appConfig.publicUrl, 'interventions', file.filename),
      filename: file.originalname,
      phase,
    });

    const refreshed = await this.repository.findById(intervention.id);
    return this.mapper.toDto(refreshed!);
  }

  // --------------------------------------------------------------------

  private async resolveIntervention(id: string): Promise<InterventionDetail> {
    const intervention = await this.repository.findById(id);
    if (!intervention) {
      throw new NotFoundException('Intervention introuvable.');
    }
    return intervention;
  }

  private assertCanView(intervention: InterventionDetail, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (requester.roleName === RoleName.AGENT && intervention.agentId !== requester.userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette intervention.");
    }
    if (intervention.report.organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette intervention.");
    }
  }

  private assertOwnsOrManages(intervention: InterventionDetail, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (requester.roleName === RoleName.AGENT) {
      if (intervention.agentId !== requester.userId) {
        throw new ForbiddenException("Cette intervention ne vous est pas assignée.");
      }
      return;
    }
    if (intervention.report.organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette intervention.");
    }
  }
}
