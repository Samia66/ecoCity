import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('dashboard')
@ApiBearerAuth('JWT')
@Controller('dashboard')
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
export class DashboardController {
  constructor(
    private readonly service: DashboardService,
  ) {}

  @Get('overview')
  @Permissions('dashboard.read')
  overview() {
    return this.service.overview();
  }
}