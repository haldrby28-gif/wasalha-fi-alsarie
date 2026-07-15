// js/app/login.js
import { auth } from "../../firebase/firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

/**
 * دالة تسجيل الدخول
 * يتم استدعاؤها عند الضغط على زر "دخول" في صفحة login.html
 */
window.validateLogin = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // التحقق البسيط من وجود البيانات
    if (!email || !password) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
        return;
    }

    try {
        // محاولة تسجيل الدخول عبر Firebase
        await signInWithEmailAndPassword(auth, email, password);
        
        // في حال نجاح الدخول
        alert("تم تسجيل الدخول بنجاح!");
        window.location.href = "home.html"; // تأكد من وجود ملف home.html في المجلد الرئيسي
    } catch (error) {
        // في حال فشل الدخول (خطأ في الإيميل أو الباسورد أو عدم التفعيل)
        console.error("خطأ في تسجيل الدخول:", error.message);
        alert("خطأ: تأكد من صحة البريد الإلكتروني وكلمة المرور.");
    }
};
