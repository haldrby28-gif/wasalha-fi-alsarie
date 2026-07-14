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
            </tr>
        `;

    }

}

function renderUsers(list) {

    tbody.innerHTML = "";

    if (list.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    لا يوجد مستخدمون.
                </td>
            </tr>
        `;

        return;

    }

    list.forEach(user => {

        tbody.innerHTML += `

        <tr>

            <td>${user.name || "-"}</td>

            <td>${user.email || "-"}</td>

            <td>${user.role || "customer"}</td>

            <td>

                <span class="status ${user.disabled ? "inactive" : "active"}">

                    ${user.disabled ? "موقوف" : "نشط"}

                </span>

            </td>

            <td>

                <button
                    class="toggle"
                    onclick="toggleUser('${user.id}', ${user.disabled ? true : false})">

                    ${user.disabled ? "تفعيل" : "إيقاف"}

                </button>

                <button
                    class="delete"
                    onclick="removeUser('${user.id}')">

                    حذف

                </button>

            </td>

        </tr>

        `;

    });

}
