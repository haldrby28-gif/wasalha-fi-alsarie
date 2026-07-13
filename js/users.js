import { db } from "../../js/firebase.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("usersTable");

onSnapshot(collection(db,"users"),(snapshot)=>{

table.innerHTML="";

snapshot.forEach((user)=>{

const data=user.data();

table.innerHTML += `

<tr>

<td>${data.name || "-"}</td>

<td>${data.email || "-"}</td>

<td>${data.role || "customer"}</td>

<td>

<span class="status ${data.active ? "active":"inactive"}">

${data.active ? "نشط":"موقوف"}

</span>

</td>

</tr>

`;

});

});
