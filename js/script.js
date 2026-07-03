// ─── TOAST POPUP SYSTEM ───────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<div class="toast-icon"></div><span>${message}</span>`;
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';

  container.appendChild(toast);
  
  // Fade in
  setTimeout(() => { toast.style.opacity = '1'; }, 10);

  toast.addEventListener('click', () => dismissToast(toast));
  setTimeout(() => dismissToast(toast), 3500);
}

function dismissToast(toast) {
  toast.style.opacity = '0';
  setTimeout(() => { toast.remove(); }, 300);
}

// ─── DROPDOWN SYSTEM ──────────────────────────────────────────────────────────
function initDropdowns() {
  const trigger = document.getElementById('profileTrigger');
  const menu = document.getElementById('profileMenu');

  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
  }
}

// ─── FAVORITES SYSTEM ─────────────────────────────────────────────────────────
function initFavorites() {
  // Handled client-side directly via Firebase in page scripts
}

// ─── INITIALIZATION ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  initFavorites();
  
  // Make sure all elements that were initially hidden by css are shown
  document.querySelectorAll('.top-bar, .main-wrapper, .listing-card, .hero h1, .hero p, .hero .btn').forEach(el => {
    el.style.opacity = '1';
  });
  
  const flashes = window.__FLASHES__ || [];
  flashes.forEach(([type, msg]) => {
    setTimeout(() => showToast(msg, type), 600);
  });
});

