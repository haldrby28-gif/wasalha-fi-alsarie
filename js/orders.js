import { db, auth } from "./firebase.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const container = document.getElementById("ordersContainer");

onAuthStateChanged(auth, (user) => {

    if (!user) {

        container.innerHTML = "<p style='text-align:center'>يجب تسجيل الدخول.</p>";
        return;

    }

    const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
    );

    onSnapshot(q, (snapshot) => {

        container.innerHTML = "";

        if (snapshot.empty) {

            container.innerHTML = "<p style='text-align:center;padding:20px'>لا توجد طلبات.</p>";
            return;

        }

        snapshot.forEach((doc) => {

            const order = doc.data();

            let status = "";

            switch (order.status) {

                case "pending":
                    status = "🟡 جديد";
                    break;

                case "preparing":
                    status = "👨‍🍳 جاري التحضير";
                    break;

                case "delivery":
                    status = "🛵 مع المندوب";
                    break;

                case "completed":
                    status = "✅ تم التسليم";
                    break;

                case "cancelled":
                    status = "❌ ملغي";
                    break;

                default:
                    status = order.status;

            }

            container.innerHTML += `

            <div class="cart-item">

                <h3>رقم الطلب</h3>

                <p>${doc.id}</p>

                <p>الحالة: ${status}</p>

                <p>الإجمالي: ${order.total} جنيه</p>

                <p>عدد المنتجات: ${order.items.length}</p>

            </div>

            `;

        });

    });

});
