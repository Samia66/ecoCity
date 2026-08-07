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

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('categories')
@ApiBearerAuth('JWT')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(
    private readonly service: CategoriesService,
  ) {}

  @Get()
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
    RoleName.AGENT,
  )
  findAll(
    @Query() query: QueryCategoriesDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
    RoleName.AGENT,
  )
  findById(
    @Param('id') id: string,
  ) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
  )
  create(
    @Body() dto: CreateCategoryDto,
  ) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/activate')
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
  )
  activate(
    @Param('id') id: string,
  ) {
    return this.service.activate(id);
  }

  @Patch(':id/deactivate')
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
  )
  deactivate(
    @Param('id') id: string,
  ) {
    return this.service.deactivate(id);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN)
  delete(
    @Param('id') id: string,
  ) {
    return this.service.delete(id);
  }
}