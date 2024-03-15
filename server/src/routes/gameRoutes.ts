import express from 'express';
import gameController from '../controllers/gameController';

const router = express.Router();

// requested to get a word
router.get('/getWord', gameController.getWord, (req, res) => {
  // console.log(res.locals);
  return res.status(200).json(res.locals.word);
});

// router.get('/getDefinition', gameController.get)

export default router;
