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

  // Smooth anchor scrolling with offset for sticky nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
