import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadStats() {

    try {

        const users = await getDocs(collection(db, "users"));
        const restaurants = await getDocs(collection(db, "restaurants"));
        const products = await getDocs(collection(db, "products"));
        const orders = await getDocs(collection(db, "orders"));
        const drivers = await getDocs(collection(db, "drivers"));
        const coupons = await getDocs(collection(db, "coupons"));

        document.getElementById("usersCount").textContent = users.size;
        document.getElementById("restaurantsCount").textContent = restaurants.size;
        document.getElementById("productsCount").textContent = products.size;
        document.getElementById("ordersCount").textContent = orders.size;
        document.getElementById("driversCount").textContent = drivers.size;
        document.getElementById("couponsCount").textContent = coupons.size;

        console.log("تم تحميل الإحصائيات بنجاح");

    } catch (error) {

        console.error("Dashboard Error:", error);

        alert("خطأ في تحميل البيانات:\n" + error.message);

    }

}

async function loadLatestOrders() {

    try {

        const tbody = document.getElementById("latestOrders");

        if (!tbody) return;

        tbody.innerHTML = "";

        const q = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const snap = await getDocs(q);

        if (snap.empty) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        لا توجد طلبات
                    </td>
                </tr>
            `;

            return;
        }

        snap.forEach((docItem) => {

            const order = docItem.data();

            tbody.innerHTML += `
                <tr>
                    <td>${docItem.id}</td>
                    <td>${order.restaurantName || "-"}</td>
                    <td>${order.total || 0} جنيه</td>
                    <td>${order.status || "-"}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

        alert("خطأ أثناء تحميل الطلبات:\n" + error.message);

    }

}

window.addEventListener("DOMContentLoaded", () => {

    loadStats();

    loadLatestOrders();

});
