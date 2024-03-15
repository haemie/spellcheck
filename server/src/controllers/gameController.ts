import { Request, Response, NextFunction } from 'express';
import Game from '../classes/gameInstance';

type gameControllerType = {
  getGame: (req: Request, res: Response, next: NextFunction) => void;
  getWord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getDefinition: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
};

const currentGames: { [key: string]: Game } = {};

const gameController: gameControllerType = {
  /** start the game, or retreive previous progress if it exists, save it onto res.locals.game */
  getGame(req: Request, res: Response, next: NextFunction) {
    // check cache/database of games
    const { userid } = req.body;
    if (!currentGames[userid]) {
      currentGames[userid] = new Game(userid);
    }
    res.locals.game = currentGames[userid];
    // game for session is on res.locals
    return next();
  },

  /** retreive word and definitions */
  async getWord(req: Request, res: Response, next: NextFunction) {
    const game = res.locals.game as Game;
    try {
      // game is on res.locals.game
      await game.getWord();
      await game.checkDictionary();
      return next();
    } catch (err) {
      console.error(err);
    }
  },

  /** retreive definition from m-w dictionary api */
  async getDefinition(req: Request, res: Response, next: NextFunction) {
    const game = res.locals.game as Game;
    try {
      await game.checkDictionary();
      return next();
    } catch (err) {
      console.error(err);
    }
  },
};

export default gameController;
