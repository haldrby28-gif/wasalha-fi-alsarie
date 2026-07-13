import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const restaurantsDiv = document.getElementById("restaurants");
const search = document.getElementById("search");

let restaurants = [];

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

function renderRestaurants(list) {

    restaurantsDiv.innerHTML = "";

    if (list.length === 0) {

        restaurantsDiv.innerHTML = "<p>لا توجد مطاعم.</p>";
        return;

    }

    list.forEach((restaurant) => {

        restaurantsDiv.innerHTML += `

<div class="restaurant-card">

<h3>${restaurant.name}</h3>

<p>${restaurant.category || ""}</p>

<p>${restaurant.isOpen ? "🟢 مفتوح" : "🔴 مغلق"}</p>

<button onclick="location.href='restaurant.html?id=${restaurant.id}'">

عرض المنتجات

</button>

</div>

`;

    });

}

search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = restaurants.filter(r =>
        (r.name || "").toLowerCase().includes(value)
    );

    renderRestaurants(filtered);

});
