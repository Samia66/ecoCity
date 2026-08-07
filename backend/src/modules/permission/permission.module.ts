import { Module } from '@nestjs/common';

import { PermissionsRepository } from './repositories/permissions.repository';
import { PermissionsController } from './permission.controller';
import { PermissionsService } from './permission.service';

@Module({
  controllers: [
    PermissionsController,
  ],
  providers: [
    PermissionsService,
    PermissionsRepository,
  ],
})
export class PermissionsModule {}