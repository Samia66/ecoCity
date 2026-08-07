import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { AttachmentsRepository } from './repositories/attachments.repository';

@Module({
  imports: [PrismaModule],

  controllers: [
    AttachmentsController,
  ],

  providers: [
    AttachmentsService,
    AttachmentsRepository,
  ],

  exports: [
    AttachmentsService,
  ],
})
export class AttachmentsModule {}