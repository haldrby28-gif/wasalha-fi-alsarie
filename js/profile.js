import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const userName=document.getElementById("userName");
const userEmail=document.getElementById("userEmail");
const userPhone=document.getElementById("userPhone");
const logoutBtn=document.getElementById("logoutBtn");

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="login.html";

return;

}

const snap=await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

const data=snap.data();

userName.textContent=data.name||"مستخدم";

userEmail.textContent="📧 "+(data.email||user.email);

userPhone.textContent="📱 "+(data.phone||"غير مسجل");

}

});

logoutBtn.addEventListener("click",async()=>{

await signOut(auth);

location.href="login.html";

});
