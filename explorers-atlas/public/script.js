// Initialize Leaflet Map (centered on Rome)
const map = L.map('map').setView([41.9028, 12.4964], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Sidebar Toggle Functionality
document.getElementById('toggle-left').addEventListener('click', () => {
    document.getElementById('left-sidebar').classList.toggle('hidden');
});

document.getElementById('toggle-right').addEventListener('click', () => {
    document.getElementById('right-sidebar').classList.toggle('hidden-right');
});

// Manage Attraction Markers
let markers = [];

function updateMap() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    const selectedCategories = Array.from(document.querySelectorAll('#filters input:checked'))
        .map(input => input.value);

    attractions.forEach(attraction => {
        if (selectedCategories.includes(attraction.category)) {
            const marker = L.marker(attraction.coords).addTo(map);
            marker.bindPopup(`
                <h3>${attraction.name}</h3>
                <img src="${attraction.photo}" alt="${attraction.name}" width="100">
                <p><a href="${attraction.wiki}" target="_blank">Wikipedia</a></p>
                <p><a href="${attraction.official}" target="_blank">Official Site</a></p>
                <p><a href="${attraction.googleMaps}" target="_blank">Google Maps</a></p>
            `);
            markers.push(marker);
        }
    });
}

document.querySelectorAll('#filters input').forEach(input => {
    input.addEventListener('change', updateMap);
});

// Scoring Function
function scoreItem(item) {
    let score = 0;
    score += item.price <= 120 ? 5 : item.price <= 140 ? 4 : 3; // Price
    score += item.distance <= 1 ? 5 : item.distance <= 3 ? 4 : 3; // Distance
    score += item.rating >= 4.9 ? 5 : item.rating >= 4.7 ? 4 : 3; // Rating
    return score; // Simplified for mock data
}

// Fetch and Populate Sidebars
async function fetchAndPopulate(endpoint, contentId) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const scoredItems = data.map(item => ({ ...item, score: scoreItem(item) }));
        const top5 = scoredItems.sort((a, b) => b.score - a.score).slice(0, 5);
        const content = document.getElementById(contentId);
        content.innerHTML = top5.map(item => `
            <div>
                <h4>${item.name}</h4>
                <p>Price: $${item.price}</p>
                <p>Rating: ${item.rating}/5</p>
                <p><a href="${item.link}" target="_blank">Book Now</a></p>
            </div>
        `).join('');
    } catch (error) {
        document.getElementById(contentId).innerHTML = 'Failed to load data';
    }
}

fetchAndPopulate('/api/stays', 'stay-content');
fetchAndPopulate('/api/eats', 'eat-content');
fetchAndPopulate('/api/guides', 'guide-content');

// Search Functionality
function addSearch(inputId, contentId) {
    document.getElementById(inputId).addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const content = document.getElementById(contentId);
        Array.from(content.children).forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            item.style.display = name.includes(query) ? 'block' : 'none';
        });
    });
}

addSearch('search-left', 'stay-content');
addSearch('search-left', 'eat-content');
addSearch('search-right', 'guide-content');

// Initial map load
updateMap(); 
