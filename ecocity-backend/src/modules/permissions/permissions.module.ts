import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsMapper } from './permissions.mapper';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository, PermissionsMapper],
  exports: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
