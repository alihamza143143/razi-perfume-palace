import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.querySelectorAll('[data-reveal]').forEach(el => { el.style.opacity = '1'; });
    return;
  }

  // Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Hero entrance
  const heroItems = document.querySelectorAll('#hero h1, #hero p, #hero a, #hero .hero-deco');
  if (heroItems.length) {
    gsap.fromTo(heroItems,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out' }
    );
  }

  // Section reveals
  document.querySelectorAll('section').forEach(section => {
    if (section.id === 'hero') return;
    const items = section.querySelectorAll('h2, h3, p, .card, .video-tile, .filter-pill, .cat-tile, .phone-tile, iframe, a.cta-primary, .why-tile');
    if (!items.length) return;
    gsap.fromTo(items,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      }
    );
  });
}
