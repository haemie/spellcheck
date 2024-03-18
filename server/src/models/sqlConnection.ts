import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const SQL_URI = process.env.SQL_URI;

export const pool = new Pool({
  connectionString: SQL_URI,
});

export function dbQuery(
  text: string,
  params: Array<any>,
  callback: (err: Error, result: any) => void
) {
  console.log('executing query', text);
  return pool.query(text, params, callback);
}
