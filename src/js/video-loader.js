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

  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = 'metadata';
  video.className = 'absolute inset-0 w-full h-full object-cover';
  video.poster = '/videos/inside-poster.svg';
  video.src = `/videos/inside-${n}.mp4`;

  tile.appendChild(video);
  video.play().catch(() => { /* autoplay blocked — poster stays */ });
}

function openModal(activeIdx) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] bg-black/95 flex items-center justify-center';
  overlay.innerHTML = `
    <button class="absolute top-4 right-4 text-ivory-100 text-3xl z-10 w-12 h-12 flex items-center justify-center hover:text-gold-500 transition" aria-label="Close">✕</button>
    <video src="/videos/inside-${activeIdx}.mp4" controls autoplay class="max-h-[90vh] max-w-[90vw]"></video>
  `;
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.tagName === 'BUTTON') {
      overlay.remove();
    }
  });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
  });
  document.body.appendChild(overlay);
}

export function initVideoLoader() {
  const tiles = document.querySelectorAll('.video-tile');
  if (!tiles.length) return;

  if (shouldLoadVideo()) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          attachVideo(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px 0px' });
    tiles.forEach(t => io.observe(t));
  }

  tiles.forEach(t => {
    t.addEventListener('click', () => openModal(t.dataset.video));
  });
}
