import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { AttachmentsRepository } from './repositories/attachments.repository';

import { ATTACHMENT_ERRORS } from './constants/attachments.constants';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly repository: AttachmentsRepository,
  ) {}

  async upload(
    reportId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new NotFoundException(
        ATTACHMENT_ERRORS.FILE_REQUIRED,
      );
    }

    return this.repository.create({
      fileName: randomUUID(),

      originalName: file.originalname,

      mimeType: file.mimetype,

      extension:
        file.originalname.split('.').pop(),

      size: file.size,

      path: file.path,

      report: {
        connect: {
          id: reportId,
        },
      },
    });
  }

  async findByReport(reportId: string) {
    return this.repository.findByReport(
      reportId,
    );
  }

  async delete(id: string) {
    const attachment =
      await this.repository.findById(id);

    if (!attachment) {
      throw new NotFoundException(
        ATTACHMENT_ERRORS.ATTACHMENT_NOT_FOUND,
      );
    }

    await this.repository.delete(id);

    return {
      message:
        'Attachment deleted successfully',
    };
  }
}