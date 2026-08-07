import { Test, TestingModule } from '@nestjs/testing';
import { ReportCommentsController } from './report-comments.controller';
import { ReportCommentsService } from './report-comments.service';

describe('ReportCommentsController', () => {
  let controller: ReportCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportCommentsController],
      providers: [ReportCommentsService],
    }).compile();

    controller = module.get<ReportCommentsController>(ReportCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
