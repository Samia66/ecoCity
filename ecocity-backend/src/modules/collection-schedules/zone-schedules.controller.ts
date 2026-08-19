import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionCode } from '../../common/constants/permissions.constant';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { CollectionSchedulesService } from './collection-schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

/** Plannings de collecte d'une zone : `GET/POST /zones/:id/schedules`. */
@Controller('zones/:zoneId/schedules')
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEAM_LEADER, RoleName.AGENT)
export class ZoneSchedulesController {
  constructor(private readonly schedulesService: CollectionSchedulesService) {}

  @Get()
  findAll(@Param('zoneId') zoneId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.schedulesService.findByZone(zoneId, user);
  }

  @Post()
  @RequirePermissions(PermissionCode.COLLECTION_SCHEDULES_MANAGE)
  create(
    @Param('zoneId') zoneId: string,
    @Body() dto: CreateScheduleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.schedulesService.create(zoneId, dto, user);
  }
}
