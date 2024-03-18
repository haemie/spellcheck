import { pool } from './sqlConnection';

const gamesSetup = `CREATE TABLE IF NOT EXISTS games (
  userid TEXT PRIMARY KEY,
  streak INTEGER NOT NULL,
  score INTEGER NOT NULL,
  word TEXT,
  definition TEXT,
  audioURL TEXT,
  sentence TEXT
)`;

const sessionsSetup = `CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");`;

export async function initializeGamesDB() {
  console.log('initializing games db');
  await pool.query(gamesSetup);
}

export async function initializeSessionsDB() {
  console.log('initializing sessions db');
  await pool.query(sessionsSetup);
}
