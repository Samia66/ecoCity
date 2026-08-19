import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { InterventionsModule } from '../interventions/interventions.module';
import { TeamsController } from './teams.controller';
import { MyTeamController } from './my-team.controller';
import { TeamsService } from './teams.service';
import { TeamsRepository } from './teams.repository';
import { TeamsMapper } from './teams.mapper';

@Module({
  imports: [UsersModule, InterventionsModule],
  controllers: [TeamsController, MyTeamController],
  providers: [TeamsService, TeamsRepository, TeamsMapper],
  exports: [TeamsService, TeamsRepository],
})
export class TeamsModule {}
