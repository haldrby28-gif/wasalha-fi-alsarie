
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

const ordersContainer = document.getElementById("ordersContainer");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    const restaurantRef = doc(db, "restaurants", user.uid);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        alert("هذا الحساب ليس مطعماً.");
        location.href = "login.html";
        return;
    }

    loadOrders(user.uid);

});

async function loadOrders(restaurantId) {

    ordersContainer.innerHTML = "<p>جارى تحميل الطلبات...</p>";

    const q = query(
        collection(db, "orders"),
        where("restaurantId", "==", restaurantId)
    );

    const snapshot = await getDocs(q);

    ordersContainer.innerHTML = "";

    if (snapshot.empty) {

        ordersContainer.innerHTML = `
            <p style="text-align:center">
                لا توجد طلبات
            </p>
        `;

        return;
    }

    snapshot.forEach((docSnap) => {

        const order = docSnap.data();

        ordersContainer.innerHTML += `

        <div class="order-card">

            <h3>طلب #${docSnap.id}</h3>

            <p>الحالة: ${order.status}</p>

            <p>الإجمالي: ${order.total} جنيه</p>

            <p>العميل: ${order.userId}</p>

            <p>المندوب:
                ${order.driverId || "لم يتم التعيين"}
            </p>

            ${buttons(docSnap.id, order.status)}

        </div>

        `;

    });

}

function buttons(id, status) {

    if (status === "pending") {

        return `
        <button onclick="prepareOrder('${id}')">
            قبول وتجهيز الطلب
        </button>
        `;

    }

    if (status === "preparing") {

        return `
        <button onclick="readyOrder('${id}')">
            الطلب جاهز
        </button>
        `;

    }

    return "";

}

window.prepareOrder = async function(id) {

    await updateDoc(doc(db, "orders", id), {

        status: "preparing"

    });

    loadOrders(auth.currentUser.uid);

}

window.readyOrder = async function(id) {

    await updateDoc(doc(db, "orders", id), {

        status: "ready"

    });

    loadOrders(auth.currentUser.uid);

}
