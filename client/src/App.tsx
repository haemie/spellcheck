import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import JSConfetti from 'js-confetti';
const jsConfetti = new JSConfetti();

function App() {
  const [count, setCount] = useState(0);
  const [userID, setUserID] = useState(null);
  const [userForm, setUserForm] = useState('');
  const [wordForm, setWordForm] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [streak, setStreak] = useState(0);
  const [audioFile, setAudioFile] = useState('');
  const [previousGuesses, setPreviousGuesses] = useState<
    Array<{ [key: string]: number }>
  >([]);

  const divRef: React.RefObject<HTMLDivElement> = useRef(null);

  async function submitWord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/game/checkWord', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submittedWord: wordForm }),
      });
      const result = await response.json();
      console.log(result);
      if (!result.score) {
        setPreviousGuesses([]);
        setWordForm('');
        setStreak(result.streak);
        jsConfetti.addConfetti();
        // load new word
        getWord();
      } else {
        // do nothing else
        const wordinput = e.target as HTMLFormElement;
        (
          wordinput.elements.namedItem('wordInput') as HTMLInputElement
        ).select();
        const guessObj: { [key: string]: number } = {};
        guessObj[wordForm] = result.score as number;
        setPreviousGuesses([guessObj].concat(...previousGuesses));
      }
      document.body.style.backgroundColor = result.color;
      setTimeout(() => {
        document.body.style.backgroundColor = 'inherit';
      }, 500);

      console.log('submitted');
    } catch (err) {
      console.error(err);
    }
  }

  async function handleStart(e: FormEvent) {
    e.preventDefault();
    try {
      getWord();
    } catch (err) {
      console.error('failed to get word from server');
    }
  }

  async function getWord() {
    try {
      const response = await fetch('http://localhost:8000/game/getWord');
      const result = await response.json();
      console.log(result);
      setTargetWord(result.word);
      setDefinition(result.definition);
      setAudioFile(result.audioURL);
      console.log('setted word from server');
      // now read word?
      // check if official audio available
      if (result.audioURL) {
        const audio = new Audio(result.audioURL);
        audio.play();
      } else {
        const msg = new SpeechSynthesisUtterance();
        msg.text = result.word;
        window.speechSynthesis.speak(msg);
      }
    } catch (err) {
      console.error('failed to get word from server');
    }
  }

  function playbackWord() {
    if (audioFile) {
      const audio = new Audio(audioFile);
      audio.play();
    } else {
      const msg = new SpeechSynthesisUtterance();
      msg.text = targetWord;
      window.speechSynthesis.speak(msg);
    }
  }

  function playbackDefinition() {
    const msg = new SpeechSynthesisUtterance();
    msg.text = definition;
    window.speechSynthesis.speak(msg);
  }

  useEffect(() => {
    // console.log(wordForm);
    if ('speechSynthesis' in window) {
      // browser tts supported
    } else {
      // browser tts not supported
      alert("Sorry, your browser doesn't support text to speech!");
    }
  }, []);

  return (
    <>
      <h1>spellcheck</h1>
      <h2>streak: {streak}</h2>
      <div ref={divRef}>
        {targetWord ? (
          <>
            <form onSubmit={submitWord}>
              <input
                type="text"
                value={wordForm}
                name="wordInput"
                onChange={(e) => setWordForm(e.target.value)}
              />
              <input type="submit" value={'submit'} />
            </form>
            <input type="button" onClick={playbackWord} value="play word" />
            <input
              type="button"
              onClick={playbackDefinition}
              value="play definition"
            />
          </>
        ) : (
          <input type="button" onClick={handleStart} value="new word" />
        )}
      </div>
      <div className="previousGuesses">
        {previousGuesses.map((e) => {
          const [key, value] = Object.entries(e)[0];
          return (
            <div>
              {key} - {value}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
