import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const restaurantsDiv = document.getElementById("restaurants");
const search = document.getElementById("search");

let restaurants = [];

// تحميل المطاعم من Firestore
onSnapshot(collection(db, "restaurants"), (snapshot) => {

    restaurants = [];

    snapshot.forEach((doc) => {

        restaurants.push({
            id: doc.id,
            ...doc.data()
        });

    });

    renderRestaurants(restaurants);

});

// عرض المطاعم
function renderRestaurants(list) {

    restaurantsDiv.innerHTML = "";

    if (list.length === 0) {
        restaurantsDiv.innerHTML = "<p style='text-align:center'>لا توجد مطاعم.</p>";
        return;
    }

    list.forEach((restaurant) => {

        restaurantsDiv.innerHTML += `
        <div class="restaurant-card">

            <img
                src="${restaurant.image}"
                alt="${restaurant.name}"
                style="width:100%;height:180px;object-fit:cover;border-radius:10px;">

            <h3>${restaurant.name}</h3>

            <p>🍽️ ${restaurant.category}</p>

            <p>⭐ ${restaurant.rating ?? "لا يوجد تقييم"}</p>

            <p>🚚 ${restaurant.deliveryTime}</p>

            <p>${restaurant.isOpen ? "🟢 مفتوح الآن" : "🔴 مغلق الآن"}</p>

            <button onclick="location.href='restaurant.html?id=${restaurant.id}'">
                عرض المنتجات
            </button>

        </div>
        `;

    });

}

// البحث
search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = restaurants.filter((restaurant) => {

        return (restaurant.name || "")
            .toLowerCase()
           
