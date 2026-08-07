import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { InterventionsService } from './interventions.service';

import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { UpdateInterventionStatusDto } from './dto/update-intervention-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('interventions')
@ApiBearerAuth('JWT')
@Controller('interventions')
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
export class InterventionsController {
  constructor(
    private readonly service: InterventionsService,
  ) {}

  @Post()
  @Permissions('reports.assign')
  create(
    @Body()
    dto: CreateInterventionDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('reports.read')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('reports.read')
  findById(
    @Param('id')
    id: string,
  ) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Permissions('reports.update')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateInterventionDto,
  ) {
    return this.service.update(
      id,
      dto,
    );
  }

  @Patch(':id/status')
  @Permissions('reports.resolve')
  updateStatus(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateInterventionStatusDto,
  ) {
    return this.service.updateStatus(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions('reports.delete')
  delete(
    @Param('id')
    id: string,
  ) {
    return this.service.delete(id);
  }
}