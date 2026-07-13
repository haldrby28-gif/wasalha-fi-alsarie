
import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("search");

let products = [];
let restaurantId = "";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    try {

        const restaurantQuery = query(
            collection(db, "restaurants"),
            where("ownerUid", "==", user.uid)
        );

        const restaurantSnapshot = await getDocs(restaurantQuery);

        if (restaurantSnapshot.empty) {

            alert("هذا الحساب ليس صاحب مطعم.");

            location.href = "login.html";

            return;

        }

        restaurantId = restaurantSnapshot.docs[0].id;

        loadProducts();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ.");

    }

});

async function loadProducts() {

    products = [];

    productsContainer.innerHTML = `
        <p style="text-align:center">
            جاري تحميل المنتجات...
        </p>
    `;

    const q = query(
        collection(db, "products"),
        where("restaurantId", "==", restaurantId)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        products.push({

            id: docSnap.id,

            ...docSnap.data()

        });

    });

    renderProducts(products);

}
function renderProducts(list) {

    productsContainer.innerHTML = "";

    if (list.length === 0) {

        productsContainer.innerHTML = `
            <p style="text-align:center;">
                لا توجد منتجات.
            </p>
        `;

        return;

    }

    list.forEach(product => {

        productsContainer.innerHTML += `

        <div class="card">

            <img
                src="${product.image}"
                alt="${product.name}">

            <div class="info">

                <h3>${product.name}</h3>

                <div class="price">

                    ${product.price} جنيه

                </div>

                <div class="buttons">

                    <button
                        class="edit"
                        onclick="editProduct('${product.id}')">

                        ✏️ تعديل

                    </button>

                    <button
                        class="delete"
                        onclick="deleteProduct('${product.id}')">

                        🗑️ حذف

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

searchInput.addEventListener("input", () => {

    const value = searchInput.value
        .trim()
        .toLowerCase();

    const filtered = products.filter(product =>

        (product.name || "")
            .toLowerCase()
            .includes(value)

    );

    renderProducts(filtered);

});

window.editProduct = function(id) {

    location.href = `edit-product.html?id=${id}`;

};

window.deleteProduct = async function(id) {

    if (!confirm("هل تريد حذف المنتج؟")) {

        return;

    }

    try {

        await deleteDoc(doc(db, "products", id));

        products = products.filter(product => product.id !== id);

        renderProducts(products);

        alert("✅ تم حذف المنتج.");

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء حذف المنتج.");

    }

};
window.refreshProducts = async function () {

    try {

        const q = query(
            collection(db, "products"),
            where("restaurantId", "==", restaurantId)
        );

        const snapshot = await getDocs(q);

        products = [];

        snapshot.forEach((docSnap) => {

            products.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        renderProducts(products);

    } catch (error) {

        console.error(error);

    }

};

// تحميل المنتجات عند فتح الصفحة
loadProducts();
