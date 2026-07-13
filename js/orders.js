import { db, auth } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ordersContainer = document.getElementById("orders");

auth.onAuthStateChanged(async (user) => {

    if (!user) {

        ordersContainer.innerHTML = `
            <p style="text-align:center;padding:20px;">
                يجب تسجيل الدخول أولاً
            </p>
        `;

        return;
    }

    const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        ordersContainer.innerHTML = `
            <p style="text-align:center;padding:20px;">
                لا توجد طلبات حتى الآن.
            </p>
        `;

        return;
    }

    ordersContainer.innerHTML = "";

    snapshot.forEach((docSnap) => {

        const order = docSnap.data();

        ordersContainer.innerHTML += `

        <div class="order-card">

            <h3>📦 الطلب</h3>

            <p>الحالة:
                <strong>${order.status}</strong>
            </p>

            <p>الإجمالي:
                <strong>${order.total} جنيه</strong>
            </p>

            <p>عدد المنتجات:
                <strong>${order.items.length}</strong>
            </p>

            <button onclick="location.href='order-details.html?id=${docSnap.id}'">
                عرض التفاصيل
            </button>

        </div>

        `;

    });

});
