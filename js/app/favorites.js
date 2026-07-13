import { auth, db } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const favoritesContainer = document.getElementById("favorites");

auth.onAuthStateChanged(async (user) => {

    if (!user) {
        favoritesContainer.innerHTML = `
            <p style="text-align:center;padding:20px;">
                يجب تسجيل الدخول أولاً
            </p>
        `;
        return;
    }

    const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        favoritesContainer.innerHTML = `
            <p style="text-align:center;padding:20px;">
                لا توجد عناصر بالمفضلة ❤️
            </p>
        `;

        return;
    }

    favoritesContainer.innerHTML = "";

    snapshot.forEach((docSnap) => {

        const item = docSnap.data();

        favoritesContainer.innerHTML += `

        <div class="restaurant-card">

            <img src="${item.image}" alt="${item.name}">

            <h3>${item.name}</h3>

            <p>${item.category}</p>

            <button class="removeFavorite"
                    data-id="${docSnap.id}">
                ❌ إزالة
            </button>

        </div>

        `;

    });

    document.querySelectorAll(".removeFavorite").forEach(btn => {

        btn.onclick = async () => {

            if (!confirm("حذف من المفضلة؟")) return;

            await deleteDoc(
                doc(db, "favorites", btn.dataset.id)
            );

            location.reload();

        };

    });

});
