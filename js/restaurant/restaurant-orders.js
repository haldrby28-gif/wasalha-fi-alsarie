import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ordersContainer = document.getElementById("ordersContainer");

let restaurantId = "";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    try {

        const restaurantQuery = query(
            collection(db, "restaurants"),
            where("ownerUid", "==", user.uid)
        );

        const restaurantSnapshot = await getDocs(restaurantQuery);

        if (restaurantSnapshot.empty) {

            alert("هذا الحساب ليس صاحب مطعم.");

            location.href = "login.html";

            return;

        }

        restaurantId = restaurantSnapshot.docs[0].id;

        loadOrders();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ.");

    }

});

async function loadOrders() {

    ordersContainer.innerHTML = "<p>جاري تحميل الطلبات...</p>";

    const q = query(
        collection(db, "orders"),
        where("restaurantId", "==", restaurantId)
    );

    const snapshot = await getDocs(q);

    ordersContainer.innerHTML = "";

    if (snapshot.empty) {

        ordersContainer.innerHTML = `
            <p style="text-align:center;">
                لا توجد طلبات.
            </p>
        `;

        return;

    }

    snapshot.forEach((docSnap) => {

        const order = docSnap.data();

        ordersContainer.innerHTML += `

        <div class="card">

            <h3>📦 طلب #${docSnap.id}</h3>

            <p><strong>العميل:</strong> ${order.userId}</p>

            <p><strong>العنوان:</strong> ${order.address || "-"}</p>

            <p><strong>الإجمالي:</strong> ${order.total} جنيه</p>

            <p><strong>المندوب:</strong>
                ${order.driverId || "لم يتم التعيين"}
            </p>

            <p><strong>الحالة:</strong>
                ${statusText(order.status)}
            </p>

            ${buttons(docSnap.id, order.status)}

        </div>

        `;

    });

}

function statusText(status) {

    switch (status) {

        case "pending":
            return "⏳ قيد الانتظار";

        case "preparing":
            return "👨‍🍳 جاري التحضير";

        case "ready":
            return "✅ جاهز للاستلام";

        case "delivering":
            return "🛵 جاري التوصيل";

        case "completed":
            return "🎉 تم التوصيل";

        default:
            return status;

    }

}

function buttons(id, status) {

    switch (status) {

        case "pending":

            return `
                <button onclick="changeStatus('${id}','preparing')">
                    👨‍🍳 بدء التحضير
                </button>
            `;

        case "preparing":

            return `
                <button onclick="changeStatus('${id}','ready')">
                    ✅ الطلب جاهز
                </button>
            `;

        case "ready":

            return `
                <button disabled>
                    🛵 في انتظار المندوب
                </button>
            `;

        case "delivering":

            return `
                <button disabled>
                    🚚 جاري التوصيل
                </button>
            `;

        case "completed":

            return `
                <button disabled>
                    ✔ تم التسليم
                </button>
            `;

        default:

            return "";

    }

}

window.changeStatus = async function(orderId, status) {

    try {

        await updateDoc(doc(db, "orders", orderId), {

            status: status

        });

        alert("✅ تم تحديث حالة الطلب.");

        loadOrders();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تحديث الحالة.");

    }

};
