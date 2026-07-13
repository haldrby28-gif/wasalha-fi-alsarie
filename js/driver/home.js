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
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const driverName = document.getElementById("driverName");
const driverStatus = document.getElementById("driverStatus");
const ordersContainer = document.getElementById("ordersContainer");

let currentDriverId = "";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentDriverId = user.uid;

    const driverSnap = await getDoc(doc(db, "drivers", user.uid));

    if (!driverSnap.exists()) {
        alert("هذا الحساب ليس حساب مندوب.");
        window.location.href = "login.html";
        return;
    }

    const driver = driverSnap.data();

    driverName.textContent = driver.name;

    driverStatus.textContent =
        driver.isOnline ? "🟢 متصل" : "🔴 غير متصل";

    loadOrders();

});

async function loadOrders() {

    ordersContainer.innerHTML = "<p>جاري تحميل الطلبات...</p>";

    const q = query(
        collection(db, "orders"),
        where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);

    ordersContainer.innerHTML = "";

    if (snapshot.empty) {

        ordersContainer.innerHTML = `
        <p style="text-align:center">
            لا توجد طلبات جديدة
        </p>
        `;

        return;
    }

    for (const orderDoc of snapshot.docs) {

        const order = orderDoc.data();

        let userName = order.userId;
        let restaurantName = order.restaurantId;

        try {

            const userSnap = await getDoc(doc(db, "users", order.userId));

            if (userSnap.exists()) {
                userName = userSnap.data().name;
            }

        } catch (e) {}

        try {

            const restaurantSnap = await getDoc(doc(db, "restaurants", order.restaurantId));

            if (restaurantSnap.exists()) {
                restaurantName = restaurantSnap.data().name;
            }

        } catch (e) {}

        ordersContainer.innerHTML += `

        <div class="order-card">

            <h3>📦 الطلب #${orderDoc.id}</h3>

            <p>👤 العميل: ${userName}</p>

            <p>🏪 المطعم: ${restaurantName}</p>

            <p>💰 الإجمالي: ${order.total} جنيه</p>

            <button onclick="acceptOrder('${orderDoc.id}')">
                استلام الطلب
            </button>

        </div>

        `;

    }

}

window.acceptOrder = async function(orderId) {

    try {

        await updateDoc(doc(db, "orders", orderId), {

            driverId: currentDriverId,
            status: "delivering"

        });

        await updateDoc(doc(db, "drivers", currentDriverId), {

            currentOrder: orderId,
            isAvailable: false

        });

        alert("✅ تم استلام الطلب بنجاح");

        loadOrders();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء استلام الطلب");

    }

};
