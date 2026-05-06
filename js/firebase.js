// ══════════════════════════════════════════════════════════
// FIREBASE CONFIG — Álbum Mundial 2026
// ══════════════════════════════════════════════════════════
//
// PASOS PARA CONFIGURAR:
//
// 1. Ve a https://console.firebase.google.com
// 2. Crea un proyecto (o usa uno existente)
// 3. Habilita Authentication → Sign-in method → Google → Activar
// 4. En Authentication → Settings → Authorized domains → Add domain:
//       - localhost
//       - tu-usuario.github.io
//       (OBLIGATORIO para que funcione en GitHub Pages)
// 5. Crea una base de datos Firestore (modo producción)
// 6. En Firestore → Rules → pega estas reglas:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /albums/{userId} {
//          allow read, write: if request.auth != null
//            && request.auth.uid == userId;
//        }
//        match /ranking/{userId} {
//          allow read: if request.auth != null;
//          allow write: if request.auth != null
//            && request.auth.uid == userId;
//        }
//        match /preferences/{userId} {
//          allow read, write: if request.auth != null
//            && request.auth.uid == userId;
//        }
//      }
//    }
//
// 7. En Project Settings → General → Your apps → Web app
//    copia el firebaseConfig de abajo y reemplaza los valores.
//
// ══════════════════════════════════════════════════════════

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, signInWithPopup, GoogleAuthProvider,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, onSnapshot,
  collection, query, where, getDocs, addDoc,
  deleteDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── REEMPLAZA ESTOS VALORES CON LOS DE TU PROYECTO ────────
const firebaseConfig = {
  apiKey:            "TU_API_KEY",
  authDomain:        "TU_PROYECTO.firebaseapp.com",
  projectId:         "TU_PROYECTO_ID",
  storageBucket:     "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId:             "TU_APP_ID"
};
// ──────────────────────────────────────────────────────────

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const provider = new GoogleAuthProvider();

// Request user's email scope
provider.addScope('email');
// Force account selection every time (allows switching accounts)
provider.setCustomParameters({ prompt: 'select_account' });

window._firebase = {
  auth, db, provider,
  signInWithPopup, signOut, onAuthStateChanged,
  doc, setDoc, getDoc, onSnapshot,
  collection, query, where, getDocs,
  addDoc, deleteDoc, updateDoc,
  GoogleAuthProvider
};

console.log('[Firebase] Initialized:', firebaseConfig.projectId);
