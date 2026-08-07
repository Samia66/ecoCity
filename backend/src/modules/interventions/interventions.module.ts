import { Module } from '@nestjs/common';

import { InterventionsController } from './interventions.controller';
import { InterventionsService } from './interventions.service';
import { InterventionsRepository } from './repositories/interventions.repository';

@Module({
  controllers: [
    InterventionsController,
  ],

  providers: [
    InterventionsService,
    InterventionsRepository,
  ],
})
export class InterventionsModule {}