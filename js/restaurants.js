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

    // تحميل بيانات المطعم
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

            <img
                src="${restaurant.image}"
                alt="${restaurant.name}"
                style="width:100%;height:200px;object-fit:cover;border-radius:10px;">

            <h3>${restaurant.name}</h3>

            <p>🍽️ ${restaurant.category}</p>

            <p>⭐ ${restaurant.rating}</p>

            <p>🚚 ${restaurant.deliveryTime}</p>

            <p>💵 رسوم التوصيل: ${restaurant.deliveryFee || 20} جنيه</p>

            <p>📌 الحد الأدنى: ${restaurant.minimumOrder || 0} جنيه</p>

            <p>${restaurant.isOpen ? "🟢 مفتوح الآن" : "🔴 مغلق الآن"}</p>

        </div>

    `;

    // تحميل المنتجات
    const q = query(
        collection(db, "products"),
        where("restaurantId", "==", restaurantId)
    );

    const snapshot = await getDocs(q);

    productsDiv.innerHTML = "";

    if (snapshot.empty) {

        productsDiv.innerHTML = `
            <p style="text-align:center;padding:20px;">
                لا توجد منتجات لهذا المطعم.
            </p>
        `;

        return;
    }

    const products = [];

    snapshot.forEach((docSnap) => {

        const product = {
            id: docSnap.id,
            ...docSnap.data()
        };

        products.push(product);

        productsDiv.innerHTML += `

        <div class="restaurant-card">

            <img
                src="${product.image}"
                alt="${product.name}"
                style="width:100%;height:170px;object-fit:cover;border-radius:10px;">

            <h3>${product.name}</h3>

            <p>💰 ${product.price} جنيه</p>

            <button class="addCart" data-id="${product.id}">
                ➕ إضافة إلى السلة
            </button>

        </div>

        `;

    });

    document.querySelectorAll(".addCart").forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            const item = products.find(p => p.id === id);

            if (!item) return;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // منع الطلب من أكثر من مطعم
            if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {

                alert("لا يمكن الطلب من أكثر من مطعم في نفس الوقت.");

                return;

            }

            const index = cart.findIndex(p => p.id === item.id);

            if (index > -1) {

                cart[index].quantity++;

            } else {

                cart.push({

                    ...item,

                    quantity: 1,

                    restaurantId: restaurantId,

                    restaurantName: restaurant.name,

                    deliveryFee: restaurant.deliveryFee || 20,

                    minimumOrder: restaurant.minimumOrder || 0

                });

            }

            localStorage.setItem("cart", JSON.stringify(cart));

            alert("✅ تمت إضافة المنتج إلى السلة");

        });

    });

}

loadRestaurant();
