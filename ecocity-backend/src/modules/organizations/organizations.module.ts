import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationsMapper } from './organizations.mapper';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository, OrganizationsMapper],
  exports: [OrganizationsService, OrganizationsRepository],
})
export class OrganizationsModule {}
