import db from "../db/db.js";
import { randomUUID } from "crypto";

export function createParticipant({ sessionId, name }) {
  const participantId = randomUUID();

  db.prepare(`
    INSERT INTO participants (id, sessionId, name)
    VALUES (?, ?, ?)
  `).run(
    participantId,
    sessionId,
    name || null
  );

  return {
    participantId
  };
}

export function getParticipantsBySession(sessionId) {
  return db.prepare(`
    SELECT id, name, connected, createdAt
    FROM participants
    WHERE sessionId = ?
  `).all(sessionId);
}

export function updateParticipantName(id, name) {
  db.prepare(`
    UPDATE participants
    SET name = ?
    WHERE id = ?
  `).run(name, id);
}

export function removeParticipant(id) {
  db.prepare(`
    DELETE FROM participants
    WHERE id = ?
  `).run(id);
}
