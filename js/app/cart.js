
import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cartItems = document.getElementById("cartItems");
const subtotal = document.getElementById("subtotal");
const delivery = document.getElementById("delivery");
const total = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const address = document.getElementById("address");
const notes = document.getElementById("notes");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// إذا كانت المنتجات القديمة لا تحتوي على quantity
cart = cart.map(item => ({
    ...item,
    quantity: item.quantity || 1
}));

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="text-align:center;padding:30px;">
                🛒 السلة فارغة
            </p>
        `;

        subtotal.textContent = 0;
        delivery.textContent = 20;
        total.textContent = 20;

        return;
    }

    let sub = 0;

    cart.forEach((item, index) => {

        const itemTotal = Number(item.price) * item.quantity;

        sub += itemTotal;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <h3>${item.name}</h3>

            <p>💰 السعر: ${item.price} جنيه</p>

            <p>📦 الكمية: ${item.quantity}</p>

            <p><strong>الإجمالي: ${itemTotal} جنيه</strong></p>

            <div class="qty-buttons">

                <button onclick="decreaseQty(${index})">➖</button>

                <button onclick="increaseQty(${index})">➕</button>

                <button onclick="removeItem(${index})">🗑️ حذف</button>

            </div>

        </div>

        `;

    });

    subtotal.textContent = sub;
    delivery.textContent = 20;
    total.textContent = sub + 20;

}

window.increaseQty = function(index) {

    cart[index].quantity++;

    saveCart();

    renderCart();

}

window.decreaseQty = function(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

    renderCart();

}

window.removeItem = function(index) {

    cart.splice(index, 1);

    saveCart();

    renderCart();

}

checkoutBtn.addEventListener("click", async () => {

    if (cart.length === 0) {

        alert("السلة فارغة");

        return;

    }

    if (!auth.currentUser) {

        alert("يجب تسجيل الدخول أولاً");

        return;

    }

    if (address.value.trim() === "") {

        alert("من فضلك أدخل عنوان التوصيل");

        address.focus();

        return;

    }

    try {

        await addDoc(collection(db, "orders"), {

            userId: auth.currentUser.uid,

            items: cart,

            address: address.value,

            notes: notes.value,

            subtotal: Number(subtotal.textContent),

            deliveryFee: Number(delivery.textContent),

            total: Number(total.textContent),

            status: "pending",

            createdAt: serverTimestamp()

        });

        localStorage.removeItem("cart");

        alert("✅ تم إرسال الطلب بنجاح");

        window.location.href = "orders.html";

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء إرسال الطلب");

    }

});

renderCart();
