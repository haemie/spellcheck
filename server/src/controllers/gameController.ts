import { Request, Response, NextFunction } from 'express';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
dotenv.config();
const dictApiKey = process.env.DICTIONARY_API_KEY;

type gameControllerType = {
  streak: number;
  word: string | null | undefined;
  getWord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getDefinition: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
};

const gameController: gameControllerType = {
  streak: 0,
  word: undefined,

  /** retreive word from randomword.com */
  async getWord(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await fetch('https://randomword.com/');
      // console.log(data.json());
      const html = await data.text();
      const { document } = new JSDOM(html).window;
      const word = document.getElementById('random_word')?.textContent;
      console.log(word);
      res.locals.word = word;
      // this.word = word;
      return next();
    } catch (err) {
      console.error(err);
    }
  },

  /** retreive definition from m-w dictionary api */
  async getDefinition() {
    try {
      const data = await fetch(
        `https://dictionaryapi.com/api/v3/references/collegiate/json/${this.word}?key=${dictApiKey}`
      );
    } catch (err) {
      console.error(err);
    }
  },
};

export default gameController;

// export default class gameController {
//   public streak: number
//   public word: string | undefined

//   constructor() {
//     this.streak = 0;
//     this.word = undefined
//   }

//   public async getWord() {
//     const data = await fetch('https://randomword.com/');
//     const html = await data.json()
//     const parser = new DOMParser();
//     const dom = parser.parseFromString(html, 'text/html')
//     const word = dom.getElementById('random_word')
//     console.log(word)
//   }

//   public wordPlayback(){

//   }

//   public sentencePlayback() {

//   }

// }
