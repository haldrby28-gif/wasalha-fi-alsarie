import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("تم تسجيل الدخول بنجاح");
        window.location.href = "home.html";
      })
      .catch((error) => {
        alert(error.message);
      });

  });
      }
