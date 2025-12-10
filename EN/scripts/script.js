document.addEventListener('DOMContentLoaded', () => {
  // 🎞️ Background Carousel
  const slides = document.querySelectorAll('.carousel-background .carousel-slide');
  let slideIndex = 0;

  const showSlide = index => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  };

  const nextSlide = () => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  };

  showSlide(slideIndex);
  setInterval(nextSlide, 5000);

  // 🧭 Mobile menu
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');

  btn?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('#menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // ⬇️ Smooth scroll to map
  document.getElementById('intro-button')?.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.map-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  // 🗺️ Interactive Map
  const map = L.map('map').setView([48.8566, 2.3522], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];

  const points = {
    day1: [
      { coord: [48.8867, 2.3431], label: 'Montmartre', img: 'images/montmartre.jpg', desc: 'A bohemian district full of art and life.' },
      { coord: [48.8860, 2.3430], label: 'Sacré-Cœur', img: 'images/sacrecoeur.jpg', desc: 'The white basilica overlooking Paris.' },
      { coord: [48.8635, 2.3709], label: 'Paris Commune (1871)', img: 'images/commune.jpg', desc: 'Historical areas linked to the 1871 revolution.' }
    ],
    day2: [
      { coord: [48.8550, 2.3650], label: 'Le Marais', img: 'images/marais.jpg', desc: 'Historic district known for squares, architecture and Jewish heritage.' },
      { coord: [48.8596, 2.3582], label: 'Carnavalet Museum', img: 'images/carnavalet.jpg', desc: 'Museum of the history of Paris.' },
      { coord: [48.8493, 2.3560], label: 'Shoah Memorial', img: 'images/shoah.jpg', desc: 'Memorial dedicated to Holocaust victims.' },
      { coord: [48.8493, 2.3560], label: 'Exhibition “Lili Jacob Album”', img: 'images/lili_jacob_album.jpg', desc: 'Temporary/permanent exhibition inside the Shoah Memorial.' }
    ],
    day3: [
      { coord: [48.8049, 2.1204], label: 'Palace of Versailles', img: 'images/versailles.jpg', desc: 'Majestic royal residence symbol of absolutism.' },
      { coord: [48.8156, 2.1265], label: 'Versailles Gardens', img: 'images/giardini.jpg', desc: 'Spectacular geometric gardens by Le Nôtre.' }
    ],
    day4: [
      { coord: [48.8561, 2.3129], label: 'Hôtel des Invalides', img: 'images/invalides.jpg', desc: 'Complex hosting museums and Napoleon’s tomb.' },
      { coord: [48.8560, 2.3130], label: 'Army Museum', img: 'images/musee_armee.jpg', desc: 'Museum located inside Les Invalides.' },
      { coord: [48.8560, 2.3130], label: 'Tomb of Napoleon', img: 'images/tomba_napoleone.jpg', desc: 'Napoleon’s monumental burial under the golden dome.' },
      { coord: [48.8351, 2.3259], label: 'Liberation Museum – Gen. Leclerc', img: 'images/liberation_leclerc.jpg', desc: 'Museum dedicated to the Liberation of Paris.' }
    ],
    day5: [
      { coord: [48.8559, 2.3456], label: 'Conciergerie', img: 'images/conciergerie.jpg', desc: 'Former palace and prison of the Palais de la Cité.' },
      { coord: [48.8600, 2.3333], label: '1st Arrondissement', img: 'images/1er_arrondissement.jpg', desc: 'Visit near Louvre and Tuileries.' },
      { coord: [48.8584, 2.2945], label: 'Eiffel Tower (optional)', img: 'images/eiffel.jpg', desc: 'Iconic symbol of Paris.' }
    ]
  };

  const clearMarkers = () => {
    markers.forEach(marker => map.removeLayer(marker));
    markers.length = 0;
  };

  window.goToDay = day => {
    if (!points[day]) return;

    localStorage.setItem('selectedDay', day);
    sessionStorage.setItem('mapInteraction', 'true');

    clearMarkers();

    const placeholder = document.getElementById('map-placeholder');
    if (placeholder) placeholder.remove();

    const bounds = [];

    points[day].forEach(p => {
      const streetViewUrl = `https://www.google.com/maps?q=&layer=c&cbll=${p.coord[0]},${p.coord[1]}`;
      const popupContent = `
        <div style="max-width:200px">
          <a href="${streetViewUrl}" target="_blank" rel="noopener noreferrer">
            <img src="${p.img}" alt="${p.label}" style="width:100%; border-radius:5px; margin-bottom:5px;" />
          </a>
          <strong>${p.label}</strong><br/>
          <em>${p.desc}</em><br/>
          <a href="${streetViewUrl}" target="_blank" style="color:#003366; font-weight:bold;">🌍 Street View</a>
        </div>
      `;
      const marker = L.marker(p.coord).addTo(map);
      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const offset = map.project(p.coord).subtract([0, 100]);
        const target = map.unproject(offset);
        map.panTo(target, { animate: true });
      });

      markers.push(marker);
      bounds.push(p.coord);
    });

    map.fitBounds(bounds);
  };

  // 📍 User location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const userMarker = L.marker([lat, lon]).addTo(map);
        userMarker.bindPopup('<strong>📍 You are here</strong>').openPopup();
        map.setView([lat, lon], 13);
      },
      err => {
        console.warn('Geolocation unavailable:', err.message);
      }
    );
  }

  // ⬆️ Scroll to top button
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollTopBtn';
  scrollBtn.textContent = '⬆️';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
