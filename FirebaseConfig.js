import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { browserLocalPersistence, getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyBElspFbNHAmSuVJor7v9PzgGR__p5ZcXQ",
  authDomain: "travel-7d0f7.firebaseapp.com",
  projectId: "travel-7d0f7",
  storageBucket: "travel-7d0f7.appspot.com",
  messagingSenderId: "1060014546535",
  appId: "1:1060014546535:web:d4ae77141e7f64db147ec2",
  measurementId: "G-P53VJ8VJCQ"
};

// Sjekker om appen kjører i et web-miljø
const isRunningOnWeb = typeof window !== 'undefined' && window.document;

// Velger riktig persistence basert på miljøet
const selectedPersistence = isRunningOnWeb
  ? browserLocalPersistence
  // Kaster en warning som ikke stemmer pga bug i TypeScript
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  : getReactNativePersistence(ReactNativeAsyncStorage);


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const storage = getStorage(app);


const database = getDatabase(app);

// Initialiserer Firebase Auth med riktig persistence
const auth = initializeAuth(app, {
  persistence: selectedPersistence
});

export { app, db, database, storage, auth };
