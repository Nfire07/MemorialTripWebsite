// =====================
// 🎞️ Carosello immagini
// =====================
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Avvio automatico del carosello ogni 5 secondi
setInterval(nextSlide, 5000);
showSlide(slideIndex);

// =====================
// 🗺️ Mappa interattiva
// =====================
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const punti = {
  giorno1: [
    { coord: [48.8867, 2.3431], label: "Montmartre" },
    { coord: [48.8860, 2.3430], label: "Sacré-Cœur" },
    { coord: [48.8635, 2.3709], label: "La Commune di Parigi (1871)" }
  ],
  giorno2: [
    { coord: [48.8590, 2.3620], label: "Marais" },
    { coord: [48.8575, 2.3622], label: "Musée Carnavalet" },
    { coord: [48.8546, 2.3572], label: "Mémorial de la Shoah" }
  ],
  giorno3: [
    { coord: [48.8049, 2.1204], label: "Palazzo di Versailles" },
    { coord: [48.8056, 2.1236], label: "Giardini di Versailles" }
  ],
  giorno4: [
    { coord: [48.8556, 2.3126], label: "Invalides / Musée de l’Armée" },
    { coord: [48.8550, 2.3120], label: "Tomba di Napoleone" },
    { coord: [48.8326, 2.3235], label: "Musée de la Libération" },
    { coord: [48.8326, 2.3235], label: "Musée du Général Leclerc - Moulin" }
  ],
  giorno5: [
    { coord: [48.8554, 2.3450], label: "Conciergerie" },
    { coord: [48.8625, 2.3361], label: "1er Arrondissement" },
    { coord: [48.8584, 2.2945], label: "Tour Eiffel (facoltativo)" }
  ]
};

// Centra la mappa su tutti i punti
const allCoords = Object.values(punti).flat().map(p => p.coord);
map.fitBounds(L.latLngBounds(allCoords));

let markers = [];

function vaiA(giorno) {
  // Rimuove i marker precedenti
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const luoghi = punti[giorno];
  const bounds = [];

  luoghi.forEach(p => {
    const marker = L.marker(p.coord).addTo(map).bindPopup(p.label);
    markers.push(marker);
    bounds.push(p.coord);
  });

  map.fitBounds(bounds);
}