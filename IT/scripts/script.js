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
      { coord: [48.8867, 2.3431], label: 'Montmartre', img: '../images/montmartre.jpg', desc: 'Un quartiere bohémien pieno di arte e vita.' },
      { coord: [48.8860, 2.3430], label: 'Sacré-Cœur', img: '../images/sacrecoeur.jpg', desc: 'La basilica bianca che domina Parigi.' },
      { coord: [48.8841, 2.3322], label: 'Moulin Rouge', img: '../images/moulin_rouge.jpg', desc: 'Il leggendario cabaret di Pigalle.' }
    ],
    giorno2: [
      { coord: [48.8550, 2.3650], label: 'Le Marais', img: '../images/marais.jpg', desc: 'Quartiere storico noto per le sue piazze e l\'architettura.' },
      { coord: [48.8596, 2.3582], label: 'Museo Carnavalet', img: '../images/carnavalet.jpg', desc: 'Museo della storia di Parigi.' },
      { coord: [48.8493, 2.3560], label: 'Memoriale della Shoah', img: '../images/shoah.jpg', desc: 'Luogo di memoria dedicato alle vittime dell’Olocausto.' },
      { coord: [48.8530, 2.3499], label: 'Notre-Dame', img: '../images/notredame.jpg', desc: 'La cattedrale gotica nel cuore dell\'Île de la Cité.' }
    ],
    giorno3: [
      { coord: [48.8049, 2.1204], label: 'Reggia di Versailles', img: '../images/versailles.jpg', desc: 'Maestosa residenza reale simbolo dell’assolutismo francese.' },
      { coord: [48.8156, 2.1265], label: 'Giardini di Versailles', img: '../images/giardini.jpg', desc: 'Spettacolari giardini geometrici progettati da Le Nôtre.' }
    ],
    giorno4: [
      { coord: [48.8561, 2.3129], label: 'Hôtel des Invalides', img: '../images/invalides.jpg', desc: 'Complesso di edifici che ospita musei e la Tomba di Napoleone.' },
      { coord: [48.8560, 2.3130], label: 'Musée de l’Armée', img: '../images/musee_armee.jpg', desc: 'Museo dell\'esercito all\'interno degli Invalides.' },
      { coord: [48.8560, 2.3130], label: 'Tomba di Napoleone', img: '../images/tomba_napoleone.jpg', desc: 'Sepolcro di Napoleone Bonaparte sotto la cupola.' },
      { coord: [48.8372, 2.3211], label: 'Museo Leclerc - Jean Moulin', img: '../images/leclerc_moulin.jpg', desc: 'Museo dedicato alla Liberazione di Parigi e alle figure di Leclerc e Moulin.' },
      { coord: [48.8584, 2.2945], label: 'Torre Eiffel (facoltativo)', img: '../images/eiffel.jpg', desc: 'Simbolo iconico di Parigi, costruita nel 1889.' }
    ],
    giorno5: [
      { coord: [48.8559, 2.3456], label: 'Conciergerie', img: '../images/conciergerie.jpg', desc: 'Antico palazzo e prigione, parte del Palais de la Cité.' },
      { coord: [48.8606, 2.3376], label: 'Louvre', img: '../images/louvre.jpg', desc: 'Il museo d\'arte più visitato al mondo.' },
      { coord: [48.8599, 2.3265], label: 'Musée d’Orsay', img: '../images/orsay.jpg', desc: 'Famoso per i capolavori impressionisti in una vecchia stazione.' },
      { coord: [48.8738, 2.2950], label: 'Avenue des Champs-Élysées', img: '../images/champs_elysees.jpg', desc: 'La strada più famosa del mondo che porta all\'Arco di Trionfo.' }
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
        const offset = map.project(p.coord).subtract([0, 100]);
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
