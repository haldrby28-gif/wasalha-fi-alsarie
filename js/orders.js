import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("ordersTable");

async function loadOrders() {

    table.innerHTML = "";

    const snapshot = await getDocs(collection(db, "orders"));

    if (snapshot.empty) {

        table.innerHTML = `
            <tr>
                <td colspan="6">لا توجد طلبات</td>
            </tr>
        `;

        return;
    }

    for (const orderDoc of snapshot.docs) {

        const order = orderDoc.data();

        // اسم العميل
        let userName = order.userId;

        try {

            const userSnap = await getDoc(doc(db, "users", order.userId));

            if (userSnap.exists()) {

                userName = userSnap.data().name || order.userId;

            }

        } catch (e) {}

        // اسم المطعم
        let restaurantName = order.restaurantId;

        try {

            const restaurantSnap = await getDoc(doc(db, "restaurants", order.restaurantId));

            if (restaurantSnap.exists()) {

                restaurantName = restaurantSnap.data().name || order.restaurantId;

            }

        } catch (e) {}

        table.innerHTML += `

        <tr>

            <td>${orderDoc.id}</td>

            <td>${userName}</td>

            <td>${restaurantName}</td>

            <td>${order.total} جنيه</td>

            <td>

                <select id="status-${orderDoc.id}">

                    <option value="pending" ${order.status==="pending"?"selected":""}>
                        قيد الانتظار
                    </option>

                    <option value="accepted" ${order.status==="accepted"?"selected":""}>
                        تم القبول
                    </option>

                    <option value="preparing" ${order.status==="preparing"?"selected":""}>
                        جاري التحضير
                    </option>

                    <option value="on_the_way" ${order.status==="on_the_way"?"selected":""}>
                        خرج للتوصيل
                    </option>

                    <option value="completed" ${order.status==="completed"?"selected":""}>
                        تم التسليم
                    </option>

                    <option value="cancelled" ${order.status==="cancelled"?"selected":""}>
                        ملغي
                    </option>

                </select>

            </td>

            <td>

                <button onclick="updateStatus('${orderDoc.id}')">

                    حفظ

                </button>

            </td>

        </tr>

        `;

    }

}

window.updateStatus = async function(orderId) {

    const status = document.getElementById(`status-${orderId}`).value;

    await updateDoc(doc(db, "orders", orderId), {

        status: status

    });

    alert("تم تحديث حالة الطلب");

};

loadOrders();
