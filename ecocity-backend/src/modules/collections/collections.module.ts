import { Module } from '@nestjs/common';
import { TeamsModule } from '../teams/teams.module';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CollectionsRepository } from './collections.repository';
import { CollectionsMapper } from './collections.mapper';

@Module({
  imports: [TeamsModule],
  controllers: [CollectionsController],
  providers: [CollectionsService, CollectionsRepository, CollectionsMapper],
  exports: [CollectionsRepository],
})
export class CollectionsModule {}
