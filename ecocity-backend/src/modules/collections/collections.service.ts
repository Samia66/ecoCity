import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, CollectionStatus } from '@prisma/client';
import { AppConfig } from '../../config/configuration';
import { toPublicFileUrl } from '../../common/utils/file-storage.util';
import { dayOfWeekFromDate, startOfUtcDay } from '../../common/utils/day-of-week.util';
import { paginate, toSkipTake, PaginatedResult } from '../../common/utils/pagination.util';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { TeamsRepository } from '../teams/teams.repository';
import { CollectionsRepository, CollectionWithRelations } from './collections.repository';
import { CollectionsMapper, CollectionDto } from './collections.mapper';
import { CompleteCollectionDto } from './dto/complete-collection.dto';
import { ReportProblemDto } from './dto/report-problem.dto';
import { QueryCollectionDto } from './dto/query-collection.dto';

/** Transitions autorisées pour TEAM_LEADER/AGENT (le staff ADMIN peut forcer n'importe quelle transition). */
const ALLOWED_TRANSITIONS: Record<CollectionStatus, CollectionStatus[]> = {
  PLANIFIEE: ['EN_COURS', 'NON_EFFECTUEE'],
  EN_COURS: ['TERMINEE', 'NON_EFFECTUEE'],
  TERMINEE: [],
  ANNULEE: [],
  NON_EFFECTUEE: [],
};

@Injectable()
export class CollectionsService {
  private readonly appConfig: AppConfig;

  constructor(
    private readonly repository: CollectionsRepository,
    private readonly mapper: CollectionsMapper,
    private readonly teamsRepository: TeamsRepository,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.get<AppConfig>('app')!;
  }

  /** `GET /collections/today` — génère les collectes du jour si besoin, puis les renvoie scopées au rôle. */
  async findToday(requester: AuthenticatedUser): Promise<CollectionDto[]> {
    const today = startOfUtcDay(new Date());
    await this.ensureTodayGenerated(requester.organizationId, today);

    const where: Prisma.CollectionWhereInput = { scheduledDate: today, team: { organizationId: requester.organizationId } };

    if (requester.roleName === RoleName.TEAM_LEADER || requester.roleName === RoleName.AGENT) {
      const team = await this.teamsRepository.findByMemberAgentId(requester.organizationId, requester.userId);
      if (!team) return [];
      where.teamId = team.id;
    }

    const collections = await this.repository.findMany({ where });
    return this.mapper.toDtoList(collections);
  }

  /** `GET /collections/my-team` — historique complet (pas seulement aujourd'hui) de l'équipe de l'appelant. */
  async findMyTeam(requester: AuthenticatedUser): Promise<CollectionDto[]> {
    const team = await this.teamsRepository.findByMemberAgentId(requester.organizationId, requester.userId);
    if (!team) return [];
    const collections = await this.repository.findMany({ where: { teamId: team.id }, take: 100 });
    return this.mapper.toDtoList(collections);
  }

  /** `GET /collections` — liste/historique filtrable pour l'ADMIN/SUPER_ADMIN. */
  async findAll(query: QueryCollectionDto, requester: AuthenticatedUser): Promise<PaginatedResult<CollectionDto>> {
    const { skip, take } = toSkipTake(query.page, query.limit);
    const where: Prisma.CollectionWhereInput = {
      ...(requester.roleName !== RoleName.SUPER_ADMIN ? { team: { organizationId: requester.organizationId } } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.teamId ? { teamId: query.teamId } : {}),
      ...(query.zoneId ? { zoneId: query.zoneId } : {}),
    };

    const [collections, total] = await Promise.all([
      this.repository.findMany({ where, skip, take }),
      this.repository.count(where),
    ]);

    return paginate(this.mapper.toDtoList(collections), total, query.page, query.limit);
  }

  async findById(id: string, requester: AuthenticatedUser): Promise<CollectionDto> {
    const collection = await this.resolveCollection(id);
    this.assertAccess(collection, requester);
    return this.mapper.toDto(collection);
  }

  async start(id: string, requester: AuthenticatedUser): Promise<CollectionDto> {
    const collection = await this.resolveCollection(id);
    this.assertAccess(collection, requester);
    return this.transition(collection, 'EN_COURS', requester, { startedAt: new Date() });
  }

  async complete(id: string, dto: CompleteCollectionDto, requester: AuthenticatedUser): Promise<CollectionDto> {
    const collection = await this.resolveCollection(id);
    this.assertAccess(collection, requester);
    return this.transition(collection, 'TERMINEE', requester, { completedAt: new Date() }, dto.comment);
  }

  async reportProblem(id: string, dto: ReportProblemDto, requester: AuthenticatedUser): Promise<CollectionDto> {
    const collection = await this.resolveCollection(id);
    this.assertAccess(collection, requester);

    const nextStatus: CollectionStatus = collection.status === 'TERMINEE' ? collection.status : 'NON_EFFECTUEE';

    await this.repository.update(id, { problemDescription: dto.problemDescription, status: nextStatus });
    await this.repository.addHistory({
      collection: { connect: { id } },
      status: nextStatus,
      comment: dto.problemDescription,
      changedById: requester.userId,
      changedByName: requester.email,
    });

    const refreshed = await this.resolveCollection(id);
    return this.mapper.toDto(refreshed);
  }

  async addPhoto(id: string, requester: AuthenticatedUser, file: Express.Multer.File): Promise<CollectionDto> {
    const collection = await this.resolveCollection(id);
    this.assertAccess(collection, requester);

    await this.repository.addAttachment({
      collection: { connect: { id } },
      url: toPublicFileUrl(this.appConfig.publicUrl, 'collections', file.filename),
      filename: file.originalname,
    });

    const refreshed = await this.resolveCollection(id);
    return this.mapper.toDto(refreshed);
  }

  // --------------------------------------------------------------------

  /** Idempotent : crée les collectes manquantes du jour à partir des plannings actifs. Appelé au début de chaque lecture "today". */
  private async ensureTodayGenerated(organizationId: string, today: Date): Promise<void> {
    const dayOfWeek = dayOfWeekFromDate(today);
    const schedules = await this.repository.findActiveSchedules(organizationId, dayOfWeek);
    await Promise.all(schedules.map((s) => this.repository.ensureCollectionForSchedule(s, today)));
  }

  private async transition(
    collection: CollectionWithRelations,
    nextStatus: CollectionStatus,
    requester: AuthenticatedUser,
    extra: Prisma.CollectionUpdateInput,
    comment?: string,
  ): Promise<CollectionDto> {
    const isStaff = requester.roleName === RoleName.ADMIN || requester.roleName === RoleName.SUPER_ADMIN;
    const allowed = ALLOWED_TRANSITIONS[collection.status] ?? [];
    if (!isStaff && !allowed.includes(nextStatus)) {
      throw new BadRequestException(`Transition invalide : ${collection.status} → ${nextStatus}.`);
    }

    await this.repository.update(collection.id, { status: nextStatus, comment, ...extra });
    await this.repository.addHistory({
      collection: { connect: { id: collection.id } },
      status: nextStatus,
      comment,
      changedById: requester.userId,
      changedByName: requester.email,
    });

    const refreshed = await this.resolveCollection(collection.id);
    return this.mapper.toDto(refreshed);
  }

  private async resolveCollection(id: string): Promise<CollectionWithRelations> {
    const collection = await this.repository.findById(id);
    if (!collection) {
      throw new NotFoundException('Collecte introuvable.');
    }
    return collection;
  }

  /** Même politique d'accès que `TeamsService.assertTeamAccess`, appliquée via l'équipe propriétaire de la collecte. */
  private assertAccess(collection: CollectionWithRelations, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;

    if (requester.roleName === RoleName.TEAM_LEADER || requester.roleName === RoleName.AGENT) {
      const isMember = collection.team.members.some((m) => m.agentId === requester.userId);
      if (!isMember) {
        throw new ForbiddenException("Vous n'avez pas accès à cette collecte.");
      }
      return;
    }

    if (collection.team.organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette collecte.");
    }
  }
}
