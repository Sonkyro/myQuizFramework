import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "backend", "quiz.db");
const db = new Database(dbPath);

// Tabellen erstellen
db.prepare(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,              -- UUID
    joinCode TEXT UNIQUE NOT NULL,     -- z.B. ABCDEF
    quizId TEXT NOT NULL,
    status TEXT DEFAULT 'active',      -- active | finished | archived
    settings TEXT,                     -- JSON (sync/async, etc.)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,          -- UUID
    sessionId TEXT NOT NULL,
    name TEXT,
    connected INTEGER DEFAULT 1,  -- WS-Status
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId INTEGER,
    participantId TEXT,
    questionId INTEGER,
    userAnswer TEXT,
    correct INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

export default db;
