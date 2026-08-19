import { Module } from '@nestjs/common';
import { ZonesModule } from '../zones/zones.module';
import { TeamsModule } from '../teams/teams.module';
import { ZoneSchedulesController } from './zone-schedules.controller';
import { SchedulesController } from './schedules.controller';
import { CollectionSchedulesService } from './collection-schedules.service';
import { CollectionSchedulesRepository } from './collection-schedules.repository';
import { CollectionSchedulesMapper } from './collection-schedules.mapper';

@Module({
  imports: [ZonesModule, TeamsModule],
  controllers: [ZoneSchedulesController, SchedulesController],
  providers: [CollectionSchedulesService, CollectionSchedulesRepository, CollectionSchedulesMapper],
  exports: [CollectionSchedulesRepository],
})
export class CollectionSchedulesModule {}
