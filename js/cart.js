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
const address=document.getElementById("address");
const notes=document.getElementById("notes");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
        <p style="text-align:center;padding:30px">
        السلة فارغة 🛒
        </p>`;

        subtotal.textContent = 0;
        total.textContent = 20;
        return;
    }

    let sub = 0;

    cart.forEach((item, index) => {

        sub += Number(item.price);

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}">

            <h3>${item.name}</h3>

            <p>💰 ${item.price} جنيه</p>

            <button onclick="removeItem(${index})">
            🗑️ حذف
            </button>

        </div>

        `;

    });

    subtotal.textContent = sub;
    delivery.textContent = 20;
    total.textContent = sub + 20;

}

window.removeItem = function(index){

    cart.splice(index,1);

    localStorage.setItem("cart",JSON.stringify(cart));

    renderCart();

}

checkoutBtn.addEventListener("click", async ()=>{

    if(cart.length===0){

        alert("السلة فارغة");

        return;
    }

    if(!auth.currentUser){

        alert("يجب تسجيل الدخول");

        return;
    }

    await addDoc(collection(db,"orders"),{

        userId:auth.currentUser.uid,

        items:cart,

        total:Number(total.textContent),

        status:"pending",

        createdAt:serverTimestamp()

    });

    localStorage.removeItem("cart");

    alert("✅ تم إرسال الطلب");

    window.location.href="orders.html";

});

renderCart();
