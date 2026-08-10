import '@testing-library/jest-dom';
jest.mock('./firebase/firebaseConfig', () => ({
  auth: {},
  db: {},
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, callback: (user: null) => void) => {
    callback(null);
    return jest.fn();
  },
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
}));
