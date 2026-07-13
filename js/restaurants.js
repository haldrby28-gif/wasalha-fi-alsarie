import { db } from "../../js/firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const saveBtn = document.getElementById("saveRestaurant");

saveBtn.addEventListener("click", async () => {

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const deliveryTime = document.getElementById("deliveryTime").value.trim();
  const deliveryFee = Number(document.getElementById("deliveryFee").value);
  const status = document.getElementById("status").value === "true";

  if (!name || !category) {
    alert("يرجى إدخال اسم المطعم والتصنيف.");
    return;
  }

  try {
    await addDoc(collection(db, "restaurants"), {
      name,
      description,
      category,
      deliveryTime,
      deliveryFee,
      isOpen: status,
      rating: 5,
      image: "",
      createdAt: new Date()
    });

    alert("تم إضافة المطعم بنجاح ✅");

    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("deliveryTime").value = "";
    document.getElementById("deliveryFee").value = "";

  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء إضافة المطعم");
  }

});
