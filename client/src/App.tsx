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
  const [score, setScore] = useState(0);
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
        credentials: 'include',
        body: JSON.stringify({ submittedWord: wordForm }),
      });
      const result = await response.json();
      console.log(result);
      if (result.diff === 0) {
        setPreviousGuesses([]);
        setWordForm('');
        setScore(result.score);
        setStreak(result.streak);
        jsConfetti.addConfetti();
        // load new word
        getWord();
      } else {
        // select the text inside input
        const wordinput = e.target as HTMLFormElement;
        (
          wordinput.elements.namedItem('wordInput') as HTMLInputElement
        ).select();
        // add guess and how far off the guess was
        const guessObj: { [key: string]: number } = {};
        guessObj[wordForm] = result.diff as number;
        setPreviousGuesses([guessObj].concat(...previousGuesses));
        // reset streak to 0
        setStreak(result.streak);
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
      const response = await fetch('http://localhost:8000/game/getWord', {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      console.log(result);
      setTargetWord(result.word);
      setDefinition(result.definition);
      setAudioFile(result.audioURL);
      console.log(`got word`, result.word);
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

  async function handleQuit(e: FormEvent) {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/game/quit', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      // const result = await response.json();
      // console.log(result);

      setPreviousGuesses([]);
      setWordForm('');
      setStreak(0);
      setTargetWord('');

      console.log('quitted');
    } catch (err) {
      console.error(err);
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
      <h1 className="font-mono">spellcheck</h1>
      <h2>
        score: {score} | streak: {streak}
      </h2>
      <div ref={divRef}>
        {targetWord ? (
          <>
            <form id="wordForm" onSubmit={submitWord}>
              <div id="wordFormWrapper" className="flex flex-row mb-4">
                <div id="wordInputWrapper">
                  <input
                    type="text"
                    id="wordInput"
                    accessKey="i"
                    style={{
                      width: `${1.2 * targetWord.length}ch`,
                      backgroundColor: 'transparent',
                      background: `repeating-linear-gradient(90deg,
                        white 0, white 1ch,
                        transparent 0, transparent 1.2ch)
                        0 100%/ ${1.2 * targetWord.length}ch 2px no-repeat`,
                    }}
                    maxLength={targetWord.length}
                    value={wordForm}
                    name="wordInput"
                    onChange={(e) => setWordForm(e.target.value)}
                  />
                  <div id="underlines">{'_'.repeat(targetWord.length)}</div>
                </div>
                <input type="submit" id="submitButton" value={'check'} />
              </div>
              <div id="playbackWrapper" className="flex flex-row gap-1">
                <input
                  type="button"
                  accessKey="a"
                  id="playWordBtn"
                  onClick={playbackWord}
                  value="play word"
                />
                <input
                  type="button"
                  accessKey="s"
                  id="playDefBtn"
                  onClick={playbackDefinition}
                  value="play definition"
                />
              </div>
            </form>
          </>
        ) : (
          <input
            type="button"
            id="startBtn"
            onClick={handleStart}
            value="start"
          />
        )}
      </div>
      <div id="previousGuesses">
        {previousGuesses.map((e, i) => {
          const [key, value] = Object.entries(e)[0];
          return (
            <div key={`guess${i}`}>
              {key} : {value}
            </div>
          );
        })}
      </div>
      <input type="button" id="quitBtn" value="quit" onClick={handleQuit} />
    </>
  );
}

export default App;
