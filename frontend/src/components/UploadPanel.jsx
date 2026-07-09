import { useState, useEffect } from "react";

export default function UploadPanel() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  async function fetchDocuments() {
    try {
      const res = await fetch("/api/upload/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function handleUpload() {
    if (!file) return setStatus("Choose a PDF or DOCX file first.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setStatus("Uploading and indexing document...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");
      setStatus(`${data.document} indexed successfully.`);
      fetchDocuments();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2>Upload Document</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "4px 0 0 0" }}>Supported formats: PDF and DOCX</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          className="input"
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="button" onClick={handleUpload} disabled={loading}>
          {loading ? "Indexing..." : "Upload"}
        </button>
      </div>

      {status && (
        <p style={{ 
          fontSize: 14, 
          margin: 0, 
          color: status.includes("failed") || status.includes("first") ? "#ef4444" : "var(--accent-primary)",
          background: "rgba(255, 255, 255, 0.02)",
          padding: 10,
          borderRadius: 8,
          border: "1px solid var(--border-color)"
        }}>
          {status}
        </p>
      )}

      {documents.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 16, marginTop: 8 }}>
          <h3 style={{ fontSize: 14, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0" }}>
            Indexed Documents ({documents.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {documents.map((doc, idx) => (
              <div key={idx} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.02)", 
                padding: "8px 12px", 
                borderRadius: 8,
                border: "1px solid var(--border-color)"
              }}>
                <span style={{ fontSize: 13, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "200px" }} title={doc.name}>
                  📄 {doc.name}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 4 }}>
                  {doc.chunks} chunks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
