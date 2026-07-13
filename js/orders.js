import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const table = document.getElementById("ordersTable");

async function loadOrders() {

    table.innerHTML = "";

    const snapshot = await getDocs(collection(db, "orders"));

    if (snapshot.empty) {

        table.innerHTML = `
        <tr>
            <td colspan="5">لا توجد طلبات</td>
        </tr>
        `;

        return;
    }

    snapshot.forEach((orderDoc) => {

        const order = orderDoc.data();

        table.innerHTML += `

        <tr>

            <td>${orderDoc.id}</td>

            <td>${order.userId}</td>

            <td>${order.total} جنيه</td>

            <td>

                <select id="status-${orderDoc.id}">

                    <option value="قيد الانتظار" ${order.status==="قيد الانتظار"?"selected":""}>
                    قيد الانتظار
                    </option>

                    <option value="تم القبول" ${order.status==="تم القبول"?"selected":""}>
                    تم القبول
                    </option>

                    <option value="جارى التحضير" ${order.status==="جارى التحضير"?"selected":""}>
                    جارى التحضير
                    </option>

                    <option value="خرج للتوصيل" ${order.status==="خرج للتوصيل"?"selected":""}>
                    خرج للتوصيل
                    </option>

                    <option value="تم التسليم" ${order.status==="تم التسليم"?"selected":""}>
                    تم التسليم
                    </option>

                    <option value="ملغى" ${order.status==="ملغى"?"selected":""}>
                    ملغى
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

    });

}

window.updateStatus = async function(orderId){

    const status = document.getElementById(`status-${orderId}`).value;

    await updateDoc(doc(db,"orders",orderId),{

        status:status

    });

    alert("تم تحديث حالة الطلب");

}

loadOrders();
