import { auth, db } from "../../js/firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function validateLogin() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
        return;
    }

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        const userSnap = await getDoc(doc(db, "users", user.uid));

        if (!userSnap.exists()) {
            alert("هذا الحساب غير موجود في قاعدة البيانات.");
            return;
        }

        const userData = userSnap.data();

        switch (userData.role) {

            case "admin":
                window.location.href = "../admin/admin-dashboard.html";
                break;

            case "restaurant":
                window.location.href = "../restaurant/restaurant-panel.html";
                break;

            case "driver":
                window.location.href = "../driver/driver-app.html";
                break;

            case "user":
                window.location.href = "home.html";
                break;

            default:
                alert("صلاحية المستخدم غير صحيحة.");
        }

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

document
    .getElementById("loginBtn")
    .addEventListener("click", validateLogin);
