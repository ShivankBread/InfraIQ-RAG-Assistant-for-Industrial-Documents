# InfraIQ

A local RAG assistant for industrial PDF/DOCX documents.

## Flow

1. User uploads PDF/DOCX from React frontend.
2. Express receives file at POST /api/upload.
3. parser.js extracts text.
4. chunker.js splits text into overlapping chunks.
5. embedder.js converts chunks into vectors locally using Xenova/all-MiniLM-L6-v2.
6. chromaClient.js stores chunks and embeddings in ChromaDB.
7. User asks a question.
8. Backend embeds the question.
9. ChromaDB returns similar chunks.
10. Groq receives question + retrieved context.
11. Frontend displays answer and citation cards.

## Run

Start Chroma:

```bash
python3 -m pip install --upgrade chromadb
chroma run --host localhost --port 8000 --path ./chroma-data
```

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```
