import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const orderDetails = document.getElementById("orderDetails");

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

        <h3>الحالة: ${order.status}</h3>

        <p>📍 العنوان: ${order.address}</p>

        <p>📝 الملاحظات: ${order.notes || "لا يوجد"}</p>

        <hr>

        <h3>المنتجات</h3>

    `;

    order.items.forEach(item => {

        html += `

        <div class="product-item">

            <h4>${item.name}</h4>

            <p>الكمية: ${item.quantity}</p>

            <p>السعر: ${item.price} جنيه</p>

        </div>

        `;

    });

    html += `

        <hr>

        <h3>الإجمالي: ${order.total} جنيه</h3>

    </div>

    `;

    orderDetails.innerHTML = html;

}

loadOrder();
