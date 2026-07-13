import { db } from "../../js/firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const name = document.getElementById("name");
const category = document.getElementById("category");
const phone = document.getElementById("phone");
const isOpen = document.getElementById("isOpen");
const saveBtn = document.getElementById("saveBtn");

if (!id) {
    alert("معرف المطعم غير موجود");
    window.location.href = "restaurants.html";
}

async function loadRestaurant() {
    try {
        const ref = doc(db, "restaurants", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            alert("المطعم غير موجود");
            window.location.href = "restaurants.html";
            return;
        }

        const data = snap.data();

        name.value = data.name || "";
        category.value = data.category || "";
        phone.value = data.phone || "";
        isOpen.value = String(data.isOpen);

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء تحميل بيانات المطعم");
    }
}

loadRestaurant();

saveBtn.addEventListener("click", async () => {
    try {
        await updateDoc(doc(db, "restaurants", id), {
            name: name.value.trim(),
            category: category.value.trim(),
            phone: phone.value.trim(),
            isOpen: isOpen.value === "true"
        });

        alert("تم حفظ التعديلات بنجاح");
        window.location.href = "restaurants.html";

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء حفظ التعديلات");
    }
});
