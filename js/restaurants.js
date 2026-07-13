import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tbody = document.querySelector("#restaurantsTable tbody");
const searchInput = document.getElementById("searchRestaurant");

let restaurants = [];

async function loadRestaurants() {

    tbody.innerHTML = "";

    const snapshot = await getDocs(collection(db, "restaurants"));

    restaurants = [];

    snapshot.forEach((docSnap) => {

        restaurants.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

    renderRestaurants(restaurants);

}

function renderRestaurants(list) {

    tbody.innerHTML = "";

    if (list.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="5">
                لا توجد مطاعم
            </td>
        </tr>
        `;

        return;

    }

    list.forEach((restaurant) => {

        tbody.innerHTML += `

        <tr>

            <td>${restaurant.name}</td>

            <td>${restaurant.category || "-"}</td>

            <td>${restaurant.phone || "-"}</td>

            <td>

                ${restaurant.isOpen
                    ? "🟢 مفتوح"
                    : "🔴 مغلق"}

            </td>

            <td>

                <button onclick="toggleRestaurant('${restaurant.id}', ${restaurant.isOpen})">

                    ${restaurant.isOpen
                        ? "إغلاق"
                        : "فتح"}

                </button>

                <button onclick="editRestaurant('${restaurant.id}')">

                    تعديل

                </button>

                <button onclick="removeRestaurant('${restaurant.id}')">

                    حذف

                </button>

            </td>

        </tr>

        `;

    });

}

window.toggleRestaurant = async function(id, currentStatus) {

    await updateDoc(doc(db, "restaurants", id), {

        isOpen: !currentStatus

    });

    loadRestaurants();

};

window.removeRestaurant = async function(id) {

    if (!confirm("هل تريد حذف المطعم؟"))
        return;

    await deleteDoc(doc(db, "restaurants", id));

    loadRestaurants();

};

window.editRestaurant = function(id) {

    location.href = `edit-restaurant.html?id=${id}`;

};

searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = restaurants.filter(r =>

        (r.name || "")
        .toLowerCase()
        .includes(value)

    );

    renderRestaurants(filtered);

});

loadRestaurants();
