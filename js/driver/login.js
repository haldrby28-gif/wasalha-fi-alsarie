import { auth, db } from "../firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

loginBtn.addEventListener("click", async () => {

    error.textContent = "";

    if (!email.value || !password.value) {
        error.textContent = "أدخل البريد الإلكتروني وكلمة المرور";
        return;
    }

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        const user = userCredential.user;

        const driverRef = doc(db, "drivers", user.uid);
        const driverSnap = await getDoc(driverRef);

        if (!driverSnap.exists()) {

            error.textContent = "هذا الحساب ليس حساب مندوب";

            return;

        }

        const driver = driverSnap.data();

        if (!driver.active) {

            error.textContent = "تم إيقاف هذا الحساب";

            return;

        }

        localStorage.setItem("driverId", user.uid);

        window.location.href = "home.html";

    } catch (err) {

        console.error(err);

        error.textContent = "البريد الإلكتروني أو كلمة المرور غير صحيحة";

    }

});
