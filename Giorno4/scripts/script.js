const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 100;
    
    if (scrolled) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

window.addEventListener('load', () => {
    const navbar = document.querySelector('.navbar');
    navbar.style.opacity = '0';
    navbar.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        navbar.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        navbar.style.opacity = '1';
        navbar.style.transform = 'translateY(0)';
    }, 100);
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    const rate = scrolled * -0.3;
    
    if (scrolled < 100) {
        navbar.style.transform = `translateY(${rate}px)`;
    } else {
        navbar.style.transform = 'translateY(0)';
    }
});

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

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.timeline-item, .monumento-card, .info-card, .membro-card, .depliant-page');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

function createLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            
            const lightboxStyles = `
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .lightbox.show {
                    opacity: 1;
                }
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .lightbox-content img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    color: white;
                    font-size: 30px;
                    cursor: pointer;
                    z-index: 10001;
                }
            `;
            
            if (!document.querySelector('#lightbox-styles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'lightbox-styles';
                styleSheet.textContent = lightboxStyles;
                document.head.appendChild(styleSheet);
            }
            
            document.body.appendChild(lightbox);
            
            setTimeout(() => lightbox.classList.add('show'), 10);
            
            const closeLightbox = () => {
                lightbox.classList.remove('show');
                setTimeout(() => document.body.removeChild(lightbox), 300);
            };
            
            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    });
}

function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        timelineObserver.observe(item);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: rgba(201, 169, 110, 0.85);
        backdrop-filter: blur(20px) saturate(150%);
        -webkit-backdrop-filter: blur(20px) saturate(150%);
        color: rgba(255, 255, 255, 1);
        border: 2px solid rgba(201, 169, 110, 0.9);
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(26, 31, 46, 0.3),
                    0 2px 8px rgba(201, 169, 110, 0.4);
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset > 100;
        
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
            
            if (scrolled) {
                scrollBtn.style.background = 'rgba(201, 169, 110, 0.95)';
                scrollBtn.style.backdropFilter = 'blur(15px) saturate(120%)';
                scrollBtn.style.webkitBackdropFilter = 'blur(15px) saturate(120%)';
                scrollBtn.style.boxShadow = '0 6px 25px rgba(26, 31, 46, 0.4), 0 3px 12px rgba(201, 169, 110, 0.5)';
                scrollBtn.style.border = '2px solid rgba(201, 169, 110, 1)';
            } else {
                scrollBtn.style.background = 'rgba(201, 169, 110, 0.85)';
                scrollBtn.style.backdropFilter = 'blur(20px) saturate(150%)';
                scrollBtn.style.webkitBackdropFilter = 'blur(20px) saturate(150%)';
                scrollBtn.style.boxShadow = '0 4px 20px rgba(26, 31, 46, 0.3), 0 2px 8px rgba(201, 169, 110, 0.4)';
                scrollBtn.style.border = '2px solid rgba(201, 169, 110, 0.9)';
            }
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-3px) scale(1.1)';
        scrollBtn.style.background = 'rgba(201, 169, 110, 1)';
        scrollBtn.style.color = 'rgba(255, 255, 255, 1)';
        scrollBtn.style.boxShadow = '0 8px 30px rgba(26, 31, 46, 0.5), 0 4px 15px rgba(201, 169, 110, 0.6)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
        const scrolled = window.pageYOffset > 100;
        if (scrolled) {
            scrollBtn.style.background = 'rgba(201, 169, 110, 0.95)';
            scrollBtn.style.boxShadow = '0 6px 25px rgba(26, 31, 46, 0.4), 0 3px 12px rgba(201, 169, 110, 0.5)';
        } else {
            scrollBtn.style.background = 'rgba(201, 169, 110, 0.85)';
            scrollBtn.style.boxShadow = '0 4px 20px rgba(26, 31, 46, 0.3), 0 2px 8px rgba(201, 169, 110, 0.4)';
        }
        scrollBtn.style.color = 'rgba(255, 255, 255, 1)';
    });
}

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    createLightbox();
    initParallax();
    animateTimeline();
    animateCounters();
    createScrollToTop();
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    const cards = document.querySelectorAll('.monumento-preview-card, .info-card, .membro-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    const monumentCards = document.querySelectorAll('.monumento-preview-card');
    monumentCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('a')) return;
            
            const link = this.querySelector('.monumento-cta');
            if (link) {
                link.click();
            }
        });
        
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-explore-monumenti, .btn-primary-large');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    const rippleStyles = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = rippleStyles;
    document.head.appendChild(styleSheet);
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = ['#home', '#itinerario', '#monumenti', '#info-pratiche', '#gruppo', '#depliant'];
        const currentSection = sections.find(section => {
            const element = document.querySelector(section);
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                nextIndex = Math.max(currentIndex - 1, 0);
            }
            
            const nextSection = document.querySelector(sections[nextIndex]);
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedScrollHandler = debounce(() => {
}, 16);

window.addEventListener('scroll', debouncedScrollHandler);
