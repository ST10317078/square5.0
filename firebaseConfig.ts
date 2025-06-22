// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyB91UEqTJVnNcg8Jsy0_6FsvqG9A6irEkE",
    authDomain: "communitychat-f3fb0.firebaseapp.com",
    projectId: "communitychat-f3fb0",
    storageBucket: "communitychat-f3fb0.firebasestorage.app",
    messagingSenderId: "975021405125",
    appId: "1:975021405125:web:9560540eb3d567dfad91ac",
    measurementId: "G-311RJN9VQ9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
