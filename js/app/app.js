// js/app/app.js

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ تطبيق وصلها يعمل");

    // تحديث سنة الفوتر (إذا وجدت)
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

});
