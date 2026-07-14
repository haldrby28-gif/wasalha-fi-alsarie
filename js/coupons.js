import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const code = document.getElementById("code");
const discount = document.getElementById("discount");
const type = document.getElementById("type");
const minimumOrder = document.getElementById("minimumOrder");
const usageLimit = document.getElementById("usageLimit");
const expireDate = document.getElementById("expireDate");

const saveCoupon = document.getElementById("saveCoupon");
const couponsTable = document.getElementById("couponsTable");

saveCoupon.addEventListener("click", addCoupon);

async function addCoupon() {

    if (
        code.value.trim() === "" ||
        discount.value === "" ||
        minimumOrder.value === "" ||
        usageLimit.value === "" ||
        expireDate.value === ""
    ) {

        alert("يرجى إدخال جميع البيانات");

        return;

    }

    try {

        await addDoc(collection(db, "coupons"), {

            code: code.value.trim().toUpperCase(),

            discount: Number(discount.value),

            type: type.value,

            minimumOrder: Number(minimumOrder.value),

            usageLimit: Number(usageLimit.value),

            usedCount: 0,

            active: true,

            expireDate: Timestamp.fromDate(new Date(expireDate.value)),

            createdAt: serverTimestamp()

        });

        alert("✅ تم إنشاء الكوبون");

        code.value = "";
        discount.value = "";
        minimumOrder.value = "";
        usageLimit.value = "";
        expireDate.value = "";

        loadCoupons();

    } catch (e) {

        console.error(e);

        alert("حدث خطأ");

    }

}

async function loadCoupons() {

    couponsTable.innerHTML = "";

    const snap = await getDocs(collection(db, "coupons"));

    snap.forEach(coupon => {

        const data = coupon.data();

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${data.code}</td>

            <td>${data.discount}</td>

            <td>${data.type}</td>

            <td>${data.usedCount}/${data.usageLimit}</td>

            <td>${data.active ? "🟢 مفعل" : "🔴 معطل"}</td>

            <td>

                <button onclick="toggleCoupon('${coupon.id}', ${data.active})">

                ${data.active ? "تعطيل" : "تفعيل"}

                </button>

                <button onclick="deleteCoupon('${coupon.id}')">

                حذف

                </button>

            </td>

        `;

        couponsTable.appendChild(tr);

    });

}

window.deleteCoupon = async function(id) {

    if (!confirm("هل تريد حذف الكوبون؟")) return;

    await deleteDoc(doc(db, "coupons", id));

    loadCoupons();

}

window.toggleCoupon = async function(id, active) {

    await updateDoc(doc(db, "coupons", id), {

        active: !active

    });

    loadCoupons();

}

loadCoupons();
