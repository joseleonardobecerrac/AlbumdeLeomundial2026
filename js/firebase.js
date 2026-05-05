// ── FIREBASE CONFIG ──
// Replace apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

  // ── FIREBASE CONFIG ── Replace with your own project config
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  window._firebase = { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged,
    doc, setDoc, getDoc, onSnapshot, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, GoogleAuthProvider };