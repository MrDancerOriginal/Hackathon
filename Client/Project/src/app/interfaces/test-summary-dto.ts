import { TestStatus } from "../enums/test-status.enum";

export interface TestSummaryDto {
  id: number;
  title: string;
  description: string;
  dateCreated: Date;
  status: TestStatus;
  pdfFileId: string;
}
