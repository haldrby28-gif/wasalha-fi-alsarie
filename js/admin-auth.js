import { db } from "../../js/firebase.js";

import {
collection,
getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadDashboard() {

try {

const users =
await getCountFromServer(collection(db,"users"));

const restaurants =
await getCountFromServer(collection(db,"restaurants"));

const orders =
await getCountFromServer(collection(db,"orders"));

const drivers =
await getCountFromServer(collection(db,"drivers"));

document.getElementById("usersCount").textContent =
users.data().count;

document.getElementById("restaurantsCount").textContent =
restaurants.data().count;

document.getElementById("ordersCount").textContent =
orders.data().count;

document.getElementById("driversCount").textContent =
drivers.data().count;

} catch(error){

console.error(error);

}

}

loadDashboard();
