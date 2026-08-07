import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import jwtConfig from './config/jwt.config';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrganizationsModule } from './modules/organization/organization.module';
import { ReportsModule } from './modules/report/report.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { CommentsModule } from './modules/comments/comments.module';
import { InterventionsModule } from './modules/interventions/interventions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PermissionsModule } from './modules/permission/permission.module';
import { RolesModule } from './modules/roles/roles.module';
import { ReportCommentsModule } from './modules/report-comments/report-comments.module';
import { ReportAttachmentsModule } from './modules/report-attachments/report-attachments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
       load: [jwtConfig],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    CommonModule,
    UsersModule,
    OrganizationsModule,
    CategoriesModule,
    ReportsModule,
    AttachmentsModule,
    CommentsModule,
    InterventionsModule,
    DashboardModule,
    PermissionsModule,
    RolesModule,
    ReportCommentsModule,
    ReportAttachmentsModule,
    
  ],
})
export class AppModule {}