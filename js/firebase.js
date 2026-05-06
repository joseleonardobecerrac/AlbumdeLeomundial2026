// ══════════════════════════════════════════════════════════
// FIREBASE CONFIG — Álbum Mundial 2026
// ══════════════════════════════════════════════════════════
//
// PASOS PARA CONFIGURAR:
//
// 1. Ve a https://console.firebase.google.com
// 2. Proyecto: algum-mundial-2026
// 3. Habilita Authentication → Sign-in method:
//       - Google
//       - Email/Password
// 4. En Authentication → Settings → Authorized domains agrega:
//       - localhost
//       - tu dominio de GitHub Pages
//       - tu dominio personalizado, si tienes
// 5. Crea Firestore Database
// 6. Configura reglas de seguridad para albums, ranking y preferences
//
// ══════════════════════════════════════════════════════════

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAnalytics,
  isSupported
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── CONFIGURACIÓN FIREBASE DEL PROYECTO ───────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAHhIXlurMt4UIML3E2Ku8_cr8Uht9e8yc",
  authDomain: "algum-mundial-2026.firebaseapp.com",
  projectId: "algum-mundial-2026",
  storageBucket: "algum-mundial-2026.firebasestorage.app",
  messagingSenderId: "905949505139",
  appId: "1:905949505139:web:25a1b183edeaa72edb2c06",
  measurementId: "G-DWQGMBG0H0"
};
// ──────────────────────────────────────────────────────────

// Inicializar Firebase
const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const provider = new GoogleAuthProvider();

// Solicitar acceso al correo del usuario
provider.addScope('email');

// Forzar selección de cuenta cada vez que use Google
provider.setCustomParameters({
  prompt: 'select_account'
});

// Analytics seguro para navegador
let analytics = null;

// Exponer Firebase globalmente para que lo usen los demás archivos JS
window._firebase = {
  app,
  auth,
  db,
  provider,
  analytics,

  // Google Auth
  signInWithPopup,
  GoogleAuthProvider,

  // Auth general
  signOut,
  onAuthStateChanged,

  // Email / Password Auth
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,

  // Firestore
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc
};

// Activar Analytics solo si el navegador lo soporta
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      window._firebase.analytics = analytics;
      console.log('[Firebase] Analytics enabled');
    }
  })
  .catch((err) => {
    console.warn('[Firebase] Analytics not available:', err);
  });

console.log('[Firebase] Initialized:', firebaseConfig.projectId);
