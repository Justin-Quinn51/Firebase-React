import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAPrzQgZstSfSDoPwFytluyO0zvh1vd8LA',
  authDomain: 'fir-react-a75ff.firebaseapp.com',
  projectId: 'fir-react-a75ff',
  storageBucket: 'fir-react-a75ff.appspot.com',
  messagingSenderId: '137660200897',
  appId: '1:137660200897:web:59a361d36ee50a23ad6140',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
