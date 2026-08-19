import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionCode } from '../../common/constants/permissions.constant';
import { RoleName } from '../../common/constants/roles.constant';
import { buildDiskStorage } from '../../common/utils/file-storage.util';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { CollectionsService } from './collections.service';
import { CompleteCollectionDto } from './dto/complete-collection.dto';
import { ReportProblemDto } from './dto/report-problem.dto';
import { QueryCollectionDto } from './dto/query-collection.dto';

@Controller('collections')
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEAM_LEADER, RoleName.AGENT)
@RequirePermissions(PermissionCode.COLLECTIONS_VIEW)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get('today')
  findToday(@CurrentUser() user: AuthenticatedUser) {
    return this.collectionsService.findToday(user);
  }

  @Get('my-team')
  @Roles(RoleName.TEAM_LEADER, RoleName.AGENT, RoleName.SUPER_ADMIN)
  findMyTeam(@CurrentUser() user: AuthenticatedUser) {
    return this.collectionsService.findMyTeam(user);
  }

  @Get()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  findAll(@Query() query: QueryCollectionDto, @CurrentUser() user: AuthenticatedUser) {
    return this.collectionsService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.collectionsService.findById(id, user);
  }

  @Post(':id/start')
  @RequirePermissions(PermissionCode.COLLECTIONS_MANAGE)
  start(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.collectionsService.start(id, user);
  }

  @Post(':id/complete')
  @RequirePermissions(PermissionCode.COLLECTIONS_MANAGE)
  complete(
    @Param('id') id: string,
    @Body() dto: CompleteCollectionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.collectionsService.complete(id, dto, user);
  }

  @Post(':id/problem')
  @RequirePermissions(PermissionCode.COLLECTIONS_MANAGE)
  reportProblem(
    @Param('id') id: string,
    @Body() dto: ReportProblemDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.collectionsService.reportProblem(id, dto, user);
  }

  @Post(':id/photos')
  @RequirePermissions(PermissionCode.COLLECTIONS_MANAGE)
  @UseInterceptors(
    FileInterceptor('photo', { storage: buildDiskStorage(process.env.UPLOAD_DIR ?? 'uploads', 'collections') }),
  )
  addPhoto(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.collectionsService.addPhoto(id, user, file);
  }
}
