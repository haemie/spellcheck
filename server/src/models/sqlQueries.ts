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
      // console.log(results.rows);
      return results;
    } catch (err) {
      console.error('error caught initializing game state:', err);
    }
  },

  async setGameState(
    sessionid: string,
    word: string,
    definition: string,
    audioURL: string | undefined
  ) {
    try {
      const querytext = `
      UPDATE games 
      SET word = $2, definition = $3, audioURL = $4
      WHERE userid = $1;`;
      const results = await dbQuery(querytext, [
        sessionid,
        word,
        definition,
        audioURL,
      ]);
      return results;
    } catch (err) {
      console.error('error caught in db.setGameState:', err);
    }
  },
};

export default db;
