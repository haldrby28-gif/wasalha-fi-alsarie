import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btn=document.getElementById("registerBtn");

btn.addEventListener("click",async()=>{

const name=document.getElementById("name").value.trim();
const email=document.getElementById("email").value.trim();
const password=document.getElementById("password").value;

if(!name||!email||!password){
alert("يرجى ملء جميع الحقول");
return;
}

try{

const user=await createUserWithEmailAndPassword(auth,email,password);

await setDoc(doc(db,"users",user.user.uid),{

name:name,
email:email,
role:"customer",
phone:"",
address:"",
photo:"",
createdAt:new Date()

});

alert("تم إنشاء الحساب بنجاح");

window.location.href="login.html";

}catch(e){

alert(e.message);

}

});
