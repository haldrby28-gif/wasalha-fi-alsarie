import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadStats() {

    try {

        const users = await getDocs(collection(db, "users"));
        const restaurants = await getDocs(collection(db, "restaurants"));
        const products = await getDocs(collection(db, "products"));
        const orders = await getDocs(collection(db, "orders"));
        const drivers = await getDocs(collection(db, "drivers"));
        const coupons = await getDocs(collection(db, "coupons"));

        document.getElementById("usersCount").textContent = users.size;
        document.getElementById("restaurantsCount").textContent = restaurants.size;
        document.get
