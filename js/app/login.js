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

const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otp");

const sendCodeBtn = document.getElementById("sendCodeBtn");
const verifyBtn = document.getElementById("verifyBtn");

const message = document.getElementById("message");

// إنشاء reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal"
});

const appVerifier = window.recaptchaVerifier;

// إرسال رمز التحقق
sendCodeBtn.addEventListener("click", async () => {

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
        verifyBtn.style.display = "block";

        sendCodeBtn.style.display = "none";

        message.innerText = "تم إرسال رمز التحقق.";

    } catch (error) {

        console.error(error);

        message.innerText = error.message;

    }

});

// التحقق من الرمز
verifyBtn.addEventListener("click", async () => {

    const code = otpInput.value.trim();

    if (code === "") {
        message.innerText = "أدخل رمز التحقق";
        return;
    }

    try {

        const result = await window.confirmationResult.confirm(code);

        const user = result.user;

        // إنشاء حساب إذا لم يكن موجودًا
        const userRef = doc(db, "users", user.uid);

        const snap = await getDoc(userRef);

        if (!snap.exists()) {

            await setDoc(userRef, {

                uid: user.uid,

                phone: user.phoneNumber,

                role: "customer",

                createdAt: serverTimestamp()

            });

        }

        message.innerText = "تم تسجيل الدخول بنجاح";

        // الانتقال للصفحة الرئيسية
        window.location.href = "../app/home.html";

    } catch (error) {

        console.error(error);

        message.innerText = "رمز التحقق غير صحيح";

    }

});
