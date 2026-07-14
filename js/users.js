import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tbody = document.querySelector("#usersTable tbody");
const searchInput = document.getElementById("searchUser");

let users = [];

async function loadUsers() {

    tbody.innerHTML = `
        <tr>
            <td colspan="5">جاري تحميل المستخدمين...</td>
        </tr>
    `;

    users = [];

    try {

        const snapshot = await getDocs(collection(db, "users"));

        snapshot.forEach((docSnap) => {

            users.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        renderUsers(users);

    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="5">حدث خطأ أثناء تحميل البيانات.</td>
           
