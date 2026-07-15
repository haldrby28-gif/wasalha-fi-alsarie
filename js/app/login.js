alert("login.js تم تحميله");
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const db = getFirestore();

// ربط الدالة بـ window مباشرة لتكون متاحة للـ HTML
window.validateLogin = async function() {
    console.log("تم استدعاء الدالة بنجاح!");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

            alert("أهلاً بك: " + userData.name);

            if (role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else if (role === "restaurant") {
                window.location.href = "restaurant-panel.html";
            } else if (role === "driver") {
                window.location.href = "driver-app.html";
            } else {
                window.location.href = "home.html";
            }
        } else {
            alert("خطأ: حسابك غير مسجل في قاعدة البيانات.");
        }
    } catch (error) {
        alert("خطأ: " + error.message);

       document.getElementById("loginBtn").addEventListener("click", validateLogin); 
    }
};
