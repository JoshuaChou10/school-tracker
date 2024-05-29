import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import '../app/globals.css'
export default function Notes() {

  const [notes, setNotes] = useState<{ id: string; title: string; content: string }[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [goal, setGoal]=useState<number|null>(null)
  const [goalReached, setGoalReached] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
  }, []);
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  useEffect(() => {
    if (goal !== null && seconds >= goal * 60) {
      setGoalReached(true);
    }
  }, [seconds, goal]);
  function addNote() {
    const newNotes = [...notes, { id: crypto.randomUUID(), title: title, content: content }];
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
    setTitle('');
    setContent('');
  }

  function deleteNote(id: string) {
   
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
    
  }

  function editNote(id: string) {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    }
    deleteNote(id);
  }
  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  const formatTime = (seconds: number) => {
    const getMinutes = `0${Math.floor(seconds / 60)}`.slice(-2);
    const getSeconds = `0${seconds % 60}`.slice(-2);
    return `${getMinutes}:${getSeconds}`;
  };
  return (
    <div className="p-4 bg-black min-h-screen">

      
      <Head>
        <title>Scholar - Notes</title>
      </Head>
      <Link className='text-white text-xl flex items-center mb-4' href="/">
        <i className="fas fa-home"></i> 
      </Link>
      <div className='flex items-center justify-center'>
          <Image
            src="/logo.png"
            alt="Home Logo"
            width={200} // Set the desired width
            height={120} // Set the desired height
            layout="fixed" // This can be responsive or fill as needed
          />
        </div>
      <h2 className="text-white text-2xl mb-4">Notes</h2>
      <b className="text-white">Add Note:</b>
      <div className="flex flex-col space-y-2 mt-2 mb-4">
        <input
          required
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <input
          required
          type="text"
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={addNote}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Note
        </button>
      </div>

      <ul className="space-y-2 list-none">
        {notes.map(({ id, title, content }) => (
          <li key={id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-gray-300">{content}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => editNote(id)} className="text-yellow-400 hover:text-yellow-600">
                <i className="fas fa-edit"></i>
                </button>
                <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this note?')) {
                    deleteNote(id);
                  }
                }}
                className="text-red-400 hover:text-red-600"
              >
                <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <h2 className="text-white text-2xl mb-4">Study Timer</h2>
        <div className="flex flex-col items-center">
          <div className="text-4xl text-white mb-4">{formatTime(seconds)}</div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Set goal (minutes)"
              value={goal !== null ? goal : ''}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
             {goalReached && <div className="text-green-500 text-4xl mt-4">Goal reached!</div>}
          </div>
          <div className="flex space-x-4">
            <button onClick={toggle} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={reset} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
              Reset
            </button>
          </div>
         
        </div>
      </div>
    </div>
    
  );
}
