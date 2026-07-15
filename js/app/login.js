// js/app/login.js
// ... نفس الـ imports السابقة ...

window.validateLogin = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

            // رسالة تنبيهية تظهر لك القيمة الحقيقية للـ role
            alert("الدور (Role) الذي قرأته من قاعدة البيانات هو: " + role);

            if (role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else if (role === "restaurant") {
                window.location.href = "restaurant-panel.html";
            } else if (role === "driver") {
                window.location.href = "driver-app.html";
            } else {
                alert("الدور غير معروف، سيتم توجيهك لصفحة العميل.");
                window.location.href = "home.html";
            }
        } else {
            alert("خطأ: هذا المستخدم ليس له مستند في مجموعة users.");
        }
    } catch (error) {
        alert("خطأ: " + error.message);
    }
};
