
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

class MonumentiGallery {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.lightbox = null;
        this.init();
    }

    init() {
        this.collectImages();
        this.bindEvents();
        this.createLightbox();
    }

    collectImages() {
        const galleries = document.querySelectorAll('.monumento-image-gallery');
        galleries.forEach((gallery, galleryIndex) => {
            const mainImg = gallery.querySelector('.main-image img');
            const thumbnails = gallery.querySelectorAll('.thumbnail-grid img');
            const uniqueImages = new Set();
            
            if (mainImg) {
                uniqueImages.add(mainImg.src);
                this.images.push({
                    src: mainImg.src,
                    alt: mainImg.alt,
                    gallery: galleryIndex
                });
            }
            
            thumbnails.forEach(thumb => {
                if (!uniqueImages.has(thumb.src)) {
                    uniqueImages.add(thumb.src);
                    this.images.push({
                        src: thumb.src,
                        alt: thumb.alt,
                        gallery: galleryIndex
                    });
                }
            });
        });
    }

    bindEvents() {
        document.querySelectorAll('.main-image').forEach((img, index) => {
            img.addEventListener('click', () => this.openLightbox(index));
        });

        document.querySelectorAll('.thumbnail-grid img').forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                const galleryIndex = this.getGalleryIndex(thumb);
                const imageIndex = this.getImageIndex(thumb, galleryIndex);
                this.openLightbox(imageIndex);
            });
        });

        document.querySelectorAll('.gallery-btn').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLightbox(index);
            });
        });
    }

    getGalleryIndex(element) {
        const gallery = element.closest('.monumento-image-gallery');
        return Array.from(document.querySelectorAll('.monumento-image-gallery')).indexOf(gallery);
    }

    getImageIndex(element, galleryIndex) {
        const gallery = element.closest('.monumento-image-gallery');
        const mainImg = gallery.querySelector('.main-image img');
        const thumbnails = Array.from(gallery.querySelectorAll('.thumbnail-grid img'));
        const thumbIndex = thumbnails.indexOf(element);
        return thumbIndex + 1;
    }

    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'monumenti-lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                <button class="lightbox-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="">
                </div>
                <div class="lightbox-thumbnails"></div>
            </div>
        `;

        this.addLightboxStyles();
        
        this.bindLightboxEvents();
        
        document.body.appendChild(this.lightbox);
    }

    addLightboxStyles() {
        const styles = `
            .monumenti-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .monumenti-lightbox.active {
                opacity: 1;
                visibility: visible;
            }
            
            .lightbox-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
            }
            
            .lightbox-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            
            .lightbox-close {
                position: absolute;
                top: 2rem;
                right: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                font-size: 1.5rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10001;
            }
            
            .lightbox-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                font-size: 1.5rem;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10001;
            }
            
            .lightbox-prev {
                left: 2rem;
            }
            
            .lightbox-next {
                right: 2rem;
            }
            
            .lightbox-prev:hover,
            .lightbox-next:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-50%) scale(1.1);
            }
            
            .lightbox-content {
                max-width: 90%;
                max-height: 80%;
                text-align: center;
            }
            
            .lightbox-image {
                max-width: 100%;
                max-height: 70vh;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            
            .lightbox-thumbnails {
                position: absolute;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 0.5rem;
                max-width: 80%;
                overflow-x: auto;
                padding: 1rem;
            }
            
            .lightbox-thumbnails img {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 5px;
                cursor: pointer;
                opacity: 0.6;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            
            .lightbox-thumbnails img:hover,
            .lightbox-thumbnails img.active {
                opacity: 1;
                border-color: var(--gold-accent);
                transform: scale(1.1);
            }
            
            @media (max-width: 768px) {
                .lightbox-container {
                    padding: 1rem;
                }
                
                .lightbox-close {
                    top: 1rem;
                    right: 1rem;
                    width: 40px;
                    height: 40px;
                    font-size: 1.2rem;
                }
                
                .lightbox-prev,
                .lightbox-next {
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
                
                .lightbox-prev {
                    left: 1rem;
                }
                
                .lightbox-next {
                    right: 1rem;
                }
                
                .lightbox-thumbnails {
                    bottom: 1rem;
                }
                
                .lightbox-thumbnails img {
                    width: 50px;
                    height: 50px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    bindLightboxEvents() {
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');
        const overlay = this.lightbox.querySelector('.lightbox-overlay');

        closeBtn.addEventListener('click', () => this.closeLightbox());
        overlay.addEventListener('click', () => this.closeLightbox());
        prevBtn.addEventListener('click', () => this.previousImage());
        nextBtn.addEventListener('click', () => this.nextImage());

        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightbox();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightbox();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightbox();
    }

    updateLightbox() {
        const image = this.images[this.currentIndex];
        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const thumbnails = this.lightbox.querySelector('.lightbox-thumbnails');

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        thumbnails.innerHTML = '';
        this.images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img.src;
            thumb.alt = img.alt;
            thumb.className = index === this.currentIndex ? 'active' : '';
            thumb.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateLightbox();
            });
            thumbnails.appendChild(thumb);
        });
    }
}

function openMap(monumentName) {
    const coordinates = {
        'Les Invalides': { lat: 48.8566, lng: 2.3122 },
        'Tomba di Napoleone': { lat: 48.8566, lng: 2.3122 },
        'Musée de l\'Armée': { lat: 48.8566, lng: 2.3122 },
        'Musée de la Libération': { lat: 48.8339, lng: 2.3319 }
    };

    const coord = coordinates[monumentName];
    if (coord) {
        const url = `https://www.google.com/maps?q=${coord.lat},${coord.lng}`;
        window.open(url, '_blank');
    }
}

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createScrollProgress();
        this.initParallaxEffects();
        this.initCounterAnimations();
    }

    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        
        const styles = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                z-index: 10001;
            }
            
            .scroll-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--gold-accent), var(--navy-blue));
                width: 0%;
                transition: width 0.1s ease;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.querySelector('.scroll-progress-bar').style.width = scrollPercent + '%';
        });
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.monumento-detailed');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const speed = 0.1 + (index * 0.05);
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };

        updateCounter();
    }
}

class EnhancedNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.highlightActiveSection();
    }

    highlightActiveSection() {
        const sections = document.querySelectorAll('.monumento-detailed');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id') || 'monumenti';
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}` || 
                    (current === 'monumenti' && link.getAttribute('href') === 'monumenti.html')) {
                    link.classList.add('active');
                }
            });
        });
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new MonumentiGallery();
    new ScrollAnimations();
    new EnhancedNavigation();
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.monumento-detailed').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});

window.addEventListener('load', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});
