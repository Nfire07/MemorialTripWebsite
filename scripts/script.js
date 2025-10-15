document.addEventListener('DOMContentLoaded', () => {
  // 🎞️ Carosello sfondo
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

  // ⬇️ Scroll fluido verso la mappa
  document.getElementById('intro-button')?.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.map-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 🗺️ Mappa interattiva
  const map = L.map('map').setView([48.8566, 2.3522], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];
  const punti = {
    giorno1: [
      { coord: [48.8867, 2.3431], label: 'Montmartre', img: 'images/montmartre.jpg', desc: 'Un quartiere bohémien pieno di arte e vita.' },
      { coord: [48.8860, 2.3430], label: 'Sacré-Cœur', img: 'images/sacrecoeur.jpg', desc: 'La basilica bianca che domina Parigi.' },
      { coord: [48.8635, 2.3709], label: 'La Commune di Parigi', img: 'images/commune.jpg', desc: 'Luogo simbolo della rivoluzione del 1871.' }
    ],
    giorno2: [
      { coord: [48.8493, 2.3560], label: 'Memoriale della Shoah', img: 'images/shoah.jpg', desc: 'Luogo di memoria dedicato alle vittime dell’Olocausto.' },
      { coord: [48.8530, 2.3690], label: 'Place de la Bastille', img: 'images/bastille.jpg', desc: 'Simbolo della Rivoluzione francese del 1789.' },
      { coord: [48.8462, 2.3371], label: 'Pantheon', img: 'images/pantheon.jpg', desc: 'Tempio laico che ospita le tombe di grandi francesi.' }
    ],
    giorno3: [
      { coord: [48.8606, 2.3376], label: 'Museo del Louvre', img: 'images/louvre.jpg', desc: 'Il museo più visitato al mondo, sede della Gioconda.' },
      { coord: [48.8584, 2.2945], label: 'Torre Eiffel', img: 'images/eiffel.jpg', desc: 'Simbolo iconico di Parigi, costruita nel 1889.' },
      { coord: [48.8625, 2.2875], label: 'Campo di Marte', img: 'images/champdemars.jpg', desc: 'Ampio spazio verde ai piedi della Torre Eiffel.' }
    ],
    giorno4: [
      { coord: [48.8049, 2.1204], label: 'Reggia di Versailles', img: 'images/versailles.jpg', desc: 'Maestosa residenza reale simbolo dell’assolutismo francese.' },
      { coord: [48.8156, 2.1265], label: 'Giardini di Versailles', img: 'images/giardini.jpg', desc: 'Spettacolari giardini geometrici progettati da Le Nôtre.' },
      { coord: [48.8014, 2.1301], label: 'Grand Trianon', img: 'images/trianon.jpg', desc: 'Palazzina privata utilizzata dai sovrani per ritirarsi.' }
    ],
    giorno5: [
      { coord: [48.8647, 2.3490], label: 'Hôtel de Ville', img: 'images/hoteldeville.jpg', desc: 'Municipio di Parigi, sede storica dell’amministrazione cittadina.' },
      { coord: [48.8590, 2.3266], label: 'Place Vendôme', img: 'images/vendome.jpg', desc: 'Piazza elegante famosa per gioiellerie e architettura classica.' },
      { coord: [48.8738, 2.2950], label: 'Arco di Trionfo', img: 'images/arco.jpg', desc: 'Monumento dedicato alle vittorie napoleoniche.' }
    ]
  };

  const clearMarkers = () => {
    markers.forEach(marker => map.removeLayer(marker));
    markers.length = 0;
  };

  window.vaiA = giorno => {
    if (!punti[giorno]) return;

    localStorage.setItem('giornoSelezionato', giorno);
    sessionStorage.setItem('interazioneMappa', 'true');
    clearMarkers();

    const placeholder = document.getElementById('map-placeholder');
    if (placeholder) placeholder.remove();

    const bounds = [];

    punti[giorno].forEach(p => {
      const streetViewUrl = `https://www.google.com/maps?q=&layer=c&cbll=${p.coord[0]},${p.coord[1]}`;
      const popupContent = `
        <div style="max-width:200px">
          <a href="${streetViewUrl}" target="_blank" rel="noopener noreferrer">
            <img src="${p.img}" alt="${p.label}" style="width:100%; border-radius:5px; margin-bottom:5px;" />
          </a>
          <strong>${p.label}</strong><br/>
          <em>${p.desc}</em><br/>
          <a href="${streetViewUrl}" target="_blank" style="color:#003366; font-weight:bold;">🌍 Vista Street View</a>
        </div>
      `;
      const marker = L.marker(p.coord).addTo(map);
      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const offset = map.project(p.coord).subtract([0, 100]); // sposta verso il basso
        const target = map.unproject(offset);
        map.panTo(target, { animate: true });
      });

      markers.push(marker);
      bounds.push(p.coord);
    });

    map.fitBounds(bounds);

    document.querySelectorAll('#giorni-form label').forEach(label => {
      label.classList.remove('attivo');
    });
    const selected = document.querySelector(`input[value="${giorno}"]`);
    selected?.parentElement.classList.add('attivo');
  };

  // 📍 Geolocalizzazione utente
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const userMarker = L.marker([lat, lon], {
          icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          })
        }).addTo(map);

        userMarker.bindPopup('<strong>📍 Sei qui</strong>').openPopup();
        map.setView([lat, lon], 13);
      },
      error => {
        console.warn('Geolocalizzazione non disponibile:', error.message);
      }
    );
  } else {
    console.warn('Geolocalizzazione non supportata dal browser.');
  }

  // 📱 Navbar dinamica
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const toggle = document.getElementById('menu-toggle');
      if (toggle) toggle.checked = false;
    });
  });

  // ⬆️ Pulsante "Torna su"
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollTopBtn';
  scrollBtn.setAttribute('aria-label', 'Torna su');
  scrollBtn.textContent = '⬆️';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});