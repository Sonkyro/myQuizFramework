import express from "express";
import { createSession } from "../models/session.js";

const router = express.Router();

// Host erstellt Session
router.post("/", (req, res) => {
  const { quizId, settings } = req.body;

  if (!quizId) {
    return res.status(400).json({ error: "quizId fehlt" });
  }

  const session = createSession({ quizId, settings });

  res.json({
    sessionId: session.sessionId, // nur für Host
    joinCode: session.joinCode
  });
});

// get sessionID by code
router.get("/by-code/:code", (req, res) => {
  const { code } = req.params;

  const session = db.prepare(`
    SELECT id, quizId, settings
    FROM sessions
    WHERE joinCode = ? AND status = 'active'
  `).get(code.toUpperCase());

  if (!session) {
    return res.status(404).json({ error: "Session nicht gefunden" });
  }

  res.json({
    sessionId: session.id,
    quizId: session.quizId,
    settings: JSON.parse(session.settings || "{}")
  });
});


export default router;
