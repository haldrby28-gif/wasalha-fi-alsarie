import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const orderInfo = document.getElementById("orderInfo");
const finishBtn = document.getElementById("finishBtn");

let currentDriverId = "";

auth.onAuthStateChanged(async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentDriverId = user.uid;

    loadOrder();

});

async function loadOrder() {

    if (!orderId) {

        orderInfo.innerHTML = "<p>الطلب غير موجود.</p>";
        return;

    }

    const orderSnap = await getDoc(doc(db, "orders", orderId));

    if (!orderSnap.exists()) {

        orderInfo.innerHTML = "<p>الطلب غير موجود.</p>";
        return;

    }

    const order = orderSnap.data();

    let html = `

    <div class="card">

        <h2>📦 الطلب #${orderId}</h2>

        <p><strong>الحالة:</strong> ${order.status}</p>

        <p><strong>العنوان:</strong> ${order.address}</p>

        <p><strong>الملاحظات:</strong> ${order.notes || "لا توجد"}</p>

        <p><strong>الإجمالي:</strong> ${order.total} جنيه</p>

    </div>

    <div class="card">

        <h3>المنتجات</h3>

    `;

    order.items.forEach(item => {

        html += `

        <div class="item">

            <span>${item.name}</span>

            <span>${item.quantity} × ${item.price} جنيه</span>

        </div>

        `;

    });

    html += `</div>`;

    orderInfo.innerHTML = html;

}

finishBtn.addEventListener("click", async () => {

    if (!confirm("هل تم تسليم الطلب؟")) return;

    try {

        await updateDoc(doc(db, "orders", orderId), {

            status: "completed"

        });

        await updateDoc(doc(db, "drivers", currentDriverId), {

            currentOrder: "",

            isAvailable: true

        });

        alert("✅ تم إنهاء الطلب بنجاح");

        window.location.href = "home.html";

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء إنهاء الطلب");

    }

});
