import { auth } from "../firebase.js";
import { db } from "../firebase.js";

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

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const driverRef = doc(db, "drivers", user.uid);
    const driverSnap = await getDoc(driverRef);

    if (!driverSnap.exists()) {
        alert("هذا الحساب ليس مندوباً.");
        window.location.href = "login.html";
        return;
    }

    const driver = driverSnap.data();

    driverName.textContent = driver.name;

    driverStatus.textContent =
        driver.isOnline ? "🟢 متصل" : "🔴 غير متصل";

    loadOrders(user.uid);

});

async function loadOrders(driverId) {

    const q = query(
        collection(db, "orders"),
        where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);

    ordersContainer.innerHTML = "";

    if (snapshot.empty) {

        ordersContainer.innerHTML = `
            <p style="text-align:center;">
                لا توجد طلبات جديدة.
            </p>
        `;

        return;
    }

    snapshot.forEach((docSnap) => {

        const order = docSnap.data();

        ordersContainer.innerHTML += `

        <div class="order-card">

            <h3>📦 طلب #${docSnap.id}</h3>

            <p>💰 الإجمالي: ${order.total} جنيه</p>

            <p>👤 العميل: ${order.userId}</p>

            <button onclick="acceptOrder('${docSnap.id}','${driverId}')">
                استلام الطلب
            </button>

        </div>

        `;

    });

}

window.acceptOrder = async function(orderId, driverId) {

    try {

        await updateDoc(doc(db, "orders", orderId), {

            status: "delivering",

            driverId: driverId

        });

        await updateDoc(doc(db, "drivers", driverId), {

            currentOrder: orderId,

            isAvailable: false

        });

        alert("✅ تم استلام الطلب.");

        location.reload();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء استلام الطلب.");

    }

};
