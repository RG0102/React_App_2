
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Storage

const firebaseConfig = {
  apiKey: "AIzaSyBcRXib9a1OcJhT7SQqxJ7dOcAutpZYPS4",
  authDomain: "shivconnect-6698b.firebaseapp.com",
  databaseURL: "https://shivconnect-6698b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shivconnect-6698b",
  storageBucket: "shivconnect-6698b.firebasestorage.app",
  messagingSenderId: "518045630567",
  appId: "1:518045630567:web:0ebbb8e6d533b4ea6994c2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = firestore; // Alias for Firestore instance
const storage = getStorage(app); // Initialize Storage

export { app, auth, firestore, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail };
