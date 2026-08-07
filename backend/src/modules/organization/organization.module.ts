import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { OrganizationsController } from './organization.controller';
import { OrganizationsService } from './organization.service';
import { OrganizationsRepository } from './repositories/organization.repository';



@Module({
  imports: [PrismaModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    OrganizationsRepository,
  ],
  exports: [
    OrganizationsService,
    OrganizationsRepository,
  ],
})
export class OrganizationsModule {}