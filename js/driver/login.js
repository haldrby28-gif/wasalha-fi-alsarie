import { auth, db } from "../firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {

    message.textContent = "";

    if (!email.value || !password.value) {

        message.textContent = "يرجى إدخال البريد وكلمة المرور";

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

            message.textContent = "هذا الحساب ليس حساب مندوب.";

            return;

        }

        await updateDoc(driverRef, {

            isOnline: true

        });

        window.location.href = "home.html";

    } catch (error) {

        message.textContent = "البريد أو كلمة المرور غير صحيحة.";

    }

});
