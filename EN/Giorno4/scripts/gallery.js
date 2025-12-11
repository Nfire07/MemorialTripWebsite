// Mobile menu functionality is now in the HTML file to avoid conflicts

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

// Gallery modal functionality - shows all images together
document.querySelectorAll('.gallery-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const allImages = [
      // Les Invalides
      { src: 'assets/images/les-invalides1.jpg', alt: 'Les Invalides - Majestic architectural complex with golden dome' },
      { src: 'assets/images/les-invalides.jpg', alt: 'Golden dome of Les Invalides' },
      { src: 'assets/images/les-invalides2.jpg', alt: 'Classical French architecture' },
      { src: 'assets/images/les-invalides3.jpg', alt: 'Les Invalides architecture' },
      // Napoleon's Tomb
      { src: 'assets/images/napoleon-tomb2.jpg', alt: 'Napoleon\'s Tomb - Imperial mausoleum with red quartz sarcophagus' },
      { src: 'assets/images/napoleon-tomb.jpg', alt: 'Red quartz sarcophagus from Corsica' },
      { src: 'assets/images/napoleon-tomb1.jpg', alt: 'Interior of the dome with decorations' },
      { src: 'assets/images/napoleon-tomb3.jpg', alt: 'Napoleon\'s Tomb details' },
      // Musée de l'Armée
      { src: 'assets/images/musee-arm1.jpg', alt: 'Musée de l\'Armée - Military collection and historical armor' },
      { src: 'assets/images/musee-armee.jpg', alt: 'Medieval and Renaissance armor' },
      { src: 'assets/images/musee-arme2.jpg', alt: 'Historical uniforms and flags' },
      { src: 'assets/images/musee-arme3.jpg', alt: 'Musée de l\'Armée collection' },
      // Musée de la Libération
      { src: 'assets/images/musee-liberation1.jpg', alt: 'Musée de la Libération - Memorial dedicated to Leclerc and Moulin' },
      { src: 'assets/images/musee-liberation.jpg', alt: 'Memorial of the French resistance' },
      { src: 'assets/images/musee-liberation2.jpg', alt: 'Permanent exhibition on the resistance' },
      { src: 'assets/images/musee-liberation3.jpg', alt: 'Musée de la Libération exhibition' }
    ];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
      <div class="gallery-modal-content">
        <span class="gallery-close">&times;</span>
        <div class="gallery-header">
          <h3>Full Gallery</h3>
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

// Expandable Monument Descriptions
document.querySelectorAll('.monumento-detailed').forEach(monument => {
  const description = monument.querySelector('.monumento-description');
  
  if (description) {
    // Create expand button
    const expandBtn = document.createElement('button');
    expandBtn.className = 'expand-toggle';
    expandBtn.innerHTML = '<span>Read more</span><i class="fas fa-chevron-down"></i>';
    expandBtn.setAttribute('aria-expanded', 'false');
    
    // Insert button inside the description area, before official section if present
    const official = description.querySelector('.monumento-official');
    if (official) {
      description.insertBefore(expandBtn, official);
    } else {
      description.appendChild(expandBtn);
    }
    
    // Add click event
    expandBtn.addEventListener('click', () => {
      const isExpanding = !description.classList.contains('expanded');
      
      description.classList.toggle('expanded');
      expandBtn.classList.toggle('expanded');
      expandBtn.setAttribute('aria-expanded', isExpanding ? 'true' : 'false');
      
      if (description.classList.contains('expanded')) {
        expandBtn.innerHTML = '<span>Show less</span><i class="fas fa-chevron-down"></i>';
        
        // Smooth scroll to keep the button in view when expanding
        setTimeout(() => {
          expandBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      } else {
        expandBtn.innerHTML = '<span>Read more</span><i class="fas fa-chevron-down"></i>';
        
        // Scroll to top of monument when collapsing
        setTimeout(() => {
          monument.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }, 100);
      }
    });
  }
});