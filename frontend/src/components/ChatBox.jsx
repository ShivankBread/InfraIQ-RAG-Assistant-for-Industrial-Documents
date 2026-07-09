import { useState } from "react";
import CitationCard from "./CitationCard.jsx";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  async function askQuestion() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setSources([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Chat failed");
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (error) {
      setAnswer(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Ask InfraIQ</h2>
      <textarea
        className="textarea"
        placeholder="Ask something from uploaded documents..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button className="button" onClick={askQuestion} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="answer-section">
          <h3>Answer</h3>
          <p className="answer-text" style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
        </div>
      )}

      {!!sources.length && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 16, color: "var(--text-secondary)", fontFamily: "Outfit", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px 0" }}>Sources</h3>
          <div className="citation-container">
            {sources.map((source) => <CitationCard key={source.id} source={source} />)}
          </div>
        </div>
      )}
    </section>
  );
}
