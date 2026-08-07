import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { PermissionsService } from './permission.service';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('permissions')
@ApiBearerAuth('JWT')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(
    private readonly service: PermissionsService,
  ) {}

  @Get()
  @Permissions('permissions.read')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('permissions.read')
  findById(
    @Param('id')
    id: string,
  ) {
    return this.service.findById(id);
  }
}