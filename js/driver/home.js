import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const driverName = document.getElementById("driverName");
const driverStatus = document.getElementById("driverStatus");
const ordersContainer = document.getElementById("ordersContainer");

let currentDriverId = "";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentDriverId = user.uid;

    const driverRef = doc(db, "drivers", currentDriverId);
    const driverSnap = await getDoc(driverRef);

    if (!driverSnap.exists()) {

        alert("هذا الحساب ليس حساب مندوب.");

        window.location.href = "login.html";

        return;
    }

    const driver = driverSnap.data();

    driverName.textContent = driver.name;

    driverStatus.textContent =
        driver.isOnline ? "🟢 متصل" : "🔴 غير متصل";

    loadOrders();

});

async function loadOrders() {

    ordersContainer.innerHTML = `
        <p style="text-align:center">
            جاري تحميل الطلبات...
        </p>
    `;

   
