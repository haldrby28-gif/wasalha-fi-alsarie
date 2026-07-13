import { db } from "../../js/firebase.js";

import {
    collection,
    onSnapshot,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tbody = document.querySelector("#restaurantsTable tbody");
const searchInput = document.getElementById("searchRestaurant");

let restaurants = [];

// تحميل المطاعم مباشرة من Firebase
onSnapshot(collection(db, "restaurants"), (snapshot) => {

    restaurants = [];

    snapshot.forEach((restaurant) => {

        restaurants.push({
            id: restaurant.id,
            ...restaurant.data()
        });

    });

    renderRestaurants(restaurants);

});

// عرض المطاعم
function renderRestaurants(list) {

    tbody.innerHTML = "";

    list.forEach((restaurant) => {

        tbody.innerHTML += `
        <tr>

            <td>${restaurant.name || ""}</td>

            <td>${restaurant.category || ""}</td>

            <td>${restaurant.phone || "-"}</td>

            <td>${restaurant.isOpen ? "🟢 مفتوح" : "🔴 مغلق"}</td>

            <td>

                <button onclick="editRestaurant('${restaurant.id}')">
                ✏️ تعديل
                </button>

                <button onclick="deleteRestaurant('${restaurant.id}')">
                🗑️ حذف
                </button>

            </td>

        </tr>
        `;

    });

}

// البحث
searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = restaurants.filter(r =>
        (r.name || "").toLowerCase().includes(keyword)
    );

    renderRestaurants(filtered);

});

// حذف مطعم
window.deleteRestaurant = async (id) => {

    if (!confirm("هل تريد حذف هذا المطعم؟")) return;

    await deleteDoc(doc(db, "restaurants", id));

};

// تعديل (سننفذه لاحقًا)
window.editRestaurant = (id) => {

    alert("سيتم إضافة صفحة
