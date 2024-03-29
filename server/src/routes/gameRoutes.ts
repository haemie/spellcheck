import express from 'express';
import gameController from '../controllers/gameController';

const router = express.Router();

// requested to get a word
// start game should use userid, either get or start a game instance, then get word
// after game is started, should be able to get more words

router.get(
  '/getWord',
  // start game instance or get game instance by using userid, save game to res.locals
  gameController.getGame,
  // with the game on res.locals, now call api to get word to save to game instance
  gameController.getWord,
  (req, res) => {
    // console.log(res.locals);
    return res.status(200).json(res.locals.getResponse);
  }
);

router.post(
  '/checkWord',
  gameController.getGame,
  gameController.checkWord,
  (req, res) => {
    // console.log(res.locals.checkResponse);
    return res.status(200).json(res.locals.checkResponse);
  }
);

router.post(
  '/quit',
  gameController.getGame,
  gameController.quitGame,
  (req, res) => {
    // console.log(res.locals.checkResponse);
    return res.status(200).json(res.locals.checkResponse);
  }
);

// router.get(
//   '/getDefinition',
//   gameController.getGame,
//   gameController.getDefinition,
//   (req, res) => {
//     return res.status(200).json(res.locals.game.definition);
//   }
// );

export default router;
