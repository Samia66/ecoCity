import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionCode } from '../../common/constants/permissions.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.zonesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zonesService.findById(id);
  }

  @Post()
  @RequirePermissions(PermissionCode.ZONES_MANAGE)
  create(@Body() dto: CreateZoneDto, @CurrentUser() user: AuthenticatedUser) {
    return this.zonesService.create(dto, user);
  }

  @Patch(':id')
  @RequirePermissions(PermissionCode.ZONES_MANAGE)
  update(@Param('id') id: string, @Body() dto: UpdateZoneDto) {
    return this.zonesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionCode.ZONES_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.zonesService.remove(id);
  }
}
