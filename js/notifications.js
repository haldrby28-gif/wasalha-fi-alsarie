import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const container = document.getElementById("notificationsContainer");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            container.innerHTML = `
                <div class="empty">
                    لا توجد إشعارات حالياً 🔔
                </div>
            `;

            return;
        }

        container.innerHTML = "";

        snapshot.forEach(async (notification) => {

            const data = notification.data();

            const date = data.createdAt
                ? data.createdAt.toDate().toLocaleString("ar-EG")
                : "";

            container.innerHTML += `
                <div class="notification">
                    <h3>${data.title}</h3>

                    <p>${data.message}</p>

                    <small>${date}</small>
                </div>
            `;

            await updateDoc(
                doc(db, "notifications", notification.id),
                {
                    isRead: true
                }
            );

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty">
                حدث خطأ أثناء تحميل الإشعارات
            </div>
        `;

    }

});
