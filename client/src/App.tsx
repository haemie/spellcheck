import { FormEvent, useEffect, useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [userID, setUserID] = useState(null);
  const [userForm, setUserForm] = useState('');
  const [wordForm, setWordForm] = useState('');
  const [targetWord, setTargetWord] = useState('');

  async function submitWord(e: FormEvent) {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/game/checkWord');
    const word = await response.json();
    console.log('submitted');
  }

  async function getWord(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/game/getWord');
      const word = await response.json();
      setTargetWord(word);
      console.log('setted word from server');
    } catch (err) {
      console.error('failed to get word from server');
    }
  }

  useEffect(() => {
    console.log(wordForm);
  });

  return (
    <>
      <h1>spellcheck</h1>
      <div>
        {targetWord ? (
          <form onSubmit={submitWord}>
            <input
              type="text"
              value={wordForm}
              onChange={(e) => setWordForm(e.target.value)}
            />
            <input type="submit" value={'submit'} />
          </form>
        ) : (
          <input type="button" onClick={getWord} value="new word" />
        )}
      </div>
    </>
  );
}

export default App;
