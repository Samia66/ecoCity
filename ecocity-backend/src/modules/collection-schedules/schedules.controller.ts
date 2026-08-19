import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionCode } from '../../common/constants/permissions.constant';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { CollectionSchedulesService } from './collection-schedules.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

/** `PATCH/DELETE /schedules/:id`. */
@Controller('schedules')
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
export class SchedulesController {
  constructor(private readonly schedulesService: CollectionSchedulesService) {}

  @Patch(':id')
  @RequirePermissions(PermissionCode.COLLECTION_SCHEDULES_MANAGE)
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto, @CurrentUser() user: AuthenticatedUser) {
    return this.schedulesService.update(id, dto, user);
  }

  @Delete(':id')
  @RequirePermissions(PermissionCode.COLLECTION_SCHEDULES_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.schedulesService.remove(id, user);
  }
}
