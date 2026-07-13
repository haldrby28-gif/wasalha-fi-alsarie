// js/app/map.js

const mapContainer = document.getElementById("map");

function showMessage(message) {
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="
                padding:20px;
                text-align:center;
                background:#fff;
                border-radius:10px;
                margin:15px;
                box-shadow:0 2px 6px rgba(0,0,0,.1);
            ">
                ${message}
            </div>
        `;
    }
}

function getCurrentLocation() {

    if (!navigator.geolocation) {
        showMessage("المتصفح لا يدعم تحديد الموقع.");
        return;
    }

    showMessage("جاري تحديد موقعك...");

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            showMessage(`
                <h3>📍 موقعك الحالي</h3>
                <p>خط العرض: ${latitude}</p>
                <p>خط الطول: ${longitude}</p>
            `);

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

        },

        () => {
            showMessage("تعذر الحصول على الموقع.");
        }

    );

}

document.addEventListener("DOMContentLoaded", () => {
    getCurrentLocation();
});
