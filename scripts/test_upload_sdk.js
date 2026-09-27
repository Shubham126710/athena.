import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

const db = getFirestore(app);

async function testUpload() {
  try {
    const q = query(collection(db, 'notes'), limit(1));
    const docs = await getDocs(q);
    console.log("Firestore OK. Notes:", docs.size);
  } catch (err) {
    console.error("Firestore failed:", err);
  }
  process.exit(0);
}

testUpload();
