import express from "express";
import { saveAnswers } from "../models/answer.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { participantId, score } = req.body;
  if (!participantId || !score) return res.status(400).json({ error: "participantId und score nötig" });

  try {
    saveAnswers(participantId, score);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Speichern fehlgeschlagen" });
  }
});

export default router;
