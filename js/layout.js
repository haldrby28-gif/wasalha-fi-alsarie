async function loadComponent(id, file) {
    const response = await fetch(file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}

loadComponent("sidebar", "components/sidebar.html");
loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");
