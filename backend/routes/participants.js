import express from "express";
import db from "../db/db.js";
import { createParticipant } from "../models/participant.js";

const router = express.Router();

// Teilnehmer tritt Session bei
router.post("/join", (req, res) => {
  const { joinCode, name } = req.body;

  if (!joinCode) {
    return res.status(400).json({ error: "joinCode fehlt" });
  }

  const session = db.prepare(`
    SELECT id FROM sessions
    WHERE joinCode = ? AND status = 'active'
  `).get(joinCode.toUpperCase());

  if (!session) {
    return res.status(404).json({ error: "Session nicht gefunden" });
  }

  const participant = createParticipant({
    sessionId: session.id,
    name
  });

  res.json({
    participantId: participant.participantId,
    sessionId: session.id
  });
});

export default router;
