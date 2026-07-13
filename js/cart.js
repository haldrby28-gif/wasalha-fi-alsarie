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

        sub += Number(item.price);

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <h3>${item.name}</h3>

            <p>💰 ${item.price} جنيه</p>

            <button onclick="removeItem(${index})">
                🗑️ حذف
            </button>

        </div>

        `;

    });

    subtotal.textContent = sub;
    delivery.textContent =
