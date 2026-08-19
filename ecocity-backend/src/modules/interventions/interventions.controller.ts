import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/constants/roles.constant';
import { buildDiskStorage } from '../../common/utils/file-storage.util';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { InterventionsService } from './interventions.service';
import { AssignInterventionDto } from './dto/assign-intervention.dto';
import { UpdateInterventionStatusDto } from './dto/update-intervention-status.dto';
import { AddInterventionCommentDto } from './dto/add-intervention-comment.dto';
import { QueryInterventionDto } from './dto/query-intervention.dto';

@Controller('interventions')
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEAM_LEADER, RoleName.AGENT)
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Get()
  findAll(@Query() query: QueryInterventionDto, @CurrentUser() user: AuthenticatedUser) {
    return this.interventionsService.findAll(query, user);
  }

  /** Interventions de l'agent connecté — app Flutter. */
  @Get('me')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.interventionsService.findMine(user);
  }

  /** Signalements en attente d'affectation — écran TEAM_LEADER de l'app Flutter. */
  @Get('unassigned')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEAM_LEADER)
  findUnassigned(@CurrentUser() user: AuthenticatedUser) {
    return this.interventionsService.findUnassigned(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.interventionsService.findById(id, user);
  }

  @Post(':id/assign')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEAM_LEADER)
  assign(@Param('id') id: string, @Body() dto: AssignInterventionDto, @CurrentUser() user: AuthenticatedUser) {
    return this.interventionsService.assign(id, dto, user);
  }

  /** Accepter / Démarrer / Suspendre / Rejeter / Résoudre — un seul endpoint, statut cible dans le body. */
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInterventionStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.interventionsService.updateStatus(id, dto, user);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() dto: AddInterventionCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.interventionsService.addComment(id, dto, user);
  }

  @Post(':id/photos/before')
  @UseInterceptors(
    FileInterceptor('photo', { storage: buildDiskStorage(process.env.UPLOAD_DIR ?? 'uploads', 'interventions') }),
  )
  addPhotoBefore(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.interventionsService.addPhoto(id, 'AVANT', user, file);
  }

  @Post(':id/photos/after')
  @UseInterceptors(
    FileInterceptor('photo', { storage: buildDiskStorage(process.env.UPLOAD_DIR ?? 'uploads', 'interventions') }),
  )
  addPhotoAfter(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.interventionsService.addPhoto(id, 'APRES', user, file);
  }
}
