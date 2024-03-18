import { Request, Response, NextFunction } from 'express';
import Game from '../classes/gameInstance';
import db from '../models/sqlQueries';

type gameControllerType = {
  getGame: (req: Request, res: Response, next: NextFunction) => void;
  getWord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  checkWord: (req: Request, res: Response, next: NextFunction) => void;
  // getDefinition: (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => Promise<void>;
};

const currentGames: { [key: string]: Game } = {};

const gameController: gameControllerType = {
  /** start the game, or retreive previous progress if it exists, save it onto res.locals.game */
  async getGame(req: Request, res: Response, next: NextFunction) {
    // check cache/database of games
    const { sessionID } = req;
    // if game not found in cache, check database
    if (!currentGames[sessionID]) {
      const gameFromDB = await db.getGameState(sessionID);
      console.log(gameFromDB);
      currentGames[sessionID] = new Game(sessionID);
    }
    res.locals.game = currentGames[sessionID];
    // game for session is on res.locals
    return next();
  },

  /** retreive word and definitions */
  async getWord(req: Request, res: Response, next: NextFunction) {
    console.log(req.sessionID);
    const game = res.locals.game as Game;
    try {
      // game is on res.locals.game
      await game.fetchRandomWord();
      await game.checkDictionary();
      res.locals.getResponse = {
        word: game.word,
        definition: game.definition,
        audioURL: game.audioURL,
      };
      return next();
    } catch (err) {
      console.error(err);
    }
  },

  checkWord(req: Request, res: Response, next: NextFunction) {
    const { submittedWord } = req.body;
    const game = res.locals.game as Game;
    try {
      res.locals.checkResponse = game.checkWord(submittedWord);
      return next();
    } catch (err) {
      console.error(err);
    }
  },

  // /** retreive definition from m-w dictionary api */
  // async getDefinition(req: Request, res: Response, next: NextFunction) {
  //   const game = res.locals.game as Game;
  //   try {
  //     await game.checkDictionary();
  //     return next();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
};

export default gameController;
