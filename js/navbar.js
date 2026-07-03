import { auth, db, onAuthStateChanged, signOut, ref, get, isFirebaseConfigured, onValue } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
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
        setupIncomingMessageListener(user.uid);
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
  });
}

let isInitialLoad = true;
const pageLoadTime = new Date().toISOString();

function setupIncomingMessageListener(userId) {
  if (!db) return;
  const messagesRef = ref(db, "messages");
  onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messages = snapshot.val();
      
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      let latestMessage = null;
      for (const [key, msg] of Object.entries(messages)) {
        if (msg.receiver_id === userId && msg.created_at > pageLoadTime) {
          if (!latestMessage || msg.created_at > latestMessage.created_at) {
            latestMessage = msg;
          }
        }
      }

      if (latestMessage) {
        const lastNotifiedKey = `last_notified_${userId}`;
        const lastNotifiedTime = sessionStorage.getItem(lastNotifiedKey) || "";
        if (latestMessage.created_at > lastNotifiedTime) {
          sessionStorage.setItem(lastNotifiedKey, latestMessage.created_at);
          
          get(ref(db, `users/${latestMessage.sender_id}`)).then((userSnap) => {
            const senderName = userSnap.exists() ? userSnap.val().full_name : "Someone";
            
            // Only notify if the user is not currently in the chat page
            if (!window.location.pathname.endsWith("messages.html")) {
              if (typeof window.showToast === 'function') {
                window.showToast(`📩 New message from ${senderName}: "${latestMessage.content}"`, "info");
              } else {
                console.log(`New message from ${senderName}: "${latestMessage.content}"`);
              }
            }
          });
        }
      }
    }
  });
}
