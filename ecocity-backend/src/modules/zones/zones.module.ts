import { Module } from '@nestjs/common';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { ZonesRepository } from './zones.repository';
import { ZonesMapper } from './zones.mapper';

@Module({
  controllers: [ZonesController],
  providers: [ZonesService, ZonesRepository, ZonesMapper],
  exports: [ZonesService, ZonesRepository],
})
export class ZonesModule {}
