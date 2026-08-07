import { ReportAttachment } from '@prisma/client';

export class ReportAttachmentsMapper {
    static toResponse(
        attachment: ReportAttachment,
    ) {
        return {
            id: attachment.id,

            reportId: attachment.reportId,

            fileName: attachment.fileName,

            originalName:
                attachment.originalName,

            mimeType: attachment.mimeType,

            extension:
                attachment.extension,

            size: attachment.size,

            path: attachment.path,

            url: attachment.url,

            createdAt:
                attachment.createdAt,
        };
    }
}