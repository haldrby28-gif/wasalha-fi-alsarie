import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const rating = document.getElementById("rating");
const comment = document.getElementById("comment");
const saveRating = document.getElementById("saveRating");

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

saveRating.addEventListener("click", async () => {

    if (!auth.currentUser) {

        alert("يجب تسجيل الدخول");

        return;

    }

    if (!orderId) {

        alert("رقم الطلب غير موجود");

        return;

    }

    // جلب بيانات الطلب
    const orderSnap = await getDoc(doc(db, "orders", orderId));

    if (!orderSnap.exists()) {

        alert("الطلب غير موجود");

        return;

    }

    const order = orderSnap.data();

    // التأكد من عدم تقييم الطلب من قبل
    const q = query(
        collection(db, "ratings"),
        where("orderId", "==", orderId),
        where("userId", "==", auth.currentUser.uid)
    );

    const ratingSnap = await getDocs(q);

    if (!ratingSnap.empty) {

        alert("لقد قمت بتقييم هذا الطلب من قبل.");

        return;

    }

    // حفظ التقييم
    await addDoc(collection(db, "ratings"), {

        orderId: orderId,

        restaurantId: order.restaurantId,

        userId: auth.currentUser.uid,

        rating: Number(rating.value),

        comment: comment.value.trim(),

        createdAt: serverTimestamp()

    });

    alert("⭐ شكراً، تم حفظ تقييمك.");

    window.location.href = "orders.html";

});
