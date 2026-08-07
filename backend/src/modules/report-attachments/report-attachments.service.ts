import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { ReportAttachmentsRepository } from './repositories/report-attachments.repository';

import {
    REPORT_ATTACHMENT_ERRORS,
    REPORT_ATTACHMENT_MESSAGES,
} from './constants/report-attachments.constants';

import { ReportAttachmentsMapper } from './mappers/report-attachments.mapper';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';

@Injectable()
export class ReportAttachmentsService {
    constructor(
        private readonly repository: ReportAttachmentsRepository,
    ) { }

    async create(
        data: UploadAttachmentDto,
    ) {
        const attachment =
            await this.repository.create({
                fileName: data.fileName,

                originalName: data.originalName,

                mimeType: data.mimeType,

                extension: data.extension,

                size: data.size,

                path: data.path,

                url: data.url,

                report: {
                    connect: {
                        id: data.reportId,
                    },
                },
            });

        return ReportAttachmentsMapper.toResponse(
            attachment,
        );
    }
    async findByReport(
        reportId: string,
    ) {
        const attachments =
            await this.repository.findByReport(
                reportId,
            );

        return attachments.map(
            ReportAttachmentsMapper.toResponse,
        );
    }

    async delete(id: string) {
        const attachment =
            await this.repository.findById(id);

        if (!attachment) {
            throw new NotFoundException(
                REPORT_ATTACHMENT_ERRORS.NOT_FOUND,
            );
        }

        await this.repository.delete(id);

        return {
            message:
                REPORT_ATTACHMENT_MESSAGES.DELETED,
        };
    }
}