import { db } from "../../js/firebase.js";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("ordersTable");

onSnapshot(collection(db, "orders"), (snapshot) => {

  table.innerHTML = "";

  snapshot.forEach((order) => {

    const data = order.data();

    table.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${data.userId || "-"}</td>
        <td>${data.total || 0} جنيه</td>

        <td>
          <select onchange="changeStatus('${order.id}',this.value)">
            <option value="pending" ${data.status=="pending"?"selected":""}>جديد</option>
            <option value="preparing" ${data.status=="preparing"?"selected":""}>جاري التحضير</option>
            <option value="delivery" ${data.status=="delivery"?"selected":""}>مع المندوب</option>
            <option value="completed" ${data.status=="completed"?"selected":""}>تم التسليم</option>
            <option value="cancelled" ${data.status=="cancelled"?"selected":""}>ملغي</option>
          </select>
        </td>

        <td>✅</td>
      </tr>
    `;

  });

});

window.changeStatus = async (id, status) => {

  await updateDoc(doc(db, "orders", id), {
    status: status
  });

};
