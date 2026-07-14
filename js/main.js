import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const notificationCount = document.getElementById("notificationCount");

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        where("isRead", "==", false)
    );

    onSnapshot(q, (snapshot) => {

        const count = snapshot.size;

        if (count > 0) {

            notificationCount.style.display = "flex";
            notificationCount.textContent = count;

        } else {

            notificationCount.style.display = "none";

        }

    });

});
