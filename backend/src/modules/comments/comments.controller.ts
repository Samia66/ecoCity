import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RoleName } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { CommentsService } from './comments.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { DEFAULT_ROLE } from '../auth/constants/auth.roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('comments')
@ApiBearerAuth('JWT')
@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(
    private readonly service: CommentsService,
  ) {}

  @Post()
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
    RoleName.AGENT,
   DEFAULT_ROLE,
  )
  create(
    @Body() dto: CreateCommentDto,

    @CurrentUser() user: JwtPayloadDto,
  ) {
    return this.service.create(
      dto,
      user.sub,
    );
  }

  @Get(':reportId')
  findByReport(
    @Param('reportId') reportId: string,
  ) {
    return this.service.findByReport(
      reportId,
    );
  }

  @Delete(':id')
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
  )
  delete(
    @Param('id') id: string,
  ) {
    return this.service.delete(id);
  }
}