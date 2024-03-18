import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
dotenv.config();
const dictApiKey = process.env.DICTIONARY_API_KEY;

/**
 *
 * @returns object containing word and definition from randomword.com
 */
export async function randomwordService() {
  try {
    const data = await fetch('https://randomword.com/');
    const html = await data.text();
    const { document } = new JSDOM(html).window;
    const word = document.getElementById('random_word')?.textContent;
    const definition = document.getElementById(
      'random_word_definition'
    )?.textContent;
    return { word, definition };
  } catch (err) {
    console.error(err);
    return { word: null, definition: null };
  }
}

/**
 *
 * @param word current word
 * @param definition current definition
 * @param audioURL current audio url
 * @returns definition and audioURL from MW if available
 */
export async function checkMerriamWebster(
  word: string,
  definition: string,
  audioURL?: string
) {
  try {
    console.log('checking dictionaryapi');
    const data = await fetch(
      `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${dictApiKey}`
    );
    const dictionary = await data.json();
    if (!dictionary[0].meta) {
      console.log('no entry found in dictionary');
      audioURL = undefined;
    } else {
      const dictionaryEntry = dictionary[0];
      // getting shortdef
      definition = dictionaryEntry?.shortdef || definition;
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
        audioURL = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audiofile}.mp3`;
      }
      console.log(definition);
      console.log(audioURL);
    }
    return { definition, audioURL };
  } catch (err) {
    console.error(err);
    return { definition, audioURL };
  }
}
