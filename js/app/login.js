
// استيراد الإعدادات
import { auth } from "../firebase.js"; // تأكد من المسار الصحيح
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

// دالة تسجيل الدخول
async function handleLogin() {
    console.log("تم الضغط على الزر!"); // تظهر في Console
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

            alert("أهلاً بك يا " + userData.name);

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
            alert("خطأ: حسابك غير موجود في قاعدة بيانات الصلاحيات.");
        }
    } catch (error) {
        alert("خطأ في تسجيل الدخول: " + error.message);
    }
}

// ربط الزر بالجافاسكريبت (بدون الحاجة لـ onclick في الـ HTML)
document.addEventListener("DOMContentLoaded", () => {
    console.log("تم ربط الجافاسكريبت!"); // إذا ظهرت هذه في الـ Console، فالكود سليم
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", handleLogin);
    } else {
        alert("خطأ: الزر غير موجود في الصفحة (تأكد من id=loginBtn)");
    }
});
