import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBAlFVebDml09v0Av9qBLrBss-Rz_m75xw",
    authDomain: "gym-tracker-app-3d6db.firebaseapp.com",
    projectId: "gym-tracker-app-3d6db",
    storageBucket: "gym-tracker-app-3d6db.firebasestorage.app",
    messagingSenderId: "284455478697",
    appId: "1:284455478697:web:550337a0a0214a0bde90b8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;