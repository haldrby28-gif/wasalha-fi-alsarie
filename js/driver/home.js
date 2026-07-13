import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    onSnapshot,
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
        location.href = "login.html";
        return;
    }

    currentDriverId = user.uid;

    const driverSnap = await getDoc(doc(db, "drivers", currentDriverId));

    if (!driverSnap.exists()) {

        alert("هذا الحساب ليس حساب مندوب");

        location.href = "login.html";

        return;
    }

    const driver = driverSnap.data();

    driverName.textContent = driver.name;

    driverStatus.textContent =
        driver.isOnline ? "🟢 متصل" : "🔴 غير متصل";

    loadOrders();

});

function loadOrders() {

    const q = query(
        collection(db, "orders"),
        where("status", "==", "ready")
    );

    onSnapshot(q, (snapshot) => {

        ordersContainer.innerHTML = "";

        if (snapshot.empty) {

            ordersContainer.innerHTML = `
                <p style="text-align:center">
                    لا توجد طلبات جاهزة.
                </p>
            `;

            return;
        }

        snapshot.forEach((docSnap) => {

            const order = docSnap.data();

            ordersContainer.innerHTML += `

            <div class="card">

                <h3>📦 طلب</h3>

                <p>العنوان: ${order.address}</p>

                <p>الإجمالي: ${order.total} جنيه</p>

                <button onclick="acceptOrder('${docSnap.id}')">

                    استلام الطلب

                </button>

            </div>

            `;

        });

    });

}

window.acceptOrder = async function(orderId){

    await updateDoc(doc(db,"orders",orderId),{

        driverId: currentDriverId,

        status:"delivering"

    });

    alert("تم استلام الطلب");

}
