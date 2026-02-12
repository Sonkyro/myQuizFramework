import express from "express";
import db from "../db/db.js";
import { createSession } from "../models/session.js";

const router = express.Router();

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

router.get("/:id/participants", (req, res) => {
  const sessionId = req.params.id;

  // 1. Teilnehmer, die verbunden sind
  const connected = db.prepare(
    `SELECT * FROM participants WHERE connectedTo = ?`
  ).all(sessionId);

  // 2. Teilnehmer, die Antworten in dieser Session haben, aber nicht verbunden
  const answeredButNotConnected = db.prepare(
    `SELECT p.* FROM participants p
     JOIN answers a ON p.id = a.participantId
     WHERE a.sessionId = ? AND (p.connectedTo IS NULL OR p.connectedTo != ?)`
  ).all(sessionId, sessionId);
  res.json({ connected, answeredButNotConnected });
});

router.get("/:id", (req, res) => {
  const sessionId = req.params.id;
  const sessionData = db.prepare(
    `SELECT * FROM sessions WHERE id = ?`
  ).all(sessionId);
  console.log(sessionData);
  res.json({ sessionData });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { status, settings } = req.body;

  const session = db.prepare("SELECT settings FROM sessions WHERE id = ?").get(id);
  if (!session) return res.status(404).json({ error: "Session nicht gefunden" });

  // Settings aktualisieren, nur Felder, die übergeben wurden
  let newSettings = JSON.parse(session.settings || "{}");
  if (settings) {
    newSettings = { ...newSettings, ...settings };
  }

  db.prepare(`
    UPDATE sessions
    SET status = COALESCE(?, status),
        settings = ?
    WHERE id = ?
  `).run(status || null, JSON.stringify(newSettings), id);

  res.json({ success: true });
});

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


router.get("/", (req, res) => {
  const sessions = db.prepare(`
    SELECT id, joinCode, quizId, status, settings
    FROM sessions
    ORDER BY createdAt DESC
  `).all();

  // settings als JSON parsen
  const parsed = sessions.map(s => ({
    ...s,
    settings: JSON.parse(s.settings || "{}")
  }));

  res.json(parsed);
});

export default router;
