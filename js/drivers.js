import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tbody = document.querySelector("#driversTable tbody");
const searchInput = document.getElementById("searchDriver");

let drivers = [];

async function loadDrivers() {

    tbody.innerHTML = `
        <tr>
            <td colspan="5">جاري تحميل المندوبين...</td>
        </tr>
    `;

    drivers = [];

    try {

        const snapshot = await getDocs(collection(db, "drivers"));

        snapshot.forEach((docSnap) => {

            drivers.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        renderDrivers(drivers);

    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="5">حدث خطأ أثناء تحميل البيانات.</td>
            </tr>
        `;

    }

}

function renderDrivers(list) {

    tbody.innerHTML = "";

    if (list.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">لا يوجد مندوبون.</td>
            </tr>
        `;

        return;

    }

    list.forEach(driver => {

        tbody.innerHTML += `

        <tr>

            <td>${driver.name || "-"}</td>

            <td>${driver.phone || "-"}</td>

            <td>

                <span class="status ${driver.isOnline ? "online" : "offline"}">

                    ${driver.isOnline ? "🟢 متصل" : "🔴 غير متصل"}

                </span>

            </td>

            <td>

                ${driver.currentOrder || "-"}

            </td>

            <td>

                <button
                    class="toggle"
                    onclick="toggleDriver('${driver.id}', ${driver.isOnline})">

                    ${driver.isOnline ? "إيقاف" : "تشغيل"}

                </button>

                <button
                    class="delete"
                    onclick="removeDriver('${driver.id}')">

                    حذف

                </button>

            </td>

        </tr>

        `;

    });

}

searchInput.addEventListener("input", () => {

    const value = searchInput.value
        .trim()
        .toLowerCase();

    const filtered = drivers.filter(driver =>

        (driver.name || "")
            .toLowerCase()
            .includes(value)

        ||

        (driver.phone || "")
            .toLowerCase()
            .includes(value)

    );

    renderDrivers(filtered);

});

window.toggleDriver = async function(id, currentStatus) {

    try {

        await updateDoc(doc(db, "drivers", id), {

            isOnline: !currentStatus

        });

        loadDrivers();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تحديث حالة المندوب.");

    }

};

window.removeDriver = async function(id) {

    if (!confirm("هل تريد حذف هذا المندوب؟")) {

        return;

    }

    try {

        await deleteDoc(doc(db, "drivers", id));

        loadDrivers();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء حذف المندوب.");

    }

};

loadDrivers();
