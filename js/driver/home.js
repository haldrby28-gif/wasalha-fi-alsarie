import { auth, db } from "../firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  query,
  where,
  onSnapshot,
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

  try {

    const driverRef = doc(db, "drivers", currentDriverId);
    const driverSnap = await getDoc(driverRef);

    if (!driverSnap.exists()) {
      alert("هذا الحساب ليس حساب مندوب");
      window.location.href = "login.html";
      return;
    }

    const driver = driverSnap.data();

    driverName.textContent = driver.name || "مندوب";
    driverStatus.textContent =
      driver.isOnline ? "🟢 متصل" : "🔴 غير متصل";

    loadOrders();

  } catch (err) {

    console.error(err);
    alert("حدث خطأ أثناء تحميل البيانات");

  }

});

function loadOrders() {

  const q = query(
    collection(db, "orders"),
    where("status", "==", "ready")
  );

  onSnapshot(q, (snapshot) => {

    ordersContainer.innerHTML = "";

  if (snapshot.empty) {

  ordersContainer.innerHTML = `
    <p style="text-align:center">
      لا توجد طلبات جاهزة
    </p>
  `;

  return;
}

snapshot.forEach((docSnap) => {

  const order = docSnap.data();

  ordersContainer.innerHTML += `
    <div class="card">

      <h3>📦 طلب جديد</h3>

      <p><strong>العنوان:</strong> ${order.address || "-"}</p>

      <p><strong>الإجمالي:</strong> ${order.total || 0} جنيه</p>

      <button onclick="acceptOrder('${docSnap.id}')">
        استلام الطلب
      </button>

    </div>
  `;

});

});

window.acceptOrder = async function (orderId) {

  try {

    await updateDoc(doc(db, "orders", orderId), {
      driverId: currentDriverId,
      status: "delivering"
    });

    alert("تم استلام الطلب بنجاح");

  } catch (err) {

    console.error(err);
    alert("حدث خطأ أثناء استلام الطلب");

  }

};
    }
