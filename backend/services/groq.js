import Groq from "groq-sdk";

let groq = null;

function getGroqClient() {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_key_here" || apiKey.trim() === "") {
      throw new Error("GROQ_API_KEY is not configured in backend/.env. Please add your Groq API Key.");
    }
    groq = new Groq({ apiKey });
  }
  return groq;
}

export async function askGroq({ question, chunks }) {
  const context = chunks
    .map((chunk, index) => {
      const source = chunk.metadata?.docName || "unknown document";
      return `Source ${index + 1}: ${source}\n${chunk.text}`;
    })
    .join("\n\n---\n\n");

  const prompt = `You are InfraIQ, a RAG assistant for industrial documents.
Answer only using the uploaded document context.
If the answer is not present in the context, say: "Not available in uploaded documents."
Include source references like [Source 1], [Source 2] where useful.

Context:
${context}

Question:
${question}`;

  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You answer questions using only provided context." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  return completion.choices[0]?.message?.content || "No answer generated.";
}

