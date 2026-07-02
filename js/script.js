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
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      
      // Optimistic update: instantly toggle UI state
      const wasActive = btn.classList.contains('active');
      const svg = btn.querySelector('svg');
      
      if (wasActive) {
        btn.classList.remove('active');
        svg.setAttribute('fill', 'none');
        showToast('Removed from saved places', 'info');
      } else {
        btn.classList.add('active');
        svg.setAttribute('fill', 'currentColor');
        showToast('Added to saved places');
      }

      try {
        const resp = await fetch(`/toggle-favorite/${id}`, { method: 'POST' });
        const data = await resp.json();
        
        const serverIsAdded = (data.status === 'added');
        // If the server disagreed with our optimistic state, sync back
        if (serverIsAdded !== !wasActive) {
          if (serverIsAdded) {
            btn.classList.add('active');
            svg.setAttribute('fill', 'currentColor');
          } else {
            btn.classList.remove('active');
            svg.setAttribute('fill', 'none');
          }
        }
        
        if (!serverIsAdded && window.location.pathname === '/my-stays') {
          const card = btn.closest('.listing-card');
          if (card) {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            setTimeout(() => {
              card.remove();
              if (document.querySelectorAll('.listing-card').length === 0) {
                window.location.reload();
              }
            }, 300);
          }
        }
      } catch (err) {
        console.error('Error toggling favorite:', err);
        showToast('Connection failed, status not saved', 'error');
        // Revert UI on network error
        if (wasActive) {
          btn.classList.add('active');
          svg.setAttribute('fill', 'currentColor');
        } else {
          btn.classList.remove('active');
          svg.setAttribute('fill', 'none');
        }
      }
    });
  });
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

