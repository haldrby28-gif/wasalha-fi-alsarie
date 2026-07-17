// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWsZP1x77VWX_AFCwboJH8vjZ5V8i0Vt0",
  authDomain: "wassalha-afe6b.firebaseapp.com",
  projectId: "wassalha-afe6b",
  storageBucket: "wassalha-afe6b.firebasestorage.app",
  messagingSenderId: "211540847218",
  appId: "1:211540847218:web:b22b25792baff28adb30eb",
  measurementId: "G-K0MBK3NSEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export Services
export { app, auth, db };
