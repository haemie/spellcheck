import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
dotenv.config();
const dictApiKey = process.env.DICTIONARY_API_KEY;
import { calculateDiff, calculateColor } from '../helper/levenshteinDist';

export default class Game {
  public userid: string;
  public streak: number;
  public word: string | null | undefined;
  public definition: string | null | undefined;
  public audioURL: string | undefined;
  public sentence: string | undefined;

  constructor(userid: string) {
    this.userid = userid;
    this.streak = 0;
    this.word = undefined;
    this.definition = undefined;
    this.audioURL = undefined;
    this.sentence = undefined;
  }

  /** retreive word from randomword.com */
  public async getWord() {
    try {
      const data = await fetch('https://randomword.com/');
      // console.log(data.json());
      const html = await data.text();
      const { document } = new JSDOM(html).window;
      const word = document.getElementById('random_word')?.textContent;
      const definition = document.getElementById(
        'random_word_definition'
      )?.textContent;
      this.word = word;
      this.definition = definition;
      return this;
    } catch (err) {
      console.error(err);
    }
  }

  public async checkDictionary() {
    try {
      console.log('checking dictionaryapi');
      const data = await fetch(
        `https://dictionaryapi.com/api/v3/references/collegiate/json/${this.word}?key=${dictApiKey}`
      );
      const dictionary = await data.json();
      if (!dictionary[0].meta) {
        console.log('no entry found in dictionary');
      } else {
        const dictionaryEntry = dictionary[0];
        // getting shortdef
        this.definition = dictionaryEntry?.shortdef || this.definition;
        // getting example sentence
        // this.sentence = dictionaryEntry?.def[0]?.sseq[0][0][1]
        // getting audiofile
        const audiofile: string = dictionaryEntry.hwi?.prs[0]?.sound?.audio;
        let subdirectory;
        if (audiofile) {
          if (audiofile.substring(0, 3) === 'bix') {
            subdirectory = 'bix';
          } else if (audiofile.substring(0, 2) === 'gg') {
            subdirectory = 'gg';
          } else if (/^[a-zA-Z]/.test(audiofile)) {
            subdirectory = audiofile[0];
          } else {
            subdirectory = 'number';
          }
          // set audioURL
          this.audioURL = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audiofile}.mp3`;
        }
        console.log(this.definition);
        console.log(this.audioURL);
      }
      return this;
    } catch (err) {
      console.error(err);
    }
  }

  /**check submitted word argument against actual word */
  public checkWord(submittedWord: string) {
    // get a score for how close the submittedword is to this.word
    let correct = false;
    let color = 'rgba(255, 0, 100, 0.5)';
    if (submittedWord === this.word) {
      this.streak += 1;
      correct = true;
      color = 'rgba(0, 255, 100, 0.5)';
    } else {
      // score the input based on levenshtein distance
      const diff = calculateDiff(submittedWord, this.word!);
      const maxdiff = this.word!.length;
      // get color from red to green depending on how close diff/maxdiff is from 0 or 1
      correct = false;
      color = calculateColor(diff / maxdiff);
    }
    return { correct, color, streak: this.streak };
  }

  // public wordPlayback() {}

  // public sentencePlayback() {}
}
