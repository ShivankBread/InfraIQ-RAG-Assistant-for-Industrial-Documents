import express from "express";
import { embedText } from "../services/embedder.js";
import { searchSimilarChunks } from "../services/chromaClient.js";
import { askGroq } from "../services/groq.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    const queryEmbedding = await embedText(question);
    const chunks = await searchSimilarChunks(queryEmbedding, 5);

    if (!chunks.length) {
      return res.json({
        answer: "Not available in uploaded documents.",
        sources: []
      });
    }

    const answer = await askGroq({ question, chunks });

    const sources = chunks.map((chunk, index) => ({
      id: index + 1,
      document: chunk.metadata?.docName,
      chunkIndex: chunk.metadata?.chunkIndex,
      preview: chunk.text.slice(0, 250) + "...",
      distance: chunk.distance
    }));

    res.json({ answer, sources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Chat failed" });
  }
});

export default router;
