import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "InfraIQ backend" });
});

app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`InfraIQ backend running on http://localhost:${PORT}`);
});
