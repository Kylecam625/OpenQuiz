/**
 * Parse uploaded documents and extract text content
 */

export async function parseDocument(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // Plain text files
  if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    return await file.text();
  }

  // Markdown files
  if (
    fileType === "text/markdown" ||
    fileName.endsWith(".md") ||
    fileName.endsWith(".markdown")
  ) {
    return await file.text();
  }

  // PDF files
  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    // For now, return error message. PDF parsing requires server-side processing
    throw new Error(
      "PDF parsing requires server-side processing. Please upload a .txt or .md file, or paste your text directly."
    );
  }

  // Word documents
  if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    throw new Error(
      "Word document parsing requires server-side processing. Please upload a .txt or .md file, or paste your text directly."
    );
  }

  throw new Error(
    `Unsupported file type: ${fileType}. Please upload a .txt or .md file.`
  );
}

export function validateDocumentSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function truncateText(text: string, maxChars: number = 20000): string {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars);
}

