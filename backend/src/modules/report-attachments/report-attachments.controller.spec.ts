import { Test, TestingModule } from '@nestjs/testing';
import { ReportAttachmentsController } from './report-attachments.controller';
import { ReportAttachmentsService } from './report-attachments.service';

describe('ReportAttachmentsController', () => {
  let controller: ReportAttachmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportAttachmentsController],
      providers: [ReportAttachmentsService],
    }).compile();

    controller = module.get<ReportAttachmentsController>(ReportAttachmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
