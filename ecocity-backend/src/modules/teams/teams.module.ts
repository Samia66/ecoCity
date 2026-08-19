import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TeamsRepository } from './teams.repository';
import { TeamsMapper } from './teams.mapper';

@Module({
  imports: [UsersModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository, TeamsMapper],
  exports: [TeamsService, TeamsRepository],
})
export class TeamsModule {}
