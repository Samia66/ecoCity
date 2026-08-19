import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { RolesMapper } from './roles.mapper';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, RolesMapper],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
