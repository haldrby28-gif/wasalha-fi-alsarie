import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("productForm");

const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");

let restaurantId = "";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    try {

        const q = query(
            collection(db, "restaurants"),
            where("ownerUid", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            alert("هذا الحساب لا يملك مطعماً.");

            location.href = "login.html";

            return;

        }

        restaurantId = snapshot.docs[0].id;

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تحميل بيانات المطعم.");

    }

});

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!restaurantId) {

        alert("لم يتم العثور على المطعم.");

        return;

    }

    try {

        await addDoc(collection(db, "products"), {

            restaurantId: restaurantId,

            name: nameInput.value.trim(),

            description: descriptionInput.value.trim(),

            price: Number(priceInput.value),

            category: categoryInput.value.trim(),

            image: imageInput.value.trim(),

            isAvailable: true,

            createdAt: serverTimestamp()

        });

        alert("✅ تم إضافة المنتج بنجاح.");

        location.href = "products.html";

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء إضافة المنتج.");

    }

});
