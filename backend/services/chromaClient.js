import { ChromaClient } from "chromadb";

const chroma = new ChromaClient({
  path: process.env.CHROMA_URL || "http://localhost:8000"
});

const COLLECTION_NAME = "infraiq_documents";

export async function getCollection() {
  return chroma.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { description: "Industrial document chunks for InfraIQ" }
  });
}

export async function addChunksToChroma({ docName, chunks, embeddings }) {
  const collection = await getCollection();

  const ids = chunks.map((_, index) => `${docName}-${Date.now()}-${index}`);
  const documents = chunks.map((chunk) => chunk.text);
  const metadatas = chunks.map((chunk, index) => ({
    docName,
    chunkIndex: index,
    startWord: chunk.startWord,
    endWord: chunk.endWord
  }));

  await collection.add({
    ids,
    documents,
    metadatas,
    embeddings
  });

  return ids.length;
}

export async function searchSimilarChunks(queryEmbedding, topK = 5) {
  const collection = await getCollection();

  const result = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK
  });

  const documents = result.documents?.[0] || [];
  const metadatas = result.metadatas?.[0] || [];
  const distances = result.distances?.[0] || [];

  return documents.map((text, index) => ({
    text,
    metadata: metadatas[index],
    distance: distances[index]
  }));
}
