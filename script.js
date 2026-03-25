// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.init();
    }
    
    init() {
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.feature-card, .hero-content, .hero-image, .details-content, .details-image'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Product Image Hover Effect
class ProductShowcase {
    constructor() {
        this.productImage = document.querySelector('.product-image');
        this.productGlow = document.querySelector('.product-glow');
        this.init();
    }
    
    init() {
        if (!this.productImage) return;
        
        this.productImage.addEventListener('mouseenter', () => {
            this.productGlow.style.opacity = '1';
            this.productGlow.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });
        
        this.productImage.addEventListener('mouseleave', () => {
            this.productGlow.style.opacity = '0.7';
            this.productGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
}

// Navbar Scroll Effect
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.style.background = 
                    document.documentElement.getAttribute('data-theme') === 'dark' 
                        ? 'rgba(0, 0, 0, 0.95)' 
                        : 'rgba(255, 255, 255, 0.95)';
            } else {
                this.navbar.style.background = 
                    document.documentElement.getAttribute('data-theme') === 'dark' 
                        ? 'rgba(0, 0, 0, 0.8)' 
                        : 'rgba(255, 255, 255, 0.8)';
            }
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new SmoothScroll();
    new AnimationObserver();
    new ProductShowcase();
    new NavbarScroll();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Button Click Handlers
document.addEventListener('DOMContentLoaded', () => {
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    if (primaryBtn) {
        primaryBtn.addEventListener('click', () => {
            // Simulate purchase flow
            alert('Vielen Dank für Ihr Interesse! Die Kaufabwicklung würde hier starten.');
        });
    }
    
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', () => {
            // Scroll to features section
            document.querySelector('#features').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});