import { pool } from './sqlConnection';

const query = `CREATE TABLE IF NOT EXISTS games (
  userid TEXT PRIMARY KEY,
  streak INTEGER NOT NULL,
  score INTEGER NOT NULL,
  word TEXT,
  definition TEXT,
  audioURL TEXT,
  sentence TEXT
)`;

export async function initializeDB() {
  console.log('initializing db');
  await pool.query(query);
}
