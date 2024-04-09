// includeFooter.js
document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.getElementById('footer-container');
    footerContainer.innerHTML = `
        <!-- Include the footer -->
        <div id="footer-placeholder"></div>
    `;

    // Fetch footer.html and include it in the placeholder
    fetch('/pages/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            footerPlaceholder.innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching footer:', error);
        });
});