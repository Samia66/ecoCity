import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RoleName } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { QueryOrganizationsDto } from './dto/query-organizations.dto';
import { OrganizationsService } from './organization.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('organizations')
@ApiBearerAuth('JWT')
@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(
    private readonly service: OrganizationsService,
  ) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  findAll(
    @Query() query: QueryOrganizationsDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  findById(
    @Param('id') id: string,
  ) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  create(
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN)
  delete(
    @Param('id') id: string,
  ) {
    return this.service.delete(id);
  }
}