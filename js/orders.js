
import { db } from "../../js/firebase.js";

import {

collection,
getDocs,
doc,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table=document.getElementById("ordersTable");

async function loadOrders(){

table.innerHTML="";

const snapshot=await getDocs(collection(db,"orders"));

snapshot.forEach(order=>{

const data=order.data();

table.innerHTML+=`

<tr>

<td>${order.id}</td>

<td>${data.userId}</td>

<td>${data.total} جنيه</td>

<td>

<select onchange="changeStatus('${order.id}',this.value)">

<option ${data.status=="pending"?"selected":""} value="pending">جديد</option>

<option ${data.status=="preparing"?"selected":""} value="preparing">جارى التحضير</option>

<option ${data.status=="delivery"?"selected":""} value="delivery">مع المندوب</option>

<option ${data.status=="completed"?"selected":""} value="completed">تم التسليم</option>

<option ${data.status=="cancelled"?"selected":""} value="cancelled">ملغى</option>

</select>

</td>

<td>

✅

</td>

</tr>

`;

});

}

window.changeStatus=async(id,status)=>{

await updateDoc(doc(db,"orders",id),{

status:status

});

alert("تم تحديث حالة الطلب");

}

loadOrders();
