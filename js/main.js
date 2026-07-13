import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const container=document.getElementById("restaurants");

async function loadRestaurants(){

const snapshot=await getDocs(collection(db,"restaurants"));

snapshot.forEach(doc=>{

const data=doc.data();

container.innerHTML+=`

<div class="card">

<img src="${data.image}" alt="">

<h3>${data.name}</h3>

<p>${data.category}</p>

<p>⭐ ${data.rating}</p>

<p>🚚 ${data.deliveryTime}</p>

<button>

عرض المطعم

</button>

</div>

`;

});

}

loadRestaurants();
