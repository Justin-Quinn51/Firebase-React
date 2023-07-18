import { useState, useEffect } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth, storage } from './config/firebase';
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewOscarWinner, setIsNewOscarWinner] = useState(false);

  // Update Title State
  const [updatedTitle, setUpdatedTitle] = useState('');

  // File Upload State
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, 'movies');

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, 'movies', id);
      await deleteDoc(movieDoc);
    } catch (error) {
      console.error(error);
    }
  };

  const updateMovieTitle = async (id) => {
    try {
      const movieDoc = doc(db, 'movies', id);
      await updateDoc(movieDoc, { title: updatedTitle });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getMovieList = async () => {
      // READ THE DATA
      // SET THE MOVIELIST
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovieList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getMovieList();
  }, [moviesCollectionRef]);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedOscar: isNewOscarWinner,
        userId: auth?.currentUser?.uid,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='App'>
      <Auth />

      <div>
        <input
          placeholder='Movie title....'
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder='Release Date....'
          type='number'
          onChange={(e) => Number(setNewReleaseDate(e.target.value))}
        />
        <input
          type='checkbox'
          onChange={(e) => setIsNewOscarWinner(e.target.checked)}
          checked={isNewOscarWinner}
        />
        <label htmlFor=''>Received An Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div className='movieInfo'>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedOscar ? 'green' : 'red' }}>
              {movie.title}
            </h1>
            <p> Date: {movie.releaseDate} </p>

            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input
              placeholder='New Movie Title'
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update Title
            </button>
          </div>
        ))}
      </div>

      <div className='upload'>
        <input type='file' onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
