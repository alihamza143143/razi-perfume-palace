import '../styles/tailwind.css';
import { initNav } from './nav.js';
import { initI18n, getLang } from './i18n.js';
import { initGallery, setGalleryLang } from './gallery.js';
import { initVideoLoader } from './video-loader.js';
import { initAnimations } from './anim.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initI18n({ onChange: (lang) => setGalleryLang(lang) });
  initGallery({ lang: getLang() });
  initVideoLoader();
  initAnimations();
});
