import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesService } from './roles.service';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth('JWT')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(
    private readonly service: RolesService,
  ) {}

  @Get()
  @Permissions('roles.read')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('roles.read')
  findById(
    @Param('id')
    id: string,
  ) {
    return this.service.findById(id);
  }

  @Post(':roleId/permissions/:permissionId')
  @Permissions('permissions.assign')
  assignPermission(
    @Param('roleId')
    roleId: string,

    @Param('permissionId')
    permissionId: string,
  ) {
    return this.service.assignPermission(
      roleId,
      permissionId,
    );
  }

  @Delete(':roleId/permissions/:permissionId')
  @Permissions('permissions.assign')
  removePermission(
    @Param('roleId')
    roleId: string,

    @Param('permissionId')
    permissionId: string,
  ) {
    return this.service.removePermission(
      roleId,
      permissionId,
    );
  }
}