const productsUrl = './src/products.json';

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }
}

function calculatePrice(product) {
  if (product.price_de) return product.price_de;
  // Smart Pricing Logic: (cost_cj * 2) + 5.00
  return (product.cost_cj * 2) + 5.00;
}

function formatPriceEUR(value) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

async function fetchProducts() {
  try {
    const res = await fetch(productsUrl);
    if (!res.ok) throw new Error(`Fehler: ${res.status} beim Laden von ${productsUrl}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Fetch error at URL:', productsUrl, err);
    return []; // Professional fallback
  }
}

function createProductCard(product, index) {
  if (!product || !product.id) return null;
  const price = product.price_de || 0;
  const card = document.createElement('article');
  
  // Asymmetrical Grid Logic: Every 3rd item spans 2 columns
  card.className = `product-card reveal-on-scroll ${index % 3 === 2 ? 'span-2' : ''}`;
  
  card.innerHTML = `
    <div class="card-media-wrap">
      <img src="${product.image_url}" alt="${product.name}" loading="lazy">
    </div>
    <div class="card-info">
      <h3>${product.name}</h3>
      <div class="card-price">${formatPriceEUR(price)}</div>
    </div>
    <div class="quick-add">Schnellkauf +</div>
  `;
  
  card.onclick = () => window.location.href = `product.html?id=${product.id}`;
  return card;
}

function initSkeleton(grid) {
  grid.innerHTML = Array(4).fill(0).map(() => `
    <div class="product-card skeleton">
      <div class="card-media-wrap" style="background: #eee;"></div>
      <div style="height: 20px; background: #eee; width: 60%; margin-bottom: 10px;"></div>
      <div style="height: 20px; background: #eee; width: 30%;"></div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  new ThemeManager();

  // 1. Hero Slideshow Logic
  const slides = document.querySelectorAll('.parallax-subject');
  let currentSlide = 0;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 1) {
    setInterval(nextSlide, 4000); // Change image every 4 seconds
  }

  // 1.1 Parallax Effect for the Active Image
  document.addEventListener('mousemove', (e) => {
    const activeSlide = document.querySelector('.parallax-subject.active');
    if (activeSlide) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.015;
      activeSlide.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
    }
  });

  // 2. Magnetic Button Logic
  const magneticBtn = document.querySelector('.btn-magnetic');
  if (magneticBtn) {
    document.addEventListener('mousemove', (e) => {
      const rect = magneticBtn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(x*x + y*y);
      
      if (distance < 150) {
        magneticBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      } else {
        magneticBtn.style.transform = `translate(0, 0)`;
      }
    });
  }

  // 3. Intersection Observer for Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // 4. Product Loading with Skeleton
  const grid = document.getElementById('product-grid');
  if (grid) {
    initSkeleton(grid);
    try {
      const products = await fetchProducts();
      grid.innerHTML = '';
      if (products.length === 0) {
        grid.innerHTML = '<div class="product-grid-info"><p>Kollektion erscheint in Kürze.</p></div>';
      } else {
        products.forEach((p, i) => {
          const card = createProductCard(p, i);
          grid.appendChild(card);
          observer.observe(card);
        });
      }
    } catch (err) {
      grid.innerHTML = '<p class="error">Kollektion momentan nicht erreichbar.</p>';
    }
  }

  // Observe static reveals
  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
});