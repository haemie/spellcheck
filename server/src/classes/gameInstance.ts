import {
  randomwordService,
  checkMerriamWebster,
} from '../services/wordServices';
import { calculateDiff, calculateColor } from '../helper/scoreCalculations';

export default class Game {
  public userid: string;
  public streak: number;
  public score: number;
  public word: string | null | undefined;
  public definition: string | null | undefined;
  public audioURL: string | undefined;
  public sentence: string | undefined;

  constructor(userid: string) {
    this.userid = userid;
    this.streak = 0;
    this.score = 0;
    this.word = undefined;
    this.definition = undefined;
    this.audioURL = undefined;
    this.sentence = undefined;
  }

  /**
   * retreive word from randomword.com
   * @returns modified game instance holding new word and definition
   */
  public async fetchRandomWord() {
    try {
      const { word, definition } = await randomwordService();
      if (word && definition) {
        this.setWord(word);
        this.setDefinition(definition);
        return this;
      }
    } catch (err) {
      this.setWord(null);
      this.setDefinition(null);
      console.error(err);
      return this;
    }
  }

  private setWord(word: string | null) {
    this.word = word;
  }

  private setDefinition(definition: string | null) {
    this.definition = definition;
  }

  public async checkDictionary() {
    try {
      console.log('checking dictionaryapi');
      if (this.word && this.definition) {
        const { definition, audioURL } = await checkMerriamWebster(
          this.word,
          this.definition
        );
      }

      return this;
    } catch (err) {
      console.error(err);
    }
  }

  /**check submitted word argument against actual word */
  public checkWord(submittedWord: string) {
    // get a score for how close the submittedword is to this.word
    let score = Infinity;
    let color = 'rgba(255, 0, 100, 0.5)';
    if (submittedWord === this.word) {
      this.streak += 1;
      score = 0;
      color = 'rgba(0, 255, 100, 0.5)';
    } else {
      // score the input based on levenshtein distance
      score = calculateDiff(submittedWord, this.word!);
      const maxdiff = this.word!.length;
      // get color from red to green depending on how close diff/maxdiff is from 0 or 1
      color = calculateColor(score / maxdiff);
    }
    return { score, color, streak: this.streak };
  }

  // public wordPlayback() {}

  // public sentencePlayback() {}
}
