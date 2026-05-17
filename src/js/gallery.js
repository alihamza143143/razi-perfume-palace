import { buildOrderLink, formatPKR } from './whatsapp.js';
import productsData from '../data/products.json';

let products = productsData.products;
let primaryNumber = productsData.primaryWhatsApp;
let currentFilter = 'all';
let currentLang = 'en';

export function matchesFilter(p, filter) {
  switch (filter) {
    case 'all': return true;
    case 'men': return p.type === 'men' || p.type === 'unisex';
    case 'women': return p.type === 'women' || p.type === 'unisex';
    case 'under-1k': return p.price < 1000;
    case '1k-2500': return p.price >= 1000 && p.price <= 2500;
    case 'premium': return p.price > 2500;
    default: return true;
  }
}

function renderCard(p, lang) {
  const name = lang === 'ur' ? p.name_ur : p.name_en;
  const link = buildOrderLink({ number: primaryNumber, product: p, lang });
  const otherSizes = lang === 'ur' ? 'دیگر سائز واٹس ایپ پر دستیاب' : 'Other sizes available on WhatsApp';
  const decantLabel = lang === 'ur' ? '10ml ڈیکانٹ' : '10ml decant';
  const orderLabel = lang === 'ur' ? 'واٹس ایپ پر آرڈر →' : 'Order on WhatsApp →';
  const refTag = lang === 'ur' ? 'حوالہ تصویر' : 'Reference image';

  return `
    <article class="card group relative bg-maroon-900/40 border border-gold-500/20 rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-gold-500 hover:shadow-2xl hover:shadow-black/50">
      <div class="absolute top-3 right-3 z-10 text-[10px] text-ivory-100/40 bg-black/40 px-2 py-1 rounded">${refTag}</div>
      <div class="aspect-[4/5] overflow-hidden bg-gradient-to-br from-maroon-700 to-maroon-900 relative">
        <div class="absolute inset-0 bg-gradient-radial from-gold-500/15 via-transparent to-transparent"></div>
        <img src="${p.image}" alt="${p.brand} ${name}" loading="lazy" width="400" height="500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div class="p-5">
        <div class="h-px w-12 bg-gold-500 mb-4"></div>
        <p class="text-gold-500 text-xs tracking-widest uppercase">${p.brand}</p>
        <h3 class="font-serif text-xl text-ivory-100 mt-1 ${lang === 'ur' ? 'font-urdu' : ''}">${name}</h3>
        <span class="inline-block mt-3 text-xs text-gold-500 border border-gold-500/40 rounded-full px-3 py-1">${decantLabel}</span>
        <p class="text-gold-500 font-semibold text-2xl mt-4">₨${formatPKR(p.price)}</p>
        <p class="text-ivory-100/50 text-xs mt-1">${otherSizes}</p>
        <a href="${link}" target="_blank" rel="noopener"
           class="mt-4 block w-full text-center bg-gold-500 text-ink-900 font-medium py-2.5 rounded-md tracking-wide hover:bg-gold-300 transition md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300">
          ${orderLabel}
        </a>
      </div>
    </article>
  `;
}

function render() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const filtered = products.filter(p => matchesFilter(p, currentFilter));
  grid.innerHTML = filtered.map(p => renderCard(p, currentLang)).join('');
}

function activatePill(target) {
  document.querySelectorAll('.filter-pill').forEach(b => {
    const isActive = b.dataset.filter === target;
    b.classList.toggle('active', isActive);
    b.classList.toggle('bg-gold-500', isActive);
    b.classList.toggle('text-ink-900', isActive);
    b.classList.toggle('text-gold-500', !isActive);
  });
}

export function initGallery({ lang = 'en' } = {}) {
  currentLang = lang;
  render();
  activatePill('all');

  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      activatePill(currentFilter);
      render();
    });
  });

  document.querySelectorAll('[data-cat]').forEach(tile => {
    tile.addEventListener('click', () => {
      currentFilter = 'all';
      activatePill('all');
      render();
    });
  });
}

export function setGalleryLang(lang) {
  currentLang = lang;
  render();
}
