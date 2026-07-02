import { auth, db, onAuthStateChanged, signOut, ref, get, isFirebaseConfigured } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFirebaseConfigModalIfNeeded();
});

async function renderNavbar() {
  const appFrame = document.querySelector(".app-frame") || document.body;

  let header = document.querySelector(".top-bar");
  if (!header) {
    header = document.createElement("header");
    header.className = "top-bar";
    appFrame.insertBefore(header, appFrame.firstChild);
  }

  let mobileNav = document.querySelector(".mobile-bottom-nav");
  if (!mobileNav) {
    mobileNav = document.createElement("nav");
    mobileNav.className = "mobile-bottom-nav";
    appFrame.appendChild(mobileNav);
  }

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  onAuthStateChanged(auth, async (user) => {
    let userData = null;

    if (user && db) {
      try {
        const snap = await get(ref(db, "users/" + user.uid));
        if (snap.exists()) {
          userData = snap.val();
        } else {
          userData = {
            full_name: user.displayName || "User",
            email: user.email,
            role: localStorage.getItem("temp_role") || "student"
          };
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }

    const currentFilename = window.location.pathname.split("/").pop() || "index.html";

    header.innerHTML = `
      <div class="header-container">
        <div style="display: flex; align-items: center;">
          <a href="index.html" class="header-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span>StayNest</span>
          </a>
        </div>
        
        <nav class="top-nav-center">
          <a href="index.html" class="nav-item ${currentFilename === "index.html" ? "active" : ""}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span>Home</span>
          </a>
          <a href="search.html" class="nav-item ${currentFilename === "search.html" ? "active" : ""}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span>Search</span>
          </a>
          ${userData && userData.role === "owner" ? `
            <a href="dashboard.html" class="nav-item ${currentFilename === "dashboard.html" ? "active" : ""}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Dashboard</span>
            </a>
          ` : ""}
          ${userData && userData.role === "student" ? `
            <a href="student_dashboard.html" class="nav-item ${currentFilename === "student_dashboard.html" ? "active" : ""}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              <span>Saved Places</span>
            </a>
          ` : ""}
          ${user ? `
            <a href="messages.html" class="nav-item ${currentFilename === "messages.html" ? "active" : ""}" style="position: relative;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>Messages</span>
            </a>
          ` : ""}
        </nav>
        
        <div style="display: flex; align-items: center; gap: 1rem; justify-content: flex-end;">
          ${user && userData ? `
            <div class="user-dropdown">
              <div class="user-profile-trigger" id="profileTrigger">
                <div class="user-meta-header desktop-only" style="text-align: right; line-height: 1.2;">
                  <div style="font-size: 0.85rem; font-weight: 700; color: var(--secondary);">${userData.full_name}</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: capitalize;">${userData.role}</div>
                </div>
                <div class="user-avatar">${(userData.full_name || "U")[0].toUpperCase()}</div>
              </div>
              
              <div class="dropdown-menu" id="profileMenu">
                <div class="dropdown-header">
                  <div style="font-weight: 700; color: var(--secondary);">${userData.full_name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${userData.email}</div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="settings.html" class="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9z"></path></svg>
                  Settings
                </a>
                ${userData.role === "owner" ? `
                  <a href="dashboard.html" class="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Owner Dashboard
                  </a>
                ` : `
                  <a href="student_dashboard.html" class="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    My Saved Stays
                  </a>
                `}
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item" id="logoutBtn" style="color: var(--error);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </a>
              </div>
            </div>
          ` : `
            <a href="auth.html" class="btn btn-primary btn-sm" style="border-radius: 100px; padding: 0.5rem 1.5rem;">Sign In</a>
          `}
          <button class="btn btn-outline btn-sm firebase-setup-trigger-btn" style="border-radius: 100px; font-size: 0.75rem; padding: 0.4rem 0.8rem; margin-left: 0.5rem;">⚙ Firebase Setup</button>
        </div>
      </div>
    `;

    mobileNav.innerHTML = `
      <a href="index.html" class="mobile-nav-item ${currentFilename === "index.html" ? "active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
        <span>Home</span>
      </a>
      <a href="search.html" class="mobile-nav-item ${currentFilename === "search.html" ? "active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span>Search</span>
      </a>
      ${userData && userData.role === "owner" ? `
        <a href="dashboard.html" class="mobile-nav-item ${currentFilename === "dashboard.html" ? "active" : ""}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Manage</span>
        </a>
      ` : ""}
      ${userData && userData.role === "student" ? `
        <a href="student_dashboard.html" class="mobile-nav-item ${currentFilename === "student_dashboard.html" ? "active" : ""}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          <span>Saved</span>
        </a>
      ` : ""}
      ${user ? `
        <a href="messages.html" class="mobile-nav-item ${currentFilename === "messages.html" ? "active" : ""}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span>Messages</span>
        </a>
      ` : `
        <a href="auth.html" class="mobile-nav-item ${currentFilename === "auth.html" ? "active" : ""}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Sign In</span>
        </a>
      `}
    `;

    const trigger = document.getElementById("profileTrigger");
    const menu = document.getElementById("profileMenu");
    if (trigger && menu) {
      trigger.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("show"); });
      document.addEventListener("click", (e) => { if (!trigger.contains(e.target) && !menu.contains(e.target)) menu.classList.remove("show"); });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        signOut(auth).then(() => { window.location.href = "index.html"; });
      });
    }

    document.querySelectorAll(".firebase-setup-trigger-btn").forEach(btn => {
      btn.addEventListener("click", (e) => { e.preventDefault(); openFirebaseConfigModal(); });
    });
  });
}

function renderFirebaseConfigModalIfNeeded() {
  if (!isFirebaseConfigured()) {
    setTimeout(() => { openFirebaseConfigModal(true); }, 1000);
  }
}

function openFirebaseConfigModal(showWarning = false) {
  let modal = document.getElementById("firebase-setup-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "firebase-setup-modal";
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999; font-family: 'Plus Jakarta Sans', sans-serif;
    `;
    modal.innerHTML = `
      <div style="background: white; border-radius: 16px; padding: 2rem; width: 90%; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; box-sizing: border-box; max-height: 90vh; overflow-y: auto;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 1.2rem; font-weight: 700;">🔥 Firebase Setup (Realtime Database)</h3>
        ${showWarning ? `
          <div style="background: #fef3c7; color: #92400e; padding: 0.75rem; border-radius: 8px; font-size: 0.82rem; margin-bottom: 1rem; border: 1px solid #fde68a;">
            <strong>Setup Required:</strong> Enter your Firebase credentials to connect the database. They are saved only in your browser (localStorage).
          </div>
        ` : ""}
        <div style="background: #f0fdf4; color: #166534; padding: 0.75rem; border-radius: 8px; font-size: 0.8rem; margin-bottom: 1.25rem; border: 1px solid #bbf7d0;">
          Using <strong>Realtime Database</strong> — No billing or credit card required! ✅
        </div>
        <form id="firebase-setup-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px;">API Key</label>
            <input type="text" id="fb-apiKey" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid #e2e8f0; box-sizing: border-box; font-size: 0.85rem;" placeholder="AIzaSy...">
          </div>
          <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px;">Auth Domain</label>
            <input type="text" id="fb-authDomain" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid #e2e8f0; box-sizing: border-box; font-size: 0.85rem;" placeholder="your-project.firebaseapp.com">
          </div>
          <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px;">Project ID</label>
            <input type="text" id="fb-projectId" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid #e2e8f0; box-sizing: border-box; font-size: 0.85rem;" placeholder="your-project-id">
          </div>
          <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px;">
              Database URL <span style="color: #dc2626;">★ Required for Realtime DB</span>
            </label>
            <input type="text" id="fb-databaseURL" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid #fca5a5; box-sizing: border-box; font-size: 0.85rem;" placeholder="https://your-project-default-rtdb.firebaseio.com">
            <small style="color: #64748b; font-size: 0.72rem;">Find this in Firebase Console → Realtime Database → copy the URL at the top</small>
          </div>
          <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px;">App ID</label>
            <input type="text" id="fb-appId" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid #e2e8f0; box-sizing: border-box; font-size: 0.85rem;" placeholder="1:123456789:web:abc...">
          </div>
          <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
            <button type="button" id="close-fb-modal" style="flex: 1; padding: 0.6rem; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: 600;">Cancel</button>
            <button type="submit" style="flex: 2; padding: 0.6rem; border-radius: 8px; border: none; background: #6366f1; color: white; cursor: pointer; font-weight: 700;">Save & Reload</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const stored = localStorage.getItem("firebase_config");
    if (stored) {
      try {
        const config = JSON.parse(stored);
        document.getElementById("fb-apiKey").value = config.apiKey || "";
        document.getElementById("fb-authDomain").value = config.authDomain || "";
        document.getElementById("fb-projectId").value = config.projectId || "";
        document.getElementById("fb-databaseURL").value = config.databaseURL || "";
        document.getElementById("fb-appId").value = config.appId || "";
      } catch (e) {}
    }

    document.getElementById("close-fb-modal").addEventListener("click", () => { modal.style.display = "none"; });

    document.getElementById("firebase-setup-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const projectId = document.getElementById("fb-projectId").value.trim();
      const newConfig = {
        apiKey: document.getElementById("fb-apiKey").value.trim(),
        authDomain: document.getElementById("fb-authDomain").value.trim(),
        projectId: projectId,
        databaseURL: document.getElementById("fb-databaseURL").value.trim(),
        storageBucket: `${projectId}.appspot.com`,
        messagingSenderId: "",
        appId: document.getElementById("fb-appId").value.trim()
      };
      localStorage.setItem("firebase_config", JSON.stringify(newConfig));
      window.location.reload();
    });
  } else {
    modal.style.display = "flex";
  }
}
