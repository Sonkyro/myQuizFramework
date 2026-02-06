import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import answerRoutes from "./routes/answers.js";
import sessionRoutes from "./routes/sessions.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API-Routen
app.use("/answers", answerRoutes);
app.use("/sessions", sessionRoutes);

// WebSocket-Setup
const wss = new WebSocketServer({ noServer: true });
wss.on("connection", (ws) => {
  ws.on("message", (message) => console.log("WS Nachricht:", message.toString()));
});

const server = app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
