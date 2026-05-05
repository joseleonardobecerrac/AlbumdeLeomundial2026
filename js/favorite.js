// ═══════════════════════════════════════════════════════════
// MI SELECCIÓN FAVORITA
// Elige tu equipo, recibe sobres con mayor probabilidad de sus
// jugadores, completa misiones y sigue su historial mundialista.
// ═══════════════════════════════════════════════════════════

// ── CSS ───────────────────────────────────────────────────
(function injectFavCSS() {
  if(document.getElementById('fav-styles')) return;
  const s = document.createElement('style');
  s.id = 'fav-styles';
  s.textContent = `
/* ══ MI SELECCIÓN ══════════════════════════════════════════ */
.fav-wrap { max-width: 960px; margin: 0 auto; padding-bottom: 60px; }

/* ── TEAM SELECTOR ── */
.fav-selector-wrap {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 20px; padding: 40px 32px; text-align: center;
  position: relative; overflow: hidden;
}
.fav-selector-wrap::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 0%, rgba(239,159,39,0.07), transparent 60%);
}
.fav-selector-wrap h2 { font-family: var(--fd); font-size: 44px; letter-spacing: 4px; margin-bottom: 8px; position: relative; }
.fav-selector-wrap p { font-size: 13px; color: var(--muted); font-family: var(--fs); line-height: 1.65; max-width: 480px; margin: 0 auto 28px; position: relative; }

.fav-search {
  width: 100%; max-width: 400px; padding: 10px 16px;
  background: var(--surface3); border: 1px solid var(--border2);
  border-radius: 10px; color: var(--text); font-family: var(--fb);
  font-size: 14px; outline: none; margin-bottom: 20px; position: relative;
}
.fav-search:focus { border-color: var(--gold); }

.fav-filter-conf {
  display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;
}
.fav-conf-btn {
  padding: 4px 12px; border-radius: 5px; font-size: 11px; font-family: var(--fm);
  border: 1px solid var(--border2); background: transparent; color: var(--muted);
  cursor: pointer; transition: all .12s; letter-spacing: .5px;
}
.fav-conf-btn.active { background: var(--gold-dim); border-color: rgba(239,159,39,.4); color: var(--gold); }
.fav-conf-btn:hover:not(.active) { color: var(--text); }

.fav-team-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px; max-height: 420px; overflow-y: auto; padding: 4px;
}
.fav-team-btn {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 14px 10px; border-radius: 12px; border: 1px solid var(--border);
  background: var(--surface3); cursor: pointer; transition: all .15s;
}
.fav-team-btn:hover { border-color: var(--gold); background: var(--gold-dim); transform: translateY(-2px); }
.fav-team-btn.selected {
  border-color: var(--gold); background: var(--gold-dim);
  box-shadow: 0 0 20px rgba(239,159,39,.2);
}
.fav-team-flag { width: 44px; height: 32px; object-fit: cover; border-radius: 5px; box-shadow: 0 2px 6px rgba(0,0,0,.4); }
.fav-team-name { font-family: var(--fb); font-size: 11px; font-weight: 700; text-align: center; line-height: 1.3; }
.fav-team-rank { font-size: 9px; font-family: var(--fm); color: var(--muted); }
.fav-team-conf-dot { width: 5px; height: 5px; border-radius: 50%; }

.fav-confirm-btn {
  margin-top: 24px; padding: 13px 40px; border-radius: 10px;
  background: linear-gradient(135deg, var(--red), var(--blue));
  border: none; color: #fff; font-family: var(--fd); font-size: 20px;
  letter-spacing: 3px; cursor: pointer; transition: all .15s;
  box-shadow: 0 4px 20px rgba(227,30,36,.3);
}
.fav-confirm-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(227,30,36,.4); }
.fav-confirm-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

/* ── HUB ── */
.fav-hub { display: flex; flex-direction: column; gap: 20px; }

.fav-hero {
  border-radius: 20px; padding: 32px; position: relative; overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
}
.fav-hero-bg { position: absolute; inset: 0; }
.fav-hero-inner { position: relative; display: flex; align-items: center; gap: 24px; }
.fav-hero-flag { width: 90px; height: 65px; object-fit: cover; border-radius: 10px; flex-shrink: 0; box-shadow: 0 4px 20px rgba(0,0,0,.5); border: 2px solid rgba(255,255,255,.12); }
.fav-hero-info { flex: 1; }
.fav-hero-label { font-size: 9px; font-family: var(--fm); letter-spacing: 3px; color: rgba(255,255,255,.5); margin-bottom: 5px; }
.fav-hero-name { font-family: var(--fd); font-size: 38px; letter-spacing: 2px; line-height: 1; color: #fff; }
.fav-hero-conf { font-size: 10px; font-family: var(--fm); letter-spacing: 2px; color: rgba(255,255,255,.5); margin-top: 4px; }
.fav-hero-stats { display: flex; gap: 20px; margin-top: 14px; }
.fav-hero-stat .n { font-family: var(--fd); font-size: 24px; color: #fff; }
.fav-hero-stat .l { font-size: 9px; font-family: var(--fm); letter-spacing: 1px; color: rgba(255,255,255,.45); }
.fav-change-btn {
  position: absolute; top: 16px; right: 16px;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
  border-radius: 6px; padding: 5px 10px; font-size: 10px; font-family: var(--fm);
  color: rgba(255,255,255,.6); cursor: pointer; transition: all .12s; letter-spacing: 1px;
}
.fav-change-btn:hover { background: rgba(255,255,255,.18); color: #fff; }

/* Progress ring */
.fav-progress-ring { position: relative; flex-shrink: 0; width: 80px; height: 80px; }
.fav-ring-svg { width: 80px; height: 80px; transform: rotate(-90deg); }
.fav-ring-bg { fill: none; stroke: rgba(255,255,255,.1); stroke-width: 5; }
.fav-ring-fill { fill: none; stroke: #fff; stroke-width: 5; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
.fav-ring-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.fav-ring-pct { font-family: var(--fd); font-size: 20px; color: #fff; line-height: 1; }
.fav-ring-sub { font-size: 8px; font-family: var(--fm); color: rgba(255,255,255,.5); letter-spacing: 1px; }

/* ── BOOSTED PACK ── */
.fav-pack-section {
  background: var(--surface2); border: 1px solid var(--border); border-radius: 16px; padding: 22px 24px;
}
.fav-pack-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.fav-pack-title { font-family: var(--fd); font-size: 22px; letter-spacing: 2px; flex: 1; }
.fav-pack-badge {
  font-size: 9px; font-family: var(--fm); letter-spacing: 1px; padding: 3px 8px;
  background: rgba(239,159,39,.12); color: var(--gold); border: 1px solid rgba(239,159,39,.25);
  border-radius: 4px;
}
.fav-pack-desc { font-size: 12px; color: var(--muted); font-family: var(--fs); margin-bottom: 16px; line-height: 1.6; }
.fav-pack-odds { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
.fav-odd-chip {
  display: flex; align-items: center; gap: 5px; padding: 5px 10px;
  background: var(--surface3); border: 1px solid var(--border2); border-radius: 6px;
  font-size: 10px; font-family: var(--fm);
}
.fav-odd-label { color: var(--muted); }
.fav-odd-val { font-weight: 700; color: var(--text); }
.fav-odd-val.boosted { color: var(--green); }

.fav-open-btn {
  width: 100%; padding: 14px; border-radius: 12px; font-family: var(--fd); font-size: 20px;
  letter-spacing: 3px; border: none; cursor: pointer; transition: all .15s;
  position: relative; overflow: hidden;
}
.fav-open-btn::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent);
  animation: packBtnShine 3s ease-in-out infinite;
}
@keyframes packBtnShine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
.fav-open-btn:hover { transform: translateY(-2px); }
.fav-cooldown { text-align: center; font-size: 11px; font-family: var(--fm); color: var(--muted); margin-top: 8px; letter-spacing: 1px; }

/* ── MISSIONS ── */
.fav-missions-grid { display: flex; flex-direction: column; gap: 10px; }
.fav-mission {
  display: flex; align-items: center; gap: 14px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 16px; transition: border-color .15s;
}
.fav-mission.completed { border-color: rgba(0,166,80,.3); background: rgba(0,166,80,.03); }
.fav-mission.claimable { border-color: rgba(239,159,39,.4); background: var(--gold-dim); animation: missionPulse 2s ease-in-out infinite; }
@keyframes missionPulse { 0%,100% { box-shadow: none; } 50% { box-shadow: 0 0 20px rgba(239,159,39,.15); } }
.fav-mission-icon { font-size: 28px; flex-shrink: 0; width: 40px; text-align: center; }
.fav-mission-info { flex: 1; }
.fav-mission-title { font-family: var(--fb); font-size: 14px; font-weight: 700; margin-bottom: 2px; }
.fav-mission-desc { font-size: 11px; color: var(--muted); font-family: var(--fs); line-height: 1.4; }
.fav-mission-progress { margin-top: 6px; }
.fav-mission-bar-wrap { height: 3px; background: var(--border); border-radius: 2px; margin-top: 3px; overflow: hidden; }
.fav-mission-bar { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--green), var(--rare-c)); transition: width .8s ease; }
.fav-mission-prog-label { font-size: 9px; font-family: var(--fm); color: var(--muted); }
.fav-mission-reward { text-align: right; flex-shrink: 0; }
.fav-mission-reward-label { font-size: 9px; font-family: var(--fm); color: var(--muted); letter-spacing: 1px; margin-bottom: 4px; }
.fav-mission-claim-btn {
  padding: 6px 12px; border-radius: 6px; font-family: var(--fb); font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all .12s; border: 1px solid;
}
.fav-mission-claim-btn.ready { background: var(--gold); border-color: var(--gold); color: #1a0a00; }
.fav-mission-claim-btn.ready:hover { background: #f5b040; }
.fav-mission-claim-btn.done { background: transparent; border-color: var(--green); color: var(--green); cursor: default; }
.fav-mission-claim-btn.locked { background: transparent; border-color: var(--border); color: var(--muted); cursor: not-allowed; }

/* ── PLAYERS HUB ── */
.fav-players-section { background: var(--surface2); border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; }
.fav-players-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-top: 14px; }
.fav-player-card {
  aspect-ratio: 3/4; border-radius: 10px; border: 1.5px solid var(--border);
  background: var(--surface3); display: flex; flex-direction: column; overflow: hidden;
  position: relative; cursor: pointer; transition: all .15s;
}
.fav-player-card:hover { transform: translateY(-3px); border-color: var(--border2); }
.fav-player-card.owned { border-color: rgba(239,159,39,.4); }
.fav-player-card.icon.owned { border-color: rgba(229,53,171,.6); box-shadow: 0 0 14px rgba(229,53,171,.2); }
.fav-player-card.legendary.owned { border-color: rgba(239,159,39,.6); box-shadow: 0 0 12px rgba(239,159,39,.2); }
.fav-player-emoji { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 30px; }
.fav-player-name { font-size: 8px; font-family: var(--fb); font-weight: 700; padding: 4px 5px 5px; border-top: 1px solid rgba(255,255,255,.05); background: rgba(0,0,0,.3); line-height: 1.3; }
.fav-player-missing { position: absolute; inset: 0; background: rgba(7,10,16,.75); display: flex; align-items: center; justify-content: center; font-size: 18px; opacity: .6; }
.fav-player-rarity-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.fav-player-rarity-bar.icon { background: var(--icon-c); }
.fav-player-rarity-bar.legendary { background: var(--gold); }
.fav-player-rarity-bar.rare { background: var(--rare-c); }
.fav-player-rarity-bar.common { background: var(--common-c); }

/* ── REVEAL CARDS ── */
.fav-reveal-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 16px;
}
.fav-reveal-card {
  aspect-ratio: 3/4; border-radius: 10px; overflow: hidden;
  display: flex; flex-direction: column; position: relative;
  opacity: 0; transform: translateY(20px) scale(.9);
}
.fav-reveal-card.show { animation: favCardReveal .5s cubic-bezier(.34,1.56,.64,1) forwards; }
@keyframes favCardReveal { to { opacity: 1; transform: none; } }
.fav-reveal-card.boosted-card::after {
  content: '⭐ FAVORITO'; position: absolute; top: 6px; left: 0; right: 0;
  text-align: center; font-size: 7px; font-family: var(--fm); letter-spacing: 1px;
  color: var(--gold); text-shadow: 0 0 6px rgba(239,159,39,.8);
}

/* ── NEXT PACK TIMER ── */
.fav-timer-ring {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--fm); font-size: 12px; color: var(--muted);
}
.fav-timer-val { font-family: var(--fd); font-size: 16px; color: var(--gold); letter-spacing: 1px; }
`;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// CONF COLORS
// ═══════════════════════════════════════════════════════════
const FAV_CONF_COLORS = {
  UEFA: '#3B82F6', CONMEBOL: '#10B981', CAF: '#F59E0B',
  CONCACAF: '#EF4444', AFC: '#8B5CF6', OFC: '#EC4899',
};

// ═══════════════════════════════════════════════════════════
// MISSIONS DEFINITION
// ═══════════════════════════════════════════════════════════
function getFavMissions(country) {
  if(!country) return [];
  const players = country.players || [];
  return [
    {
      id: 'first_player',
      icon: '🎴',
      title: 'Primera lámina',
      desc: `Consigue cualquier lámina de ${country.name}`,
      reward: '🎁 Sobre favorito x1',
      rewardType: 'pack',
      check: () => players.some(p => state.collected.has(p.id)),
      progress: () => ({ cur: players.filter(p=>state.collected.has(p.id)).length > 0 ? 1 : 0, max: 1 }),
    },
    {
      id: 'half_squad',
      icon: '⚽',
      title: 'Media plantilla',
      desc: `Consigue el 50% de los jugadores de ${country.name}`,
      reward: '🌟 Lámina legendaria garantizada',
      rewardType: 'legendary',
      check: () => {
        const n = players.filter(p=>state.collected.has(p.id)).length;
        return n >= Math.ceil(players.length / 2);
      },
      progress: () => ({ cur: players.filter(p=>state.collected.has(p.id)).length, max: Math.ceil(players.length / 2) }),
    },
    {
      id: 'full_squad',
      icon: '🏆',
      title: 'Plantilla completa',
      desc: `Completa el 100% de los jugadores de ${country.name}`,
      reward: '💎 Lámina ICON garantizada',
      rewardType: 'icon',
      check: () => players.every(p => state.collected.has(p.id)),
      progress: () => ({ cur: players.filter(p=>state.collected.has(p.id)).length, max: players.length }),
    },
    {
      id: 'get_icon',
      icon: '⭐',
      title: 'La estrella',
      desc: `Consigue la lámina ICON de ${country.name}`,
      reward: '🎮 +200 puntos de trivia',
      rewardType: 'trivia_pts',
      hidden: !players.some(p=>p.rarity==='icon'),
      check: () => players.filter(p=>p.rarity==='icon').some(p=>state.collected.has(p.id)),
      progress: () => ({
        cur: players.filter(p=>p.rarity==='icon'&&state.collected.has(p.id)).length,
        max: Math.max(1, players.filter(p=>p.rarity==='icon').length)
      }),
    },
    {
      id: 'open_5_packs',
      icon: '📦',
      title: 'Abre 5 sobres favoritos',
      desc: 'Abre 5 sobres del sobre de tu selección',
      reward: '🔄 Desbloquea intercambio prioritario',
      rewardType: 'exchange_boost',
      check: () => (state.favMissions?.['open_5_packs']?.openCount || 0) >= 5,
      progress: () => ({ cur: state.favMissions?.['open_5_packs']?.openCount || 0, max: 5 }),
    },
    {
      id: 'trivia_fav',
      icon: '🧠',
      title: `Experto en ${country.name}`,
      desc: 'Acumula 300 puntos en el modo Trivia',
      reward: '✨ Lámina rara garantizada',
      rewardType: 'rare',
      check: () => (state.gameScore || 0) >= 300,
      progress: () => ({ cur: Math.min(state.gameScore || 0, 300), max: 300 }),
    },
  ].filter(m => !m.hidden);
}

// ═══════════════════════════════════════════════════════════
// PACK SYSTEM — boosted odds
// ═══════════════════════════════════════════════════════════
const FAV_PACK_COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours

function getFavPackCooldown() {
  const lastStr = localStorage.getItem('album26_fav_pack_last');
  if(!lastStr) return 0;
  const elapsed = Date.now() - parseInt(lastStr);
  return Math.max(0, FAV_PACK_COOLDOWN_MS - elapsed);
}

function setFavPackUsed() {
  localStorage.setItem('album26_fav_pack_last', Date.now().toString());
}

function drawFavPack(country) {
  const allPlayers = COUNTRIES.flatMap(c => c.players.map(p=>({...p, countryCode:c.code, flag:c.flag})));
  const favPlayers = allPlayers.filter(p => p.countryCode === country.code);
  const otherPlayers = allPlayers.filter(p => p.countryCode !== country.code);
  const drawn = [];
  const used = new Set();

  for(let i = 0; i < 5; i++) {
    // 60% chance each slot is a fav team player
    const isFav = Math.random() < 0.60 && favPlayers.length > 0;
    const pool = isFav ? favPlayers : otherPlayers;

    // Rarity weights — boosted for fav players
    const weights = isFav
      ? { icon: 5, legendary: 15, rare: 35, common: 45 }  // boosted!
      : { icon: 1, legendary: 5,  rare: 20, common: 74 };  // normal

    let pick;
    let attempts = 0;
    while(!pick || used.has(pick.id)) {
      if(attempts++ > 200) break;
      const roll = Math.random() * 100;
      let filtered;
      if(roll < weights.icon)           filtered = pool.filter(p=>p.rarity==='icon');
      else if(roll < weights.icon + weights.legendary) filtered = pool.filter(p=>p.rarity==='legendary');
      else if(roll < weights.icon + weights.legendary + weights.rare) filtered = pool.filter(p=>p.rarity==='rare');
      else                               filtered = pool.filter(p=>p.rarity==='common');
      if(!filtered.length) filtered = pool;
      if(filtered.length) pick = filtered[Math.floor(Math.random()*filtered.length)];
    }
    if(pick) {
      drawn.push({ ...pick, isFav: pick.countryCode === country.code });
      used.add(pick.id);
    }
  }
  return drawn;
}

// ═══════════════════════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════════════════════
let favFilter = 'ALL';
let favSearchVal = '';
let favSelectedCode = null;

function renderFavorite(page) {
  if(!state.favTeam) {
    renderFavSelector(page);
  } else {
    renderFavHub(page);
  }
}

// ── SELECTOR ──────────────────────────────────────────────
function renderFavSelector(page) {
  const confs = [...new Set(COUNTRIES.map(c=>c.conf))].sort();

  page.innerHTML = `<div class="fav-wrap page-enter">
    <div class="fav-selector-wrap">
      <h2>❤️ ELIGE TU SELECCIÓN</h2>
      <p>Selecciona tu equipo favorito del Mundial 2026. Recibirás sobres con mayor probabilidad de sus jugadores, misiones exclusivas y seguimiento especial de su progreso.</p>

      <input class="fav-search" id="fav-search-inp" type="text"
        placeholder="🔍  Buscar selección…" oninput="favSearchFilter(this.value)">

      <div class="fav-filter-conf">
        <button class="fav-conf-btn${favFilter==='ALL'?' active':''}" onclick="setFavConf('ALL')">Todas</button>
        ${confs.map(c=>`<button class="fav-conf-btn${favFilter===c?' active':''}" onclick="setFavConf('${c}')" style="border-color:${FAV_CONF_COLORS[c]||'var(--border2)'}20;">${c}</button>`).join('')}
      </div>

      <div class="fav-team-grid" id="fav-team-grid"></div>

      <button class="fav-confirm-btn" id="fav-confirm-btn" disabled
        onclick="confirmFavTeam()">ELEGIR ESTA SELECCIÓN</button>
    </div>
  </div>`;

  renderFavGrid();
}

function renderFavGrid() {
  const grid = document.getElementById('fav-team-grid');
  if(!grid) return;
  let list = COUNTRIES;
  if(favFilter !== 'ALL') list = list.filter(c=>c.conf===favFilter);
  if(favSearchVal.trim()) list = list.filter(c=>c.name.toLowerCase().includes(favSearchVal.toLowerCase()));

  grid.innerHTML = list.map(c => {
    const isSelected = c.code === favSelectedCode;
    const col = FAV_CONF_COLORS[c.conf] || '#888';
    return `<button class="fav-team-btn${isSelected?' selected':''}" onclick="selectFavTeam('${c.code}')">
      <img class="fav-team-flag" src="https://flagcdn.com/${c.flag}.svg" onerror="this.src=''">
      <div class="fav-team-name">${c.name}</div>
      <div class="fav-team-rank">FIFA #${c.ranking}</div>
      <div class="fav-team-conf-dot" style="background:${col};box-shadow:0 0 4px ${col}60;"></div>
    </button>`;
  }).join('');
}

window.favSearchFilter = function(v) {
  favSearchVal = v;
  renderFavGrid();
};
window.setFavConf = function(conf) {
  favFilter = conf;
  document.querySelectorAll('.fav-conf-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  renderFavGrid();
};
window.selectFavTeam = function(code) {
  favSelectedCode = code;
  const btn = document.getElementById('fav-confirm-btn');
  if(btn) btn.disabled = false;
  renderFavGrid();
};
window.confirmFavTeam = function() {
  if(!favSelectedCode) return;
  const prev = state.favTeam;
  state.favTeam = favSelectedCode;
  if(prev !== favSelectedCode) state.favMissions = {}; // reset missions on change
  saveState();
  renderFavHub(document.getElementById('page'));
  toast(`❤️ ${COUNTRIES.find(c=>c.code===favSelectedCode)?.name} es tu selección favorita`, 'success');
};

// ── HUB ──────────────────────────────────────────────────
function renderFavHub(page) {
  const country = COUNTRIES.find(c=>c.code===state.favTeam);
  if(!country) { state.favTeam = null; renderFavSelector(page); return; }

  const players = country.players || [];
  const owned = players.filter(p=>state.collected.has(p.id)).length;
  const pct = players.length > 0 ? Math.round(owned/players.length*100) : 0;
  const missions = getFavMissions(country);
  const cooldown = getFavPackCooldown();
  const cooldownHMS = msToHMS(cooldown);

  // Dynamic hero color from conf
  const confColor = FAV_CONF_COLORS[country.conf] || '#EF9F27';

  // Circumference for ring
  const R = 35, C = 2 * Math.PI * R;
  const dashOffset = C - (pct / 100) * C;

  page.innerHTML = `<div class="fav-wrap page-enter">
    <!-- Hero -->
    <div class="fav-hero" style="background:linear-gradient(135deg,rgba(7,10,16,0.95),rgba(7,10,16,0.85));">
      <div class="fav-hero-bg" style="background:radial-gradient(ellipse at 0% 50%,${confColor}22,transparent 60%),radial-gradient(ellipse at 100% 50%,${confColor}11,transparent 60%);"></div>
      <button class="fav-change-btn" onclick="state.favTeam=null;renderFavSelector(document.getElementById('page'))">Cambiar ❯</button>
      <div class="fav-hero-inner">
        <img class="fav-hero-flag" src="https://flagcdn.com/${country.flag}.svg" onerror="this.style.opacity=.3">
        <div class="fav-hero-info">
          <div class="fav-hero-label">❤️ MI SELECCIÓN FAVORITA</div>
          <div class="fav-hero-name">${country.name.toUpperCase()}</div>
          <div class="fav-hero-conf">${country.conf} · FIFA #${country.ranking} · Grupo ${country.group}</div>
          <div class="fav-hero-stats">
            <div class="fav-hero-stat"><div class="n">${owned}/${players.length}</div><div class="l">LÁMINAS</div></div>
            <div class="fav-hero-stat"><div class="n">${country.world_cups}</div><div class="l">MUNDIALES</div></div>
            <div class="fav-hero-stat"><div class="n">${missions.filter(m=>state.favMissions?.[m.id]?.completed).length}/${missions.length}</div><div class="l">MISIONES</div></div>
          </div>
        </div>
        <div class="fav-progress-ring">
          <svg class="fav-ring-svg" viewBox="0 0 80 80">
            <circle class="fav-ring-bg" cx="40" cy="40" r="${R}"/>
            <circle class="fav-ring-fill" cx="40" cy="40" r="${R}"
              stroke="${confColor}"
              stroke-dasharray="${C}"
              stroke-dashoffset="${dashOffset}"/>
          </svg>
          <div class="fav-ring-label">
            <div class="fav-ring-pct">${pct}%</div>
            <div class="fav-ring-sub">ÁLBUM</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boosted Pack -->
    <div class="fav-pack-section">
      <div class="fav-pack-header">
        <div class="fav-pack-title">⚡ SOBRE FAVORITO</div>
        <span class="fav-pack-badge">PROBABILIDAD MEJORADA</span>
      </div>
      <p class="fav-pack-desc">Un sobre especial con 60% de probabilidad de obtener jugadores de ${country.name}. Las láminas de tu equipo también tienen mejor probabilidad de rareza.</p>
      <div class="fav-pack-odds">
        <div class="fav-odd-chip"><span class="fav-odd-label">Jugadores fav:</span><span class="fav-odd-val boosted">60%</span></div>
        <div class="fav-odd-chip"><span class="fav-odd-label">ICON (fav):</span><span class="fav-odd-val boosted">5%</span></div>
        <div class="fav-odd-chip"><span class="fav-odd-label">LEGENDARY (fav):</span><span class="fav-odd-val boosted">15%</span></div>
        <div class="fav-odd-chip"><span class="fav-odd-label">RARE (fav):</span><span class="fav-odd-val boosted">35%</span></div>
        <div class="fav-odd-chip"><span class="fav-odd-label">Cooldown:</span><span class="fav-odd-val">3h</span></div>
      </div>
      <button class="fav-open-btn" id="fav-open-btn"
        style="background:linear-gradient(135deg,${confColor}dd,${confColor}88);color:#fff;"
        onclick="openFavPack()" ${cooldown > 0 ? 'disabled' : ''}>
        ${cooldown > 0 ? '⏳ EN RECARGA' : '📦 ABRIR SOBRE FAVORITO'}
      </button>
      ${cooldown > 0 ? `<div class="fav-cooldown">Disponible en ${cooldownHMS}</div>` : '<div class="fav-cooldown">¡Disponible ahora!</div>'}
      <div id="fav-reveal-area"></div>
    </div>

    <!-- Missions -->
    <div class="section-label">🎯 MISIONES DE ${country.name.toUpperCase()}</div>
    <div class="fav-missions-grid" id="fav-missions-wrap">
      ${renderMissionsHTML(missions)}
    </div>

    <!-- Players -->
    <div class="fav-players-section" style="margin-top:20px;">
      <div class="section-label" style="margin-bottom:0;">👕 PLANTILLA — ${owned}/${players.length} láminas</div>
      <div class="fav-players-grid">
        ${players.map(p => {
          const has = state.collected.has(p.id);
          return `<div class="fav-player-card ${p.rarity}${has?' owned':''}" onclick="navigate('country','${country.code}')">
            <div class="fav-player-rarity-bar ${p.rarity}"></div>
            <div class="fav-player-emoji">${p.e}</div>
            <div class="fav-player-name">${p.name.split(' ').pop()}</div>
            ${!has ? '<div class="fav-player-missing">🔒</div>' : ''}
          </div>`;
        }).join('')}
      </div>
      <div style="text-align:center;margin-top:14px;">
        <button class="tb-btn gold" onclick="navigate('country','${country.code}')" style="padding:8px 24px;">
          Ver página completa de ${country.name} →
        </button>
      </div>
    </div>
  </div>`;

  // Cooldown timer update
  if(cooldown > 0) {
    const ti = setInterval(() => {
      const cd = getFavPackCooldown();
      const btn = document.getElementById('fav-open-btn');
      const lbl = btn?.nextElementSibling;
      if(!btn) { clearInterval(ti); return; }
      if(cd <= 0) {
        clearInterval(ti);
        btn.disabled = false;
        btn.textContent = '📦 ABRIR SOBRE FAVORITO';
        if(lbl) lbl.textContent = '¡Disponible ahora!';
      } else {
        if(lbl) lbl.textContent = `Disponible en ${msToHMS(cd)}`;
      }
    }, 1000);
  }
}

function renderMissionsHTML(missions) {
  return missions.map(m => {
    const prog = m.progress();
    const isDone = state.favMissions?.[m.id]?.completed;
    const isReady = m.check() && !isDone;
    const pct = Math.min(100, Math.round(prog.cur / prog.max * 100));

    return `<div class="fav-mission ${isDone?'completed':isReady?'claimable':''}">
      <div class="fav-mission-icon">${m.icon}</div>
      <div class="fav-mission-info">
        <div class="fav-mission-title">${m.title}</div>
        <div class="fav-mission-desc">${m.desc}</div>
        <div class="fav-mission-progress">
          <div class="fav-mission-prog-label">${prog.cur}/${prog.max}</div>
          <div class="fav-mission-bar-wrap">
            <div class="fav-mission-bar" style="width:${pct}%"></div>
          </div>
        </div>
      </div>
      <div class="fav-mission-reward">
        <div class="fav-mission-reward-label">RECOMPENSA</div>
        <div style="font-size:11px;font-family:var(--fb);font-weight:600;margin-bottom:6px;color:var(--gold);">${m.reward}</div>
        <button class="fav-mission-claim-btn ${isDone?'done':isReady?'ready':'locked'}"
          onclick="${isReady?`claimFavMission('${m.id}')`:''}"
          ${!isReady?'disabled':''}>
          ${isDone?'✓ Reclamada':isReady?'¡RECLAMAR!':'Bloqueada'}
        </button>
      </div>
    </div>`;
  }).join('');
}

// ── OPEN FAV PACK ─────────────────────────────────────────
window.openFavPack = function() {
  const country = COUNTRIES.find(c=>c.code===state.favTeam);
  if(!country || getFavPackCooldown() > 0) return;

  const btn = document.getElementById('fav-open-btn');
  if(btn) { btn.disabled = true; btn.textContent = '⏳ Abriendo…'; }

  const drawn = drawFavPack(country);
  setFavPackUsed();

  // Track mission progress
  if(!state.favMissions) state.favMissions = {};
  if(!state.favMissions['open_5_packs']) state.favMissions['open_5_packs'] = { openCount: 0 };
  state.favMissions['open_5_packs'].openCount = (state.favMissions['open_5_packs'].openCount || 0) + 1;

  // Collect cards
  drawn.forEach(p => {
    if(state.collected.has(p.id)) {
      state.duplicates[p.id] = (state.duplicates[p.id]||1)+1;
    } else {
      state.collected.add(p.id);
    }
  });
  saveState();
  updateProgress();

  // Render reveal
  const area = document.getElementById('fav-reveal-area');
  if(!area) return;
  area.innerHTML = `<div style="font-size:9px;font-family:var(--fm);letter-spacing:2px;color:var(--muted);margin:16px 0 10px;">LÁMINAS OBTENIDAS</div>
    <div class="fav-reveal-grid" id="fav-rev-grid"></div>`;

  const grid = document.getElementById('fav-rev-grid');
  drawn.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = `fav-reveal-card ${p.rarity}${p.isFav?' boosted-card':''}`;
    const rarityColors = {icon:'rgba(229,53,171,.15)',legendary:'rgba(239,159,39,.1)',rare:'rgba(91,164,245,.1)',common:'rgba(255,255,255,.03)'};
    card.style.background = rarityColors[p.rarity] || rarityColors.common;
    card.style.border = `1.5px solid ${p.rarity==='icon'?'rgba(229,53,171,.4)':p.rarity==='legendary'?'rgba(239,159,39,.4)':p.rarity==='rare'?'rgba(91,164,245,.3)':'var(--border)'}`;
    card.innerHTML = `<div style="flex:1;display:flex;align-items:center;justify-content:center;font-size:28px;">${p.e}</div>
      <div style="padding:4px 5px 5px;background:rgba(0,0,0,.4);font-size:8px;font-family:var(--fb);font-weight:700;">${p.name.split(' ').pop()}</div>`;
    if(p.isFav) card.style.boxShadow = `0 0 12px rgba(239,159,39,.2)`;
    grid.appendChild(card);
    setTimeout(() => card.classList.add('show'), 150 + i*130);
  });

  // Refresh missions section
  const country2 = COUNTRIES.find(c=>c.code===state.favTeam);
  if(country2) {
    const wrap = document.getElementById('fav-missions-wrap');
    if(wrap) wrap.innerHTML = renderMissionsHTML(getFavMissions(country2));
  }

  // Update cooldown btn
  setTimeout(() => {
    const b = document.getElementById('fav-open-btn');
    const cd = getFavPackCooldown();
    if(b) {
      b.textContent = '⏳ EN RECARGA';
      b.nextElementSibling && (b.nextElementSibling.textContent = `Disponible en ${msToHMS(cd)}`);
    }
  }, 300);

  const favCount = drawn.filter(p=>p.isFav).length;
  toast(`📦 ${favCount} de 5 láminas son de ${country.name} ⭐`, 'success');
};

// ── CLAIM MISSION ─────────────────────────────────────────
window.claimFavMission = function(missionId) {
  const country = COUNTRIES.find(c=>c.code===state.favTeam);
  if(!country) return;
  const missions = getFavMissions(country);
  const mission = missions.find(m=>m.id===missionId);
  if(!mission || !mission.check()) return;
  if(state.favMissions?.[missionId]?.completed) return;

  if(!state.favMissions) state.favMissions = {};
  state.favMissions[missionId] = { completed: true, claimedAt: new Date().toISOString() };

  // Apply reward
  if(mission.rewardType === 'pack') {
    // Give a free fav pack (reset cooldown)
    localStorage.removeItem('album26_fav_pack_last');
    toast(`🎁 ¡Misión completada! Tienes un sobre favorito extra`, 'success');
  } else if(mission.rewardType === 'trivia_pts') {
    state.gameScore = (state.gameScore || 0) + 200;
    toast(`🎮 ¡+200 puntos de trivia! Total: ${state.gameScore}`, 'success');
  } else if(['legendary','rare','icon'].includes(mission.rewardType)) {
    // Grant a random player of that rarity
    const allPlayers = COUNTRIES.flatMap(c=>c.players.map(p=>({...p,countryCode:c.code,flag:c.flag})));
    const pool = allPlayers.filter(p=>p.rarity===mission.rewardType && !state.collected.has(p.id));
    if(pool.length > 0) {
      const pick = pool[Math.floor(Math.random()*pool.length)];
      state.collected.add(pick.id);
      toast(`✨ ¡${pick.name} añadido a tu álbum!`, 'success');
    } else {
      toast(`✅ Misión completada — todas las láminas de esa rareza ya las tienes`, 'success');
    }
  } else {
    toast(`✅ ¡Misión completada! ${mission.reward}`, 'success');
  }

  saveState(); updateProgress();
  // Re-render missions
  const wrap = document.getElementById('fav-missions-wrap');
  if(wrap) wrap.innerHTML = renderMissionsHTML(getFavMissions(country));
};

// ── HELPERS ───────────────────────────────────────────────
function msToHMS(ms) {
  if(ms <= 0) return '00:00:00';
  const s = Math.floor(ms/1000);
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// ── Sidebar badge when missions are claimable ──────────────
(function patchSidebarFav() {
  const check = () => {
    const navEl = document.getElementById('nav-favorite');
    if(!navEl || !state.favTeam) return;
    const country = COUNTRIES.find(c=>c.code===state.favTeam);
    if(!country) return;
    const missions = getFavMissions(country);
    const claimable = missions.filter(m => m.check() && !state.favMissions?.[m.id]?.completed).length;
    const pack = getFavPackCooldown() === 0;
    const total = (claimable > 0 ? 1 : 0) + (pack ? 1 : 0);

    let badge = navEl.querySelector('.sb-badge');
    if(total > 0) {
      if(!badge) { badge = document.createElement('span'); badge.className = 'sb-badge'; navEl.appendChild(badge); }
      badge.textContent = total + ' new';
      badge.style.background = 'rgba(239,159,39,0.15)';
      badge.style.color = 'var(--gold)';
    } else if(badge) {
      badge.remove();
    }
  };
  setTimeout(check, 600);
  setInterval(check, 60000);
})();
