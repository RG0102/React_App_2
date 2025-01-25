import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVPW9BJfmT5uZRiEewGbK9pR6ZBfr2rpQ",
  authDomain: "elderlyconnect-9b5fa.firebaseapp.com",
  projectId: "elderlyconnect-9b5fa",
  storageBucket: "elderlyconnect-9b5fa.firebasestorage.app",
  messagingSenderId: "40817712695",
  appId: "1:40817712695:web:e311cff3f60ea8a4d8a9b2",
  measurementId: "G-ZTKG9FT86E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Export the Firebase functions
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, firestore };
