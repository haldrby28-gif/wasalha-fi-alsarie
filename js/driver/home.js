import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const driverName = document.getElementById("driverName");
const driverStatus = document.getElementById("driverStatus");
const ordersContainer = document.getElementById("ordersContainer");

auth.onAuthStateChanged(async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const driverRef = doc(db, "drivers", user.uid);
    const driverSnap = await getDoc(driverRef);

    if (!driverSnap.exists()) {

        alert("هذا الحساب ليس مندوب.");

        window.location.href = "login.html";

        return;

    }

    const driver = driverSnap.data();

    driverName.textContent = driver.name;

    driverStatus.textContent =
        driver.isOnline ? "🟢 متصل" : "🔴 غير متصل";

    loadOrders(user.uid);

});

async function loadOrders(driverId) {

    const q = query(
        collection(db, "orders"),
        where("status", "==", "جديد")
    );

    const snapshot = await getDocs(q);

    ordersContainer.innerHTML = "";

    if (snapshot.empty) {

        ordersContainer.innerHTML = `
        <p style="text-align:center;">
            لا توجد طلبات جديدة.
        </p>
        `;

       
