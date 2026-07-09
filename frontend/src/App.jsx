import UploadPanel from "./components/UploadPanel.jsx";
import ChatBox from "./components/ChatBox.jsx";

export default function App() {
  return (
    <main className="app-shell">
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>InfraIQ</h1>
        <p style={{ color: "#4b5563", marginTop: 8 }}>
          Upload industrial documents and ask grounded questions with citations.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
        <UploadPanel />
        <ChatBox />
      </div>
    </main>
  );
}
