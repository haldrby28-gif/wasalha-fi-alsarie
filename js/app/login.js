console.log("بدأ تحميل login.js");

alert("login.js يعمل");
    console.log("Firebase Loaded", auth, db);
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("الحساب غير موجود في قاعدة البيانات");
            return;
        }

        const userData = userSnap.data();

        alert("مرحباً " + userData.name);

        switch (userData.role) {

            case "admin":
                window.location.href = "../admin/dashboard.html";
                break;

            case "restaurant":
                window.location.href = "../restaurant/dashboard.html";
                break;

            case "driver":
                window.location.href = "../driver/index.html";
                break;

            default:
                window.location.href = "home.html";
                break;

        }

    } catch (error) {

        console.error(error);

        alert("خطأ: " + error.message);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    alert("login.js يعمل");

    const btn = document.getElementById("loginBtn");

    if (!btn) {
        alert("الزر غير موجود");
        return;
    }

    btn.addEventListener("click", () => {
        alert("تم الضغط على الزر");
        validateLogin();
    });

});
