import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDKIEoV2OwzQXjk7Y0BbVWW1Udn1gAiCD0",
  authDomain: "admissons-52494.firebaseapp.com",
  projectId: "admissons-52494",
  storageBucket: "admissons-52494.firebasestorage.app",
  messagingSenderId: "665055956369",
  appId: "1:665055956369:web:5a73b0a45b4c7a318bde30",
  measurementId: "G-NCQLGEFKFD"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export { firebaseApp, auth, googleProvider }; 