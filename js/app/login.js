// js/app/login.js
import { auth } from "../../firebase/firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const db = getFirestore();

window.validateLogin = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // 1. تسجيل الدخول
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. جلب بيانات المستخدم من مجموعة users بناءً على الـ UID الخاص به
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

            // كود التتبع (لنعرف ماذا يحدث في الخلفية)
            console.log("تم تسجيل الدخول بنجاح.");
            console.log("بيانات المستخدم:", userData);
            console.log("الدور (Role) الموجود هو:", role);

            alert("أهلاً بك: " + userData.name);

            // 3. التوجيه بناءً على الصلاحية (Role)
            // ملاحظة: تأكد أن القيمة في Firestore مطابقة تماماً (مثلاً "admin" وليس "Admin")
            if (role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else if (role === "restaurant") {
                window.location.href = "restaurant-panel.html";
            } else if (role === "driver") {
                window.location.href = "driver-app.html";
            } else {
                console.log("الدور غير معروف، سيتم التوجيه لصفحة العميل.");
                window.location.href = "home.html";
            }
        } else {
            console.error("خطأ: المستند غير موجود في مجموعة users لهذا الـ UID");
            alert("خطأ: حسابك غير مسجل في قاعدة بيانات الصلاحيات.");
        }
    } catch (error) {
        console.error("خطأ أثناء تسجيل الدخول:", error.message);
        alert("خطأ: تأكد من البريد الإلكتروني وكلمة المرور.");
    }
};
