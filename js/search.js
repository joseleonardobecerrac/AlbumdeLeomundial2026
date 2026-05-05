// ═══════════════════════════════════════════════════════════
// BÚSQUEDA GLOBAL — Ctrl+K command palette
// Jugadores · Selecciones · Estadios · Navegación
// ═══════════════════════════════════════════════════════════

(function initGlobalSearch() {

// ── CSS ───────────────────────────────────────────────────
const css = `
/* ══ GLOBAL SEARCH ══════════════════════════════════════ */

/* Topbar trigger button */
.gs-trigger {
  display: flex; align-items: center; gap: 8px;
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: 8px; padding: 6px 12px;
  cursor: pointer; transition: all .15s;
  color: var(--muted); flex: 1; max-width: 320px;
  text-align: left;
}
.gs-trigger:hover {
  border-color: var(--gold);
  background: var(--surface3);
  color: var(--text);
}
.gs-trigger-icon { font-size: 13px; flex-shrink: 0; }
.gs-trigger-text {
  flex: 1; font-family: var(--fs); font-size: 13px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.gs-trigger-kbd {
  font-family: var(--fm); font-size: 10px; letter-spacing: .5px;
  background: var(--surface3); border: 1px solid var(--border2);
  border-radius: 4px; padding: 2px 6px; flex-shrink: 0;
  color: var(--muted2);
}

/* Overlay backdrop */
.gs-overlay {
  position: fixed; inset: 0; z-index: 700;
  background: rgba(0,0,0,0.65); backdrop-filter: blur(10px);
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 80px;
  opacity: 0; pointer-events: none;
  transition: opacity .2s ease;
}
.gs-overlay.open {
  opacity: 1; pointer-events: all;
}

/* Modal box */
.gs-modal {
  width: 640px; max-width: 94vw;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  transform: scale(.96) translateY(-8px);
  transition: transform .2s cubic-bezier(.34,1.56,.64,1);
  display: flex; flex-direction: column; max-height: 72vh;
}
.gs-overlay.open .gs-modal {
  transform: none;
}

/* Input row */
.gs-input-wrap {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.gs-input-icon { font-size: 18px; flex-shrink: 0; }
.gs-input {
  flex: 1; background: transparent; border: none; outline: none;
  color: var(--text); font-family: var(--fb); font-size: 18px;
  font-weight: 500; letter-spacing: .2px;
}
.gs-input::placeholder { color: var(--muted); }
.gs-close-btn {
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: 5px; padding: 3px 7px; cursor: pointer;
  font-family: var(--fm); font-size: 10px; letter-spacing: 1px;
  color: var(--muted); transition: all .12s; flex-shrink: 0;
}
.gs-close-btn:hover { border-color: var(--border3); color: var(--text); }

/* Filters */
.gs-filters {
  display: flex; gap: 4px; padding: 8px 14px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
  overflow-x: auto; flex-wrap: nowrap;
}
.gs-filter-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 5px;
  border: 1px solid var(--border); background: transparent;
  color: var(--muted); font-family: var(--fm); font-size: 10px;
  letter-spacing: .5px; cursor: pointer; white-space: nowrap;
  transition: all .12s; flex-shrink: 0;
}
.gs-filter-btn.active {
  background: var(--gold-dim); border-color: rgba(239,159,39,.4);
  color: var(--gold);
}
.gs-filter-btn:hover:not(.active) { color: var(--text); border-color: var(--border2); }
.gs-filter-count {
  background: var(--surface3); border-radius: 3px;
  padding: 1px 5px; font-size: 9px; color: var(--muted2);
}
.gs-filter-btn.active .gs-filter-count {
  background: rgba(239,159,39,.15); color: var(--gold);
}

/* Results list */
.gs-results {
  overflow-y: auto; flex: 1;
  padding: 6px 0;
}

/* Section header */
.gs-section-header {
  padding: 10px 16px 4px;
  font-size: 9px; font-family: var(--fm); letter-spacing: 2px;
  color: var(--muted2); text-transform: uppercase;
  display: flex; align-items: center; gap: 8px;
}
.gs-section-header::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* Result item */
.gs-item {
  display: flex; align-items: center; gap: 12px;
  padding: 9px 16px; cursor: pointer;
  transition: background .1s;
  position: relative;
}
.gs-item:hover, .gs-item.selected {
  background: var(--surface2);
}
.gs-item.selected::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px; background: var(--gold);
}
.gs-item-emoji {
  font-size: 22px; width: 32px; text-align: center; flex-shrink: 0;
}
.gs-item-flag {
  width: 22px; height: 16px; object-fit: cover; border-radius: 2px;
  flex-shrink: 0;
}
.gs-item-info { flex: 1; min-width: 0; }
.gs-item-name {
  font-family: var(--fb); font-size: 14px; font-weight: 700;
  color: var(--text); white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis;
}
.gs-item-name mark {
  background: rgba(239,159,39,.25); color: var(--gold);
  border-radius: 2px; font-style: normal;
}
.gs-item-sub {
  font-size: 11px; color: var(--muted); font-family: var(--fs);
  margin-top: 1px; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis;
}
.gs-item-right {
  display: flex; flex-direction: column; align-items: flex-end;
  gap: 3px; flex-shrink: 0;
}
.gs-item-rarity {
  font-size: 8px; font-family: var(--fm); padding: 2px 6px;
  border-radius: 3px; letter-spacing: .5px;
}
.gs-item-rarity.icon      { background: rgba(229,53,171,.15); color: var(--icon-c); }
.gs-item-rarity.legendary { background: rgba(239,159,39,.15); color: var(--gold); }
.gs-item-rarity.rare      { background: rgba(91,164,245,.15); color: var(--rare-c); }
.gs-item-rarity.common    { background: rgba(136,153,170,.1); color: var(--common-c); }
.gs-item-owned {
  font-size: 8px; font-family: var(--fm); color: var(--green);
  letter-spacing: .5px;
}
.gs-item-arrow {
  font-size: 12px; color: var(--muted2); opacity: 0;
  transition: opacity .1s;
}
.gs-item:hover .gs-item-arrow,
.gs-item.selected .gs-item-arrow { opacity: 1; }

/* Type badge (country, stadium, nav) */
.gs-item-type {
  font-size: 8px; font-family: var(--fm); letter-spacing: 1px;
  padding: 2px 6px; border-radius: 3px;
  background: var(--surface3); color: var(--muted);
}
.gs-item-type.nav { background: rgba(0,79,159,.12); color: var(--rare-c); }
.gs-item-type.country { background: rgba(0,166,80,.1); color: var(--green); }
.gs-item-type.stadium { background: rgba(239,159,39,.1); color: var(--gold); }

/* Empty / no results */
.gs-empty-state {
  text-align: center; padding: 40px 20px;
  color: var(--muted); font-family: var(--fs); font-size: 14px;
}
.gs-empty-state .gs-empty-icon { font-size: 36px; margin-bottom: 10px; display: block; }
.gs-empty-state .gs-empty-title { font-family: var(--fd); font-size: 18px; letter-spacing: 1px; margin-bottom: 4px; }

/* Recent searches */
.gs-recent-tag {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 20px;
  background: var(--surface2); border: 1px solid var(--border);
  font-size: 11px; font-family: var(--fb); color: var(--muted);
  cursor: pointer; transition: all .12s; margin: 3px;
}
.gs-recent-tag:hover { border-color: var(--gold); color: var(--gold); }
.gs-recent-wrap { padding: 10px 16px; display: flex; flex-wrap: wrap; }

/* Footer hints */
.gs-footer {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 16px; border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.gs-hint {
  display: flex; align-items: center; gap: 4px;
  font-size: 10px; font-family: var(--fm); color: var(--muted2);
  letter-spacing: .5px;
}
.gs-hint kbd {
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: 3px; padding: 1px 5px; font-size: 9px;
  font-family: var(--fm); color: var(--muted);
}

/* Light mode overrides */
:root.light .gs-modal {
  background: #fff;
  box-shadow: 0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06);
}
:root.light .gs-item:hover,
:root.light .gs-item.selected { background: #F5F7FC; }
:root.light .gs-close-btn { background: #F0F2F8; }
:root.light .gs-filter-btn { background: transparent; }
:root.light .gs-recent-tag { background: #F5F7FC; }
`;

const styleEl = document.createElement('style');
styleEl.id = 'gs-styles';
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ═══════════════════════════════════════════════════════════
// DATA INDEX — built once, searched fast
// ═══════════════════════════════════════════════════════════

let searchIndex = [];
let indexBuilt  = false;

function buildIndex() {
  if(indexBuilt) return;
  indexBuilt = true;
  searchIndex = [];

  // ── PLAYERS ──────────────────────────────────────────────
  COUNTRIES.forEach(c => {
    c.players.forEach(p => {
      searchIndex.push({
        type:    'player',
        id:      p.id,
        name:    p.name,
        sub:     `${c.name} · ${p.club} · ${p.pos}`,
        emoji:   p.e,
        flag:    c.flag,
        rarity:  p.rarity,
        owned:   state.collected?.has(p.id),
        country: c.code,
        keywords: [p.name, c.name, p.club, p.pos, p.rarity].join(' ').toLowerCase(),
        action:  () => navigate('country', c.code),
      });
    });
  });

  // ── COUNTRIES ─────────────────────────────────────────────
  COUNTRIES.forEach(c => {
    const owned = c.players.filter(p => state.collected?.has(p.id)).length;
    searchIndex.push({
      type:    'country',
      id:      'country-' + c.code,
      name:    c.name,
      sub:     `${c.conf} · Grupo ${c.group} · FIFA #${c.ranking} · ${owned}/${c.players.length} láminas`,
      emoji:   null,
      flag:    c.flag,
      rarity:  null,
      owned:   owned > 0,
      keywords: [c.name, c.conf, c.group, c.code, c.best].join(' ').toLowerCase(),
      action:  () => navigate('country', c.code),
    });
  });

  // ── STADIUMS ─────────────────────────────────────────────
  if(typeof STADIUMS !== 'undefined') {
    STADIUMS.forEach(s => {
      searchIndex.push({
        type:    'stadium',
        id:      'stad-' + s.id,
        name:    s.name,
        sub:     `${s.city}, ${s.country} · ${s.cap?.toLocaleString() || '—'} esp. · ${s.role}`,
        emoji:   '🏟️',
        flag:    s.flag,
        rarity:  null,
        owned:   state.stadiumsCollected?.has(s.id),
        keywords: [s.name, s.city, s.country, s.role].join(' ').toLowerCase(),
        action:  () => navigate('stadiums'),
      });
    });
  }

  // ── NAVIGATION SHORTCUTS ──────────────────────────────────
  const navItems = [
    { name: 'Abrir Sobre',     sub: 'Abre tu sobre de láminas del día',   emoji: '📦', action: () => navigate('pack') },
    { name: 'Mi 11 Ideal',     sub: 'Arma tu equipo favorito',             emoji: '⚽', action: () => navigate('lineup') },
    { name: 'Trivia Mundial',  sub: '50 preguntas de historia del fútbol', emoji: '🧠', action: () => navigate('trivia') },
    { name: 'Predictor IA',    sub: 'Predice resultados con Claude',       emoji: '🤖', action: () => navigate('predictor') },
    { name: 'Comparador',      sub: 'Compara jugadores cara a cara',       emoji: '⚖️', action: () => navigate('compare') },
    { name: 'Ranking Global',  sub: 'Tabla de coleccionistas en vivo',     emoji: '🏅', action: () => navigate('ranking') },
    { name: 'Mapa Mundial',    sub: '48 países en el mapa interactivo',    emoji: '🗺️', action: () => navigate('worldmap') },
    { name: 'Intercambios',    sub: 'Intercambia duplicados',               emoji: '🔄', action: () => navigate('exchange') },
    { name: 'Edición Limitada',sub: 'Láminas especiales y eventos',        emoji: '💎', action: () => navigate('limited') },
    { name: 'Mi Selección',    sub: 'Tu equipo favorito y misiones',       emoji: '❤️', action: () => navigate('favorite') },
    { name: 'Posiciones',      sub: 'Tabla de grupos editable',            emoji: '📊', action: () => navigate('standings') },
    { name: 'Llaves',          sub: 'Bracket completo del torneo',         emoji: '🏆', action: () => navigate('bracket') },
    { name: 'Estadios',        sub: '16 recintos del Mundial 2026',        emoji: '🏟️', action: () => navigate('stadiums') },
    { name: '¿Quién soy?',     sub: 'Minijuego de adivinar jugadores',     emoji: '🎮', action: () => navigate('game') },
  ];
  navItems.forEach((n, i) => {
    searchIndex.push({
      type: 'nav', id: 'nav-' + i, name: n.name, sub: n.sub,
      emoji: n.emoji, flag: null, rarity: null, owned: false,
      keywords: n.name.toLowerCase() + ' ' + n.sub.toLowerCase(),
      action: n.action,
    });
  });
}

// ═══════════════════════════════════════════════════════════
// SEARCH ENGINE — fuzzy + score ranking
// ═══════════════════════════════════════════════════════════

let gsFilter  = 'all';
let gsQuery   = '';
let selectedIdx = -1;
let visibleItems = [];
let recentSearches = [];

try { recentSearches = JSON.parse(localStorage.getItem('gs_recent') || '[]'); } catch(e) {}

function saveRecent(query) {
  if(!query.trim() || query.length < 2) return;
  recentSearches = [query, ...recentSearches.filter(r => r !== query)].slice(0, 8);
  localStorage.setItem('gs_recent', JSON.stringify(recentSearches));
}

function scoreMatch(item, q) {
  if(!q) return item.type === 'nav' ? 10 : item.type === 'country' ? 8 : 5;
  const name = item.name.toLowerCase();
  const kw   = item.keywords;
  const ql   = q.toLowerCase();

  if(name === ql)              return 100;
  if(name.startsWith(ql))     return 90;
  if(name.includes(ql))       return 80;
  if(kw.startsWith(ql))       return 60;
  if(kw.includes(ql))         return 50;

  // Fuzzy: all chars present in order
  let ki = 0;
  for(const ch of ql) {
    ki = kw.indexOf(ch, ki);
    if(ki === -1) return 0;
    ki++;
  }
  return 20;
}

function highlight(text, q) {
  if(!q) return text;
  const ql = q.toLowerCase();
  const idx = text.toLowerCase().indexOf(ql);
  if(idx === -1) return text;
  return text.slice(0, idx) + '<mark>' + text.slice(idx, idx + q.length) + '</mark>' + text.slice(idx + q.length);
}

function runSearch(q, filter) {
  buildIndex();  // idempotent
  const results = searchIndex
    .map(item => ({ item, score: scoreMatch(item, q) }))
    .filter(r => r.score > 0)
    .filter(r => filter === 'all' || r.item.type === filter)
    .sort((a, b) => {
      // Owned first (same score)
      if(a.score === b.score && a.item.owned !== b.item.owned) return b.item.owned ? 1 : -1;
      return b.score - a.score;
    })
    .slice(0, 40)
    .map(r => r.item);
  return results;
}

// ═══════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════

function renderFilters() {
  const wrap = document.getElementById('gs-filters');
  if(!wrap) return;

  const counts = {
    all: searchIndex.length,
    player:  searchIndex.filter(i=>i.type==='player').length,
    country: searchIndex.filter(i=>i.type==='country').length,
    stadium: searchIndex.filter(i=>i.type==='stadium').length,
    nav:     searchIndex.filter(i=>i.type==='nav').length,
  };

  const filters = [
    { id:'all',     label:'Todo',        icon:'🔍' },
    { id:'player',  label:'Jugadores',   icon:'⭐' },
    { id:'country', label:'Selecciones', icon:'🚩' },
    { id:'stadium', label:'Estadios',    icon:'🏟️' },
    { id:'nav',     label:'Ir a…',       icon:'→' },
  ];

  wrap.innerHTML = filters.map(f => `
    <button class="gs-filter-btn${gsFilter===f.id?' active':''}" onclick="gsSetFilter('${f.id}')">
      ${f.icon} ${f.label}
      <span class="gs-filter-count">${counts[f.id]||0}</span>
    </button>`).join('');
}

function renderResults(q) {
  const list = document.getElementById('gs-results');
  if(!list) return;

  // Empty query → show recents + nav shortcuts
  if(!q.trim()) {
    renderEmpty(q);
    return;
  }

  const results = runSearch(q, gsFilter);
  visibleItems = results;
  selectedIdx = results.length > 0 ? 0 : -1;

  if(!results.length) {
    list.innerHTML = `<div class="gs-empty-state">
      <span class="gs-empty-icon">🔍</span>
      <div class="gs-empty-title">Sin resultados</div>
      <div>No encontramos "${q}". Prueba con el nombre del club o país.</div>
    </div>`;
    return;
  }

  // Group by type
  const groups = {};
  results.forEach(r => {
    if(!groups[r.type]) groups[r.type] = [];
    groups[r.type].push(r);
  });

  const typeLabels = { player:'Jugadores', country:'Selecciones', stadium:'Estadios', nav:'Ir a' };
  const typeOrder  = ['nav', 'country', 'player', 'stadium'];

  let html = '';
  let globalIdx = 0;

  typeOrder.forEach(type => {
    const group = groups[type];
    if(!group) return;
    html += `<div class="gs-section-header">${typeLabels[type]||type}</div>`;
    group.forEach(item => {
      html += renderItem(item, q, globalIdx);
      globalIdx++;
    });
  });

  list.innerHTML = html;
  highlightSelected();
}

function renderItem(item, q, idx) {
  const isPlayer  = item.type === 'player';
  const isCountry = item.type === 'country';
  const isStadium = item.type === 'stadium';
  const isNav     = item.type === 'nav';

  const flagHTML = item.flag
    ? `<img class="gs-item-flag" src="https://flagcdn.com/${item.flag}.svg" onerror="this.style.display='none'">`
    : '';
  const emojiHTML = item.emoji ? `<div class="gs-item-emoji">${item.emoji}</div>` : '';

  const leftIcon = isPlayer ? emojiHTML : (isCountry || isStadium) ? flagHTML : emojiHTML;

  const typeTag = isCountry ? '<span class="gs-item-type country">SELECCIÓN</span>'
    : isStadium ? '<span class="gs-item-type stadium">ESTADIO</span>'
    : isNav ? '<span class="gs-item-type nav">IR A</span>'
    : '';

  const rarityTag = isPlayer && item.rarity
    ? `<span class="gs-item-rarity ${item.rarity}">${item.rarity.toUpperCase()}</span>` : '';

  const ownedTag = item.owned
    ? `<span class="gs-item-owned">✓ Tengo</span>` : '';

  return `<div class="gs-item" data-idx="${idx}" onclick="gsSelectItem(${idx})">
    ${leftIcon}
    <div class="gs-item-info">
      <div class="gs-item-name">${highlight(item.name, q)}</div>
      <div class="gs-item-sub">${item.sub}</div>
    </div>
    <div class="gs-item-right">
      ${typeTag}${rarityTag}${ownedTag}
    </div>
    <span class="gs-item-arrow">›</span>
  </div>`;
}

function renderEmpty(q) {
  const list = document.getElementById('gs-results');
  if(!list) return;
  visibleItems = [];

  // Show recent searches + quick nav
  const navItems = searchIndex.filter(i=>i.type==='nav').slice(0,6);
  visibleItems = navItems;
  selectedIdx = -1;

  let html = '';

  if(recentSearches.length) {
    html += `<div class="gs-section-header">Búsquedas recientes</div>
      <div class="gs-recent-wrap">
        ${recentSearches.map(r =>
          `<span class="gs-recent-tag" onclick="gsUseRecent('${r.replace(/'/g,"\\'")}')">🕐 ${r}</span>`
        ).join('')}
      </div>`;
  }

  html += `<div class="gs-section-header">Accesos rápidos</div>`;
  navItems.forEach((item, idx) => {
    html += renderItem(item, '', idx);
  });

  list.innerHTML = html;
}

function highlightSelected() {
  document.querySelectorAll('.gs-item').forEach(el => {
    el.classList.toggle('selected', parseInt(el.dataset.idx) === selectedIdx);
    if(parseInt(el.dataset.idx) === selectedIdx) {
      el.scrollIntoView({ block: 'nearest' });
    }
  });
}

// ═══════════════════════════════════════════════════════════
// OPEN / CLOSE
// ═══════════════════════════════════════════════════════════

window.openGlobalSearch = function() {
  buildIndex();
  const overlay = document.getElementById('gs-overlay');
  const input   = document.getElementById('gs-input');
  if(!overlay) return;

  overlay.classList.add('open');
  renderFilters();
  renderEmpty('');
  setTimeout(() => input?.focus(), 50);
};

window.closeGlobalSearch = function() {
  const overlay = document.getElementById('gs-overlay');
  const input   = document.getElementById('gs-input');
  if(overlay) overlay.classList.remove('open');
  if(input) input.value = '';
  gsQuery = '';
  selectedIdx = -1;
  visibleItems = [];
};

// ═══════════════════════════════════════════════════════════
// INTERACTIONS
// ═══════════════════════════════════════════════════════════

window.gsSearch = function(q) {
  gsQuery = q;
  selectedIdx = 0;
  renderResults(q);
};

window.gsSetFilter = function(f) {
  gsFilter = f;
  renderFilters();
  renderResults(gsQuery);
};

window.gsSelectItem = function(idx) {
  const item = visibleItems[idx];
  if(!item) return;
  saveRecent(item.name);
  closeGlobalSearch();
  setTimeout(() => item.action(), 80);
};

window.gsUseRecent = function(q) {
  const input = document.getElementById('gs-input');
  if(input) { input.value = q; gsSearch(q); input.focus(); }
};

// ── KEYBOARD NAVIGATION ───────────────────────────────────
document.addEventListener('keydown', e => {
  // Ctrl+K or Cmd+K → open
  if((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const overlay = document.getElementById('gs-overlay');
    if(overlay?.classList.contains('open')) closeGlobalSearch();
    else openGlobalSearch();
    return;
  }

  const overlay = document.getElementById('gs-overlay');
  if(!overlay?.classList.contains('open')) return;

  if(e.key === 'Escape') {
    closeGlobalSearch();
    return;
  }

  if(e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIdx = Math.min(selectedIdx + 1, visibleItems.length - 1);
    highlightSelected();
    return;
  }

  if(e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIdx = Math.max(selectedIdx - 1, 0);
    highlightSelected();
    return;
  }

  if(e.key === 'Enter' && selectedIdx >= 0) {
    e.preventDefault();
    gsSelectItem(selectedIdx);
    return;
  }

  // Typing when input not focused → focus it
  if(e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    document.getElementById('gs-input')?.focus();
  }
});

// ── REBUILD INDEX ON COLLECTION CHANGE ────────────────────
// Patch saveState so index resets when you collect cards
const _origSaveGS = window.saveState;
if(_origSaveGS) {
  window.saveState = function() {
    indexBuilt = false;  // force rebuild next open
    _origSaveGS();
  };
}

// ── MOBILE: focus trigger shows keyboard ──────────────────
document.getElementById('gs-trigger')?.addEventListener('click', () => {
  setTimeout(() => document.getElementById('gs-input')?.focus(), 60);
});

})(); // end IIFE
