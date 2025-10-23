// Mobile menu functionality
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.getElementById('menu');

if (menuBtn && navMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking on nav links
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroBg = document.querySelector('.hero-background');
  
  if (heroBg) {
    const rate = scrolled * -0.3;
    heroBg.style.transform = `translateY(${rate}px)`;
  }
});

// Gallery modal functionality
document.querySelectorAll('.gallery-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const allImages = [
      { src: 'assets/images/les-invalides.jpg', alt: 'Les Invalides - Cupola dorata' },
      { src: 'assets/images/les-invalides1.jpg', alt: 'Les Invalides - Complesso architettonico' },
      { src: 'assets/images/les-invalides2.jpg', alt: 'Les Invalides - Architettura classica' },
      { src: 'assets/images/musee-arm1.jpg', alt: 'Musée de l\'Armée - Collezione militare' },
      { src: 'assets/images/musee-armee.jpg', alt: 'Musée de l\'Armée - Armature storiche' },
      { src: 'assets/images/musee-arme2.jpg', alt: 'Musée de l\'Armée - Uniformi e bandiere' },
      { src: 'assets/images/musee-liberation.jpg', alt: 'Musée de la Libération - Memoriale' },
      { src: 'assets/images/musee-liberation1.jpg', alt: 'Musée de la Libération - Leclerc e Moulin' },
      { src: 'assets/images/musee-liberation2.jpg', alt: 'Musée de la Libération - Resistenza francese' },
      { src: 'assets/images/napoleon-tomb.jpg', alt: 'Tomba di Napoleone - Sarcofago di quarzo rosso' },
      { src: 'assets/images/napoleon-tomb1.jpg', alt: 'Tomba di Napoleone - Interno della cupola' },
      { src: 'assets/images/napoleon-tomb2.jpg', alt: 'Tomba di Napoleone - Mausoleo imperiale' },
      { src: 'assets/images/qr-code.png', alt: 'QR Code - Informazioni' }
    ];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
      <div class="gallery-modal-content">
        <span class="gallery-close">&times;</span>
        <div class="gallery-header">
          <h3>Galleria Completa - Tutte le Immagini</h3>
          <div class="gallery-counter">
            <span class="current-image">1</span> / <span class="total-images">${allImages.length}</span>
          </div>
        </div>
        <div class="gallery-main">
          <img src="${allImages[0].src}" alt="${allImages[0].alt}" class="gallery-main-img">
          <div class="gallery-nav">
            <button class="gallery-prev">&larr;</button>
            <button class="gallery-next">&rarr;</button>
          </div>
        </div>
        <div class="gallery-thumbnails">
          ${allImages.map((img, index) => 
            `<img src="${img.src}" alt="${img.alt}" class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">`
          ).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    let currentIndex = 0;
    
    // Update main image function
    function updateMainImage(index) {
      const mainImgEl = modal.querySelector('.gallery-main-img');
      const thumbs = modal.querySelectorAll('.gallery-thumb');
      const currentImageEl = modal.querySelector('.current-image');
      
      mainImgEl.src = allImages[index].src;
      mainImgEl.alt = allImages[index].alt;
      currentImageEl.textContent = index + 1;
      
      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
      });
      
      currentIndex = index;
    }
    
    // Event listeners
    modal.querySelector('.gallery-close').addEventListener('click', () => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    });
    
    modal.querySelector('.gallery-prev').addEventListener('click', () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
      updateMainImage(newIndex);
    });
    
    modal.querySelector('.gallery-next').addEventListener('click', () => {
      const newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
      updateMainImage(newIndex);
    });
    
    modal.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
      thumb.addEventListener('click', () => updateMainImage(index));
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function handleKeydown(e) {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
      } else if (e.key === 'ArrowLeft') {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
        updateMainImage(newIndex);
      } else if (e.key === 'ArrowRight') {
        const newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
        updateMainImage(newIndex);
      }
    });
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Animate monument cards
document.querySelectorAll('.monumento-detailed').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  animationObserver.observe(el);
});

// Animate timeline steps
document.querySelectorAll('.timeline-step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateX(-30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  animationObserver.observe(el);
});

// Hover effects for cards
document.querySelectorAll('.gothic-panel, .monumento-detailed').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});