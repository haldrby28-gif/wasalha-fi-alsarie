import { db } from "../../js/firebase.js";

import {

collection,

onSnapshot,

deleteDoc,

doc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table=document.getElementById("productsTable");

onSnapshot(collection(db,"products"),(snapshot)=>{

table.innerHTML="";

snapshot.forEach((product)=>{

const data=product.data();

table.innerHTML+=`

<tr>

<td>${data.name}</td>

<td>${data.restaurantId}</td>

<td>${data.price} جنيه</td>

<td>${data.available?"✅":"❌"}</td>

<td>

<button class="delete"

onclick="deleteProduct('${product.id}')">

حذف

</button>

</td>

</tr>

`;

});

});

window.deleteProduct=async(id)=>{

if(confirm("حذف المنتج؟")){

await deleteDoc(doc(db,"products",id));

}

}
