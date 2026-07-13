async function loadComponent(id, file) {
    const res = await fetch(file);
    document.getElementById(id).innerHTML = await res.text();

    if (id === "sidebar") {
        activateCurrentPage();
    }
}

loadComponent("sidebar", "./components/sidebar.html");
loadComponent("header", "./components/header.html");
loadComponent("footer", "./components/footer.html");

function activateCurrentPage() {
    const page = location.pathname.split("/").pop();

    document.querySelectorAll(".sidebar a").forEach(link => {
        if (link.getAttribute("href") === page) {
            link.classList.add("active");
        }
    });
}

window.toggleSidebar = function () {
    document.querySelector(".sidebar").classList.toggle("show");
};
