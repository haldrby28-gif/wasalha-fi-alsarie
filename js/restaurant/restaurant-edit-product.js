import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const form = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

let restaurantId = "";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    try {

        // معرفة المطعم الخاص بصاحب الحساب
        const restaurantQuery = query(
            collection(db, "restaurants"),
            where("ownerUid", "==", user.uid)
        );

        const restaurantSnapshot = await getDocs(restaurantQuery);

        if (restaurantSnapshot.empty) {

            alert("هذا الحساب لا يملك مطعماً.");
            location.href = "login.html";
            return;

        }

        restaurantId = restaurantSnapshot.docs[0].id;

        loadProduct();

    } catch (error) {

        console.error(error);
        alert("حدث خطأ.");

    }

});

async function loadProduct() {

    try {

        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {

            alert("المنتج غير موجود.");
            location.href = "products.html";
            return;

        }

        const product = productSnap.data();

        // التأكد أن المنتج يتبع هذا المطعم
        if (product.restaurantId !== restaurantId) {

            alert("غير مصرح لك بتعديل هذا المنتج.");
            location.href = "products.html";
            return;

        }

        nameInput.value = product.name || "";
        descriptionInput.value = product.description || "";
        priceInput.value = product.price || "";
        categoryInput.value = product.category || "";
        imageInput.value = product.image || "";

        preview.src = product.image || "";

    } catch (error) {

        console.error(error);

    }

}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await updateDoc(doc(db, "products", productId), {

            name: nameInput.value.trim(),

            description: descriptionInput.value.trim(),

            price: Number(priceInput.value),

            category: categoryInput.value.trim(),

            image: imageInput.value.trim()

        });

        alert("✅ تم تحديث المنتج بنجاح.");

        location.href = "products.html";

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء التعديل.");

    }

});
