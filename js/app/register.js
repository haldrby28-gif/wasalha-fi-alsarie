
import { auth, db } from "../firebase.js";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otp");

const sendBtn = document.getElementById("sendCodeBtn");
const registerBtn = document.getElementById("registerBtn");

const message = document.getElementById("message");

window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
        size: "normal"
    }
);

const appVerifier = window.recaptchaVerifier;

sendBtn.onclick = async () => {

    const phone = phoneInput.value.trim();

    if (phone === "") {
        message.innerText = "أدخل رقم الهاتف";
        return;
    }

    try {

        const confirmation = await signInWithPhoneNumber(
            auth,
            phone,
            appVerifier
        );

        window.confirmationResult = confirmation;

        otpInput.style.display = "block";
        registerBtn.style.display = "block";
        sendBtn.style.display = "none";

        message.innerText = "تم إرسال رمز التحقق.";

    } catch (e) {

        console.error(e);

        message.innerText = e.message;

    }

};

registerBtn.onclick = async () => {

    const code = otpInput.value.trim();

    if (code === "") {
        message.innerText = "أدخل رمز التحقق";
        return;
    }

    try {

        const result = await window.confirmationResult.confirm(code);

        const user = result.user;

        const ref = doc(db, "users", user.uid);

        const snap = await getDoc(ref);

        if (!snap.exists()) {

            await setDoc(ref, {

                uid: user.uid,

                name: nameInput.value.trim(),

                phone: user.phoneNumber,

                role: "customer",

                isActive: true,

                createdAt: serverTimestamp()

            });

        }

        message.innerText = "تم إنشاء الحساب";

        setTimeout(() => {

            window.location.href = "home.html";

        }, 1000);

    } catch (e) {

        console.error(e);

        message.innerText = "رمز التحقق غير صحيح";

    }

};
