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
  applyToggleLabel(lang);
}

function applyLangVisibility(lang) {
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    el.classList.toggle('hidden', lang !== 'en');
  });
  document.querySelectorAll('[data-lang-ur]').forEach(el => {
    el.classList.toggle('hidden', lang !== 'ur');
  });
}

function applyToggleLabel(lang) {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.setAttribute('aria-label', lang === 'en' ? 'Switch to Urdu' : 'Switch to English');
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
