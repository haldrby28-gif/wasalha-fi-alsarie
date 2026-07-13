import { db } from "../../js/firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("restaurantsTable");

async function loadRestaurants() {

  table.innerHTML = "";

  const snapshot = await getDocs(collection(db, "restaurants"));

  snapshot.forEach((restaurant) => {

    const data = restaurant.data();

    table.innerHTML += `
      <tr>
        <td>
          <img src="${data.image || 'https://via.placeholder.com/80'}"
               width="80"
               height="60"
               style="border-radius:8px;">
        </td>

        <td>${data.name}</td>

        <td>${data.category}</td>

        <td>⭐ ${data.rating ?? 0}</td>

        <td>${data.isOpen ? "🟢 مفتوح" : "🔴 مغلق"}</td>

        <td>
          <button class="action edit">
            تعديل
          </button>

          <button class="action delete"
            onclick="deleteRestaurant('${restaurant.id}')">
            حذف
          </button>
        </td>
      </tr>
    `;

  });

}

window.deleteRestaurant = async function(id){

const ok = confirm("هل تريد حذف المطعم؟");

if(!ok) return;

await deleteDoc(doc(db,"restaurants",id));

loadRestaurants();

}

loadRestaurants();
