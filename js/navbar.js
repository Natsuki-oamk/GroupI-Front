// includeNavbar.js
document.addEventListener('DOMContentLoaded', function() {
    const navbarContainer = document.getElementById('navbar-container');
    navbarContainer.innerHTML = `
        <!-- Include the navbar -->
        <div id="navbar-placeholder"></div>
    `;

    // Fetch navbar.html and include it in the placeholder
    fetch('/pages/navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            navbarPlaceholder.innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching navbar:', error);
        });
});
