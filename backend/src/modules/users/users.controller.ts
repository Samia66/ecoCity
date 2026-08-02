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

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { QueryUsersDto } from './dto/query-users.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly service: UsersService,
  ) { }

  @Get()
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  findAll(
    @Query() query: QueryUsersDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  findOne(
    @Param('id') id: string,
  ) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  create(
    @Body() dto: CreateUserDto,
  ) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }

  @Patch(':id/role')
  @Roles(RoleName.SUPER_ADMIN)
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.service.updateRole(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN)
  delete(
    @Param('id') id: string,
  ) {
    return this.service.delete(id);
  }
}