import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ZonesRepository } from '../zones/zones.repository';
import { TeamsRepository } from '../teams/teams.repository';
import { CollectionSchedulesRepository, ScheduleWithRelations } from './collection-schedules.repository';
import { CollectionSchedulesMapper, CollectionScheduleDto } from './collection-schedules.mapper';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class CollectionSchedulesService {
  constructor(
    private readonly repository: CollectionSchedulesRepository,
    private readonly mapper: CollectionSchedulesMapper,
    private readonly zonesRepository: ZonesRepository,
    private readonly teamsRepository: TeamsRepository,
  ) {}

  async findByZone(zoneId: string, requester: AuthenticatedUser): Promise<CollectionScheduleDto[]> {
    await this.getZoneOrThrow(zoneId, requester);
    const schedules = await this.repository.findByZone(zoneId);
    return this.mapper.toDtoList(schedules);
  }

  async create(zoneId: string, dto: CreateScheduleDto, requester: AuthenticatedUser): Promise<CollectionScheduleDto> {
    const zone = await this.getZoneOrThrow(zoneId, requester);
    this.assertManages(zone.organizationId, requester);

    const assignment = await this.teamsRepository.findZoneAssignment(dto.teamId, zoneId);
    if (!assignment) {
      throw new BadRequestException("Cette équipe n'est pas affectée à cette zone — affectez-la d'abord.");
    }

    const existing = await this.repository.findExisting(zoneId, dto.teamId, dto.dayOfWeek);
    if (existing) {
      throw new BadRequestException('Un planning existe déjà pour cette équipe, cette zone et ce jour.');
    }

    const schedule = await this.repository.create({
      zone: { connect: { id: zoneId } },
      team: { connect: { id: dto.teamId } },
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isActive: dto.isActive ?? true,
    });
    return this.mapper.toDto(schedule);
  }

  async update(id: string, dto: UpdateScheduleDto, requester: AuthenticatedUser): Promise<CollectionScheduleDto> {
    const schedule = await this.getScheduleOrThrow(id);
    this.assertManages(schedule.zone.organizationId, requester);

    if (dto.dayOfWeek !== undefined && dto.dayOfWeek !== schedule.dayOfWeek) {
      const existing = await this.repository.findExisting(schedule.zoneId, schedule.teamId, dto.dayOfWeek);
      if (existing) {
        throw new BadRequestException('Un planning existe déjà pour cette équipe, cette zone et ce jour.');
      }
    }

    const updated = await this.repository.update(id, {
      ...(dto.dayOfWeek !== undefined ? { dayOfWeek: dto.dayOfWeek } : {}),
      ...(dto.startTime !== undefined ? { startTime: dto.startTime } : {}),
      ...(dto.endTime !== undefined ? { endTime: dto.endTime } : {}),
      ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
    });
    return this.mapper.toDto(updated);
  }

  async remove(id: string, requester: AuthenticatedUser): Promise<void> {
    const schedule = await this.getScheduleOrThrow(id);
    this.assertManages(schedule.zone.organizationId, requester);
    await this.repository.remove(id);
  }

  // --------------------------------------------------------------------

  private async getZoneOrThrow(zoneId: string, requester: AuthenticatedUser) {
    const zone = await this.zonesRepository.findById(zoneId);
    if (!zone || zone.deletedAt) {
      throw new NotFoundException('Zone introuvable.');
    }
    if (requester.roleName !== RoleName.SUPER_ADMIN && zone.organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette zone.");
    }
    return zone;
  }

  private async getScheduleOrThrow(id: string): Promise<ScheduleWithRelations> {
    const schedule = await this.repository.findById(id);
    if (!schedule) {
      throw new NotFoundException('Planning introuvable.');
    }
    return schedule;
  }

  private assertManages(organizationId: string, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (requester.roleName !== RoleName.ADMIN || organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à gérer ce planning.");
    }
  }
}
