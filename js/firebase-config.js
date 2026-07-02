// Firebase SDK Initialization - Realtime Database (No Billing Required)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, GoogleAuthProvider, signInWithPopup, updatePassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, push, update, remove, onValue, query, orderByChild, equalTo, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ── Hardcoded Firebase Config (Production) ──────────────────────────────────
const DEFAULT_CONFIG = {
  apiKey: "AIzaSyCcEJ7uPH9QjwtsQ9PHNLRu6YFW50TuNyw",
  authDomain: "mydatabase-3940e.firebaseapp.com",
  databaseURL: "https://mydatabase-3940e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mydatabase-3940e",
  appId: "1:778307236083:web:f203436558e6947a424786"
};

// Load config — localStorage overrides default (for local dev)
function getFirebaseConfig() {
  try {
    const stored = localStorage.getItem('firebase_config');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.apiKey && parsed.databaseURL) return parsed;
    }
  } catch (e) {}
  return DEFAULT_CONFIG;
}

function isFirebaseConfigured() {
  return true; // Always configured via hardcoded default
}

let app, auth, db;

try {
  app = initializeApp(getFirebaseConfig());
  auth = getAuth(app);
  db = getDatabase(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// Helper: convert RTDB snapshot object to array
function snapshotToArray(snapshot) {
  if (!snapshot.exists()) return [];
  const val = snapshot.val();
  return Object.entries(val).map(([id, data]) => ({ id, ...data }));
}

export {
  app, auth, db,
  isFirebaseConfigured,
  snapshotToArray,
  // Realtime Database functions
  ref, set, get, push, update, remove, onValue, query, orderByChild, equalTo, off,
  // Auth functions
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, updateProfile, GoogleAuthProvider, signInWithPopup, updatePassword
};
