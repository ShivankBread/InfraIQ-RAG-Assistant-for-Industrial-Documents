import express from "express";
import multer from "multer";
import { parseDocument } from "../services/parser.js";
import { chunkText } from "../services/chunker.js";
import { embedMany } from "../services/embedder.js";
import { addChunksToChroma } from "../services/chromaClient.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const uploadedDocs = [];

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const text = await parseDocument(file);

    if (!text) {
      return res.status(400).json({ error: "No readable text found in document." });
    }

    const chunks = chunkText(text, { chunkSize: 500, overlap: 50 });
    const embeddings = await embedMany(chunks.map((chunk) => chunk.text));

    const storedCount = await addChunksToChroma({
      docName: file.originalname,
      chunks,
      embeddings
    });

    uploadedDocs.push({
      name: file.originalname,
      chunks: storedCount,
      uploadedAt: new Date().toISOString()
    });

    res.json({
      message: "Document uploaded and indexed successfully.",
      document: file.originalname,
      chunks: storedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

router.get("/documents", (req, res) => {
  res.json({ documents: uploadedDocs });
});

export default router;
