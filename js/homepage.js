// Checking the presence of element with IDcomment-btn
const btn = document.querySelector('#comment-btn');

if (btn) {
    // Add the click event to the element
    btn.addEventListener('click', () => {
        alert('Commenting on the text');
    });
} else {
    console.error("Element with id 'comment-btn' not found!");
}

// desired coordinates (latitude and longitude)
var latitude = 65.059412;
var longitude = 25.465970;

// Initialize and add the map
var myMap = L.map('map').setView([latitude, longitude], 13); // Map center and zoom level

// Add tile layer and marker
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Add marker to the map
L.marker([latitude, longitude]).addTo(myMap)
    .bindPopup('Your location') // Popup message
    .openPopup(); // Open popup by default
