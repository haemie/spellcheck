import { Request, Response, NextFunction } from 'express';
import Game from '../classes/gameInstance';
import db from '../models/sqlQueries';

type gameControllerType = {
  getGame: (req: Request, res: Response, next: NextFunction) => void;
  getWord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  checkWord: (req: Request, res: Response, next: NextFunction) => void;
  quitGame: (req: Request, res: Response, next: NextFunction) => void;

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
    try {
      // console.log('getting game in getgame controller');
      // destructire sessionID from req
      const { sessionID } = req;
      // check cache of games
      // if game not found in cache, check database
      if (!currentGames[sessionID]) {
        console.log('game not found in currentgames, checking database');
        const gameFromDB = await db.getGameState(sessionID);
        // if game not found in database, create a new gamestate
        if (gameFromDB?.rows.length === 0) {
          console.log('game not found in database, creating new entry');
          // initialize gamestate
          db.initializeGameState(sessionID);
          // add new game to cache
          currentGames[sessionID] = new Game(sessionID);
          // console.log(currentGames);
        } else {
          console.log('game found in database, retreiving and creating class');
          // game found in database, create game with retrieved values
          const {
            userid,
            streak,
            score,
            word,
            definition,
            audiourl,
            sentence,
          } = gameFromDB?.rows[0];
          currentGames[sessionID] = new Game(
            userid,
            streak,
            score,
            word,
            definition,
            audiourl,
            sentence
          );
          // console.log(gameFromDB?.rows);
        }
      }
      // game for session onto res.locals
      res.locals.game = currentGames[sessionID];
      return next();
    } catch (err) {
      console.log('error caught in getGame controller');
      console.error(err);
      return next(err);
    }
  },

  /** retreive word and definitions */
  async getWord(req: Request, res: Response, next: NextFunction) {
    // console.log('getting word in getword controller');
    const { sessionID } = req;
    console.log('sessionID:', sessionID);
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
      if (game.word && game.definition) {
        db.setGameState(game.userid, game.word, game.definition, game.audioURL);
      }
      return next();
    } catch (err) {
      console.log('error caught in getWord controller');
      console.error(err);
      return next(err);
    }
  },

  checkWord(req: Request, res: Response, next: NextFunction) {
    const { submittedWord } = req.body;
    const game = res.locals.game as Game;
    console.log(game);
    try {
      res.locals.checkResponse = game.checkWord(submittedWord);
      return next();
    } catch (err) {
      console.log('error caught in checkword controller');
      console.error(err);
      return next(err);
    }
  },

  async quitGame(req: Request, res: Response, next: NextFunction) {
    try {
      const game = res.locals.game as Game;
      game.resetGame();
      return next();
    } catch (err) {
      console.log('error caught in quitgame controller');
      console.error(err);
      return next(err);
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
