# Razi Perfume Palace — Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, polish, and deploy a single-page, bilingual (EN+UR), luxury landing site for رضی پرفیوم پیلس (Razi Perfume Palace) with 12 perfume products, 3 shop videos, WhatsApp-driven conversion, and production Vercel URL handed back to the user.

**Architecture:** Vanilla HTML + Vite + Tailwind CSS + GSAP/ScrollTrigger + Lenis. Static site, no backend. Bilingual via `content/copy.json` + tiny i18n.js. Products in `data/products.json`. Videos compressed via ffmpeg, lazy-loaded with network-aware fallback. Deployed to Vercel personal scope from a new GitHub repo under `alihamza143143`.

**Tech Stack:** Vite, Tailwind CSS, GSAP + ScrollTrigger, Lenis, Vitest (for JS unit tests), Google Fonts (Cormorant Garamond, Inter, Noto Nastaliq Urdu), Google Maps embed, ffmpeg (video compression), GitHub, Vercel.

**Reference spec:** `docs/superpowers/specs/2026-05-17-razi-perfume-palace-landing-design.md`

---

## File Structure (target end-state)

```
perfumePalace/
├── docs/superpowers/
│   ├── specs/2026-05-17-razi-perfume-palace-landing-design.md
│   └── plans/2026-05-17-razi-perfume-palace-landing.md   ← this file
├── public/
│   ├── images/
│   │   ├── bottles/                  (4-5 royalty-free perfume bottle placeholders)
│   │   ├── textures/marble-maroon.jpg
│   │   └── og-image.jpg
│   ├── videos/
│   │   ├── inside-1.mp4 / .webm / -mobile.mp4 / -mobile.webm / -poster.jpg
│   │   ├── inside-2.* (same set)
│   │   └── inside-3.* (same set)
│   └── favicon.svg
├── src/
│   ├── content/copy.json              (all EN/UR text)
│   ├── data/products.json             (12 products)
│   ├── styles/
│   │   ├── tailwind.css
│   │   └── tokens.css                 (CSS variables)
│   ├── js/
│   │   ├── main.js                    (entry: init Lenis, GSAP, modules)
│   │   ├── i18n.js
│   │   ├── gallery.js
│   │   ├── video-loader.js
│   │   ├── nav.js
│   │   └── whatsapp.js                (link builder, prefilled msg)
│   ├── components/                    (HTML partials, injected at build)
│   │   ├── nav.html
│   │   ├── hero.html
│   │   ├── brand-story.html
│   │   ├── category-teaser.html
│   │   ├── gallery.html
│   │   ├── trust-strip.html
│   │   ├── inside-razi.html
│   │   ├── visit-us.html
│   │   └── footer.html
│   └── tests/
│       ├── whatsapp.test.js
│       ├── i18n.test.js
│       └── gallery.test.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
└── vercel.json
```

---

## Phase A — Project Scaffold

### Task A1: Initialize git repo + ignore nesting

**Files:**
- Create: `perfumePalace/.gitignore`
- Create: `perfumePalace/README.md`
- Modify: `C:/Users/ARFA TECH/Desktop/.gitignore` (add `perfumePalace/` so outer Desktop repo ignores this nested project)

**Why this task:** `perfumePalace/` sits inside the Desktop git repo. We init a new dedicated repo here AND tell Desktop to ignore the folder. This prevents the past-incident pattern (Desktop's git history clobbering subproject `.git`).

- [ ] **Step 1: Add `perfumePalace/` to Desktop's .gitignore**

```bash
cd "C:/Users/ARFA TECH/Desktop"
echo "" >> .gitignore
echo "# Nested standalone projects (own git repos)" >> .gitignore
echo "perfumePalace/" >> .gitignore
```

Verify: `grep perfumePalace .gitignore` → matches.

- [ ] **Step 2: Init git in perfumePalace with personal identity**

```bash
cd "C:/Users/ARFA TECH/Desktop/perfumePalace"
git init
git config user.name "alihamza143143"
git config user.email "alihamza891840@gmail.com"
git branch -M main
```

Verify: `git config user.email` → `alihamza891840@gmail.com`.

- [ ] **Step 3: Create .gitignore**

Create `perfumePalace/.gitignore`:
```
node_modules
dist
.vite
.env
.env.local
.DS_Store
*.log
.vercel
```

- [ ] **Step 4: Create minimal README**

Create `perfumePalace/README.md`:
```markdown
# Razi Perfume Palace

Single-page bilingual (EN+UR) luxury landing site for رضی پرفیوم پیلس — wholesale fragrance dealer in Kallar Syedan, Rawalpindi.

## Stack
Vite · Tailwind · GSAP · Lenis · Vanilla JS

## Local dev
```
npm install
npm run dev
```

## Deploy
Auto-deployed to Vercel from `main`.
```

- [ ] **Step 5: Initial commit**

```bash
git add .gitignore README.md docs/
git commit -m "init: design spec + plan"
git log --oneline
```

Verify: One commit, no `Co-Authored-By` line in message.

---

### Task A2: Vite + Tailwind + dependencies

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
- Create: `index.html` (minimal placeholder)
- Create: `src/styles/tailwind.css`, `src/js/main.js`

- [ ] **Step 1: Initialize npm + install dependencies**

```bash
cd "C:/Users/ARFA TECH/Desktop/perfumePalace"
npm init -y
npm install --save-dev vite tailwindcss@3 postcss autoprefixer vitest @vitest/ui jsdom
npm install gsap lenis
```

Verify: `package.json` lists all deps; `node_modules/` populated.

- [ ] **Step 2: package.json scripts**

Replace `scripts` block in `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Create vite.config.js**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    minify: 'esbuild',
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 4: Tailwind config**

Create `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          900: '#3B0A0A',
          700: '#5A1212',
        },
        brand: {
          red: '#8B0000',
        },
        gold: {
          500: '#C9A24B',
          300: '#E0C481',
        },
        ivory: {
          100: '#F4EBD0',
        },
        ink: {
          900: '#0A0606',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      maxWidth: {
        site: '1280px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: PostCSS config**

Create `postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Tailwind entry CSS**

Create `src/styles/tailwind.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-maroon-900 text-ivory-100 font-sans; }
  html[dir="rtl"] body { @apply font-urdu; }
}
```

- [ ] **Step 7: Minimal index.html + main.js**

Create `index.html`:
```html
<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Razi Perfume Palace · رضی پرفیوم پیلس</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&family=Noto+Nastaliq+Urdu:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/src/styles/tailwind.css" />
</head>
<body>
  <main id="app">
    <h1 class="font-serif text-4xl text-gold-500 p-8">Razi Perfume Palace — scaffold OK</h1>
  </main>
  <script type="module" src="/src/js/main.js"></script>
</body>
</html>
```

Create `src/js/main.js`:
```js
console.log('Razi Perfume Palace — main.js loaded');
```

- [ ] **Step 8: Verify dev server runs**

```bash
npm run dev
```

Expected: Vite prints `Local: http://localhost:5173`. Open in browser, see gold heading on maroon. Stop server (Ctrl+C).

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "scaffold: vite + tailwind + gsap + lenis"
```

---

## Phase B — Brand System & Global Layout

### Task B1: Design tokens + base styles

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/styles/tailwind.css` (import tokens)
- Modify: `index.html` (link tokens.css)

- [ ] **Step 1: Create tokens.css**

```css
:root {
  --maroon-900: #3B0A0A;
  --maroon-700: #5A1212;
  --brand-red: #8B0000;
  --gold-500: #C9A24B;
  --gold-300: #E0C481;
  --ivory-100: #F4EBD0;
  --ivory-60: rgba(244, 235, 208, 0.6);
  --ink-900: #0A0606;

  --section-padding-y: clamp(4rem, 8vw, 8rem);
  --container-max: 1280px;

  --ease-luxe: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-slow: 1.2s;
}

::selection { background: var(--gold-500); color: var(--ink-900); }

html { scroll-behavior: smooth; }
html.no-smooth { scroll-behavior: auto; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Import into tailwind.css**

Prepend to `src/styles/tailwind.css`:
```css
@import './tokens.css';
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

Expected: `dist/` created without errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles
git commit -m "tokens: brand palette, type, motion"
```

---

### Task B2: Global layout (sticky nav, mobile bottom bar)

**Files:**
- Create: `src/components/nav.html`
- Modify: `index.html` (inject nav, app shell)
- Create: `src/js/nav.js`

- [ ] **Step 1: Create nav component HTML**

Create `src/components/nav.html`:
```html
<nav id="site-nav" class="fixed top-0 inset-x-0 z-50 transition-all duration-500 bg-transparent">
  <div class="max-w-site mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
    <a href="#hero" class="flex items-center gap-2" aria-label="Razi Perfume Palace home">
      <span class="text-gold-500 font-serif text-xl tracking-wide">RAZI</span>
      <span class="text-ivory-100/60 hidden md:inline text-sm">·</span>
      <span class="text-ivory-100/70 hidden md:inline font-urdu text-base">رضی</span>
    </a>
    <ul class="hidden md:flex gap-8 text-sm tracking-wide text-ivory-100/80">
      <li><a href="#hero" data-i18n="nav.home">Home</a></li>
      <li><a href="#brand-story" data-i18n="nav.story">Story</a></li>
      <li><a href="#gallery" data-i18n="nav.shop">Shop</a></li>
      <li><a href="#visit-us" data-i18n="nav.visit">Visit</a></li>
    </ul>
    <button id="lang-toggle" class="text-sm text-gold-500 hover:text-gold-300 transition" aria-label="Toggle language">
      <span data-lang-en>اردو</span><span data-lang-ur class="hidden">EN</span>
    </button>
  </div>
</nav>
```

- [ ] **Step 2: Create nav.js for scroll behaviour**

Create `src/js/nav.js`:
```js
export function initNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.remove('bg-transparent');
      nav.classList.add('bg-maroon-900/90', 'backdrop-blur-md', 'shadow-lg', 'shadow-black/30');
    } else {
      nav.classList.add('bg-transparent');
      nav.classList.remove('bg-maroon-900/90', 'backdrop-blur-md', 'shadow-lg', 'shadow-black/30');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
```

- [ ] **Step 3: Add mobile bottom CTA bar**

Add inside `<body>` of `index.html`, just before `</body>`:
```html
<div class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-maroon-900/95 backdrop-blur-md border-t border-gold-500/20 p-3">
  <a id="mobile-cta"
     href="https://wa.me/923338726133?text=Salam%2C%20I'd%20like%20to%20know%20about%20your%20perfumes."
     target="_blank" rel="noopener"
     class="block w-full text-center bg-gold-500 text-ink-900 font-medium py-3 rounded-md tracking-wide">
    Order on WhatsApp
  </a>
</div>
```

- [ ] **Step 4: Inject nav into index.html**

For now, inline the nav HTML directly into `index.html` (we use a simple injection pattern, not a build-time HTML partial system to keep complexity low). Replace the `<body>` content of `index.html` so it includes the nav at top + the existing `<main>` + the mobile bar.

- [ ] **Step 5: Wire main.js**

Update `src/js/main.js`:
```js
import { initNav } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
});
```

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

Expected: Nav visible top of page; scroll down past 80px → nav background goes opaque maroon. Mobile bottom bar visible at narrow widths (resize browser < 768px).

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "layout: sticky nav + mobile cta bar"
```

---

## Phase C — Hero

### Task C1: Hero section

**Files:**
- Modify: `index.html` (replace placeholder with hero)
- Create: `public/images/hero-bottle.png` (placeholder bottle silhouette, transparent PNG)

- [ ] **Step 1: Add hero HTML**

Replace the `<main>` content in `index.html`:
```html
<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0" style="background: radial-gradient(ellipse at center, #5A1212 0%, #3B0A0A 50%, #0A0606 100%);"></div>
  <div id="particles" class="absolute inset-0 pointer-events-none opacity-30" aria-hidden="true"></div>
  <div class="relative z-10 max-w-site mx-auto px-6 text-center">
    <div class="mb-6">
      <span class="text-gold-500 text-2xl">✦</span>
      <h1 class="font-urdu text-5xl md:text-7xl text-gold-500 inline-block mx-3" style="line-height:1.2">رضی پرفیوم پیلس</h1>
      <span class="text-gold-500 text-2xl">✦</span>
    </div>
    <p class="font-serif text-xl md:text-2xl tracking-[0.3em] text-ivory-100/90 mb-4">RAZI PERFUME PALACE</p>
    <p class="text-ivory-100/70 text-base md:text-lg mb-10" data-i18n="hero.tagline">
      <span class="font-urdu">خوشبو کا جہاں</span>  ·  A world of scent
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <a href="https://wa.me/923338726133?text=Salam%2C%20I'd%20like%20to%20know%20about%20your%20perfumes."
         target="_blank" rel="noopener"
         class="bg-gold-500 text-ink-900 font-medium px-8 py-4 rounded-md tracking-wide hover:bg-gold-300 transition relative overflow-hidden group">
        <span class="relative z-10">Order on WhatsApp →</span>
      </a>
      <a href="#visit-us"
         class="border border-gold-500/60 text-gold-500 px-8 py-4 rounded-md tracking-wide hover:bg-gold-500/10 transition">
        Visit Shop
      </a>
    </div>
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-500/60 text-2xl animate-bounce" aria-hidden="true">⌄</div>
  </div>
</section>
```

- [ ] **Step 2: Add gold particle drift CSS (inline simple version)**

Add to `src/styles/tokens.css`:
```css
@keyframes drift {
  0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateY(110vh) translateX(40px); opacity: 0; }
}

#particles::before, #particles::after {
  content: '';
  position: absolute;
  width: 2px; height: 2px;
  background: var(--gold-500);
  border-radius: 50%;
  box-shadow:
    10vw 5vh 0 var(--gold-300),
    25vw 20vh 0 var(--gold-500),
    40vw 12vh 0 var(--gold-300),
    60vw 30vh 0 var(--gold-500),
    75vw 18vh 0 var(--gold-300),
    90vw 25vh 0 var(--gold-500),
    15vw 50vh 0 var(--gold-300),
    35vw 60vh 0 var(--gold-500),
    55vw 70vh 0 var(--gold-300),
    80vw 55vh 0 var(--gold-500);
  animation: drift 18s linear infinite;
}
#particles::after { animation-delay: -9s; }
```

- [ ] **Step 3: Verify hero in browser**

```bash
npm run dev
```

Expected: Full-viewport maroon gradient, Urdu calligraphy + English wordmark + tagline centered, gold particles drifting, two CTAs (gold + outlined), bouncing scroll indicator.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "hero: gradient, logo lockup, ctas, particle drift"
```

---

## Phase D — Brand Story + Category Teaser

### Task D1: Brand story section

**Files:** Modify `index.html`

- [ ] **Step 1: Add brand story section**

After `</section>` of hero, add:
```html
<section id="brand-story" class="relative py-24 md:py-32 overflow-hidden">
  <div class="absolute inset-0" style="background:
    linear-gradient(180deg, #3B0A0A 0%, #5A1212 100%);"></div>
  <div class="absolute inset-0 opacity-20 mix-blend-overlay"
       style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%221%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.3%22/%3E%3C/svg%3E');">
  </div>
  <div class="relative max-w-site mx-auto px-6 md:px-10">
    <div class="text-center mb-12">
      <span class="block h-px w-16 bg-gold-500 mx-auto mb-6"></span>
      <h2 class="font-serif text-3xl md:text-5xl text-gold-500" data-i18n="story.heading">A House of Fragrance</h2>
    </div>
    <div class="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
      <div data-lang-en class="space-y-4 text-ivory-100/90 leading-relaxed">
        <p>Built on trust.</p>
        <p>Razi Perfume Palace is a wholesale fragrance house in Kallar Syedan. We carry international designer fragrances, authentic attar, and sprays — at honest wholesale rates.</p>
        <p class="text-gold-500 italic">— Muhammad Saad Jahangir, Proprietor</p>
      </div>
      <div data-lang-ur class="space-y-4 text-ivory-100/90 leading-relaxed font-urdu text-lg" dir="rtl">
        <p>اعتماد پر قائم۔</p>
        <p>رضی پرفیوم پیلس کلر سیداں کا تھوک ڈیلر ہے۔ ہم بین الاقوامی ڈیزائنر خوشبو، اصلی عطر اور سپرے مناسب قیمت پر فراہم کرتے ہیں۔</p>
        <p class="text-gold-500">— محمد سعد جہانگیر، پروپرائٹر</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add category teaser section**

Right after brand story:
```html
<section id="categories" class="py-20 bg-maroon-900">
  <div class="max-w-site mx-auto px-6 md:px-10">
    <div class="text-center mb-12">
      <h2 class="font-serif text-2xl md:text-4xl text-gold-500">What We Carry</h2>
      <span class="block h-px w-16 bg-gold-500 mx-auto mt-4"></span>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <a href="#gallery" data-cat="all" class="cat-tile group border border-gold-500/30 hover:border-gold-500 rounded-lg p-6 text-center transition-all hover:-translate-y-1 hover:bg-gold-500/5">
        <div class="text-4xl mb-3">🧴</div>
        <h3 class="text-gold-500 font-serif text-lg">Perfumes</h3>
      </a>
      <a href="#gallery" data-cat="attar" class="cat-tile group border border-gold-500/30 hover:border-gold-500 rounded-lg p-6 text-center transition-all hover:-translate-y-1 hover:bg-gold-500/5">
        <div class="text-4xl mb-3">💧</div>
        <h3 class="text-gold-500 font-serif text-lg">Attar</h3>
      </a>
      <a href="#gallery" data-cat="spray" class="cat-tile group border border-gold-500/30 hover:border-gold-500 rounded-lg p-6 text-center transition-all hover:-translate-y-1 hover:bg-gold-500/5">
        <div class="text-4xl mb-3">💨</div>
        <h3 class="text-gold-500 font-serif text-lg">Sprays</h3>
      </a>
      <a href="#gallery" data-cat="air" class="cat-tile group border border-gold-500/30 hover:border-gold-500 rounded-lg p-6 text-center transition-all hover:-translate-y-1 hover:bg-gold-500/5">
        <div class="text-4xl mb-3">🌸</div>
        <h3 class="text-gold-500 font-serif text-lg">Air Fresheners</h3>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify in browser, commit**

```bash
npm run dev    # check appearance
# stop server
git add .
git commit -m "sections: brand story + category teaser"
```

---

## Phase E — Product Gallery (Centerpiece)

### Task E1: Products data + WhatsApp link builder + tests

**Files:**
- Create: `src/data/products.json`
- Create: `src/js/whatsapp.js`
- Create: `src/tests/whatsapp.test.js`

- [ ] **Step 1: Create products.json**

```json
{
  "primaryWhatsApp": "923338726133",
  "products": [
    { "id": "burberry-her", "brand": "Burberry", "name_en": "Her EDT", "name_ur": "ہر EDT", "type": "women", "price": 3499, "image": "/images/bottles/b1.jpg", "tier": "premium" },
    { "id": "ch-good-girl", "brand": "Carolina Herrera", "name_en": "Good Girl EDP", "name_ur": "گُڈ گرل EDP", "type": "women", "price": 4899, "image": "/images/bottles/b2.jpg", "tier": "premium" },
    { "id": "ck-defy", "brand": "Calvin Klein", "name_en": "Defy Parfum", "name_ur": "ڈیفائی پرفیوم", "type": "men", "price": 2699, "image": "/images/bottles/b3.jpg", "tier": "mid" },
    { "id": "burberry-london-men", "brand": "Burberry", "name_en": "London Men EDT", "name_ur": "لندن مین EDT", "type": "men", "price": 2299, "image": "/images/bottles/b4.jpg", "tier": "mid" },
    { "id": "ck-eternity-intense-w", "brand": "Calvin Klein", "name_en": "Eternity Intense Women EDP", "name_ur": "ایٹرنٹی انٹینس وومن EDP", "type": "women", "price": 2199, "image": "/images/bottles/b1.jpg", "tier": "mid" },
    { "id": "burberry-weekend", "brand": "Burberry", "name_en": "Weekend EDT", "name_ur": "ویک اینڈ EDT", "type": "unisex", "price": 1999, "image": "/images/bottles/b2.jpg", "tier": "mid" },
    { "id": "hb-bottled-night", "brand": "Hugo Boss", "name_en": "Bottled Night EDT", "name_ur": "بوٹلڈ نائٹ EDT", "type": "men", "price": 1949, "image": "/images/bottles/b3.jpg", "tier": "mid" },
    { "id": "ck-euphoria-w", "brand": "Calvin Klein", "name_en": "Euphoria Women EDT", "name_ur": "یوفوریا وومن EDT", "type": "women", "price": 1929, "image": "/images/bottles/b4.jpg", "tier": "mid" },
    { "id": "ck-eternity-men", "brand": "Calvin Klein", "name_en": "Eternity Men EDT", "name_ur": "ایٹرنٹی مین EDT", "type": "men", "price": 2499, "image": "/images/bottles/b5.jpg", "tier": "mid" },
    { "id": "ws-eau-my-secret", "brand": "Women Secret", "name_en": "Eau My Secret EDT", "name_ur": "او مائی سیکریٹ EDT", "type": "women", "price": 999, "image": "/images/bottles/b1.jpg", "tier": "entry" },
    { "id": "ab-her-secret", "brand": "Antonio Banderas", "name_en": "Her Secret Temptation", "name_ur": "ہر سیکریٹ ٹیمپٹیشن", "type": "women", "price": 899, "image": "/images/bottles/b2.jpg", "tier": "entry" },
    { "id": "benetton-black-intenso", "brand": "Benetton", "name_en": "Black Intenso EDP", "name_ur": "بلیک اینٹینسو EDP", "type": "men", "price": 459, "image": "/images/bottles/b3.jpg", "tier": "entry" }
  ]
}
```

- [ ] **Step 2: Write failing test for WhatsApp link builder**

Create `src/tests/whatsapp.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { buildOrderLink, formatPKR } from '../js/whatsapp.js';

describe('buildOrderLink', () => {
  it('builds wa.me link with prefilled English order message', () => {
    const url = buildOrderLink({
      number: '923338726133',
      product: { brand: 'Burberry', name_en: 'Her EDT', price: 3499 },
      lang: 'en',
    });
    expect(url).toContain('https://wa.me/923338726133');
    expect(url).toContain('Burberry');
    expect(url).toContain('Her%20EDT');
    expect(url).toContain('3%2C499');
    expect(url).toContain('10ml');
  });

  it('builds wa.me link with Urdu message when lang=ur', () => {
    const url = buildOrderLink({
      number: '923338726133',
      product: { brand: 'Burberry', name_ur: 'ہر EDT', price: 3499 },
      lang: 'ur',
    });
    expect(url).toContain('https://wa.me/923338726133');
    expect(decodeURIComponent(url)).toContain('السلام علیکم');
    expect(decodeURIComponent(url)).toContain('ہر EDT');
  });

  it('escapes URL-unsafe characters', () => {
    const url = buildOrderLink({
      number: '923338726133',
      product: { brand: 'X & Y', name_en: 'A/B', price: 100 },
      lang: 'en',
    });
    expect(url).not.toContain(' ');
    expect(url).toContain('%26');
    expect(url).toContain('%2F');
  });
});

describe('formatPKR', () => {
  it('formats numbers with thousand separators', () => {
    expect(formatPKR(3499)).toBe('3,499');
    expect(formatPKR(459)).toBe('459');
    expect(formatPKR(45118)).toBe('45,118');
  });
});
```

- [ ] **Step 3: Run test (expect FAIL)**

```bash
npm test
```

Expected: FAIL — `whatsapp.js` module not found.

- [ ] **Step 4: Implement whatsapp.js**

Create `src/js/whatsapp.js`:
```js
export function formatPKR(n) {
  return Number(n).toLocaleString('en-US');
}

export function buildOrderLink({ number, product, lang = 'en' }) {
  const price = formatPKR(product.price);
  const name = lang === 'ur' ? product.name_ur : product.name_en;
  const brand = product.brand || '';

  const msgEn = `Salam, I'd like to order *${brand} ${name} — 10ml decant* at Rs. ${price}. Are other sizes available?`;
  const msgUr = `السلام علیکم، میں *${brand} ${name} — 10ml ڈیکانٹ* آرڈر کرنا چاہتا/چاہتی ہوں — قیمت Rs. ${price}۔ کیا دیگر سائز دستیاب ہیں؟`;

  const text = lang === 'ur' ? msgUr : msgEn;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
```

- [ ] **Step 5: Run test (expect PASS)**

```bash
npm test
```

Expected: All 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/data src/js/whatsapp.js src/tests/whatsapp.test.js
git commit -m "products: data + whatsapp link builder w/ tests"
```

---

### Task E2: Gallery render

**Files:**
- Modify: `index.html` (add gallery section markup)
- Create: `src/js/gallery.js`
- Modify: `src/js/main.js` (import + init gallery)
- Create: `public/images/bottles/b1.jpg ... b5.jpg` (placeholder bottle images — see step 1)

- [ ] **Step 1: Source placeholder bottle images**

Use Unsplash CDN direct image URLs (free for commercial use under Unsplash license). Save these 5 URLs as local files in `public/images/bottles/`. Run from project root:

```bash
mkdir -p public/images/bottles
curl -L -o public/images/bottles/b1.jpg "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"
curl -L -o public/images/bottles/b2.jpg "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80"
curl -L -o public/images/bottles/b3.jpg "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"
curl -L -o public/images/bottles/b4.jpg "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800&q=80"
curl -L -o public/images/bottles/b5.jpg "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
```

Verify: 5 jpg files, each 50-200KB.

- [ ] **Step 2: Add gallery section markup to index.html**

After category teaser section:
```html
<section id="gallery" class="py-20 md:py-28 bg-gradient-to-b from-maroon-900 to-maroon-700">
  <div class="max-w-site mx-auto px-6 md:px-10">
    <div class="text-center mb-12">
      <h2 class="font-serif text-3xl md:text-5xl text-gold-500">Our Fragrances</h2>
      <span class="block h-px w-16 bg-gold-500 mx-auto mt-4 mb-3"></span>
      <p class="text-ivory-100/60 text-sm" data-i18n="gallery.subtitle">12 designer scents · 10ml decant pricing</p>
    </div>
    <div id="filter-pills" class="flex flex-wrap gap-2 justify-center mb-10">
      <button data-filter="all" class="filter-pill active px-4 py-2 text-sm rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition">All</button>
      <button data-filter="men" class="filter-pill px-4 py-2 text-sm rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition">Men</button>
      <button data-filter="women" class="filter-pill px-4 py-2 text-sm rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition">Women</button>
      <button data-filter="under-1k" class="filter-pill px-4 py-2 text-sm rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition">Under ₨1,000</button>
      <button data-filter="1k-2500" class="filter-pill px-4 py-2 text-sm rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition">₨1,000–2,500</button>
      <button data-filter="premium" class="filter-pill px-4 py-2 text-sm rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition">Premium</button>
    </div>
    <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <!-- cards injected by gallery.js -->
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create gallery.js**

Create `src/js/gallery.js`:
```js
import { buildOrderLink, formatPKR } from './whatsapp.js';

let products = [];
let primaryNumber = '923338726133';
let currentFilter = 'all';
let currentLang = 'en';

function matchesFilter(p, filter) {
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
  return `
    <article class="card group relative bg-maroon-900/40 border border-gold-500/20 rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-gold-500 hover:shadow-2xl hover:shadow-black/50">
      <div class="absolute top-3 right-3 z-10 text-[10px] text-ivory-100/40 bg-black/30 px-2 py-1 rounded">Reference image</div>
      <div class="aspect-[4/5] overflow-hidden bg-gradient-to-br from-maroon-700 to-maroon-900 relative">
        <div class="absolute inset-0 bg-gradient-radial from-gold-500/10 via-transparent to-transparent"></div>
        <img src="${p.image}" alt="${p.brand} ${name}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-luminosity opacity-90" />
      </div>
      <div class="p-5">
        <div class="h-px w-12 bg-gold-500 mb-4"></div>
        <p class="text-gold-500 text-xs tracking-widest uppercase">${p.brand}</p>
        <h3 class="font-serif text-xl text-ivory-100 mt-1 ${lang === 'ur' ? 'font-urdu' : ''}">${name}</h3>
        <span class="inline-block mt-3 text-xs text-gold-500 border border-gold-500/40 rounded-full px-3 py-1">10ml decant</span>
        <p class="text-gold-500 font-semibold text-2xl mt-4">₨${formatPKR(p.price)}</p>
        <p class="text-ivory-100/50 text-xs mt-1" data-i18n="gallery.otherSizes">Other sizes available on WhatsApp</p>
        <a href="${link}" target="_blank" rel="noopener"
           class="mt-4 block w-full text-center bg-gold-500 text-ink-900 font-medium py-2.5 rounded-md tracking-wide hover:bg-gold-300 transition md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0">
          Order on WhatsApp →
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

export async function initGallery({ lang = 'en' } = {}) {
  currentLang = lang;
  try {
    const res = await fetch('/src/data/products.json');
    const data = await res.json();
    products = data.products;
    primaryNumber = data.primaryWhatsApp;
  } catch (e) {
    console.error('Failed to load products', e);
    return;
  }
  render();

  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active', 'bg-gold-500', 'text-ink-900'));
      btn.classList.add('active', 'bg-gold-500', 'text-ink-900');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  document.querySelectorAll('[data-cat]').forEach(tile => {
    tile.addEventListener('click', e => {
      const map = { all: 'all', attar: 'all', spray: 'all', air: 'all' };
      const target = map[tile.dataset.cat] || 'all';
      document.querySelectorAll('.filter-pill').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === target);
        b.classList.toggle('bg-gold-500', b.dataset.filter === target);
        b.classList.toggle('text-ink-900', b.dataset.filter === target);
      });
      currentFilter = target;
      render();
    });
  });
}

export function setGalleryLang(lang) {
  currentLang = lang;
  render();
}
```

- [ ] **Step 4: Wire into main.js**

Update `src/js/main.js`:
```js
import { initNav } from './nav.js';
import { initGallery } from './gallery.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGallery();
});
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Expected: Gallery section renders 12 cards. Hovering desktop card lifts it + reveals WhatsApp button. Click filter pill → grid updates. Click WhatsApp button → opens wa.me link with prefilled message.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "gallery: 12 products grid, filters, whatsapp ctas"
```

---

### Task E3: Gallery filter unit tests

**Files:** Create `src/tests/gallery.test.js`

- [ ] **Step 1: Write filter logic test**

Note: gallery.js uses internal `matchesFilter`. We extract it as a named export for testability.

Refactor `src/js/gallery.js` to also export `matchesFilter`:
```js
// Add to existing gallery.js exports
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
```
And delete the duplicate `function matchesFilter` already present (the module-internal one).

- [ ] **Step 2: Write tests**

Create `src/tests/gallery.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { matchesFilter } from '../js/gallery.js';

const men = { type: 'men', price: 2000 };
const women = { type: 'women', price: 800 };
const unisex = { type: 'unisex', price: 1500 };
const premium = { type: 'men', price: 4000 };

describe('matchesFilter', () => {
  it('all returns every product', () => {
    [men, women, unisex, premium].forEach(p => expect(matchesFilter(p, 'all')).toBe(true));
  });
  it('men includes men + unisex, excludes women', () => {
    expect(matchesFilter(men, 'men')).toBe(true);
    expect(matchesFilter(unisex, 'men')).toBe(true);
    expect(matchesFilter(women, 'men')).toBe(false);
  });
  it('women includes women + unisex, excludes men', () => {
    expect(matchesFilter(women, 'women')).toBe(true);
    expect(matchesFilter(unisex, 'women')).toBe(true);
    expect(matchesFilter(men, 'women')).toBe(false);
  });
  it('under-1k matches only < 1000', () => {
    expect(matchesFilter(women, 'under-1k')).toBe(true);
    expect(matchesFilter(unisex, 'under-1k')).toBe(false);
  });
  it('1k-2500 matches inclusive range', () => {
    expect(matchesFilter(men, '1k-2500')).toBe(true);
    expect(matchesFilter(unisex, '1k-2500')).toBe(true);
    expect(matchesFilter(premium, '1k-2500')).toBe(false);
  });
  it('premium matches > 2500', () => {
    expect(matchesFilter(premium, 'premium')).toBe(true);
    expect(matchesFilter(men, 'premium')).toBe(false);
  });
});
```

- [ ] **Step 3: Run, expect PASS, commit**

```bash
npm test
git add .
git commit -m "test: gallery filter logic"
```

---

## Phase F — Trust Strip + Inside Razi (Videos)

### Task F1: Install ffmpeg + compress videos

**Files:** None code-side. Tool install + asset processing.

- [ ] **Step 1: Install ffmpeg via winget**

Run interactively (user instruction noted that they'll handle CLI auth/installs but ffmpeg install is needed for autonomous execution):

```bash
winget install --id=Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
```

Verify in a NEW terminal: `ffmpeg -version` prints version.

- [ ] **Step 2: Compress 3 videos to web-optimized variants**

Create the target dir and run for each:
```bash
mkdir -p public/videos
cd "/c/Users/ARFA TECH/Desktop/perfumePalace"

# Video 1 (1.4MB source)
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.34.00.mp4" \
  -an -vf "scale=720:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart \
  public/videos/inside-1.mp4
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.34.00.mp4" \
  -an -vf "scale=720:-2" -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 \
  public/videos/inside-1.webm
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.34.00.mp4" \
  -an -vf "scale=480:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart \
  public/videos/inside-1-mobile.mp4
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.34.00.mp4" \
  -vframes 1 -q:v 3 public/videos/inside-1-poster.jpg

# Video 2 (3.4MB source) — same pattern
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.34.01.mp4" \
  -an -vf "scale=720:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart \
  public/videos/inside-2.mp4
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.34.01.mp4" \
  -an -vf "scale=720:-2" -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 \
  public/videos/inside-2.webm
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.34.01.mp4" \
  -an -vf "scale=480:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart \
  public/videos/inside-2-mobile.mp4
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.34.01.mp4" \
  -vframes 1 -q:v 3 public/videos/inside-2-poster.jpg

# Video 3 (5.4MB source) — same pattern
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.38.28.mp4" \
  -an -vf "scale=720:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart \
  public/videos/inside-3.mp4
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.38.28.mp4" \
  -an -vf "scale=720:-2" -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 \
  public/videos/inside-3.webm
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.38.28.mp4" \
  -an -vf "scale=480:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart \
  public/videos/inside-3-mobile.mp4
ffmpeg -i "/c/Users/ARFA TECH/Downloads/WhatsApp Video 2026-05-17 at 16.38.28.mp4" \
  -vframes 1 -q:v 3 public/videos/inside-3-poster.jpg
```

Verify sizes: `ls -lh public/videos` — desktop variants ≤ 1.2MB, mobile ≤ 600KB, posters ≤ 80KB.

- [ ] **Step 3: Commit**

```bash
git add public/videos
git commit -m "videos: compress 3 shop interiors (mp4/webm, desktop+mobile, posters)"
```

---

### Task F2: Trust strip + Inside Razi section + video lazy loader

**Files:**
- Modify: `index.html` (add trust strip + inside-razi sections)
- Create: `src/js/video-loader.js`
- Modify: `src/js/main.js`

- [ ] **Step 1: Add trust strip section**

After gallery section in index.html:
```html
<section id="why-razi" class="py-16 bg-maroon-900 border-y border-gold-500/10">
  <div class="max-w-site mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
    <div><div class="text-gold-500 text-3xl mb-2">✓</div><p class="text-sm text-ivory-100/80">Wholesale rates</p></div>
    <div><div class="text-gold-500 text-3xl mb-2">✓</div><p class="text-sm text-ivory-100/80">Authentic stock</p></div>
    <div><div class="text-gold-500 text-3xl mb-2">✓</div><p class="text-sm text-ivory-100/80">10ml · 30ml · 50ml · Full bottle</p></div>
    <div><div class="text-gold-500 text-3xl mb-2">✓</div><p class="text-sm text-ivory-100/80">All major designer brands</p></div>
  </div>
</section>
```

- [ ] **Step 2: Add Inside Razi section**

After trust strip:
```html
<section id="inside-razi" class="py-20 md:py-28 bg-gradient-to-b from-maroon-900 to-maroon-700">
  <div class="max-w-site mx-auto px-6 md:px-10">
    <div class="text-center mb-12">
      <h2 class="font-serif text-3xl md:text-5xl text-gold-500">Inside Razi</h2>
      <span class="block h-px w-16 bg-gold-500 mx-auto mt-4 mb-3"></span>
      <p class="text-ivory-100/60 text-sm">See where every fragrance comes from.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div class="video-tile relative aspect-[9/16] rounded-lg overflow-hidden bg-black border border-gold-500/20" data-video="1">
        <img src="/videos/inside-1-poster.jpg" alt="Inside the shop — view 1" loading="lazy" class="w-full h-full object-cover" />
        <div class="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div class="w-14 h-14 rounded-full bg-gold-500/90 flex items-center justify-center text-ink-900 text-2xl">▶</div>
        </div>
      </div>
      <div class="video-tile relative aspect-[9/16] rounded-lg overflow-hidden bg-black border border-gold-500/20" data-video="2">
        <img src="/videos/inside-2-poster.jpg" alt="Inside the shop — view 2" loading="lazy" class="w-full h-full object-cover" />
        <div class="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div class="w-14 h-14 rounded-full bg-gold-500/90 flex items-center justify-center text-ink-900 text-2xl">▶</div>
        </div>
      </div>
      <div class="video-tile relative aspect-[9/16] rounded-lg overflow-hidden bg-black border border-gold-500/20" data-video="3">
        <img src="/videos/inside-3-poster.jpg" alt="Inside the shop — view 3" loading="lazy" class="w-full h-full object-cover" />
        <div class="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div class="w-14 h-14 rounded-full bg-gold-500/90 flex items-center justify-center text-ink-900 text-2xl">▶</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create video-loader.js**

Create `src/js/video-loader.js`:
```js
function shouldLoadVideo() {
  if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return false;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) return false;
  return true;
}

function attachVideo(tile) {
  if (tile.dataset.loaded === '1') return;
  tile.dataset.loaded = '1';
  const n = tile.dataset.video;
  const isMobile = window.innerWidth < 768;
  const suffix = isMobile ? '-mobile' : '';
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = 'metadata';
  video.className = 'absolute inset-0 w-full h-full object-cover';
  video.poster = `/videos/inside-${n}-poster.jpg`;
  video.innerHTML = `
    <source src="/videos/inside-${n}${suffix}.webm" type="video/webm" />
    <source src="/videos/inside-${n}${suffix}.mp4" type="video/mp4" />
  `;
  tile.appendChild(video);
  video.play().catch(() => { /* autoplay blocked — poster stays */ });
}

export function initVideoLoader() {
  if (!shouldLoadVideo()) return;
  const tiles = document.querySelectorAll('.video-tile');
  if (!tiles.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        attachVideo(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px' });
  tiles.forEach(t => io.observe(t));

  tiles.forEach(t => {
    t.addEventListener('click', () => openModal(t.dataset.video));
  });
}

function openModal(activeIdx) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] bg-black/95 flex items-center justify-center';
  overlay.innerHTML = `
    <button class="absolute top-4 right-4 text-ivory-100 text-3xl" aria-label="Close">✕</button>
    <video src="/videos/inside-${activeIdx}.mp4" controls autoplay class="max-h-[90vh] max-w-[90vw]"></video>
  `;
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.tagName === 'BUTTON') {
      overlay.remove();
    }
  });
  document.body.appendChild(overlay);
}
```

- [ ] **Step 4: Wire video-loader into main.js**

Update `src/js/main.js`:
```js
import { initNav } from './nav.js';
import { initGallery } from './gallery.js';
import { initVideoLoader } from './video-loader.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGallery();
  initVideoLoader();
});
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Expected: 3 video tiles render with poster images. Scroll to section → videos start playing muted. Click a tile → fullscreen modal opens with controls. Close via ✕.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "videos + trust: trust strip, inside razi tiles, lazy loader w/ modal"
```

---

## Phase G — Visit Us + Footer

### Task G1: Visit Us section + footer

**Files:** Modify `index.html`

- [ ] **Step 1: Add Visit Us section**

After inside-razi section:
```html
<section id="visit-us" class="py-20 md:py-28 bg-maroon-900">
  <div class="max-w-site mx-auto px-6 md:px-10">
    <div class="text-center mb-12">
      <h2 class="font-serif text-3xl md:text-5xl text-gold-500">Visit the Shop</h2>
      <span class="block h-px w-16 bg-gold-500 mx-auto mt-4"></span>
    </div>
    <div class="grid md:grid-cols-2 gap-8 items-start">
      <div class="aspect-square md:aspect-[4/5] rounded-lg overflow-hidden border border-gold-500/20">
        <iframe
          src="https://www.google.com/maps?q=Zaheer+Cheema+Plaza+Choa+Road+Kallar+Syedan+Rawalpindi&output=embed"
          class="w-full h-full" style="filter: grayscale(0.4) contrast(1.1);" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade" title="Razi Perfume Palace location"></iframe>
      </div>
      <div class="space-y-6">
        <div>
          <p class="text-gold-500 text-sm tracking-widest uppercase mb-2">Address</p>
          <p class="text-ivory-100 leading-relaxed">
            Shop #02, Zaheer Cheema Plaza,<br/>Choa Road, Kallar Syedan,<br/>Rawalpindi
          </p>
        </div>
        <div>
          <p class="text-gold-500 text-sm tracking-widest uppercase mb-2">Phone</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="tel:+923338726133" class="phone-tile flex items-center gap-3 p-3 border border-gold-500/20 rounded hover:border-gold-500 hover:bg-gold-500/5 transition">
              <span class="text-gold-500 text-xl">📞</span>
              <div>
                <p class="text-ivory-100 text-sm">0333-8726133</p>
                <p class="text-ivory-100/50 text-xs">Raja Saad</p>
              </div>
            </a>
            <a href="tel:+923051934272" class="phone-tile flex items-center gap-3 p-3 border border-gold-500/20 rounded hover:border-gold-500 hover:bg-gold-500/5 transition">
              <span class="text-gold-500 text-xl">📞</span>
              <div>
                <p class="text-ivory-100 text-sm">0305-1934272</p>
                <p class="text-ivory-100/50 text-xs">Raja Bilal</p>
              </div>
            </a>
            <a href="tel:+923125606336" class="phone-tile flex items-center gap-3 p-3 border border-gold-500/20 rounded hover:border-gold-500 hover:bg-gold-500/5 transition">
              <span class="text-gold-500 text-xl">📞</span>
              <p class="text-ivory-100 text-sm">0312-5606336</p>
            </a>
            <a href="tel:+923426266811" class="phone-tile flex items-center gap-3 p-3 border border-gold-500/20 rounded hover:border-gold-500 hover:bg-gold-500/5 transition">
              <span class="text-gold-500 text-xl">📞</span>
              <p class="text-ivory-100 text-sm">0342-6266811</p>
            </a>
          </div>
        </div>
        <div>
          <p class="text-gold-500 text-sm tracking-widest uppercase mb-2">Hours</p>
          <p class="text-ivory-100">9 AM – 9 PM · Open every day</p>
        </div>
        <a href="https://wa.me/923338726133"
           target="_blank" rel="noopener"
           class="block w-full text-center bg-gold-500 text-ink-900 font-medium py-3 rounded-md tracking-wide hover:bg-gold-300 transition">
          Chat on WhatsApp
        </a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add footer**

After Visit Us section:
```html
<footer class="bg-ink-900 border-t border-gold-500/20 py-12 mb-20 md:mb-0">
  <div class="max-w-site mx-auto px-6 md:px-10 text-center space-y-4">
    <div>
      <p class="font-urdu text-gold-500 text-2xl">رضی پرفیوم پیلس</p>
      <p class="font-serif text-ivory-100 tracking-[0.2em] text-sm">RAZI PERFUME PALACE</p>
      <p class="text-ivory-100/50 text-xs mt-1">Wholesale fragrance dealer · Kallar Syedan</p>
    </div>
    <div class="pt-4">
      <p class="text-gold-500 text-xs tracking-widest uppercase mb-3">Proprietors</p>
      <div class="flex justify-center gap-6 text-sm">
        <a href="https://www.facebook.com/profile.php?id=100004821720515" target="_blank" rel="noopener" class="text-ivory-100 hover:text-gold-500 transition flex items-center gap-2">
          <span>Raja Saad Jahangir</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/></svg>
        </a>
        <a href="https://www.facebook.com/profile.php?id=100052006638032" target="_blank" rel="noopener" class="text-ivory-100 hover:text-gold-500 transition flex items-center gap-2">
          <span>Raja Bilal Jahangir</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/></svg>
        </a>
      </div>
    </div>
    <div class="pt-4 text-ivory-100/60 text-sm space-y-1">
      <p>Shop #02, Zaheer Cheema Plaza, Choa Road, Kallar Syedan, Rawalpindi</p>
      <p>0333-8726133 · 0305-1934272 · 0312-5606336 · 0342-6266811</p>
    </div>
    <div class="h-px w-24 bg-gold-500/30 mx-auto my-4"></div>
    <p class="text-ivory-100/40 text-xs">© 2026 Razi Perfume Palace · All rights reserved</p>
  </div>
</footer>
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev   # eyeball
git add .
git commit -m "sections: visit us + footer"
```

---

## Phase H — Bilingual Toggle

### Task H1: i18n module + tests

**Files:**
- Create: `src/content/copy.json`
- Create: `src/js/i18n.js`
- Create: `src/tests/i18n.test.js`
- Modify: `src/js/main.js`

- [ ] **Step 1: Write i18n test**

Create `src/tests/i18n.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest';
import { getLang, setLang } from '../js/i18n.js';

describe('i18n storage', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  it('defaults to en if nothing stored', () => {
    expect(getLang()).toBe('en');
  });

  it('persists set lang to localStorage', () => {
    setLang('ur');
    expect(localStorage.getItem('razi-locale')).toBe('ur');
    expect(getLang()).toBe('ur');
  });

  it('setting lang updates <html lang> and dir', () => {
    setLang('ur');
    expect(document.documentElement.lang).toBe('ur');
    expect(document.documentElement.dir).toBe('rtl');
    setLang('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
```

- [ ] **Step 2: Run, expect FAIL**

```bash
npm test
```

- [ ] **Step 3: Implement i18n.js**

Create `src/js/i18n.js`:
```js
const KEY = 'razi-locale';

export function getLang() {
  try {
    return localStorage.getItem(KEY) || 'en';
  } catch {
    return 'en';
  }
}

export function setLang(lang) {
  try { localStorage.setItem(KEY, lang); } catch {}
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  applyLangVisibility(lang);
}

function applyLangVisibility(lang) {
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    el.classList.toggle('hidden', lang !== 'en');
  });
  document.querySelectorAll('[data-lang-ur]').forEach(el => {
    el.classList.toggle('hidden', lang !== 'ur');
  });
}

export function initI18n({ onChange } = {}) {
  const initial = getLang();
  setLang(initial);
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = getLang() === 'en' ? 'ur' : 'en';
      setLang(next);
      onChange?.(next);
    });
  }
}
```

- [ ] **Step 4: Create copy.json (placeholder for now, expanded later)**

```json
{
  "en": {
    "nav.home": "Home", "nav.story": "Story", "nav.shop": "Shop", "nav.visit": "Visit",
    "hero.tagline": "A world of scent"
  },
  "ur": {
    "nav.home": "ہوم", "nav.story": "ہماری کہانی", "nav.shop": "شاپ", "nav.visit": "وزٹ",
    "hero.tagline": "خوشبو کا جہاں"
  }
}
```

- [ ] **Step 5: Run test, expect PASS**

```bash
npm test
```

- [ ] **Step 6: Wire into main.js (with gallery lang sync)**

Update `src/js/main.js`:
```js
import { initNav } from './nav.js';
import { initGallery, setGalleryLang } from './gallery.js';
import { initVideoLoader } from './video-loader.js';
import { initI18n, getLang } from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  initI18n({ onChange: (lang) => setGalleryLang(lang) });
  await initGallery({ lang: getLang() });
  initVideoLoader();
});
```

- [ ] **Step 7: Verify + commit**

```bash
npm run dev   # toggle EN/اردو button, watch story columns swap, gallery re-render
git add .
git commit -m "i18n: toggle, persist, rtl swap, gallery lang sync"
```

---

## Phase I — Animation Polish + Performance

### Task I1: GSAP scroll reveals

**Files:** Modify `src/js/main.js`, create `src/js/anim.js`

- [ ] **Step 1: Create anim.js**

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.style.opacity = '1');
    return;
  }

  const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Hero entrance
  gsap.from('#hero h1, #hero p, #hero a', {
    opacity: 0, y: 24, duration: 1.2, stagger: 0.15, ease: 'power3.out',
  });

  // Section reveal helper
  document.querySelectorAll('section').forEach(section => {
    if (section.id === 'hero') return;
    const items = section.querySelectorAll('h2, p, .card, .video-tile, .filter-pill, .cat-tile, .phone-tile');
    if (!items.length) return;
    gsap.from(items, {
      opacity: 0, y: 24, duration: 0.8, stagger: 0.06, ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    });
  });
}
```

- [ ] **Step 2: Wire into main.js**

Update `src/js/main.js`:
```js
import { initNav } from './nav.js';
import { initGallery, setGalleryLang } from './gallery.js';
import { initVideoLoader } from './video-loader.js';
import { initI18n, getLang } from './i18n.js';
import { initAnimations } from './anim.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  initI18n({ onChange: (lang) => setGalleryLang(lang) });
  await initGallery({ lang: getLang() });
  initVideoLoader();
  initAnimations();
});
```

- [ ] **Step 3: Verify smooth scroll + reveals**

```bash
npm run dev   # scroll the page, animations should reveal cleanly
git add .
git commit -m "anim: gsap reveals + lenis smooth scroll"
```

---

### Task I2: Production build + Lighthouse pass

**Files:** None — verification.

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: `dist/` produced. Check `dist/assets/` for hashed bundles. Note overall sizes.

- [ ] **Step 2: Preview built site**

```bash
npm run preview
```

Open the printed URL. Check that all sections render and behave like dev. Stop preview server.

- [ ] **Step 3: Lighthouse manual check**

Open the preview URL in Chrome, run Lighthouse (DevTools → Lighthouse → Mobile, Performance + Accessibility + Best Practices + SEO). Record scores.

Target gates:
- Performance ≥ 85 (target 90)
- Accessibility ≥ 95
- Best Practices ≥ 90
- SEO ≥ 90

If Performance < 85, common quick fixes:
- Add `width` + `height` attributes to all `<img>` tags
- Defer Google Fonts with `media="print" onload="this.media='all'"` trick
- Reduce GSAP-imported plugin surface (we only need ScrollTrigger)

- [ ] **Step 4: Commit any perf tweaks**

If tweaks needed:
```bash
git add .
git commit -m "perf: lighthouse polish pass"
```

---

## Phase J — Deploy

### Task J1: Push to GitHub

**Files:** None — git remote operations.

- [ ] **Step 1: Verify gh auth**

```bash
gh auth status
```

If not authenticated as `alihamza143143`, prompt the user with: `please run ! gh auth login` and wait for confirmation.

- [ ] **Step 2: Create remote repo**

```bash
gh repo create alihamza143143/razi-perfume-palace --public --source=. --description "Razi Perfume Palace — bilingual luxury landing site"
```

- [ ] **Step 3: Push**

```bash
git push -u origin main
```

Verify: `gh repo view alihamza143143/razi-perfume-palace --web` opens GitHub.

---

### Task J2: Deploy to Vercel

**Files:** Create `vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/videos/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/images/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

- [ ] **Step 2: Commit + push**

```bash
git add vercel.json
git commit -m "deploy: vercel config"
git push
```

- [ ] **Step 3: Verify vercel CLI auth + scope**

```bash
vercel whoami
vercel teams list
```

If not authenticated as the personal account (NOT `dev-4046`/rsnnetwork), prompt user: `please run ! vercel login` with personal email and wait.

- [ ] **Step 4: Deploy**

```bash
vercel link --yes --project razi-perfume-palace
vercel --prod --yes
```

Capture the production URL printed (e.g., `https://razi-perfume-palace.vercel.app`).

- [ ] **Step 5: Smoke test production**

Open the production URL on:
- Desktop Chrome — full visual + scroll
- Mobile Chrome (DevTools mobile emulation, iPhone 12 Pro) — responsive
- Open `/` on real phone if possible

Verify:
- Hero loads
- Toggle EN/اردو works
- Click a product card's WhatsApp button → opens wa.me link
- Click a phone tile → dialer opens (mobile only)
- Videos play in Inside Razi section
- Lighthouse run on production URL hits ≥ 85 perf

- [ ] **Step 6: Commit if any fix needed, redeploy**

```bash
# only if changes
git add . && git commit -m "fix: production smoke fixes" && git push
# Vercel auto-deploys from push
```

---

### Task J3: RajaSkill production audit + hand-off

**Files:** None — orchestration.

- [ ] **Step 1: Invoke RajaSkill via Skill tool**

Use Skill tool with name `RajaSkill`. Ask it to audit the deployed production site for: visual polish, mobile responsiveness on Android/iOS viewports, performance budget verification, contact link sanity, video performance under throttled network.

- [ ] **Step 2: Apply any RajaSkill-identified fixes**

For each issue raised, fix in code, commit, and push (Vercel auto-deploys).

- [ ] **Step 3: Hand back final URL to user**

Print to user:
- Production URL
- GitHub repo URL
- Summary of what shipped (sections, products count, languages, animations)
- Any open items remaining (e.g., real product photos when available, custom domain)

---

## Self-Review Checklist

After completing the plan above, before invoking execution skill, verify:

**1. Spec coverage**
- [x] Brand system (§3) → Task B1 (tokens)
- [x] Tech stack (§4) → Task A2 (scaffold)
- [x] Page architecture (§5) → Tasks B2, C1, D1, E1-E3, F1-F2, G1
- [x] Hero (§6.1) → Task C1
- [x] Brand story (§6.2) → Task D1
- [x] Category teaser (§6.3) → Task D1
- [x] Product gallery (§6.4) → Tasks E1-E3
- [x] Trust strip (§6.5) → Task F2
- [x] Inside Razi videos (§6.6) → Tasks F1-F2
- [x] Visit Us (§6.7) → Task G1
- [x] Footer (§6.8) → Task G1
- [x] Product catalog with 10ml pricing (§7) → Task E1 (products.json)
- [x] Bilingual (§8) → Task H1
- [x] Animations (§9) → Task I1
- [x] Responsive (§10) → Built into every section's Tailwind classes
- [x] Video integration (§11) → Tasks F1-F2 (ffmpeg + video-loader)
- [x] Performance (§12) → Task I2
- [x] Accessibility (§13) → Built into markup; verified in Task I2 Lighthouse
- [x] Deploy (§14) → Tasks J1-J2
- [x] Success criteria (§16) → Task J2 step 5 smoke test

**2. Placeholder scan**
- No "TBD" / "implement later" without code
- All test snippets contain real assertions
- All file paths are exact

**3. Type / name consistency**
- `buildOrderLink` (E1, used in E2) — signature consistent
- `matchesFilter` (E2 refactored to export, used in E3 test) — exported as expected
- `getLang` / `setLang` (H1) — used in main.js (H1 step 6)
- `initGallery({ lang })` (E2) — called with `{ lang: getLang() }` in main.js

Plan ready for execution.
