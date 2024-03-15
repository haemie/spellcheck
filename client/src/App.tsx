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
  const divRef: React.RefObject<HTMLDivElement> = useRef(null);

  async function submitWord(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/game/checkWord', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submittedWord: wordForm }),
      });
      const result: string | number = await response.json();
      if (result !== 1) {
        jsConfetti.addConfetti();
        document.body.style.backgroundColor = result as string;
        setTimeout(() => {
          document.body.style.backgroundColor = 'inherit';
        }, 500);
      }
      console.log('submitted');
    } catch (err) {
      console.error(err);
    }
  }

  async function getWord(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/game/getWord');
      const word = await response.json();
      setTargetWord(word);
      console.log('setted word from server');
      // now read word?
      const msg = new SpeechSynthesisUtterance();
      msg.text = word;
      window.speechSynthesis.speak(msg);
    } catch (err) {
      console.error('failed to get word from server');
    }
  }

  function playbackWord() {
    const msg = new SpeechSynthesisUtterance();
    msg.text = targetWord;
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
      <div ref={divRef}>
        {targetWord ? (
          <>
            {' '}
            <form onSubmit={submitWord}>
              <input
                type="text"
                value={wordForm}
                onChange={(e) => setWordForm(e.target.value)}
              />
              <input type="submit" value={'submit'} />
            </form>
            <input type="button" onClick={playbackWord} value="play word" />
          </>
        ) : (
          <input type="button" onClick={getWord} value="new word" />
        )}
      </div>
    </>
  );
}

export default App;
