import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const restaurantName = document.getElementById("restaurantName");
const ordersCount = document.getElementById("ordersCount");
const productsCount = document.getElementById("productsCount");
const salesTotal = document.getElementById("salesTotal");
const rating = document.getElementById("rating");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    try {

        // البحث عن المطعم المرتبط بصاحب الحساب
        const restaurantQuery = query(
            collection(db, "restaurants"),
            where("ownerUid", "==", user.uid)
        );

        const restaurantSnapshot = await getDocs(restaurantQuery);

        if (restaurantSnapshot.empty) {

            alert("لا يوجد مطعم مرتبط بهذا الحساب.");

            return;

        }

        const restaurantDoc = restaurantSnapshot.docs[0];

        const restaurantId = restaurantDoc.id;

        const restaurant = restaurantDoc.data();

        restaurantName.textContent = restaurant.name || "مطعمي";

        rating.textContent = restaurant.rating || "0";

        // عدد المنتجات
        const productsQuery = query(
            collection(db, "products"),
            where("restaurantId", "==", restaurantId)
        );

        const productsSnapshot = await getDocs(productsQuery);

        productsCount.textContent = productsSnapshot.size;

        // الطلبات
        const ordersQuery = query(
            collection(db, "orders"),
            where("restaurantId", "==", restaurantId)
        );

        const ordersSnapshot = await getDocs(ordersQuery);

        let totalSales = 0;
        let newOrders = 0;

        ordersSnapshot.forEach(doc => {

            const order = doc.data();

            if (order.status === "pending") {

                newOrders++;

            }

            if (order.status === "completed") {

                totalSales += Number(order.total || 0);

            }

        });

        ordersCount.textContent = newOrders;

        salesTotal.textContent = totalSales + " ج";

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تحميل البيانات.");

    }

});
