import { Module } from '@nestjs/common';
import { InterventionsModule } from '../interventions/interventions.module';
import { UsersController } from './users.controller';
import { TeamController } from './team.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';

@Module({
  imports: [InterventionsModule],
  controllers: [UsersController, TeamController],
  providers: [UsersService, UsersRepository, UsersMapper],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
