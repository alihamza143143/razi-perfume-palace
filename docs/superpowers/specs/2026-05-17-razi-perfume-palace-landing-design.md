# Razi Perfume Palace — Landing Page Design Spec

**Date**: 2026-05-17
**Status**: Draft — awaiting user review
**Author**: Brainstormed with Ali Hamza (developer)
**Client / shop owner**: Raja Saad Jahangir & Raja Bilal Jahangir (proprietors)

---

## 1. Project Overview

A single-page, bilingual (English + Urdu) luxury landing site for **رضی پرفیوم پیلس — Razi Perfume Palace**, a wholesale fragrance dealer in Kallar Syedan, Rawalpindi. The site showcases hand-picked international designer fragrances at decant-friendly 10ml pricing, with WhatsApp as the primary conversion channel. No cart, no checkout — every product card opens a prefilled WhatsApp order chat.

**Goal**: Convert search/social traffic into WhatsApp leads and shop visits. Communicate "real shop, real stock, fair wholesale pricing" within 10 seconds of landing.

---

## 2. Scope

### In scope (v1)

- Single long-scroll landing page
- Bilingual content (English default, Urdu toggle with full RTL)
- Hero with animated logo reveal
- Brand story section
- Category teaser (4 tiles)
- Product gallery (12 hand-picked perfumes, 10ml decant pricing)
- "Why Razi" trust strip (4 icons)
- "Inside Razi" video section (3 shop-interior videos in 9:16 tiles)
- Visit Us section (embedded Google Map + 4 phone tiles + hours)
- Footer (proprietor names, social icons, address, phones)
- WhatsApp "Order Now" CTAs throughout, with prefilled per-product messages
- Sticky mobile-only bottom CTA bar
- GSAP scroll animations + Lenis smooth scroll
- Responsive: mobile-first, breakpoints at 640px, 1024px
- Reduced-motion + reduced-data accessibility fallbacks

### Out of scope (v1)

- Shopping cart, checkout, payment integration
- Admin panel / CMS
- Database — products live in a JSON file
- Real product photography (placeholder strategy below)
- Separate /shop, /about, or /contact pages
- Blog, testimonials, newsletter signup
- Size selector on product cards (single 10ml price; multi-size handled over WhatsApp)
- User accounts / login
- Multi-language beyond EN + UR
- Server-side rendering — fully static

---

## 3. Brand System

### Palette

| Token | Hex | Use |
|---|---|---|
| `--maroon-900` | `#3B0A0A` | Primary background, hero base |
| `--maroon-700` | `#5A1212` | Section backgrounds, hover states |
| `--red-brand` | `#8B0000` | Accents, secondary CTAs |
| `--gold-500` | `#C9A24B` | Primary CTAs, logo, headings underlines |
| `--gold-300` | `#E0C481` | Hover highlights, shimmer |
| `--ivory-100` | `#F4EBD0` | Text on dark backgrounds |
| `--ivory-60` | `rgba(244,235,208,0.6)` | Secondary text |
| `--ink-900` | `#0A0606` | Text on gold buttons |

### Typography

| Use | Family | Weight | Notes |
|---|---|---|---|
| English headings | Cormorant Garamond | 500 / 600 | Serif, luxury feel |
| English body | Inter | 400 / 500 | Clean modern sans |
| Numbers / prices | Inter (tabular figures) | 600 | `font-variant-numeric: tabular-nums` so columns align |
| Urdu headings + body | Noto Nastaliq Urdu | 400 / 600 | Web-safe Nastaliq, loads via Google Fonts |
| Logo Urdu calligraphy | Custom SVG | — | Traced from Facebook poster, gold fill, animatable per-character |

### Logo

Two-part lockup, gold on dark, used everywhere:

1. **Urdu mark** — `رضی پرفیوم پیلس` traced from the existing poster as an SVG. Crisp at every size, supports per-letter draw-on animation.
2. **English wordmark** — `RAZI PERFUME PALACE` in Cormorant Garamond, smaller, letter-spaced, beneath the Urdu mark.

Optional ornament: small `✦` gold star left and right of the Urdu mark.

---

## 4. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Build | **Vite** (vanilla, no React) | Single-page site doesn't need framework overhead |
| Markup | HTML + small templated includes | Simplicity, easy editing |
| Styling | **Tailwind CSS** | Design system tokens, fast iteration, responsive utilities |
| Animations | **GSAP** + ScrollTrigger | Best-in-class, granular control, well-supported |
| Smooth scroll | **Lenis** | Buttery scroll, plays well with ScrollTrigger |
| i18n | Custom — `src/content/copy.json` + tiny JS toggle | No framework needed; one file holds all bilingual content |
| Icons | Lucide (SVG) + custom gold ornaments | Crisp, lightweight |
| Map | Google Maps embed `<iframe>` | Zero JS cost, native mobile handoff |
| Hosting | **Vercel** (personal scope, not rsnnetwork) | Auto-deploy from GitHub, free CDN, edge cache |
| Repo | Private GitHub under `alihamza143143` | Per standing rule: client previews stay private until presentable |

### Files / structure (proposed)

```
perfumePalace/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-17-razi-perfume-palace-landing-design.md  ← this file
├── public/
│   ├── images/
│   │   ├── bottles/                   ← placeholder bottle photos (4-5 generic, reused)
│   │   ├── textures/                  ← maroon marble parallax bg
│   │   └── og-image.jpg               ← Open Graph share card
│   ├── videos/                        ← compressed shop-interior videos + posters
│   │   ├── inside-1.mp4 / .webm / -poster.jpg
│   │   ├── inside-2.mp4 / .webm / -poster.jpg
│   │   └── inside-3.mp4 / .webm / -poster.jpg
│   └── fonts/                         ← self-hosted if needed
├── src/
│   ├── content/
│   │   └── copy.json                  ← all bilingual text (en + ur)
│   ├── data/
│   │   └── products.json              ← 12 products with prices, brand, volume
│   ├── styles/
│   │   ├── tailwind.css
│   │   └── tokens.css                 ← CSS custom properties from §3
│   ├── js/
│   │   ├── main.js                    ← entry, Lenis init, GSAP timelines
│   │   ├── i18n.js                    ← language toggle, localStorage persist
│   │   ├── gallery.js                 ← filter pills, WhatsApp link builder
│   │   ├── video-loader.js            ← lazy load + network-aware degradation
│   │   └── nav.js                     ← sticky nav scroll behaviour
│   └── components/                    ← templated HTML partials
│       ├── nav.html
│       ├── hero.html
│       ├── brand-story.html
│       ├── category-teaser.html
│       ├── gallery.html
│       ├── trust-strip.html
│       ├── inside-razi.html
│       ├── visit-us.html
│       └── footer.html
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .gitignore
└── README.md
```

---

## 5. Page Architecture

Single long-scroll page with sticky nav. Section order:

1. **Hero** — 100vh, dark gradient, gold logo reveal, primary CTAs
2. **Brand Story** — parallax marble background, EN + UR copy
3. **Category Teaser** — 4 tiles linking to gallery filter
4. **Product Gallery** — 12 perfumes, 10ml decant pricing, filter pills, WhatsApp CTAs
5. **Why Razi** — trust strip, 4 icons in a row
6. **Inside Razi** — 3 phone-shot shop-interior videos in 9:16 tiles
7. **Visit Us** — Google Map + 4 phone tiles + address + hours + WhatsApp CTA
8. **Footer** — logo, proprietors, social icons, repeat contact info, copyright

**Sticky elements**:
- Top nav: logo (small), nav links (Home / Story / Shop / Visit), language toggle (`EN | اردو`). Translucent on hero, opaque maroon on scroll.
- Mobile-only bottom bar: persistent gold **Order on WhatsApp** button.

---

## 6. Section Specs

### 6.1 Hero

- **Height**: `100vh` (capped at 900px so very tall monitors don't waste space)
- **Background**: radial gradient `--maroon-900` → near-black, with subtle gold particle drift (CSS-only, ~12 particles, slow downward drift, 30% opacity)
- **Content** (centered):
  - Urdu calligraphy SVG, animated letter-by-letter on load (~1.8s)
  - English wordmark fades in below
  - Tagline: `خوشبو کا جہاں · A world of scent`
  - Primary CTA (gold filled): **Order on WhatsApp →**
  - Secondary CTA (gold outlined): **Visit Shop** (smooth-scrolls to Visit Us)
- **Decorative**: Slow-rotating perfume bottle (CSS `transform: rotateY` infinite, ~16s/cycle). Behind text on mobile, beside text on desktop.
- **On scroll out**: Hero contents fade + parallax down. Logo SVG shrinks and docks into sticky nav.

### 6.2 Brand Story

- **Height**: ~80vh
- **Background**: Maroon marble texture, parallax factor 0.3
- **Layout**: Two columns (English / Urdu) side by side on desktop. Stack vertically on mobile. On Urdu locale, only Urdu column shows; on English locale, only English column shows. (Toggle hides the non-active column.)
- **Copy** (English):
  > A house of fragrance, built on trust.
  > Razi Perfume Palace is a wholesale fragrance house in Kallar Syedan. We carry international designer fragrances, authentic attar, and sprays — at honest wholesale rates.
  > — Muhammad Saad Jahangir, Proprietor
- **Copy** (Urdu):
  > خوشبو کا گھر، اعتماد پر قائم۔
  > رضی پرفیوم پیلس کلر سیداں کا تھوک ڈیلر ہے۔ ہم بین الاقوامی ڈیزائنر خوشبو، اصلی عطر اور سپرے مناسب قیمت پر فراہم کرتے ہیں۔
  > — محمد سعد جہانگیر، پروپرائٹر
- **Animation**: Word-by-word fade-in as section enters viewport. Gold underline draws under heading.

### 6.3 Category Teaser

- 4 tiles in a row (desktop) / 2x2 (mobile):
  - Perfumes · Attar · Sprays · Air Fresheners
- Each tile: gold border, ivory text, icon. Hover → lifts 4px, gold border brightens.
- Click → smooth-scrolls to Product Gallery, applies that category filter.

### 6.4 Product Gallery

- **Heading**: `OUR FRAGRANCES · ہماری خوشبوئیں`
- **Filter pills** above grid (gold pills, single-select):
  - `All · Men · Women · Under ₨1,000 · ₨1,000–2,500 · Premium`
- **Grid**: 3 columns desktop, 2 columns tablet, 1 column mobile
- **12 products** (see §7 for full data)
- **Card design**:
  - Aspect: portrait, 4:5 image area
  - Image: placeholder bottle photo (see §7 placeholder strategy)
  - Soft gold radial gradient behind bottle
  - Brand (small, gold uppercase, letter-spaced)
  - Product name (Cormorant Garamond, ivory)
  - "10ml decant" pill, gold border
  - Price in gold, bold
  - "Other sizes available on WhatsApp" — small ivory 60% line
  - Gold **Order on WhatsApp →** button (hover-reveal on desktop, always-visible on mobile)
  - Small `[Reference image]` tag corner — legal disclaimer that photos are representative
- **Card hover** (desktop): lifts 8px, gold-tinted shadow, gold border traces around edge, bottle scales 1.05.
- **WhatsApp click**: opens `https://wa.me/923338726133?text=<URL-encoded prefilled message>`
  - EN: `Salam, I'd like to order *Burberry Her EDT — 10ml decant* at Rs. 3,499. Are other sizes available?`
  - UR: `السلام علیکم، میں *برباری ہر EDT — 10ml ڈیکانٹ* آرڈر کرنا چاہتا/چاہتی ہوں — قیمت Rs. 3,499۔ کیا دیگر سائز دستیاب ہیں؟`

### 6.5 Why Razi (trust strip)

- 4 icons in a row (single row desktop, 2x2 mobile)
- Each: gold line-icon + short label
  1. ✓ Wholesale rates
  2. ✓ Authentic stock
  3. ✓ Available in 10ml, 30ml, 50ml & full bottle
  4. ✓ All major designer brands

### 6.6 Inside Razi (videos)

- **Heading**: `INSIDE RAZI · ہمارے دکان کے اندر`
- **Subhead**: `See where every fragrance comes from.`
- **Layout**:
  - Desktop: 3 tiles in a row, each 9:16 vertical
  - Mobile: 1 tile per screen, horizontal-swipe carousel
- **Tile behaviour**:
  - Initial: poster image (first frame extracted at build time)
  - Hover (desktop): mute + autoplay loop
  - Tap: open fullscreen modal with all 3 swipeable
  - Audio: always muted (browser autoplay rules)
- **Below tiles**: CTA `[ Visit Us → ]`

### 6.7 Visit Us

- **Heading**: `VISIT THE SHOP · ہماری دکان آئیں`
- **Layout**: 2-column on desktop (map left, info right); stacked on mobile (map above info)
- **Left**: Google Maps `<iframe>` pinned to `Zaheer Cheema Plaza Choa Road Kallar Syedan Rawalpindi`. Dark-themed (Google's `dark` style if available, else default). Button below: **Open in Maps →** (opens native maps app on mobile via `geo:` / Apple Maps URL).
- **Right**:
  - Address: `Shop #02, Zaheer Cheema Plaza, Choa Road, Kallar Syedan, Rawalpindi`
  - Phone tiles (4 of them, each is a `tel:` link):
    - 📞 0333-8726133 — Raja Saad
    - 📞 0305-1934272 — Raja Bilal
    - 📞 0312-5606336
    - 📞 0342-6266811
  - Hours: `9 AM – 9 PM, daily`
  - Primary WhatsApp CTA (gold filled): **Chat on WhatsApp** → `wa.me/923338726133` (no prefilled message — general enquiry)

### 6.8 Footer

- Logo (small, gold)
- `رضی پرفیوم پیلس · RAZI PERFUME PALACE`
- `Wholesale fragrance dealer · Kallar Syedan`
- **Proprietors** subheading:
  - Raja Saad Jahangir → Facebook icon links to `https://www.facebook.com/profile.php?id=100004821720515`
  - Raja Bilal Jahangir → Facebook icon links to `https://www.facebook.com/profile.php?id=100052006638032`
- Full address
- All 4 phones
- Thin gold divider line
- `© 2026 Razi Perfume Palace · All rights reserved`

---

## 7. Product Catalog

### Pricing rule

`displayed_10ml_price = (allure_full_bottle_price ÷ volume_ml) × 10ml × 0.88` (~12% under Allure), rounded to clean `₨X99` retail.

### The 12 products

| # | Brand | Name | Type | 10ml Price (₨) | WhatsApp keyword |
|---|---|---|---|---|---|
| 1 | Burberry | Her EDT | Women | 3,499 | `Burberry Her EDT 10ml` |
| 2 | Carolina Herrera | Good Girl EDP | Women | 4,899 | `Carolina Herrera Good Girl 10ml` |
| 3 | Calvin Klein | Defy Parfum | Men | 2,699 | `CK Defy Parfum 10ml` |
| 4 | Burberry | London Men EDT | Men | 2,299 | `Burberry London Men 10ml` |
| 5 | Calvin Klein | Eternity Intense Women EDP | Women | 2,199 | `CK Eternity Intense Women 10ml` |
| 6 | Burberry | Weekend EDT | Unisex | 1,999 | `Burberry Weekend 10ml` |
| 7 | Hugo Boss | Bottled Night EDT | Men | 1,949 | `Hugo Boss Bottled Night 10ml` |
| 8 | Calvin Klein | Euphoria Women EDT | Women | 1,929 | `CK Euphoria Women 10ml` |
| 9 | Calvin Klein | Eternity Men EDT | Men | 2,499 | `CK Eternity Men 10ml` |
| 10 | Women Secret | Eau My Secret EDT | Women | 999 | `Women Secret Eau My Secret 10ml` |
| 11 | Antonio Banderas | Her Secret Temptation | Women | 899 | `Antonio Banderas Her Secret Temptation 10ml` |
| 12 | Benetton | Black Intenso EDP | Men | 459 | `Benetton Black Intenso 10ml` |

Data lives in `src/data/products.json`:
```json
{
  "products": [
    {
      "id": "burberry-her-edt",
      "brand": "Burberry",
      "name_en": "Her EDT",
      "name_ur": "ہر EDT",
      "type": "women",
      "price_pkr": 3499,
      "image": "/images/bottles/dark-round-1.jpg",
      "premium": true
    },
    ...
  ]
}
```

### Placeholder image strategy

- 4–5 royalty-free perfume bottle photos from Unsplash/Pexels, picked to roughly match brand aesthetics (Burberry-ish glass, CK-ish square, etc.)
- Cycled across the 12 cards intentionally so it doesn't look lazy
- Each card carries a tiny `[Reference image]` corner tag to make clear photos are representative — legal cover + buyer honesty
- Folder: `public/images/bottles/` — swap any file to update everything

---

## 8. Bilingual Content Strategy

- **Source of truth**: `src/content/copy.json` — shape `{ en: {...}, ur: {...} }` with section/key paths
- **Default locale**: English on first visit; remembers user choice in `localStorage` (`razi-locale`)
- **Toggle**: `EN | اردو` in nav header. Switches instantly, no reload.
- **DOM behaviour on toggle**:
  - `<html lang>` and `<html dir>` swap (`en` / `ltr` ↔ `ur` / `rtl`)
  - Nastaliq font kicks in for all text when `ur`
  - Tailwind RTL utilities handle layout flip (`rtl:ml-0 rtl:mr-4` etc.)
  - Non-active language blocks hide via `[data-lang]` selector
- **WhatsApp prefilled messages**: separate `wa_message_en` / `wa_message_ur` per product
- **URLs stay the same** — no `/en` vs `/ur` paths. SEO is fine for a single-page brochure; Google indexes whichever locale is default on first paint.
- **Open Graph share card**: English only for v1 (most shares happen in mixed-language WhatsApp threads where English is universally readable)

---

## 9. Animation Strategy

Three layers:

1. **Smooth scroll**: Lenis, ease `0.8`, gentle inertia. One global instance, integrated with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
2. **Scroll-triggered reveals**: GSAP ScrollTrigger. Every major content block fades + slides up 24px as it enters viewport, staggered ~80ms per child. Fires once per page load, no re-trigger when scrolling back up (`once: true`).
3. **Micro-interactions**: Card hovers, gold shimmer sweep on primary CTA, nav background tint on scroll-past-hero. CSS-only where possible; GSAP only for things needing precise timing.

### Reduced-motion fallback

`@media (prefers-reduced-motion: reduce)`:
- All GSAP animations swap to instant fades (`gsap.set` instead of `gsap.to`)
- Lenis smooth scroll disabled (use native scroll)
- Hero bottle rotation paused
- Card hover transforms removed

### Performance constraints

- No animation may cause a layout shift (CLS = 0 target)
- All animated properties limited to `transform` and `opacity` (GPU-cheap)
- ScrollTrigger-driven scenes disabled below 360px viewport width as a fallback

---

## 10. Responsive Plan

| Breakpoint | Width | Key changes |
|---|---|---|
| Mobile | ≤ 640px | Nav collapses to hamburger; hero bottle behind text low-opacity; gallery 1-col; "Order on WhatsApp" always visible on cards; Visit Us stacks; sticky bottom WhatsApp bar appears |
| Tablet | 641–1024px | Gallery 2-col; nav links visible; bottom bar hidden |
| Desktop | ≥ 1025px | Full 3-col gallery; hover states active; sticky nav full width |

**Test targets**:
- iPhone SE (375×667)
- Samsung Galaxy A-series (360×800)
- iPhone 14 Pro (393×852)
- iPad (768×1024)
- Desktop 1440×900

---

## 11. Video Integration Strategy

Three phone-shot shop-interior videos, placed in §6.6 "Inside Razi" as 9:16 vertical tiles.

### Build-time processing

For each `.mp4` in `Downloads/WhatsApp Video 2026-05-17 at *.mp4`:

1. **Re-encode** with ffmpeg:
   - Desktop variant: 720p, ~1.2 Mbps H.264, `-movflags +faststart`
   - Mobile variant: 480p, ~600 Kbps H.264
2. **Generate WebM** (VP9) versions, ~30% smaller, served first to modern browsers
3. **Extract poster** — first frame as JPG, quality 85
4. **Strip audio** — saves ~30%, audio not used (muted autoplay)

Resulting per-video assets land in `public/videos/`:
```
inside-1.mp4    (720p ~1.2MB)
inside-1.webm   (720p ~800KB)
inside-1-mobile.mp4   (480p ~600KB)
inside-1-mobile.webm  (480p ~400KB)
inside-1-poster.jpg   (~50KB)
```

### Runtime loading

`src/js/video-loader.js`:

1. On page load: only poster images render. No video bytes downloaded.
2. **IntersectionObserver** watches video tiles. When a tile enters viewport:
   - If `navigator.connection.effectiveType` is `'2g'` or `'slow-2g'` OR `prefers-reduced-data` is set → stop. Show poster only.
   - Else: inject `<video preload="metadata" muted loop playsinline autoplay>` with `<source>` for WebM then MP4, picking mobile or desktop variant based on viewport width.
3. On tap (mobile) or click (desktop) → open fullscreen modal with all 3 videos swipeable, controls visible.

### Performance budget

- Total page initial payload (HTML + CSS + JS + fonts + above-fold images): **≤ 500 KB**
- Hero + brand story + first 3 product cards loaded → page is interactive
- Videos load only on scroll; combined video payload capped at **3 MB**
- Lighthouse Performance target: **≥ 90 on mid-tier mobile (Moto G4-class)**

---

## 12. Performance & SEO

### Performance

- Vite production build: minified CSS/JS, hashed filenames for cache
- Tailwind purges unused classes in production
- Fonts: `font-display: swap` on Cormorant + Nastaliq; subset to Latin + Arabic where possible
- Images: WebP with JPG fallback, `<img loading="lazy">` for everything below the fold
- One critical CSS bundle inlined in `<head>` for above-fold paint

### SEO basics

- `<title>` and `<meta name="description">` per locale (English default in HTML, JS swaps for Urdu)
- Open Graph + Twitter Card meta — share card shows logo, tagline, address
- `<link rel="canonical">` to `https://raziperfumepalace.com` (placeholder domain)
- Schema.org `LocalBusiness` JSON-LD with: name, address, phones, hours, geo coords, image
- robots.txt + sitemap.xml (single-URL sitemap is fine for a one-pager)

---

## 13. Accessibility

- Color contrast: gold-on-maroon and ivory-on-maroon both pass WCAG AA (verified during build)
- All interactive elements keyboard-reachable; visible focus rings (gold outline, 2px)
- `<button>` for buttons, `<a>` for links — no clickable `<div>`
- `aria-label` on icon-only buttons (Facebook icons, phone tiles, language toggle)
- Video tiles have `aria-label="Inside the shop, video 1 of 3"`
- Language toggle uses `aria-pressed`
- Forms (none in v1) — n/a

---

## 14. Deploy Plan

1. **Repo**: GitHub `alihamza143143/razi-perfume-palace`. Public or private TBD (default public for shareability, flip to private if the client prefers).
2. **Hosting**: Vercel, **personal scope** (NOT `rsnnetwork` team — this is a personal/client project).
3. **Production URL on launch**: `razi-perfume-palace.vercel.app` (Vercel's default subdomain) — shareable from the moment the full v1 ships. Per shop owner's explicit instruction to deliver a public production URL.
4. **Custom domain (optional, later)**: `raziperfumepalace.com` (or `.pk` / `.shop`) — purchased separately after launch if the shop owner wants. Site keeps working on `vercel.app` indefinitely.
5. **Push cadence during build**: every phase boundary, with autonomous execution from spec approval onward.
6. **Standing safety rules still apply**: no `Co-Authored-By` in commits, no AI mentions in commit messages / PR descriptions / GitHub content.

### Phases (for implementation plan)

- Phase A — Project scaffold (Vite + Tailwind + GSAP + Lenis, empty index.html)
- Phase B — Brand system + design tokens + global layout
- Phase C — Hero
- Phase D — Brand story + category teaser
- Phase E — Product gallery (the centerpiece)
- Phase F — Trust strip + Inside Razi (videos)
- Phase G — Visit Us + footer
- Phase H — Bilingual toggle wiring + Urdu copy pass
- Phase I — Animation polish + performance pass
- Phase J — Vercel deploy + share preview with shop owner

---

## 15. Open Questions / Defer to Implementation

- **Repo location** — `perfumePalace/` currently sits inside the Desktop git repo. Past incident (`RSN/` losing `.git`) makes nested repos risky here. Need to decide: keep here and add to outer `.gitignore`, or move to a sibling like `Desktop/perfumePalace-dev/` before `git init`. **Decide before Phase A.**
- **Domain purchase** — `.com` vs `.pk` vs `.shop`. Confirm with shop owner before Phase J.
- **Shop owner confirmation** on: shop hours (placeholder `9 AM – 9 PM daily`), primary WhatsApp number (`0333-8726133`), proprietor attribution (currently `Muhammad Saad Jahangir` in brand story — confirm preferred name).
- **Future v2 candidates** (out of scope now): size selector dropdown, real product photos, /shop separate page with full catalog (50+ items), testimonials, blog, newsletter, payment integration if conversion data justifies.

---

## 16. Success Criteria

The v1 site is "done" when:

- All 8 sections render correctly on mobile + desktop
- Bilingual toggle switches instantly with correct RTL on Urdu
- All 12 products are tappable and open WhatsApp with the correct prefilled message
- All 4 phone tiles dial on mobile
- Google Maps embed shows correct shop location
- 3 shop-interior videos play in the Inside Razi section, with poster fallback on slow networks
- Lighthouse Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on mid-tier mobile
- Site deployed to Vercel under `alihamza143143` personal scope at a shareable production URL (`razi-perfume-palace.vercel.app` or similar)
- Production URL handed back to shop owner ready to share with customers
