// firebaseConfig.ts
import { initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";                      // ← Web SDK
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: 'AIzaSyB91UEqTJVnNcg8Jsy0_6FsvqG9A6irEkE',
  authDomain: 'communitychat-f3fb0.firebaseapp.com',
  projectId: 'communitychat-f3fb0',
  storageBucket: 'communitychat-f3fb0.appspot.com',
  messagingSenderId: '975021405125',
  appId: '1:975021405125:web:9560540eb3d567dfad91ac',
  measurementId: 'G-311RJN9VQ9',
};

let app: FirebaseApp;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

// DOM persistence (memory only)—we’ll manually refresh tokens below
export const auth = getAuth(app);

// Force Firestore into long‑polling on RN
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const storage = getStorage(app);
export const functions = getFunctions(app);
