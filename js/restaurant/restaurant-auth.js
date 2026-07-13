import { auth, db } from "../firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        try {

            const result = await signInWithEmailAndPassword(
                auth,
                email.value.trim(),
                password.value
            );

            const uid = result.user.uid;

            const q = query(
                collection(db, "restaurants"),
                where("ownerUid", "==", uid)
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {

                alert("هذا الحساب ليس صاحب مطعم.");

                await signOut(auth);

                return;

            }

            window.location.href = "home.html";

        } catch (error) {

            alert("البريد الإلكتروني أو كلمة المرور غير صحيحة.");

            console.error(error);

        }

    });

}

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const q = query(
        collection(db, "restaurants"),
        where("ownerUid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        await signOut(auth);

        alert("لا
