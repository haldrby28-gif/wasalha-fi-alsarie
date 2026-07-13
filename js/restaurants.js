import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const restaurantId = params.get("id");

const restaurantName = document.getElementById("restaurantName");
const restaurantInfo = document.getElementById("restaurantInfo");
const productsDiv = document.getElementById("products");

async function loadRestaurant() {

    if (!restaurantId) {
        restaurantName.textContent = "المطعم غير موجود";
        return;
    }

    // بيانات المطعم
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        restaurantName.textContent = "المطعم غير موجود";
        return;
    }

    const restaurant = restaurantSnap.data();

    restaurantName.textContent = restaurant.name;

    restaurantInfo.innerHTML = `
        <div class="restaurant-card">

            <img src="${restaurant.image}"
                 style="width:100%;height:200px;object-fit:cover;border-radius:10px;">

            <h3>${restaurant.name}</h3>

            <p>🍽️ ${restaurant.category}</p>

            <p>⭐ ${restaurant.rating}</p>

            <p>🚚 ${restaurant.deliveryTime}</p>

            <p>${restaurant.isOpen ? "🟢 مفتوح الآن" : "🔴 مغلق الآن"}</p>

        </div>
    `;

    // المنتجات
    const q = query(
        collection(db, "products"),
        where("restaurantId", "==", restaurantId)
    );

    const productsSnap = await getDocs(q);

    productsDiv.innerHTML = "";

    if (productsSnap.empty) {
        productsDiv.innerHTML = "<p style='padding:15px'>لا توجد منتجات.</p>";
        return;
    }

    productsSnap.forEach((docSnap) => {

        const product = {
            id: docSnap.id,
            ...docSnap.data()
        };

        productsDiv.innerHTML += `

        <div class="restaurant-card">

            <img src="${product.image}"
                 style="width:100%;height:170px;object-fit:cover;border-radius:10px;">

            <h3>${product.name}</
