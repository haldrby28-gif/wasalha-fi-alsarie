import { auth, db } from "../../js/firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("المستخدم غير موجود.");
    window.location.href = "login.html";
    return;
  }

  const userData = userSnap.data();

  if (userData.role !== "admin") {
    alert("ليس لديك صلاحية الدخول إلى لوحة الإدارة.");
    window.location.href = "../app/home.html";
  }

});
