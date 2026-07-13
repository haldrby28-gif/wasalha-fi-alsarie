import { db } from "./firebase.js";

import {
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// الحصول على معرف الطلب من الرابط
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

if (!orderId) {

    alert("رقم الطلب غير موجود");

    throw new Error("Order ID Missing");

}

let map;
let driverMarker;

// إنشاء الخريطة
map = L.map("map").setView([30.0444, 31.2357], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

    attribution: "&copy; OpenStreetMap"

}).addTo(map);

// متابعة الطلب
onSnapshot(doc(db, "orders", orderId), async (orderSnap) => {

    if (!orderSnap.exists()) return;

    const order = orderSnap.data();

    if (!order.driverId) return;

    // متابعة المندوب
    onSnapshot(doc(db, "drivers", order.driverId), (driverSnap) => {

        if (!driverSnap.exists()) return;

        const driver = driverSnap.data();

        if (!driver.latitude || !driver.longitude) return;

        const latlng = [driver.latitude, driver.longitude];

        if (!driverMarker) {

            driverMarker = L.marker(latlng)

                .addTo(map)

                .bindPopup("🚚 المندوب");

            map.setView(latlng, 15);

        } else {

            driverMarker.setLatLng(latlng);

        }

    });

});
