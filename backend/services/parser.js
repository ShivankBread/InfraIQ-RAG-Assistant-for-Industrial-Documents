import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parseDocument(file) {
  if (!file) throw new Error("No file uploaded");

  if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf")) {
    const data = await pdfParse(file.buffer);
    return cleanText(data.text);
  }

  if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return cleanText(result.value);
  }

  throw new Error("Unsupported file type. Upload PDF or DOCX only.");
}

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\u0000/g, "")
    .trim();
}
