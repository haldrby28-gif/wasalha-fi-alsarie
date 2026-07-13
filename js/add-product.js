import { db } from "../../js/firebase.js";

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const restaurantSelect=document.getElementById("restaurantId");

async function loadRestaurants(){

restaurantSelect.innerHTML="<option value=''>اختر المطعم</option>";

const snapshot=await getDocs(collection(db,"restaurants"));

snapshot.forEach((doc)=>{

const data=doc.data();

restaurantSelect.innerHTML+=`
<option value="${doc.id}">
${data.name}
</option>
`;

});

}

loadRestaurants();

document.getElementById("saveProduct").addEventListener("click",async()=>{

const name=document.getElementById("name").value.trim();

const description=document.getElementById("description").value.trim();

const price=Number(document.getElementById("price").value);

const restaurantId=restaurantSelect.value;

const available=document.getElementById("available").value==="true";

if(!name||!restaurantId){

alert("أكمل جميع البيانات");

return;

}

await addDoc(collection(db,"products"),{

name,
description,
price,
restaurantId,
available,
image:"",
createdAt:new Date()

});

alert("تمت إضافة المنتج بنجاح");

window.location.reload();

});
