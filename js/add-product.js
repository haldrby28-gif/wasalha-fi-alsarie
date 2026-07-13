import { db } from "../../js/firebase.js";

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("saveProduct").addEventListener("click", async()=>{

const name=document.getElementById("name").value;
const description=document.getElementById("description").value;
const price=Number(document.getElementById("price").value);
const restaurantId=document.getElementById("restaurantId").value;
const available=document.getElementById("available").value==="true";

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

});
