import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const orderDetails = document.getElementById("orderDetails");

function getStatus(status) {

    switch (status) {

        case "pending":
            return "🟡 قيد الانتظار";

        case "accepted":
            return "✅ تم قبول الطلب";

        case "preparing":
            return "👨‍🍳 جاري التحضير";

        case "on_the_way":
            return "🛵 في الطريق";

        case "completed":
            return "🎉 تم التسليم";

        case "cancelled":
            return "❌ تم إلغاء الطلب";

        default:
            return status || "غير معروف";
    }

}

async function loadOrder() {

    if (!orderId) {

        orderDetails.innerHTML = "<p>الطلب غير موجود.</p>";

        return;

    }

    const snap = await getDoc(doc(db, "orders", orderId));

    if (!snap.exists()) {

        orderDetails.innerHTML = "<p>الطلب غير موجود.</p>";

        return;

    }

    const order = snap.data();

    let html = `

    <div class="order-card">

        <h2>${getStatus(order.status)}</h2>

        <p><strong>📍 العنوان:</strong> ${order.address}</p>

        <p><strong>📝 الملاحظات:</strong> ${order.notes || "لا يوجد"}</p>

        <hr>

        <h3>المنتجات</h3>

    `;

    order.items.forEach(item => {

        html += `

        <div class="product-item">

            <h4>${item.name}</h4>

            <p>الكمية: ${item.quantity}</p>

            <p>السعر: ${item.price} جنيه</p>

            <hr>

        </div>

        `;

    });

    html += `

        <h3>الإجمالي: ${order.total} جنيه</h3>

    `;

    if (order.status === "completed") {

        html += `

        <br>

        <button onclick="location.href='rate-order.html?id=${orderId}'">

            ⭐ قيّم المطعم

        </button>

        `;

    }

    html += `</div>`;

    orderDetails.innerHTML = html;

}

loadOrder();
