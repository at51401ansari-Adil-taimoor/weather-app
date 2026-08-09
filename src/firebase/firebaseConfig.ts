import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAGtLHdsqnr5b4mihPvXt1hLCcme0Ku_DM',
  authDomain: 'weather-app-flyrank.firebaseapp.com',
  projectId: 'weather-app-flyrank',
  storageBucket: 'weather-app-flyrank.firebasestorage.app',
  messagingSenderId: '624493469606',
  appId: '1:624493469606:web:afd681f0b8b4bbcaa5f967',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
