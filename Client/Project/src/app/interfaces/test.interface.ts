import { TestStatus } from "../enums/test-status.enum";
import { Question } from "./question.interface";

interface PdfFile {
  id: number;
  // other properties of PdfFile
}

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


