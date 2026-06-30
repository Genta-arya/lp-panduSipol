// src/firebase.js atau path berkas firebase kamu
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. Tambahkan import ini

const firebaseConfig = {
  apiKey: "AIzaSyCSBKShPWiX5ZEEl65OB271NYIzEhDLorQ",
  authDomain: "informasisipol.firebaseapp.com",
  projectId: "informasisipol",
  storageBucket: "informasisipol.firebasestorage.app",
  messagingSenderId: "777532856564",
  appId: "1:777532856564:web:e3536ff92bfcf624bc66a1",
  measurementId: "G-G3470BD78H"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// 2. Inisialisasi dan Ekspor Firestore Database
export const db = getFirestore(app);

// 3. Ekspor Firebase Authentication (Spasi error pada 'ap p' sudah diperbaiki)
export const auth = getAuth(app);