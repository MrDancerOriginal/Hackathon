export interface PdfFile {
  id: number;
  fileName: string;
  filePath?: string;
  extractedText?: string;
  uploadedDate: string; // Date in ISO 8601 format (UTC)
}
