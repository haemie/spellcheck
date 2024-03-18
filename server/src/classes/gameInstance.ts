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

  constructor(
    userid: string,
    streak?: number,
    score?: number,
    word?: string,
    definition?: string,
    audioURL?: string,
    sentence?: string
  ) {
    this.userid = userid;
    this.streak = streak || 0;
    this.score = score || 0;
    this.word = word;
    this.definition = definition;
    this.audioURL = audioURL;
    this.sentence = sentence;
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

  private setAudioURL(audioURL: string | undefined) {
    this.audioURL = audioURL;
  }

  public async checkDictionary() {
    try {
      console.log('checking dictionaryapi');
      if (this.word && this.definition) {
        const { definition, audioURL } = await checkMerriamWebster(
          this.word,
          this.definition
        );
        this.setDefinition(definition);
        this.setAudioURL(audioURL);
      }
      return this;
    } catch (err) {
      console.error(err);
    }
  }

  /**check submitted word argument against actual word */
  public checkWord(submittedWord: string) {
    // get a diff score for how close the submittedword is to this.word
    let diff = Infinity;
    let color = 'rgba(255, 0, 100, 0.5)';
    if (submittedWord === this.word) {
      this.streak += 1;
      this.score += 1;
      diff = 0;
      color = 'rgba(0, 255, 100, 0.5)';
    } else {
      this.streak = 0;
      // score the input based on levenshtein distance
      diff = calculateDiff(submittedWord, this.word!);
      const maxdiff = this.word!.length;
      // get color from red to green depending on how close diff/maxdiff is from 0 or 1
      color = calculateColor(diff / maxdiff);
    }
    return { diff, color, streak: this.streak, score: this.score };
  }

  /**
   * reset game after quit
   */
  public resetGame() {
    this.streak = 0;
    this.score = 0;
    this.word = null;
    this.definition = null;
    return this;
  }

  // public wordPlayback() {}

  // public sentencePlayback() {}
}
