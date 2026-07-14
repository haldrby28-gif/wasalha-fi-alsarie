import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usersCount = document.getElementById("usersCount");
const restaurantsCount = document.getElementById("restaurantsCount");
const driversCount = document.getElementById("driversCount");
const ordersCount = document.getElementById("ordersCount");
const sales = document.getElementById("sales");

async function loadDashboard() {

    try {

        // المستخدمون
        const usersSnap = await getDocs(collection(db, "users"));
        usersCount.textContent = usersSnap.size;

        // المطاعم
        const restaurantsSnap = await getDocs(collection(db, "restaurants"));
        restaurantsCount.textContent = restaurantsSnap.size;

        // المندوبون
        const driversSnap = await getDocs(collection(db, "drivers"));
        driversCount.textContent = driversSnap.size;

        // الطلبات
        const ordersSnap = await getDocs(collection(db, "orders"));
        ordersCount.textContent = ordersSnap.size;

        // إجمالي المبيعات
        let totalSales = 0;

        ordersSnap.forEach((docSnap) => {

            const order = docSnap.data();

            if (order.status === "completed") {

                totalSales += Number(order.total || 0);

            }

        });

        sales.textContent = totalSales + " جنيه";

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تحميل الإحصائيات.");

    }

}

loadDashboard();
