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

    try {

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

            let statusText = order.status;

            switch (order.status) {

                case "pending":
                    statusText = "🟡 بانتظار قبول المندوب";
                    break;

                case "delivering":
                    statusText = "🚚 جاري التوصيل";
                    break;

                case "completed":
                    statusText = "✅ تم التسليم";
                    break;

                case "cancelled":
                    statusText = "❌ ملغي";
                    break;

            }

            ordersContainer.innerHTML += `

            <div class="order-card">

                <h3>📦 الطلب</h3>

                <p>
                    <strong>الحالة:</strong>
                    ${statusText}
                </p>

                <p>
                    <strong>الإجمالي:</strong>
                    ${order.total} جنيه
                </p>

                <p>
                    <strong>عدد المنتجات:</strong>
                    ${order.items.length}
                </p>

                <button onclick="location.href='order-details.html?id=${docSnap.id}'">
                    📄 عرض التفاصيل
                </button>

                ${
                    order.status === "delivering"
                    ? `
                    <button
                        style="margin-top:10px;background:#28a745;color:#fff;"
                        onclick="location.href='tracking.html?id=${docSnap.id}'">
                        🚚 تتبع الطلب
                    </button>
                    `
                    : ""
                }

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

        ordersContainer.innerHTML = `
            <p style="text-align:center;color:red;padding:20px;">
                حدث خطأ أثناء تحميل الطلبات.
            </p>
        `;

    }

});
