// firebase/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWsZP1x77VWX_AFCwboJH8vjZ5V8i0Vt0",
  authDomain: "wassalha-afe6b.firebaseapp.com",
  projectId: "wassalha-afe6b",
  storageBucket: "wassalha-afe6b.firebasestorage.app",
  messagingSenderId: "211540847218",
  appId: "1:211540847218:web:9de6442ee857b114db30eb",
  measurementId: "G-VD55WX7WW8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // نقوم بتصدير auth لاستخدامه في الصفحات
export const analytics = getAnalytics(app);
