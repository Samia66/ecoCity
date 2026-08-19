import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionCode } from '../../common/constants/permissions.constant';
import { AppConfig } from '../../config/configuration';
import { buildDiskStorage } from '../../common/utils/file-storage.util';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { QueryReportDto } from './dto/query-report.dto';

@Controller('reports')
export class ReportsController {
  private readonly uploadDir: string;

  constructor(
    private readonly reportsService: ReportsService,
    configService: ConfigService,
  ) {
    this.uploadDir = configService.get<AppConfig>('app')!.upload.dir;
  }

  @Get()
  findAll(@Query() query: QueryReportDto, @CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.findAll(query, user);
  }

  /** Signalements du citoyen connecté — consommé par l'app Flutter. */
  @Get('me')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.findMine(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.findById(id, user);
  }

  /**
   * Accepte indifféremment un corps JSON (Angular, sans pièce jointe) ou
   * multipart/form-data avec un champ `photo` (Flutter). `FileInterceptor`
   * ignore silencieusement les requêtes non multipart.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: buildDiskStorage(process.env.UPLOAD_DIR ?? 'uploads', 'reports'),
    }),
  )
  create(
    @Body() dto: CreateReportDto,
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.reportsService.create(dto, user, photo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportDto, @CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.update(id, dto, user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReportStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reportsService.updateStatus(id, dto, user);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: AddCommentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.addComment(id, dto, user);
  }

  @Post(':id/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: buildDiskStorage(process.env.UPLOAD_DIR ?? 'uploads', 'reports'),
    }),
  )
  uploadAttachment(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.reportsService.uploadAttachment(id, user, file);
  }

  @Delete(':id')
  @RequirePermissions(PermissionCode.REPORTS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.remove(id, user);
  }
}
