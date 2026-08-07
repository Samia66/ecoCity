import { Test, TestingModule } from '@nestjs/testing';
import { ReportAttachmentsService } from './report-attachments.service';

describe('ReportAttachmentsService', () => {
  let service: ReportAttachmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportAttachmentsService],
    }).compile();

    service = module.get<ReportAttachmentsService>(ReportAttachmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
