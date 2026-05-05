// ═══════════════════════════════════════════════════════════
// THEME TOGGLE — Modo oscuro / claro
// Persiste en localStorage, respeta prefers-color-scheme
// ═══════════════════════════════════════════════════════════

(function initTheme() {

const STORAGE_KEY = 'album26_theme';      // 'dark' | 'light' | 'system'
const root        = document.documentElement;

// ── READ SYSTEM PREFERENCE ────────────────────────────────
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function getSystemTheme() {
  return prefersDark.matches ? 'dark' : 'light';
}

function getSavedTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'system';
}

function resolveTheme(pref) {
  return pref === 'system' ? getSystemTheme() : pref;
}

// ── APPLY THEME ───────────────────────────────────────────
function applyTheme(theme) {
  const isLight = theme === 'light';

  // Toggle class on <html>
  root.classList.toggle('light', isLight);

  // Update meta theme-color for browser chrome
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = isLight ? '#F0F2F8' : '#070A10';

  // Update topbar button
  updateToggleUI(isLight);
}

function updateToggleUI(isLight) {
  const icon  = document.getElementById('topbar-theme-icon');
  const label = document.getElementById('topbar-theme-label');
  const sbIcon = document.getElementById('sb-theme-icon');
  const sbLabel = document.getElementById('sb-theme-label');
  const sbThumb = document.getElementById('sb-theme-thumb');

  if(icon)  icon.textContent  = isLight ? '☀️' : '🌙';
  if(label) label.textContent = isLight ? 'CLARO' : 'OSCURO';
  if(sbIcon)  sbIcon.textContent  = isLight ? '☀️' : '🌙';
  if(sbLabel) sbLabel.textContent = isLight ? 'Modo claro' : 'Modo oscuro';
}

// ── TOGGLE (called from topbar button and sidebar) ────────
window.toggleTheme = function() {
  const saved   = getSavedTheme();
  const current = resolveTheme(saved);
  const next    = current === 'dark' ? 'light' : 'dark';

  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);

  // Save to Firebase if logged in
  if(state?.userId && state?.userMode === 'firebase' && window._firebase) {
    try {
      const { db, doc, setDoc } = window._firebase;
      setDoc(doc(db, 'preferences', state.userId), { theme: next }, { merge: true });
    } catch(e) {}
  }

  const msg = next === 'light' ? '☀️ Modo claro activado' : '🌙 Modo oscuro activado';
  if(window.toast) toast(msg);
};

// ── INJECT SIDEBAR TOGGLE ─────────────────────────────────
function injectSidebarToggle() {
  // Find the "App" section added by pwa.js, or inject before sb-progress
  const progress = document.querySelector('.sb-progress');
  if(!progress || document.getElementById('sb-theme-row')) return;

  const row = document.createElement('div');
  row.id = 'sb-theme-row';
  row.className = 'sb-item';
  row.style.justifyContent = 'space-between';
  row.onclick = toggleTheme;
  row.innerHTML = `
    <div style="display:flex;align-items:center;gap:9px;">
      <span class="sb-flag" id="sb-theme-icon">🌙</span>
      <span id="sb-theme-label">Modo oscuro</span>
    </div>
    <div class="theme-toggle-track" id="sb-theme-track">
      <div class="theme-toggle-thumb" id="sb-theme-thumb"></div>
    </div>`;

  progress.parentNode.insertBefore(row, progress);
}

// ── SYSTEM PREFERENCE LISTENER ────────────────────────────
prefersDark.addEventListener('change', e => {
  if(getSavedTheme() === 'system') {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

// ── LOAD PREFERENCE FROM FIREBASE (if logged in) ──────────
async function loadThemeFromCloud() {
  if(!state?.userId || !window._firebase) return;
  try {
    const { db, doc, getDoc } = window._firebase;
    const snap = await getDoc(doc(db, 'preferences', state.userId));
    if(snap.exists() && snap.data().theme) {
      const cloudTheme = snap.data().theme;
      localStorage.setItem(STORAGE_KEY, cloudTheme);
      applyTheme(resolveTheme(cloudTheme));
      updateToggleUI(cloudTheme === 'light');
    }
  } catch(e) {}
}

// ── INIT ─────────────────────────────────────────────────
// Apply immediately (before DOM renders) to avoid flash
(function applyImmediate() {
  const saved   = getSavedTheme();
  const resolved = resolveTheme(saved);
  if(resolved === 'light') root.classList.add('light');
})();

// After DOM ready: inject sidebar toggle + sync with cloud
document.addEventListener('DOMContentLoaded', () => {
  const saved    = getSavedTheme();
  const resolved = resolveTheme(saved);
  applyTheme(resolved);
  setTimeout(injectSidebarToggle, 700);
});

// Also inject after app shows (in case sidebar wasn't ready)
const _checkThemeUI = setInterval(() => {
  if(document.getElementById('sb-theme-row')) { clearInterval(_checkThemeUI); return; }
  if(document.querySelector('.sb-progress'))  { injectSidebarToggle(); }
}, 500);

// Try to sync with Firebase once auth is ready
setTimeout(() => loadThemeFromCloud(), 2000);

})(); // end IIFE
