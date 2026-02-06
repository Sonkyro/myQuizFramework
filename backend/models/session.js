import db from "../db/db.js";
import { randomUUID } from "crypto";
import { generateJoinCode } from "../utils/generateJoinCode.js";

export function createSession({ quizId, settings }) {
  let joinCode;
  let exists = true;

  while (exists) {
    joinCode = generateJoinCode();
    const found = db
      .prepare("SELECT 1 FROM sessions WHERE joinCode = ? AND status = 'active'")
      .get(joinCode);
    exists = !!found;
  }

  const sessionId = randomUUID();

  db.prepare(`
    INSERT INTO sessions (id, joinCode, quizId, settings)
    VALUES (?, ?, ?, ?)
  `).run(
    sessionId,
    joinCode,
    quizId,
    JSON.stringify(settings || {})
  );

  return {
    sessionId,
    joinCode
  };
}
