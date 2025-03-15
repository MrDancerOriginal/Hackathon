import { TestStatus } from "../enums/test-status.enum";
import { PdfFile } from "./pdffile.interface";
import { Question } from "./question.interface";

export interface Test {
  id: number;
  title: string;
  description: string;
  authorId: string;
  dateCreated: string; // Date in ISO 8601 format (UTC)
  status: TestStatus;
  pdfFileId?: number;
  pdfFile?: PdfFile;
  questions: Question[];
}


