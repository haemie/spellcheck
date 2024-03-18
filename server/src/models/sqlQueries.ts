import { dbQuery } from './sqlConnection';

const db = {
  async getGameState(sessionid: string) {
    try {
      const querytext = `SELECT * FROM games WHERE userid = $1;`;
      const results = await dbQuery(querytext, [sessionid]);
      return results;
    } catch (err) {
      console.error('error caught in db.getGameState:', err);
    }
  },

  async initializeGameState(sessionid: string) {
    try {
      const querytext = `INSERT INTO games (userid, score, streak)
      VALUES ($1, $2, $3);`;
      const results = await dbQuery(querytext, [sessionid, 0, 0]);
      // console.log('asdfasdf');
      // console.log(results.rows);
      return results;
    } catch (err) {
      console.error('error caught initializing game state:', err);
    }
  },
};

export default db;
