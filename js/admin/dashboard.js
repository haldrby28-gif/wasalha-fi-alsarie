import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadStats() {

    document.getElementById("usersCount").textContent =
        (await getDocs(collection(db, "users"))).size;

    document.getElementById("restaurantsCount").textContent =
        (await getDocs(collection(db, "restaurants"))).size;

    document.getElementById("productsCount").textContent =
        (await getDocs(collection(db, "products"))).size;

    document.getElementById("ordersCount").textContent =
        (await getDocs(collection(db, "orders"))).size;

    document.getElementById("driversCount").textContent =
        (await getDocs(collection(db, "drivers"))).size;

    document.getElementById("couponsCount").textContent =
        (await getDocs(collection(db, "coupons"))).size;

}

async function loadLatestOrders() {

    const tbody = document.getElementById("latestOrders");

    if (!tbody) return;

    tbody.innerHTML = "";

    const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(10)
    );

    const snap = await getDocs(q);

    snap.forEach(doc => {

        const order = doc.data();

        tbody.innerHTML += `
        <tr>

            <td>${doc.id}</td>

            <td>${order.restaurantName || "-"}</td>

            <td>${order.total} جنيه</td>

            <td>${order.status}</td>

        </tr>
        `;

    });

}

loadStats();
loadLatestOrders();
