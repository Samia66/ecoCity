import {
  IsUUID,
} from 'class-validator';

export class AssignReportDto {

  @IsUUID()
  agentId: string;

}