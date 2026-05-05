// ═══ CMP STATS + ALL RENDER FUNCTIONS ═══
const CMP_STATS = [
  {key:'overall',   label:'VALORACIÓN GENERAL', icon:'⭐'},
  {key:'pace',      label:'VELOCIDAD',           icon:'⚡'},
  {key:'shooting',  label:'REMATE',              icon:'🎯'},
  {key:'passing',   label:'PASE',                icon:'🎨'},
  {key:'dribbling', label:'REGATE',              icon:'🔥'},
  {key:'defending', label:'DEFENSA',             icon:'🛡️'},
  {key:'physical',  label:'FÍSICO',              icon:'💪'},
  {key:'worldcups', label:'MUNDIALES JUGADOS',   icon:'🏆'},
];

// Base stats by rarity
const RARITY_BASE = {
  icon:      {overall:96, pace:88, shooting:92, passing:91, dribbling:94, defending:72, physical:84},
  legendary: {overall:88, pace:82, shooting:86, passing:84, dribbling:85, defending:68, physical:80},
  rare:      {overall:80, pace:76, shooting:78, passing:77, dribbling:76, defending:65, physical:76},
  common:    {overall:72, pace:70, shooting:70, passing:68, dribbling:68, defending:60, physical:70},
};

// Position modifiers
const POS_MOD = {
  POR: {defending:+18, physical:+10, shooting:-20, dribbling:-15, pace:-5},
  DEF: {defending:+14, physical:+8,  shooting:-10, dribbling:-8},
  MED: {passing:+8,    dribbling:+4, shooting:-2},
  DEL: {shooting:+10, pace:+6,      dribbling:+6, defending:-12},
};

function computeStats(player, countryWorldCups) {
  const base = {...(RARITY_BASE[player.rarity] || RARITY_BASE.common)};
  const mod  = POS_MOD[player.pos] || {};
  Object.entries(mod).forEach(([k,v]) => { if(base[k]!==undefined) base[k] = Math.min(99, Math.max(40, base[k]+v)); });
  // Small jitter so same-rarity players differ
  const seed = player.id.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  Object.keys(base).forEach(k => {
    base[k] = Math.min(99, Math.max(40, base[k] + ((seed % 7) - 3)));
  });
  base.worldcups = countryWorldCups || 0;
  return base;
}

let cmpState = {
  playerA: null,
  playerB: null,
  selecting: null,   // 'A' | 'B'
  filterPos: 'ALL',
  filterOwned: true,
  search: '',
};

// ── MAIN RENDER ────────────────────────────────────────────
function injectCmpAIStyles() {
  if(document.getElementById('cmp-ai-styles')) return;
  const s = document.createElement('style');
  s.id = 'cmp-ai-styles';
  s.textContent = `
/* ── Comparador IA analysis ── */
.cmp-ai-section{
  border-top:1px solid var(--border);
  padding:20px 24px;
}
.cmp-ai-btn{
  width:100%;padding:13px;border-radius:10px;
  background:linear-gradient(135deg,#1a0a2e 0%,#0a1a35 100%);
  border:1px solid rgba(127,119,221,0.35);
  color:#a09ae8;font-family:var(--fd);font-size:18px;
  letter-spacing:3px;cursor:pointer;transition:all .2s;
  display:flex;align-items:center;justify-content:center;gap:10px;
  position:relative;overflow:hidden;
}
.cmp-ai-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(127,119,221,0.08),transparent);
  animation:aiSheen 2.5s ease-in-out infinite;
}
@keyframes aiSheen{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
.cmp-ai-btn:hover{
  border-color:rgba(127,119,221,0.6);
  box-shadow:0 0 24px rgba(127,119,221,0.2);
  color:#c8c4f8;
}
.cmp-ai-btn:disabled{opacity:.5;cursor:not-allowed;}

.cmp-ai-loading{
  display:flex;flex-direction:column;align-items:center;gap:12px;
  padding:24px 0;
}
.cmp-ai-orb{
  width:48px;height:48px;border-radius:50%;
  background:conic-gradient(#7F77DD,#5BA4F5,#D4537E,#EF9F27,#7F77DD);
  animation:orbSpin 1s linear infinite;
}
@keyframes orbSpin{to{transform:rotate(360deg)}}
.cmp-ai-loading-text{
  font-family:var(--fd);font-size:16px;letter-spacing:2px;color:#a09ae8;
}
.cmp-ai-steps{
  display:flex;flex-direction:column;gap:5px;align-items:center;
}
.cmp-ai-step{
  font-size:10px;font-family:var(--fm);color:var(--muted);letter-spacing:.5px;
  transition:color .3s;
}
.cmp-ai-step.active{color:var(--text);}
.cmp-ai-step.done{color:var(--green);}
.cmp-ai-step.done::before{content:'✓ ';}

.cmp-ai-result{
  background:linear-gradient(160deg,rgba(127,119,221,0.05),rgba(91,164,245,0.04));
  border:1px solid rgba(127,119,221,0.2);border-radius:12px;
  overflow:hidden;
}
.cmp-ai-result-header{
  display:flex;align-items:center;gap:10px;
  padding:14px 18px;border-bottom:1px solid rgba(127,119,221,0.15);
}
.cmp-ai-badge{
  font-size:9px;font-family:var(--fm);letter-spacing:2px;
  background:rgba(127,119,221,0.15);color:#a09ae8;
  padding:3px 8px;border-radius:4px;border:1px solid rgba(127,119,221,0.25);
}
.cmp-ai-winner-line{
  font-family:var(--fd);font-size:18px;letter-spacing:1px;flex:1;
}
.cmp-ai-winner-line .winner-name-a{color:var(--gold);}
.cmp-ai-winner-line .winner-name-b{color:var(--rare-c);}
.cmp-ai-winner-line .winner-tie{color:var(--muted);}

.cmp-ai-body{padding:18px 20px;}
.cmp-ai-analysis{
  font-family:var(--fs);font-size:14px;line-height:1.78;color:var(--text);
  margin-bottom:16px;
}
.cmp-ai-analysis p{margin-bottom:12px;}
.cmp-ai-analysis p:last-child{margin:0;}
.cmp-ai-analysis strong{color:var(--gold);}

.cmp-ai-factors{margin-bottom:16px;}
.cmp-ai-factors-title{
  font-size:9px;font-family:var(--fm);letter-spacing:2px;color:var(--muted);margin-bottom:10px;
}
.cmp-ai-factor{
  display:flex;align-items:flex-start;gap:8px;
  font-size:12px;font-family:var(--fs);color:var(--text);line-height:1.5;
  margin-bottom:7px;
}
.cmp-ai-factor-ico{flex-shrink:0;font-size:14px;}
.cmp-ai-factor-side{
  font-size:8px;font-family:var(--fm);letter-spacing:1px;padding:2px 6px;
  border-radius:3px;flex-shrink:0;margin-top:2px;
}
.cmp-ai-factor-side.a{background:rgba(239,159,39,0.12);color:var(--gold);}
.cmp-ai-factor-side.b{background:rgba(91,164,245,0.12);color:var(--rare-c);}
.cmp-ai-factor-side.neutral{background:rgba(255,255,255,0.05);color:var(--muted);}

.cmp-ai-verdict-box{
  display:flex;align-items:center;gap:16px;
  padding:14px 16px;border-radius:10px;
  background:rgba(127,119,221,0.07);border:1px solid rgba(127,119,221,0.15);
}
.cmp-ai-verdict-emoji{font-size:32px;flex-shrink:0;}
.cmp-ai-verdict-text{flex:1;}
.cmp-ai-verdict-title{
  font-family:var(--fd);font-size:18px;letter-spacing:1px;margin-bottom:3px;
}
.cmp-ai-verdict-sub{font-size:12px;color:var(--muted);font-family:var(--fs);line-height:1.5;}
.cmp-ai-verdict-confidence{
  text-align:right;flex-shrink:0;
}
.cmp-ai-confidence-num{
  font-family:var(--fd);font-size:32px;letter-spacing:-1px;
  background:linear-gradient(135deg,#a09ae8,#5BA4F5);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.cmp-ai-confidence-label{font-size:9px;font-family:var(--fm);color:var(--muted);letter-spacing:1px;}

/* Stream cursor */
.ai-cursor{display:inline-block;width:2px;height:1em;background:#a09ae8;
  margin-left:2px;vertical-align:middle;animation:aiCursorBlink .7s step-end infinite;}
@keyframes aiCursorBlink{0%,100%{opacity:1}50%{opacity:0}}

.cmp-ai-retry{
  font-size:11px;font-family:var(--fb);font-weight:600;
  color:var(--muted);border:1px solid var(--border2);border-radius:6px;
  background:transparent;padding:6px 12px;cursor:pointer;transition:all .12s;margin-top:12px;
}
.cmp-ai-retry:hover{color:var(--text);border-color:var(--border3);}
`;
  document.head.appendChild(s);
}

function renderComparator(page) {
  injectCmpAIStyles();
  page.innerHTML = `<div class="cmp-wrap page-enter">
    <div class="cmp-hero">
      <h2>⚖️ COMPARADOR</h2>
      <p>Selecciona dos jugadores de tu álbum y analiza sus estadísticas cara a cara</p>
    </div>

    <div class="cmp-random-row">
      <button class="cmp-random-btn" onclick="randomComparison()">🎲 Comparación aleatoria</button>
      <button class="cmp-random-btn" onclick="randomSameCountry()">🌍 Mismo país</button>
      <button class="cmp-random-btn" onclick="randomSamePos()">📋 Misma posición</button>
      <label class="cmp-only-owned">
        <input type="checkbox" id="chk-owned" ${cmpState.filterOwned?'checked':''} onchange="cmpState.filterOwned=this.checked">
        Solo mis láminas
      </label>
    </div>

    <div class="cmp-arena" id="cmp-arena"></div>

    <div class="cmp-picker" id="cmp-picker">
      <div class="cmp-picker-head">
        <span class="cmp-picker-title" id="cmp-picker-title">ELEGIR JUGADOR</span>
        <input class="cmp-picker-search" id="cmp-search" type="text"
          placeholder="🔍  Buscar por nombre, club o país…"
          oninput="cmpFilterSearch(this.value)">
        <button style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:2px 6px;"
          onclick="closeCmpPicker()">✕</button>
      </div>
      <div class="cmp-picker-filters" id="cmp-filters"></div>
      <div class="cmp-picker-grid" id="cmp-grid"></div>
    </div>

    <div id="cmp-result"></div>

    <div class="cmp-actions" id="cmp-actions" style="display:none;">
      <button class="cmp-btn" onclick="shareComparison()">📤 Compartir</button>
      <button class="cmp-btn" onclick="cmpState.playerA=null;cmpState.playerB=null;renderComparator(page)">🔄 Nueva comparación</button>
      <button class="cmp-btn gold" onclick="randomComparison()">🎲 Aleatoria</button>
    </div>
  </div>`;

  renderCmpArena();
  renderCmpFilters();
  maybeBuildComparison();
}

// ── ARENA ──────────────────────────────────────────────────
function renderCmpArena() {
  const wrap = document.getElementById('cmp-arena');
  if(!wrap) return;
  wrap.innerHTML = `
    ${renderCmpSlot('A', cmpState.playerA)}
    <div class="cmp-vs-col">
      <div class="cmp-vs">VS</div>
    </div>
    ${renderCmpSlot('B', cmpState.playerB)}`;
}

function renderCmpSlot(side, player) {
  const isSelecting = cmpState.selecting === side;
  if(player) {
    const country = COUNTRIES.find(c=>c.players.some(p=>p.id===player.id));
    const rarityColors = {icon:'var(--icon-c)',legendary:'var(--legendary-c)',rare:'var(--rare-c)',common:'var(--common-c)'};
    return `<div class="cmp-slot slot-${side.toLowerCase()} has-player">
      <div class="cmp-ph-emoji">${player.e}</div>
      ${country ? `<img class="cmp-slot-flag" src="https://flagcdn.com/${country.flag}.svg" onerror="this.style.display='none'">` : ''}
      <div class="cmp-slot-name">${player.name}</div>
      <div class="cmp-slot-meta">${player.club}</div>
      <span class="cmp-slot-rarity" style="background:rgba(0,0,0,0.2);color:${rarityColors[player.rarity]}">${player.rarity.toUpperCase()}</span>
      ${state.collected.has(player.id) ? '<span class="cmp-owned-badge">✓ En mi álbum</span>' : ''}
      <button class="cmp-slot-change" onclick="openCmpPicker('${side}')">Cambiar jugador</button>
    </div>`;
  }
  return `<div class="cmp-slot slot-${side.toLowerCase()}${isSelecting?' selecting':''}" onclick="openCmpPicker('${side}')">
    <div class="cmp-slot-add">+</div>
    <div class="cmp-slot-hint">JUGADOR ${side}</div>
    <div style="font-size:11px;color:var(--muted2);font-family:var(--fs);margin-top:4px;">Toca para elegir</div>
  </div>`;
}

// ── FILTERS ────────────────────────────────────────────────
function renderCmpFilters() {
  const wrap = document.getElementById('cmp-filters');
  if(!wrap) return;
  const positions = ['ALL','POR','DEF','MED','DEL'];
  wrap.innerHTML = `<span style="font-size:9px;font-family:var(--fm);color:var(--muted);letter-spacing:1px;align-self:center;">POS:</span>` +
    positions.map(p =>
      `<button class="cmp-filter${cmpState.filterPos===p?' active':''}" onclick="setCmpFilter('${p}')">${p==='ALL'?'TODOS':p}</button>`
    ).join('') +
    `<span style="font-size:9px;font-family:var(--fm);color:var(--muted);letter-spacing:1px;margin-left:8px;align-self:center;">RAREZA:</span>` +
    ['ALL','icon','legendary','rare','common'].map(r =>
      `<button class="cmp-filter${(cmpState.filterRarity||'ALL')===r?' active':''}" onclick="setCmpRarity('${r}')">${r==='ALL'?'TODAS':r.toUpperCase()}</button>`
    ).join('');
}

window.setCmpFilter = function(pos) {
  cmpState.filterPos = pos;
  renderCmpFilters();
  cmpFilterSearch(cmpState.search);
};
window.setCmpRarity = function(r) {
  cmpState.filterRarity = r;
  renderCmpFilters();
  cmpFilterSearch(cmpState.search);
};

// ── PICKER ─────────────────────────────────────────────────
window.openCmpPicker = function(side) {
  cmpState.selecting = side;
  const picker = document.getElementById('cmp-picker');
  const title  = document.getElementById('cmp-picker-title');
  const search = document.getElementById('cmp-search');
  if(picker) picker.classList.add('open');
  if(title) title.textContent = `ELEGIR JUGADOR ${side}`;
  if(search) { search.value=''; search.focus(); }
  cmpState.search = '';
  cmpFilterSearch('');
  renderCmpArena();
};

window.closeCmpPicker = function() {
  cmpState.selecting = null;
  const picker = document.getElementById('cmp-picker');
  if(picker) picker.classList.remove('open');
  renderCmpArena();
};

window.cmpFilterSearch = function(q) {
  cmpState.search = q;
  const grid = document.getElementById('cmp-grid');
  if(!grid) return;

  let allPlayers = COUNTRIES.flatMap(c =>
    c.players.map(p => ({...p, countryName:c.name, flag:c.flag, world_cups:c.world_cups}))
  );

  if(cmpState.filterPos !== 'ALL') allPlayers = allPlayers.filter(p => p.pos === cmpState.filterPos);
  if(cmpState.filterRarity && cmpState.filterRarity !== 'ALL') allPlayers = allPlayers.filter(p => p.rarity === cmpState.filterRarity);
  if(cmpState.filterOwned) allPlayers = allPlayers.filter(p => state.collected.has(p.id));
  if(q.trim()) allPlayers = allPlayers.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.club.toLowerCase().includes(q.toLowerCase()) ||
    p.countryName.toLowerCase().includes(q.toLowerCase())
  );

  // Sort by rarity weight
  const rOrder = {icon:0,legendary:1,rare:2,common:3};
  allPlayers.sort((a,b)=>(rOrder[a.rarity]||3)-(rOrder[b.rarity]||3));

  const rarityColors = {icon:'rgba(229,53,171,.15)',legendary:'rgba(239,159,39,.15)',rare:'rgba(91,164,245,.15)',common:'rgba(136,153,170,.15)'};
  const rarityText   = {icon:'var(--icon-c)',legendary:'var(--gold)',rare:'var(--rare-c)',common:'var(--common-c)'};

  if(!allPlayers.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--muted);font-size:12px;font-family:var(--fs);">
      Sin jugadores para estos filtros${cmpState.filterOwned?' · Prueba desactivar "Solo mis láminas"':''}</div>`;
    return;
  }

  grid.innerHTML = allPlayers.map(p => {
    const alreadyChosen = (cmpState.selecting==='A' && cmpState.playerB?.id===p.id) ||
                          (cmpState.selecting==='B' && cmpState.playerA?.id===p.id);
    return `<button class="cmp-player-btn${alreadyChosen?' not-owned':''}"
      onclick="${alreadyChosen?'':''}" ${alreadyChosen?'disabled':''} onclick="pickCmpPlayer('${p.id}')">
      <span class="pe">${p.e}</span>
      <div class="pi">
        <div class="pn">${p.name}</div>
        <div class="pm">${p.club} · ${p.countryName}</div>
      </div>
      <span class="pr" style="background:${rarityColors[p.rarity]};color:${rarityText[p.rarity]}">${p.rarity.slice(0,3).toUpperCase()}</span>
    </button>`;
  }).join('');
};

window.pickCmpPlayer = function(id) {
  const all = COUNTRIES.flatMap(c => c.players.map(p=>({...p,world_cups:c.world_cups})));
  const player = all.find(p=>p.id===id);
  if(!player) return;
  if(cmpState.selecting==='A') cmpState.playerA = player;
  else cmpState.playerB = player;
  closeCmpPicker();
  renderCmpArena();
  maybeBuildComparison();
};

// ── BUILD COMPARISON ───────────────────────────────────────
function maybeBuildComparison() {
  const result = document.getElementById('cmp-result');
  const actions = document.getElementById('cmp-actions');
  if(!result) return;
  if(!cmpState.playerA || !cmpState.playerB) {
    result.innerHTML = '';
    if(actions) actions.style.display = 'none';
    return;
  }
  buildComparisonCard(result);
  if(actions) actions.style.display = 'flex';
}

function buildComparisonCard(container) {
  const pA = cmpState.playerA;
  const pB = cmpState.playerB;
  const cA = COUNTRIES.find(c=>c.players.some(p=>p.id===pA.id));
  const cB = COUNTRIES.find(c=>c.players.some(p=>p.id===pB.id));

  const statsA = computeStats(pA, cA?.world_cups||0);
  const statsB = computeStats(pB, cB?.world_cups||0);

  // Count wins per side
  let winsA=0, winsB=0, ties=0;
  CMP_STATS.forEach(s => {
    const vA = statsA[s.key]||0, vB = statsB[s.key]||0;
    if(vA>vB) winsA++;
    else if(vB>vA) winsB++;
    else ties++;
  });

  const totalA = CMP_STATS.reduce((acc,s)=>acc+(statsA[s.key]||0),0);
  const totalB = CMP_STATS.reduce((acc,s)=>acc+(statsB[s.key]||0),0);
  const overallWinner = totalA > totalB ? 'A' : totalB > totalA ? 'B' : 'TIE';

  const rarityColors = {icon:'var(--icon-c)',legendary:'var(--legendary-c)',rare:'var(--rare-c)',common:'var(--common-c)'};

  // Build stat rows
  let statsHTML = '';
  CMP_STATS.forEach(s => {
    const vA = statsA[s.key]||0;
    const vB = statsB[s.key]||0;
    const maxV = Math.max(vA, vB, 1);
    const pctA = Math.round((vA/maxV)*50);  // max 50% each side
    const pctB = Math.round((vB/maxV)*50);
    const winA = vA > vB, winB = vB > vA;
    const displayA = s.key==='worldcups' ? vA : vA;
    const displayB = s.key==='worldcups' ? vB : vB;

    statsHTML += `<div class="cmp-stat-row">
      <div class="cmp-stat-val side-a ${winA?'winner-a':winB?'tie':'tie'}">${displayA}</div>
      <div class="cmp-stat-mid">
        <div class="cmp-stat-label">${s.icon} ${s.label}</div>
        <div class="cmp-stat-bar-wrap">
          <div class="cmp-stat-bar-a" style="width:${pctA}%"></div>
          <div class="cmp-stat-bar-b" style="width:${pctB}%"></div>
        </div>
      </div>
      <div class="cmp-stat-val side-b ${winB?'winner-b':winA?'tie':'tie'}">${displayB}</div>
    </div>`;
  });

  container.innerHTML = `<div class="cmp-card">
    <!-- Header -->
    <div class="cmp-card-header">
      <div class="cmp-player-head side-a">
        <div class="cmp-ph-emoji">${pA.e}</div>
        <div class="cmp-ph-name">${pA.name}</div>
        <div class="cmp-ph-club">${pA.club}</div>
        ${cA?`<img class="cmp-ph-flag" src="https://flagcdn.com/${cA.flag}.svg" onerror="this.style.display='none'" title="${cA.name}">`:'' }
        <span class="cmp-ph-rarity" style="background:rgba(0,0,0,0.25);color:${rarityColors[pA.rarity]}">${pA.rarity.toUpperCase()}</span>
        ${state.collected.has(pA.id)?'<span class="cmp-owned-badge">✓ En álbum</span>':''}
      </div>
      <div class="cmp-divider-col">
        <span style="font-family:var(--fd);font-size:18px;color:var(--muted);">VS</span>
        <div style="width:1px;flex:1;background:var(--border);"></div>
        <span style="font-size:10px;color:var(--muted);font-family:var(--fm);">${winsA}–${winsB}</span>
      </div>
      <div class="cmp-player-head side-b">
        <div class="cmp-ph-emoji">${pB.e}</div>
        <div class="cmp-ph-name">${pB.name}</div>
        <div class="cmp-ph-club">${pB.club}</div>
        ${cB?`<img class="cmp-ph-flag" src="https://flagcdn.com/${cB.flag}.svg" onerror="this.style.display='none'" title="${cB.name}">`:'' }
        <span class="cmp-ph-rarity" style="background:rgba(0,0,0,0.25);color:${rarityColors[pB.rarity]}">${pB.rarity.toUpperCase()}</span>
        ${state.collected.has(pB.id)?'<span class="cmp-owned-badge">✓ En álbum</span>':''}
      </div>
    </div>

    <!-- Stats -->
    <div class="cmp-stats-body">${statsHTML}</div>

    <!-- Verdict -->
    <div class="cmp-verdict">
      <div class="cmp-verdict-side">
        <div class="cmp-verdict-score side-a">${winsA}</div>
        <div class="cmp-verdict-label">STATS GANADAS</div>
      </div>
      <div class="cmp-verdict-mid">
        <div class="cmp-verdict-winner ${overallWinner==='A'?'a':overallWinner==='B'?'b':'tie'}">
          ${overallWinner==='A'? pA.name.split(' ').pop()+' GANA'
          : overallWinner==='B'? pB.name.split(' ').pop()+' GANA'
          : 'EMPATE TÉCNICO'}
        </div>
        ${ties>0?`<div style="font-size:9px;font-family:var(--fm);color:var(--muted);margin-top:5px;">${ties} ESTADÍSTICAS EMPATADAS</div>`:''}
      </div>
      <div class="cmp-verdict-side">
        <div class="cmp-verdict-score side-b">${winsB}</div>
        <div class="cmp-verdict-label">STATS GANADAS</div>
      </div>
    </div>
  </div>`;
}

// ── RANDOM HELPERS ─────────────────────────────────────────
function allCollectedPlayers() {
  const filterOwned = document.getElementById('chk-owned')?.checked ?? cmpState.filterOwned;
  return COUNTRIES.flatMap(c =>
    c.players
      .filter(p => !filterOwned || state.collected.has(p.id))
      .map(p=>({...p, world_cups:c.world_cups, countryCode:c.code}))
  );
}

window.randomComparison = function() {
  const pool = allCollectedPlayers();
  if(pool.length < 2) { toast('Necesitas al menos 2 láminas para comparar','error'); return; }
  const shuffled = pool.sort(()=>Math.random()-0.5);
  cmpState.playerA = shuffled[0];
  cmpState.playerB = shuffled.find(p=>p.id!==shuffled[0].id) || shuffled[1];
  renderCmpArena();
  maybeBuildComparison();
  toast('Comparación aleatoria generada ✓','success');
};

window.randomSameCountry = function() {
  const pool = allCollectedPlayers();
  // Find countries with 2+ players in pool
  const byCountry = {};
  pool.forEach(p=>{ if(!byCountry[p.countryCode]) byCountry[p.countryCode]=[]; byCountry[p.countryCode].push(p); });
  const eligible = Object.values(byCountry).filter(a=>a.length>=2);
  if(!eligible.length) { toast('Necesitas 2 jugadores del mismo país','error'); return; }
  const group = eligible[Math.floor(Math.random()*eligible.length)];
  const shuffled = group.sort(()=>Math.random()-0.5);
  cmpState.playerA = shuffled[0];
  cmpState.playerB = shuffled[1];
  renderCmpArena();
  maybeBuildComparison();
  const c = COUNTRIES.find(x=>x.code===cmpState.playerA.countryCode);
  toast(`Duelo de ${c?.name||'mismo país'} 🔥`,'success');
};

window.randomSamePos = function() {
  const pool = allCollectedPlayers();
  const positions = ['POR','DEF','MED','DEL'];
  const pos = positions[Math.floor(Math.random()*positions.length)];
  const filtered = pool.filter(p=>p.pos===pos);
  if(filtered.length < 2) { toast(`No hay suficientes ${pos} en tu álbum`,'error'); return; }
  const shuffled = filtered.sort(()=>Math.random()-0.5);
  cmpState.playerA = shuffled[0];
  cmpState.playerB = shuffled[1];
  renderCmpArena();
  maybeBuildComparison();
  const posLabel = {POR:'Porteros',DEF:'Defensas',MED:'Mediocampistas',DEL:'Delanteros'};
  toast(`Duelo de ${posLabel[pos]} ⚔️`,'success');
};

window.shareComparison = function() {
  if(!cmpState.playerA || !cmpState.playerB) return;
  const pA = cmpState.playerA, pB = cmpState.playerB;
  const sA = computeStats(pA,0), sB = computeStats(pB,0);
  let wA=0,wB=0;
  CMP_STATS.forEach(s=>{ if(sA[s.key]>sB[s.key]) wA++; else if(sB[s.key]>sA[s.key]) wB++; });
  const winner = wA>wB?pA.name:wB>wA?pB.name:'EMPATE';
  const text = `⚖️ Comparador — Álbum Mundial 2026\n\n${pA.name} ${wA} – ${wB} ${pB.name}\n🏆 Ganador: ${winner}\n\n#AlbumMundial2026 #FIFA2026`;
  navigator.clipboard.writeText(text)
    .then(()=>toast('Comparación copiada ✓','success'))
    .catch(()=>toast('No se pudo copiar'));
};

function renderPredictor(page) {
  page.innerHTML = `<div class="predictor-wrap page-enter">
    <div class="predictor-hero">
      <h2>🤖 PREDICTOR IA</h2>
      <p>Análisis inteligente powered by Claude · Estadísticas reales · Simulación táctica</p>
    </div>

    <!-- Mode selector -->
    <div class="pred-modes">
      ${PRED_MODES.map(m => `
        <div class="pred-mode${predState.mode===m.id?' active':''}" onclick="selectPredMode('${m.id}')">
          <div class="pred-mode-icon">${m.icon}</div>
          <div class="pred-mode-name">${m.name}</div>
          <div class="pred-mode-desc">${m.desc}</div>
        </div>`).join('')}
    </div>

    <!-- Team selection arena -->
    <div id="pred-arena-wrap"></div>

    <!-- Country picker -->
    <div class="pred-picker" id="pred-picker">
      <div class="pred-picker-head">
        <span style="font-size:10px;font-family:var(--fm);letter-spacing:1px;color:var(--muted);">
          SELECCIONAR EQUIPO ${predState.selecting||''}
        </span>
        <input class="pred-picker-search" id="pred-search" type="text"
          placeholder="🔍 Buscar selección…" oninput="filterPredCountries(this.value)">
        <button class="pred-picker-close" onclick="closePredPicker()">✕</button>
      </div>
      <div class="pred-picker-grid" id="pred-country-grid"></div>
    </div>

    <!-- Predict button -->
    <button class="pred-btn" id="pred-btn" onclick="runPredictor()" disabled>
      ⚡ ANALIZAR CON IA
    </button>

    <!-- Loading -->
    <div id="pred-loading" style="display:none;">
      <div class="pred-loading">
        <div class="pred-loading-orb"></div>
        <div class="pred-loading-text">ANALIZANDO…</div>
        <div class="pred-loading-sub">Claude está procesando datos tácticos, históricos y estadísticos</div>
        <div class="pred-loading-steps" id="pred-steps"></div>
      </div>
    </div>

    <!-- Result -->
    <div id="pred-result-wrap"></div>

  </div>`;

  renderPredArena();
  checkPredBtn();
}

function renderPredArena() {
  const wrap = document.getElementById('pred-arena-wrap');
  if(!wrap) return;

  if(predState.mode === 'champion') {
    wrap.innerHTML = `
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;
        padding:24px;text-align:center;margin-bottom:20px;">
        <div style="font-size:40px;margin-bottom:12px;">🏆</div>
        <div style="font-family:var(--fd);font-size:24px;letter-spacing:2px;margin-bottom:6px;">¿QUIÉN GANARÁ EL MUNDIAL 2026?</div>
        <div style="font-size:12px;color:var(--muted);font-family:var(--fs);">
          Claude analizará las 48 selecciones, sus estadísticas FIFA, historial mundialista,
          forma reciente y potencial de jugadores para predecir al campeón.
        </div>
      </div>`;
    checkPredBtn();
    return;
  }

  const tA = predState.teamA;
  const tB = predState.teamB;

  wrap.innerHTML = `<div class="pred-arena">
    <div class="pred-team-slot${tA?' selected':''}${predState.selecting==='A'?' selecting':''}"
      onclick="openPredPicker('A')">
      <div class="pred-slot-label">LOCAL</div>
      ${tA
        ? `<img class="pred-flag-big" src="https://flagcdn.com/${tA.flag}.svg" alt="${tA.name}" onerror="this.style.display='none'">
           <div class="pred-team-name">${tA.name}</div>
           <div class="pred-team-rank">FIFA #${tA.ranking} · ${tA.conf}</div>`
        : `<div class="add-hint">+</div>
           <div style="font-size:11px;color:var(--muted);font-family:var(--fm);">ELEGIR EQUIPO</div>`}
    </div>
    <div class="pred-vs">VS</div>
    <div class="pred-team-slot${tB?' selected':''}${predState.selecting==='B'?' selecting':''}"
      onclick="openPredPicker('B')">
      <div class="pred-slot-label">VISITANTE</div>
      ${tB
        ? `<img class="pred-flag-big" src="https://flagcdn.com/${tB.flag}.svg" alt="${tB.name}" onerror="this.style.display='none'">
           <div class="pred-team-name">${tB.name}</div>
           <div class="pred-team-rank">FIFA #${tB.ranking} · ${tB.conf}</div>`
        : `<div class="add-hint">+</div>
           <div style="font-size:11px;color:var(--muted);font-family:var(--fm);">ELEGIR EQUIPO</div>`}
    </div>
  </div>`;
}

window.selectPredMode = function(id) {
  predState.mode = id;
  predState.result = null;
  document.querySelectorAll('.pred-mode').forEach((el,i) => {
    el.classList.toggle('active', PRED_MODES[i].id === id);
  });
  renderPredArena();
  document.getElementById('pred-result-wrap').innerHTML = '';
  checkPredBtn();
};

window.openPredPicker = function(slot) {
  predState.selecting = slot;
  predState.pickerSearch = '';
  const picker = document.getElementById('pred-picker');
  const search = document.getElementById('pred-search');
  if(picker) { picker.classList.add('open'); }
  if(search) { search.value=''; search.focus(); }
  filterPredCountries('');
  renderPredArena();
};

window.closePredPicker = function() {
  predState.selecting = null;
  const picker = document.getElementById('pred-picker');
  if(picker) picker.classList.remove('open');
  renderPredArena();
};

window.filterPredCountries = function(q) {
  predState.pickerSearch = q;
  const grid = document.getElementById('pred-country-grid');
  if(!grid) return;
  const filtered = COUNTRIES.filter(c =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.conf.toLowerCase().includes(q.toLowerCase())
  );
  grid.innerHTML = filtered.map(c => `
    <button class="pred-country-btn" onclick="selectPredTeam('${c.code}')">
      <img class="pred-country-flag" src="https://flagcdn.com/${c.flag}.svg" alt="${c.name}"
        onerror="this.style.display='none'">
      <span class="pred-country-name">${c.name}</span>
    </button>`).join('');
};

window.selectPredTeam = function(code) {
  const country = COUNTRIES.find(c => c.code === code);
  if(!country) return;
  if(predState.selecting === 'A') predState.teamA = country;
  else predState.teamB = country;
  closePredPicker();
  renderPredArena();
  checkPredBtn();
  // Clear old result
  const rw = document.getElementById('pred-result-wrap');
  if(rw) rw.innerHTML = '';
};

function checkPredBtn() {
  const btn = document.getElementById('pred-btn');
  if(!btn) return;
  const ready = predState.mode === 'champion'
    ? true
    : !!(predState.teamA && predState.teamB && predState.teamA.code !== predState.teamB.code);
  btn.disabled = !ready;
}

// ── BUILD PROMPT ──────────────────────────────────────────
function buildPrompt() {
  const tA = predState.teamA;
  const tB = predState.teamB;

  const countryContext = COUNTRIES.map(c =>
    `${c.name} (FIFA #${c.ranking}, ${c.conf}, ${c.world_cups} mundiales, mejor: ${c.best})`
  ).join('; ');

  if(predState.mode === 'champion') {
    return `Eres el mejor analista de fútbol del mundo. Vas a predecir el campeón del Mundial 2026.

SELECCIONES CLASIFICADAS (con ranking FIFA y datos):
${countryContext}

El Mundial 2026 se juega en USA, Canadá y México con 48 equipos. Formato: 12 grupos de 4, luego octavos, cuartos, semis y final.

Responde EXACTAMENTE en este JSON (sin markdown, sin texto extra):
{
  "winner": "Nombre del país ganador",
  "winner_code": "código de 2-3 letras del país",
  "winner_flag": "código ISO bandera ej: ar, br, fr",
  "probability": "porcentaje ej: 34%",
  "finalist": "Nombre del subcampeón",
  "finalist_flag": "código ISO bandera",
  "score_winner": número entero de goles del ganador en la final,
  "score_finalist": número entero de goles del subcampeón,
  "semifinalists": ["País 1", "País 2"],
  "dark_horse": "Equipo sorpresa que llegará lejos",
  "analysis": "Análisis narrativo de 3 párrafos separados por \n\n explicando por qué ese equipo ganará: su plantel, sus figuras, su momento de forma, su historia mundialista y por qué los favoritos no lo lograrán. Sé específico, menciona jugadores reales.",
  "factors": [
    "Factor clave 1 que da ventaja al ganador",
    "Factor clave 2",
    "Factor clave 3",
    "Factor clave 4"
  ],
  "stats": {
    "ranking_winner": número ranking FIFA,
    "titles_winner": número de títulos mundiales,
    "ranking_finalist": número,
    "titles_finalist": número
  }
}`;
  }

  if(predState.mode === 'match') {
    const starsA = tA.players.filter(p=>p.rarity==='icon'||p.rarity==='legendary').map(p=>p.name).join(', ') || 'Sin datos';
    const starsB = tB.players.filter(p=>p.rarity==='icon'||p.rarity==='legendary').map(p=>p.name).join(', ') || 'Sin datos';

    return `Eres el mejor analista de fútbol del mundo. Predice el resultado de este partido del Mundial 2026.

EQUIPO LOCAL: ${tA.name}
- Ranking FIFA: #${tA.ranking}
- Confederación: ${tA.conf}
- Mundiales jugados: ${tA.world_cups}
- Mejor resultado histórico: ${tA.best}
- Figuras: ${starsA}
- Historia: ${tA.history}

EQUIPO VISITANTE: ${tB.name}
- Ranking FIFA: #${tB.ranking}
- Confederación: ${tB.conf}
- Mundiales jugados: ${tB.world_cups}
- Mejor resultado histórico: ${tB.best}
- Figuras: ${starsB}
- Historia: ${tB.history}

Responde EXACTAMENTE en este JSON (sin markdown, sin texto extra):
{
  "winner": "Nombre del equipo ganador o EMPATE",
  "winner_flag": "código ISO bandera del ganador (vacío si empate)",
  "loser_flag": "código ISO bandera del perdedor (vacío si empate)",
  "probability_home": porcentaje numérico de victoria local (sin %),
  "probability_away": porcentaje numérico de victoria visitante (sin %),
  "probability_draw": porcentaje numérico de empate (sin %),
  "score_home": goles del local como número entero,
  "score_away": goles del visitante como número entero,
  "analysis": "Análisis narrativo en 3 párrafos separados por \n\n. Explica la táctica de cada equipo, quién dominará el partido, los jugadores decisivos y el momento clave. Sé concreto y emocionante.",
  "factors": [
    "Factor que favorece al ${tA.name}",
    "Factor que favorece al ${tB.name}",
    "Variable clave del partido",
    "Predicción del momento decisivo"
  ],
  "stats": {
    "ranking_home": ${tA.ranking},
    "ranking_away": ${tB.ranking},
    "worldcups_home": ${tA.world_cups},
    "worldcups_away": ${tB.world_cups},
    "possession_home": posesión estimada local como número sin %,
    "shots_home": tiros al arco estimados local,
    "shots_away": tiros al arco estimados visitante
  },
  "key_player_home": "Jugador clave del ${tA.name}",
  "key_player_away": "Jugador clave del ${tB.name}"
}`;
  }

  // Group mode
  const groupCountries = COUNTRIES.filter(c => c.group === (predState.teamA?.group || 'A'));
  const groupLabel = predState.teamA?.group || 'A';
  const groupTeams = groupCountries.map(c =>
    `${c.name} (FIFA #${c.ranking}, ${c.world_cups} mundiales, mejor: ${c.best})`
  ).join('\n');

  return `Eres el mejor analista de fútbol del mundo. Predice los resultados del Grupo ${groupLabel} del Mundial 2026.

EQUIPOS DEL GRUPO ${groupLabel}:
${groupTeams}

Responde EXACTAMENTE en este JSON (sin markdown, sin texto extra):
{
  "standings": [
    {"pos":1,"team":"Nombre","flag":"código ISO","pts":número,"gf":número,"gc":número},
    {"pos":2,"team":"Nombre","flag":"código ISO","pts":número,"gf":número,"gc":número},
    {"pos":3,"team":"Nombre","flag":"código ISO","pts":número,"gf":número,"gc":número},
    {"pos":4,"team":"Nombre","flag":"código ISO","pts":número,"gf":número,"gc":número}
  ],
  "analysis": "Análisis de 3 párrafos separados por \n\n sobre las dinámicas del grupo, los candidatos a clasificar, las sorpresas posibles y los partidos clave.",
  "key_match": "Descripción del partido más importante del grupo",
  "dark_horse": "Equipo que puede sorprender en este grupo",
  "factors": ["Factor 1","Factor 2","Factor 3","Factor 4"]
}`;
}

// ── CALL CLAUDE API ───────────────────────────────────────
async function callClaude(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if(!response.ok) throw new Error('API error ' + response.status);
  const data = await response.json();
  const raw = data.content?.find(b => b.type === 'text')?.text || '';
  // Strip markdown fences if any
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── LOADING ANIMATION ─────────────────────────────────────
function showPredLoading(steps) {
  const el = document.getElementById('pred-loading');
  const stepsEl = document.getElementById('pred-steps');
  if(el) el.style.display = 'block';
  if(stepsEl) {
    stepsEl.innerHTML = steps.map((s,i) =>
      `<div class="pred-step" id="pred-step-${i}">
         <div class="pred-step-dot"></div>${s}
       </div>`
    ).join('');
  }
}
function activateStep(i) {
  document.querySelectorAll('.pred-step').forEach((el,j) => {
    if(j < i) el.className = 'pred-step done';
    else if(j === i) el.className = 'pred-step active';
    else el.className = 'pred-step';
  });
}
function hidePredLoading() {
  const el = document.getElementById('pred-loading');
  if(el) el.style.display = 'none';
}

// ── RUN PREDICTOR ─────────────────────────────────────────
window.runPredictor = async function() {
  if(predState.loading) return;
  predState.loading = true;
  predState.result = null;

  const btn = document.getElementById('pred-btn');
  if(btn) btn.disabled = true;
  document.getElementById('pred-result-wrap').innerHTML = '';

  const stepLabels = predState.mode === 'champion'
    ? ['Cargando datos de 48 selecciones…','Analizando rankings FIFA…','Evaluando forma reciente…','Simulando el torneo…','Generando análisis final…']
    : predState.mode === 'match'
    ? ['Cargando perfiles de equipos…','Analizando estadísticas…','Calculando probabilidades…','Simulando táctica…','Generando predicción…']
    : ['Cargando equipos del grupo…','Analizando enfrentamientos…','Calculando posiciones…','Generando análisis…','Finalizando…'];

  showPredLoading(stepLabels);

  // Animate steps while waiting
  let stepIdx = 0;
  activateStep(0);
  const stepTimer = setInterval(() => {
    stepIdx++;
    if(stepIdx < stepLabels.length - 1) activateStep(stepIdx);
  }, 900);

  try {
    const prompt = buildPrompt();
    const result = await callClaude(prompt);
    clearInterval(stepTimer);
    activateStep(stepLabels.length - 1);
    await new Promise(r => setTimeout(r, 400));
    hidePredLoading();
    predState.result = result;
    renderPredResult(result);
  } catch(err) {
    clearInterval(stepTimer);
    hidePredLoading();
    console.error(err);
    document.getElementById('pred-result-wrap').innerHTML = `
      <div style="background:rgba(227,30,36,0.08);border:1px solid rgba(227,30,36,0.2);
        border-radius:12px;padding:20px;text-align:center;color:var(--red);font-family:var(--fb);">
        <div style="font-size:24px;margin-bottom:8px;">⚠️</div>
        <div style="font-size:16px;font-weight:700;margin-bottom:4px;">Error al conectar con la IA</div>
        <div style="font-size:12px;color:var(--muted);font-family:var(--fs);">
          Verifica que Firebase esté configurado y la API key de Anthropic sea válida.
          <br>Error: ${err.message}
        </div>
        <button onclick="runPredictor()" style="margin-top:14px;padding:8px 20px;border-radius:7px;
          border:1px solid var(--red);background:transparent;color:var(--red);
          font-family:var(--fb);cursor:pointer;">Reintentar</button>
      </div>`;
  } finally {
    predState.loading = false;
    if(btn) btn.disabled = false;
  }
};

// ── RENDER RESULT ─────────────────────────────────────────
function renderPredResult(data) {
  const wrap = document.getElementById('pred-result-wrap');
  if(!wrap) return;

  if(predState.mode === 'champion') renderChampionResult(wrap, data);
  else if(predState.mode === 'match') renderMatchResult(wrap, data);
  else renderGroupResult(wrap, data);
}

function renderMatchResult(wrap, d) {
  const tA = predState.teamA;
  const tB = predState.teamB;
  const isDraw = d.winner === 'EMPATE' || d.score_home === d.score_away;
  const homeWin = !isDraw && d.winner === tA.name;

  // Parse analysis paragraphs
  const paragraphs = (d.analysis||'').split('\n\n').filter(Boolean);

  const statsRows = [
    {label:'RANKING FIFA', l:`#${d.stats?.ranking_home||tA.ranking}`, r:`#${d.stats?.ranking_away||tB.ranking}`,
     valL:100-((d.stats?.ranking_home||tA.ranking)/48*100), valR:100-((d.stats?.ranking_away||tB.ranking)/48*100)},
    {label:'MUNDIALES', l:d.stats?.worldcups_home||tA.world_cups, r:d.stats?.worldcups_away||tB.world_cups,
     valL:Math.min((d.stats?.worldcups_home||tA.world_cups)/23*100,100), valR:Math.min((d.stats?.worldcups_away||tB.world_cups)/23*100,100)},
    {label:'POSESIÓN EST.', l:(d.stats?.possession_home||50)+'%', r:(100-(d.stats?.possession_home||50))+'%',
     valL:d.stats?.possession_home||50, valR:100-(d.stats?.possession_home||50)},
    {label:'TIROS AL ARCO', l:d.stats?.shots_home||5, r:d.stats?.shots_away||5,
     valL:Math.min((d.stats?.shots_home||5)/15*100,100), valR:Math.min((d.stats?.shots_away||5)/15*100,100)},
  ];

  wrap.innerHTML = `<div class="pred-result">
    <div class="pred-result-header">
      <div class="pred-result-title">ANÁLISIS DEL PARTIDO</div>
      <span class="ai-badge">CLAUDE AI</span>
    </div>

    <!-- Score -->
    <div class="pred-score-box">
      <div class="pred-score-team">
        <img class="pred-score-flag2" src="https://flagcdn.com/${tA.flag}.svg" onerror="this.style.display='none'">
        <div class="pred-score-name">${tA.name}</div>
      </div>
      <div style="text-align:center;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="pred-score-num" style="color:${homeWin?'var(--green)':isDraw?'var(--gold)':'var(--muted)'}">${d.score_home??'-'}</div>
          <div class="pred-score-sep">—</div>
          <div class="pred-score-num" style="color:${!homeWin&&!isDraw?'var(--green)':isDraw?'var(--gold)':'var(--muted)'}">${d.score_away??'-'}</div>
        </div>
        <div style="font-size:9px;font-family:var(--fm);color:var(--muted);margin-top:3px;">MARCADOR PREDICHO</div>
      </div>
      <div class="pred-score-team">
        <img class="pred-score-flag2" src="https://flagcdn.com/${tB.flag}.svg" onerror="this.style.display='none'">
        <div class="pred-score-name">${tB.name}</div>
      </div>
    </div>

    <!-- Probabilities -->
    <div style="display:flex;padding:12px 24px;gap:0;border-bottom:1px solid var(--border);">
      ${[
        {label:tA.name, pct:d.probability_home||0, color:'var(--red)'},
        {label:'EMPATE',    pct:d.probability_draw||0, color:'var(--muted)'},
        {label:tB.name, pct:d.probability_away||0, color:'var(--blue)'},
      ].map(item => `
        <div style="flex:1;text-align:center;padding:8px 4px;border-right:1px solid var(--border);" >
          <div style="font-family:var(--fd);font-size:22px;color:${item.color}">${item.pct}%</div>
          <div style="font-size:8px;font-family:var(--fm);color:var(--muted);letter-spacing:1px;margin-top:1px;">${item.label}</div>
        </div>`).join('')}
      <div style="flex:1;text-align:center;padding:8px 4px;">
        <div style="font-size:9px;font-family:var(--fm);color:var(--muted);margin-bottom:4px;">FIGURA LOCAL</div>
        <div style="font-size:11px;font-family:var(--fb);font-weight:700;">${d.key_player_home||'—'}</div>
        <div style="font-size:9px;font-family:var(--fm);color:var(--muted);margin-top:6px;margin-bottom:2px;">FIGURA VISITANTE</div>
        <div style="font-size:11px;font-family:var(--fb);font-weight:700;">${d.key_player_away||'—'}</div>
      </div>
    </div>

    <!-- Stats comparison -->
    <div class="pred-stats-grid">
      ${statsRows.map(row => `
        <div style="text-align:right;font-size:13px;font-family:var(--fb);font-weight:600;padding:5px 8px;color:var(--red);">${row.l}</div>
        <div style="text-align:center;font-size:9px;font-family:var(--fm);letter-spacing:1px;color:var(--muted);padding:5px 0;display:flex;align-items:center;justify-content:center;">${row.label}</div>
        <div style="text-align:left;font-size:13px;font-family:var(--fb);font-weight:600;padding:5px 8px;color:var(--blue);">${row.r}</div>
        <div style="grid-column:1/-1;height:4px;background:var(--border);border-radius:2px;margin:1px 0 8px;overflow:hidden;position:relative;">
          <div style="position:absolute;right:50%;top:0;bottom:0;border-radius:2px 0 0 2px;background:var(--red);width:${Math.min(row.valL,50)}%;"></div>
          <div style="position:absolute;left:50%;top:0;bottom:0;border-radius:0 2px 2px 0;background:var(--blue);width:${Math.min(row.valR,50)}%;"></div>
        </div>`).join('')}
    </div>

    <!-- Analysis -->
    <div class="pred-analysis">
      ${paragraphs.map(p=>`<p>${p}</p>`).join('')}
    </div>

    <!-- Key factors -->
    <div class="pred-factors">
      <div class="pred-factors-title">FACTORES CLAVE</div>
      ${(d.factors||[]).map((f,i)=>`
        <div class="pred-factor">
          <span class="pred-factor-ico">${['⚔️','🛡️','🎯','⚡'][i]||'→'}</span>${f}
        </div>`).join('')}
    </div>
  </div>

  <div class="pred-actions">
    <button class="pred-action-btn" onclick="sharePrediction()">📤 Compartir predicción</button>
    <button class="pred-action-btn primary" onclick="runPredictor()">🔄 Nueva predicción</button>
  </div>`;
}

function renderChampionResult(wrap, d) {
  const paragraphs = (d.analysis||'').split('\n\n').filter(Boolean);

  wrap.innerHTML = `<div class="pred-result">
    <div class="pred-result-header">
      <div class="pred-result-title">PREDICCIÓN: CAMPEÓN MUNDIAL 2026</div>
      <span class="ai-badge">CLAUDE AI</span>
    </div>

    <!-- Winner banner -->
    <div class="pred-winner-banner">
      <img class="pred-winner-flag" src="https://flagcdn.com/${d.winner_flag||'un'}.svg" onerror="this.style.display='none'">
      <div class="pred-winner-info">
        <div class="pred-winner-label">🏆 CAMPEÓN PREDICHO</div>
        <div class="pred-winner-name">${d.winner||'—'}</div>
      </div>
      <div>
        <div class="pred-winner-prob">${d.probability||'—'}</div>
        <div class="pred-winner-prob-label">PROBABILIDAD</div>
      </div>
    </div>

    <!-- Final score -->
    <div class="pred-score-box">
      <div class="pred-score-team">
        <img class="pred-score-flag2" src="https://flagcdn.com/${d.winner_flag||'un'}.svg" onerror="this.style.display='none'">
        <div class="pred-score-name" style="font-size:11px;">${d.winner||'—'}</div>
      </div>
      <div style="text-align:center;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="pred-score-num" style="color:var(--green)">${d.score_winner??'-'}</div>
          <div class="pred-score-sep">—</div>
          <div class="pred-score-num" style="color:var(--muted)">${d.score_finalist??'-'}</div>
        </div>
        <div style="font-size:9px;font-family:var(--fm);color:var(--muted);margin-top:3px;">FINAL PREDICHA</div>
      </div>
      <div class="pred-score-team">
        <img class="pred-score-flag2" src="https://flagcdn.com/${d.finalist_flag||'un'}.svg" onerror="this.style.display='none'">
        <div class="pred-score-name" style="font-size:11px;">${d.finalist||'—'}</div>
      </div>
    </div>

    <!-- Semifinalists + dark horse -->
    <div style="display:flex;gap:0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
      <div style="flex:1;padding:12px 16px;border-right:1px solid var(--border);">
        <div style="font-size:9px;font-family:var(--fm);letter-spacing:2px;color:var(--muted);margin-bottom:8px;">SEMIFINALISTAS</div>
        ${(d.semifinalists||[]).map(s=>`<div style="font-size:12px;font-family:var(--fb);font-weight:600;margin-bottom:4px;">🔹 ${s}</div>`).join('')}
      </div>
      <div style="flex:1;padding:12px 16px;">
        <div style="font-size:9px;font-family:var(--fm);letter-spacing:2px;color:var(--muted);margin-bottom:8px;">DARK HORSE 🎯</div>
        <div style="font-size:13px;font-family:var(--fb);font-weight:700;color:var(--gold);">${d.dark_horse||'—'}</div>
      </div>
    </div>

    <!-- Analysis -->
    <div class="pred-analysis">
      ${paragraphs.map(p=>`<p>${p}</p>`).join('')}
    </div>

    <!-- Factors -->
    <div class="pred-factors">
      <div class="pred-factors-title">CLAVES PARA EL TÍTULO</div>
      ${(d.factors||[]).map((f,i)=>`
        <div class="pred-factor">
          <span class="pred-factor-ico">${['🏆','⭐','💪','🎯'][i]||'→'}</span>${f}
        </div>`).join('')}
    </div>
  </div>

  <div class="pred-actions">
    <button class="pred-action-btn" onclick="sharePrediction()">📤 Compartir</button>
    <button class="pred-action-btn primary" onclick="runPredictor()">🔄 Nuevo análisis</button>
  </div>`;
}

function renderGroupResult(wrap, d) {
  const groupCountries = COUNTRIES.filter(c => c.group === (predState.teamA?.group || 'A'));
  const paragraphs = (d.analysis||'').split('\n\n').filter(Boolean);

  wrap.innerHTML = `<div class="pred-result">
    <div class="pred-result-header">
      <div class="pred-result-title">PREDICCIÓN GRUPO ${predState.teamA?.group||'A'}</div>
      <span class="ai-badge">CLAUDE AI</span>
    </div>

    <!-- Predicted table -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--border);">
      <div style="font-size:9px;font-family:var(--fm);letter-spacing:2px;color:var(--muted);margin-bottom:12px;">TABLA PREDICHA</div>
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr>
          <th style="font-size:9px;font-family:var(--fm);color:var(--muted);text-align:left;padding:4px 8px;border-bottom:1px solid var(--border);">#</th>
          <th style="font-size:9px;font-family:var(--fm);color:var(--muted);text-align:left;padding:4px 8px;border-bottom:1px solid var(--border);">EQUIPO</th>
          <th style="font-size:9px;font-family:var(--fm);color:var(--muted);text-align:center;padding:4px 8px;border-bottom:1px solid var(--border);">PTS</th>
          <th style="font-size:9px;font-family:var(--fm);color:var(--muted);text-align:center;padding:4px 8px;border-bottom:1px solid var(--border);">GF</th>
          <th style="font-size:9px;font-family:var(--fm);color:var(--muted);text-align:center;padding:4px 8px;border-bottom:1px solid var(--border);">GC</th>
          <th style="font-size:9px;font-family:var(--fm);color:var(--muted);text-align:center;padding:4px 8px;border-bottom:1px solid var(--border);">DIF</th>
        </tr></thead>
        <tbody>
          ${(d.standings||[]).map((s,i)=>{
            const country = COUNTRIES.find(c=>c.name===s.team||c.code===s.flag);
            const flag = s.flag || country?.flag || '';
            return `<tr style="${i<2?'background:rgba(0,166,80,0.04);':''}">
              <td style="padding:7px 8px;font-size:11px;font-family:var(--fm);color:${i<2?'var(--green)':'var(--muted)'};">${i+1}</td>
              <td style="padding:7px 8px;">
                <div style="display:flex;align-items:center;gap:7px;">
                  <img src="https://flagcdn.com/${flag}.svg" style="width:18px;height:13px;object-fit:cover;border-radius:2px;" onerror="this.style.display='none'">
                  <span style="font-size:12px;font-family:var(--fb);font-weight:700;">${s.team}</span>
                  ${i<2?'<span style="font-size:8px;background:rgba(0,166,80,.15);color:var(--green);padding:1px 5px;border-radius:3px;font-family:var(--fm);">CLASIFICA</span>':''}
                </div>
              </td>
              <td style="text-align:center;font-family:var(--fd);font-size:16px;color:${i<2?'var(--green)':'var(--text)'};">${s.pts}</td>
              <td style="text-align:center;font-size:12px;font-family:var(--fm);">${s.gf}</td>
              <td style="text-align:center;font-size:12px;font-family:var(--fm);">${s.gc}</td>
              <td style="text-align:center;font-size:12px;font-family:var(--fm);color:${(s.gf-s.gc)>=0?'var(--green)':'var(--red)'};">${(s.gf-s.gc)>=0?'+':''}${s.gf-s.gc}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Key match + dark horse -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--border);">
      <div style="flex:1;padding:12px 16px;border-right:1px solid var(--border);">
        <div style="font-size:9px;font-family:var(--fm);letter-spacing:2px;color:var(--muted);margin-bottom:6px;">PARTIDO CLAVE ⚡</div>
        <div style="font-size:12px;font-family:var(--fs);line-height:1.5;">${d.key_match||'—'}</div>
      </div>
      <div style="flex:1;padding:12px 16px;">
        <div style="font-size:9px;font-family:var(--fm);letter-spacing:2px;color:var(--muted);margin-bottom:6px;">SORPRESA 🎯</div>
        <div style="font-size:13px;font-family:var(--fb);font-weight:700;color:var(--gold);">${d.dark_horse||'—'}</div>
      </div>
    </div>

    <div class="pred-analysis">
      ${paragraphs.map(p=>`<p>${p}</p>`).join('')}
    </div>

    <div class="pred-factors">
      <div class="pred-factors-title">FACTORES DEL GRUPO</div>
      ${(d.factors||[]).map((f,i)=>`
        <div class="pred-factor">
          <span class="pred-factor-ico">${['📊','⚽','🔥','🎯'][i]||'→'}</span>${f}
        </div>`).join('')}
    </div>
  </div>

  <div class="pred-actions">
    <button class="pred-action-btn" onclick="sharePrediction()">📤 Compartir</button>
    <button class="pred-action-btn primary" onclick="runPredictor()">🔄 Nuevo análisis</button>
  </div>`;
}

window.sharePrediction = function() {
  const d = predState.result;
  if(!d) return;
  let text = '';
  if(predState.mode==='champion') {
    text = `🏆 Predicción IA — Mundial 2026\n\nCampeón: ${d.winner} (${d.probability})\nFinalista: ${d.finalist}\nMarcador: ${d.score_winner}-${d.score_finalist}\nDark horse: ${d.dark_horse}\n\n#AlbumMundial2026 #FIFAWorldCup2026`;
  } else if(predState.mode==='match') {
    text = `⚽ Predicción IA — ${predState.teamA?.name} vs ${predState.teamB?.name}\nMarcador: ${d.score_home}-${d.score_away}\nGanador: ${d.winner}\n\n#AlbumMundial2026`;
  } else {
    text = `📊 Predicción IA — Grupo ${predState.teamA?.group}\n${(d.standings||[]).map((s,i)=>`${i+1}. ${s.team} (${s.pts}pts)`).join('\n')}\n\n#AlbumMundial2026`;
  }
  navigator.clipboard.writeText(text)
    .then(()=>toast('Predicción copiada ✓','success'))
    .catch(()=>toast('No se pudo copiar'));
};

function renderTrivia(page) {
  try { triviaState.bestScore = parseInt(localStorage.getItem('trivia26_best') || '0'); } catch(e){}
  if(triviaState.timerInterval) { clearInterval(triviaState.timerInterval); triviaState.timerInterval = null; }

  if(triviaState.phase === 'game') { renderTriviaGame(page); return; }
  if(triviaState.phase === 'results') { renderTriviaResults(page); return; }

  page.innerHTML = `<div class="trivia-lobby page-enter">
    <div class="trivia-hero">
      <h2>TRIVIA<br>MUNDIALISTA</h2>
      <p>Pon a prueba tu conocimiento del fútbol mundial. Historia, jugadores, estadios y más.</p>
      ${triviaState.bestScore ? `<div style="margin-top:10px;font-family:var(--fm);font-size:11px;color:var(--gold);">🏆 Tu récord: ${triviaState.bestScore} pts</div>` : ''}
    </div>

    <div style="font-size:9px;letter-spacing:2px;color:var(--muted);font-family:var(--fm);margin-bottom:14px;align-self:flex-start;">MODO DE JUEGO</div>
    <div class="trivia-modes">
      ${TRIVIA_MODES.map(m => `
        <div class="trivia-mode-card${triviaState.mode===m.id?' selected':''}" onclick="selectTriviaMode('${m.id}')">
          <div class="tmc-icon">${m.icon}</div>
          <div class="tmc-name">${m.name}</div>
          <div class="tmc-desc">${m.desc}</div>
          <span class="tmc-badge" style="background:${m.badgeColor};color:var(--${m.badgeText})">${m.badge}</span>
        </div>`).join('')}
    </div>

    <div style="font-size:9px;letter-spacing:2px;color:var(--muted);font-family:var(--fm);margin-bottom:14px;align-self:flex-start;">CATEGORÍA</div>
    <div class="trivia-cats">
      ${TRIVIA_CATS.map(c => `
        <button class="trivia-cat-btn${triviaState.category===c.id?' active':''}" onclick="selectTriviaCat('${c.id}')">${c.label}</button>`
      ).join('')}
    </div>

    <button class="trivia-start-btn" onclick="startTrivia()">COMENZAR</button>
  </div>`;
}

window.selectTriviaMode = function(id) {
  triviaState.mode = id;
  document.querySelectorAll('.trivia-mode-card').forEach((c,i) => {
    c.classList.toggle('selected', TRIVIA_MODES[i].id === id);
  });
};

window.selectTriviaCat = function(id) {
  triviaState.category = id;
  document.querySelectorAll('.trivia-cat-btn').forEach(b => {
    b.classList.toggle('active', b.textContent === TRIVIA_CATS.find(c=>c.id===id)?.label);
  });
};

window.startTrivia = function() {
  const modeConfig = {
    rapido:  {count:10, time:15, lives:0},
    clasico: {count:15, time:30, lives:3},
    experto: {count:20, time:20, lives:1},
    infinito:{count:999,time:0,  lives:0},
  };
  const cfg = modeConfig[triviaState.mode];
  let pool = triviaState.category === 'mix'
    ? [...TRIVIA_BANK]
    : TRIVIA_BANK.filter(q => q.cat === triviaState.category);

  if(triviaState.mode === 'experto') pool = pool.filter(q => q.diff === 'hard');

  // Shuffle
  pool = pool.sort(() => Math.random() - 0.5);
  triviaState.questions = pool.slice(0, Math.min(cfg.count, pool.length));
  triviaState.current = 0;
  triviaState.answers = [];
  triviaState.score = 0;
  triviaState.lives = cfg.lives;
  triviaState.timeLeft = cfg.time;
  triviaState.streak = 0;
  triviaState.phase = 'game';
  renderTriviaGame(document.getElementById('page'));
};

// ── GAME ──────────────────────────────────────────────────
function renderTriviaGame(page) {
  const cfg = {rapido:{time:15},clasico:{time:30},experto:{time:20},infinito:{time:0}};
  const timeMax = cfg[triviaState.mode]?.time || 0;
  const q = triviaState.questions[triviaState.current];
  if(!q) { triviaState.phase='results'; renderTriviaResults(page); return; }

  const catLabel = TRIVIA_CATS.find(c=>c.id===q.cat)?.label || q.cat;
  const diffMap = {easy:'FÁCIL',medium:'MEDIA',hard:'DIFÍCIL'};
  const total = triviaState.questions.length === 999 ? '∞' : triviaState.questions.length;
  const livesHTML = triviaState.lives > 0
    ? Array.from({length:3}).map((_,i)=>i<triviaState.lives?'❤️':'🖤').join('')
    : '';

  page.innerHTML = `<div class="trivia-game page-enter cat-${q.cat}">
    <div class="trivia-hud">
      <div class="hud-cell">
        <div class="hud-val gold">${triviaState.score}</div>
        <div class="hud-lbl">PUNTOS</div>
      </div>
      <div class="hud-cell">
        <div class="hud-val">${triviaState.current+1}<span style="font-size:14px;color:var(--muted)">/${total}</span></div>
        <div class="hud-lbl">PREGUNTA</div>
      </div>
      <div class="hud-cell">
        <div class="hud-val green">${triviaState.streak}<span style="font-size:14px;">🔥</span></div>
        <div class="hud-lbl">RACHA</div>
      </div>
      ${triviaState.lives > 0 ? `<div class="hud-cell"><div class="hud-val" style="font-size:18px;">${livesHTML}</div><div class="hud-lbl">VIDAS</div></div>` : ''}
      ${timeMax > 0 ? `<div class="hud-cell"><div class="hud-val red" id="hud-timer">${timeMax}</div><div class="hud-lbl">SEG</div></div>` : ''}
    </div>

    ${timeMax > 0 ? `<div class="trivia-timer-wrap"><div class="trivia-timer-bar" id="timer-bar" style="width:100%"></div></div>` : ''}

    <div class="trivia-progress">
      ${triviaState.questions.map((_,i) => {
        const a = triviaState.answers[i];
        let cls = i === triviaState.current ? 'current' : (a ? (a.correct?'correct':'wrong') : '');
        return `<div class="prog-dot ${cls}"></div>`;
      }).join('')}
    </div>

    <div class="trivia-q-card">
      <div class="trivia-q-meta">
        <span class="trivia-q-cat">${catLabel}</span>
        <span class="trivia-q-diff diff-${q.diff}">${diffMap[q.diff]}</span>
        <span class="trivia-q-num">${q.pts} pts</span>
      </div>
      <div class="trivia-q-text">${q.q}</div>
    </div>

    <div class="trivia-opts" id="trivia-opts">
      ${q.opts.map((opt,i) => `
        <button class="trivia-opt" onclick="answerTrivia(${i})" id="opt-${i}">
          <span class="opt-key">${'ABCD'[i]}</span>${opt}
        </button>`).join('')}
    </div>

    <div class="trivia-feedback" id="trivia-feedback">
      <div class="tf-icon" id="tf-icon"></div>
      <div>
        <div class="tf-title" id="tf-title"></div>
        <div class="tf-explain" id="tf-explain"></div>
        <div class="tf-pts" id="tf-pts"></div>
      </div>
    </div>

    <button class="trivia-next-btn" id="trivia-next" onclick="nextTriviaQ()">
      ${triviaState.current + 1 >= triviaState.questions.length ? 'VER RESULTADOS ›' : 'SIGUIENTE ›'}
    </button>
  </div>`;

  // Start timer
  if(timeMax > 0) {
    triviaState.timeLeft = timeMax;
    if(triviaState.timerInterval) clearInterval(triviaState.timerInterval);
    triviaState.timerInterval = setInterval(() => {
      triviaState.timeLeft--;
      const hud = document.getElementById('hud-timer');
      const bar = document.getElementById('timer-bar');
      if(hud) hud.textContent = triviaState.timeLeft;
      if(bar) {
        const pct = (triviaState.timeLeft / timeMax) * 100;
        bar.style.width = pct + '%';
        if(pct < 30) bar.classList.add('danger');
      }
      if(triviaState.timeLeft <= 0) {
        clearInterval(triviaState.timerInterval);
        answerTrivia(-1); // Time out = wrong
      }
    }, 1000);
  }

  // Keyboard shortcuts
  document.onkeydown = (e) => {
    const map = {'a':0,'b':1,'c':2,'d':3,'1':0,'2':1,'3':2,'4':3};
    const k = e.key.toLowerCase();
    if(k in map) answerTrivia(map[k]);
    if(k === 'enter' || k === ' ') {
      const btn = document.getElementById('trivia-next');
      if(btn && btn.classList.contains('show')) nextTriviaQ();
    }
  };
}

window.answerTrivia = function(chosen) {
  // Stop if already answered
  const opts = document.querySelectorAll('.trivia-opt');
  if(!opts.length || opts[0].disabled) return;

  if(triviaState.timerInterval) { clearInterval(triviaState.timerInterval); triviaState.timerInterval = null; }

  const q = triviaState.questions[triviaState.current];
  const correct = chosen === q.ans;
  const timeBonus = triviaState.mode !== 'infinito' ? Math.floor(triviaState.timeLeft * 0.5) : 0;
  const streakBonus = correct ? triviaState.streak * 5 : 0;
  const ptsEarned = correct ? q.pts + timeBonus + streakBonus : 0;

  if(correct) {
    triviaState.score += ptsEarned;
    triviaState.streak++;
  } else {
    triviaState.streak = 0;
    if(triviaState.lives > 0) triviaState.lives--;
  }

  triviaState.answers[triviaState.current] = {qid: q.id, correct, chosen, pts: ptsEarned};

  // Style options
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if(i === q.ans) btn.classList.add('correct');
    else if(i === chosen && !correct) btn.classList.add('wrong');
    else if(chosen === -1 && i !== q.ans) btn.classList.add('missed');
  });

  // Feedback
  const fb = document.getElementById('trivia-feedback');
  const fbIcon = document.getElementById('tf-icon');
  const fbTitle = document.getElementById('tf-title');
  const fbExplain = document.getElementById('tf-explain');
  const fbPts = document.getElementById('tf-pts');
  if(fb) {
    fb.classList.add('show');
    if(chosen === -1) {
      fbIcon.textContent = '⏰';
      fbTitle.textContent = '¡TIEMPO!';
      fbTitle.className = 'tf-title wrong';
      fbPts.textContent = '';
    } else if(correct) {
      const msgs = ['¡CORRECTO!','¡EXACTO!','¡MUY BIEN!','¡BRILLANTE!'];
      fbIcon.textContent = triviaState.streak >= 3 ? '🔥' : '✅';
      fbTitle.textContent = msgs[Math.floor(Math.random()*msgs.length)];
      fbTitle.className = 'tf-title correct';
      fbPts.textContent = `+${ptsEarned} pts${timeBonus?` (${timeBonus} tiempo)`:''}${streakBonus?` (×${triviaState.streak} racha)`:''}`;
    } else {
      fbIcon.textContent = '❌';
      fbTitle.textContent = 'INCORRECTO';
      fbTitle.className = 'tf-title wrong';
      fbPts.textContent = '';
    }
    fbExplain.textContent = q.explain;
  }

  // Update progress dots
  document.querySelectorAll('.prog-dot').forEach((d,i) => {
    if(i < triviaState.current) {
      const a = triviaState.answers[i];
      d.className = 'prog-dot ' + (a?.correct ? 'correct' : 'wrong');
    }
  });

  const nextBtn = document.getElementById('trivia-next');
  if(nextBtn) nextBtn.classList.add('show');

  // Game over if no lives left
  if(triviaState.lives === 0 && triviaState.mode !== 'infinito' && !correct) {
    setTimeout(() => { triviaState.phase='results'; renderTriviaResults(document.getElementById('page')); }, 1800);
    return;
  }
};

window.nextTriviaQ = function() {
  triviaState.current++;
  if(triviaState.current >= triviaState.questions.length) {
    triviaState.phase = 'results';
    renderTriviaResults(document.getElementById('page'));
    return;
  }
  renderTriviaGame(document.getElementById('page'));
};

// ── RESULTS ──────────────────────────────────────────────────
function renderTriviaResults(page) {
  document.onkeydown = null;
  if(triviaState.timerInterval) { clearInterval(triviaState.timerInterval); triviaState.timerInterval = null; }

  const answered = triviaState.answers.filter(Boolean);
  const correct = answered.filter(a=>a.correct).length;
  const wrong = answered.filter(a=>!a.correct).length;
  const pct = answered.length ? Math.round((correct/answered.length)*100) : 0;
  const score = triviaState.score;

  if(score > triviaState.bestScore) {
    triviaState.bestScore = score;
    try { localStorage.setItem('trivia26_best', score); } catch(e){}
  }

  const trophy = pct >= 90?'🏆':pct>=70?'🥇':pct>=50?'🥈':pct>=30?'🥉':'😅';
  const title  = pct >= 90?'EXPERTO MUNDIAL':pct>=70?'GRAN FANÁTICO':pct>=50?'AFICIONADO':pct>=30?'APRENDIZ':'NOVATO';

  // Review list
  const reviewHTML = answered.map((a,i) => {
    const q = TRIVIA_BANK.find(x=>x.id===a.qid);
    if(!q) return '';
    return `<div class="review-item">
      <div class="review-ico">${a.correct?'✅':'❌'}</div>
      <div>
        <div class="review-q">${q.q}</div>
        <div class="review-a">Respuesta correcta: <strong>${q.opts[q.ans]}</strong>${!a.correct&&a.chosen>=0?` · Elegiste: ${q.opts[a.chosen]}`:''}</div>
      </div>
    </div>`;
  }).join('');

  page.innerHTML = `<div class="trivia-results page-enter">
    <div class="results-trophy">${trophy}</div>
    <div class="results-title">${title}</div>
    <div class="results-score">${score}</div>
    <div class="results-label">PUNTOS TOTALES · RÉCORD: ${triviaState.bestScore}</div>

    <div class="results-grid">
      <div class="results-stat">
        <div class="n" style="color:var(--green)">${correct}</div>
        <div class="l">CORRECTAS</div>
      </div>
      <div class="results-stat">
        <div class="n" style="color:var(--red)">${wrong}</div>
        <div class="l">FALLADAS</div>
      </div>
      <div class="results-stat">
        <div class="n" style="color:var(--gold)">${pct}%</div>
        <div class="l">PRECISIÓN</div>
      </div>
    </div>

    <div class="results-review">${reviewHTML || '<div style="color:var(--muted);text-align:center;padding:12px;font-family:var(--fs);font-size:13px;">Sin preguntas respondidas</div>'}</div>

    <div class="results-btns">
      <button class="res-btn primary" onclick="triviaState.phase='lobby';triviaState.questions=[];renderTrivia(document.getElementById('page'))">JUGAR DE NUEVO</button>
      <button class="res-btn secondary" onclick="navigate('home')">AL ÁLBUM</button>
    </div>
  </div>`;
}

function renderLineup(page) {
  // Init slots if empty or formation changed
  if(!lineupState.slots.length) {
    lineupState.slots = buildSlots(lineupState.formation);
  }
  // Load saved lineups from localStorage
  try {
    lineupState.savedLineups = JSON.parse(localStorage.getItem('album26_lineups') || '[]');
  } catch(e) { lineupState.savedLineups = []; }

  page.innerHTML = `<div class="page-enter">
    <div style="margin-bottom:20px;">
      <div style="font-family:var(--fd);font-size:40px;letter-spacing:3px;">MI 11 IDEAL</div>
      <div style="font-size:11px;color:var(--muted);font-family:var(--fm);margin-top:3px;">
        Solo puedes colocar jugadores que ya tienes en tu álbum · Elige la formación y arma tu equipo
      </div>
    </div>
    <div class="lineup-wrap" id="lineup-wrap">
      <div>
        <div class="pitch-outer">
          <div class="pitch-formation-bar">
            <span class="label">FORMACIÓN</span>
            ${Object.keys(FORMATIONS).map(f =>
              `<button class="formation-btn${f===lineupState.formation?' active':''}"
                onclick="changeFormation('${f}')">${f}</button>`
            ).join('')}
          </div>
          <div class="pitch" id="pitch-field"></div>
          <div class="lineup-rating" id="lineup-rating-bar">
            <div>
              <div class="rating-num" id="rating-num">--</div>
              <div class="rating-label">VALORACIÓN</div>
            </div>
            <div style="margin-left:4px;">
              <div class="rating-stars" id="rating-stars">☆☆☆☆☆</div>
              <div style="font-size:9px;color:var(--muted);font-family:var(--fm);margin-top:2px;" id="rating-desc">Selecciona jugadores</div>
            </div>
            <div style="margin-left:auto;font-size:10px;font-family:var(--fm);color:var(--muted);" id="filled-count">0/11</div>
          </div>
        </div>

        <div class="lineup-actions">
          <input class="lineup-name-input" id="lineup-name-inp" type="text"
            placeholder="Nombre de tu equipo…" value="${lineupState.name}"
            oninput="lineupState.name=this.value">
          <button class="tb-btn gold" onclick="saveLineup()">💾 Guardar equipo</button>
          <button class="tb-btn" onclick="clearLineup()">🗑 Limpiar</button>
          <button class="tb-btn" onclick="shareLineup()">📤 Compartir</button>
        </div>

        <div class="lineup-saved-list" id="saved-list"></div>
      </div>

      <div class="picker-panel" id="picker-panel">
        <div class="picker-header">
          <div class="picker-title">JUGADORES</div>
          <div id="picker-slot-info" style="display:none;" class="picker-slot-target">
            Seleccionando posición — elige un jugador
          </div>
          <input class="picker-search" id="picker-search" type="text"
            placeholder="🔍  Buscar jugador o país…"
            oninput="lineupState.search=this.value;refreshPickerList()">
          <div class="picker-filters">
            <span class="label" style="font-size:9px;color:var(--muted);font-family:var(--fm);align-self:center;">POS:</span>
            ${['ALL','POR','DEF','MED','DEL'].map(p =>
              `<button class="filter-btn${p===lineupState.filterPos?' active':''}"
                onclick="setFilterPos('${p}')">${p}</button>`
            ).join('')}
            <button class="filter-btn${lineupState.filterOwned?' active':''}"
              onclick="toggleFilterOwned()" style="margin-left:auto;">
              ${lineupState.filterOwned ? '🔒 Tengo' : '🌐 Todos'}
            </button>
          </div>
        </div>
        <div class="picker-list" id="picker-list"></div>
      </div>
    </div>
  </div>`;

  renderPitch();
  refreshPickerList();
  renderSavedList();
  updateRating();
}

function renderPitch() {
  const field = document.getElementById('pitch-field');
  if(!field) return;

  field.innerHTML = lineupState.slots.map((slot, i) => {
    const filled = !!slot.player;
    const p = slot.player;
    const isTarget = lineupState.selectedSlot &&
      lineupState.selectedSlot.posKey === slot.posKey &&
      lineupState.selectedSlot.slotIdx === slot.slotIdx;

    return `<div class="pitch-slot${filled?' filled':''}${filled?' '+p.rarity:''}${isTarget?' slot-target':''}"
      style="left:${slot.x}%;top:${slot.y}%;"
      onclick="clickPitchSlot(${i})"
      title="${filled ? p.name : 'Añadir '+slot.posKey}">
      <div class="pitch-circle" style="${isTarget?'border-color:var(--gold);box-shadow:0 0 0 3px rgba(239,159,39,0.4);':''}">
        ${filled
          ? `<span class="pitch-player-emoji">${p.e}</span>
             <div class="pitch-remove" onclick="event.stopPropagation();removeFromSlot(${i})">✕</div>`
          : `<span class="pitch-add">${isTarget?'👆':'+'}
             </span>`}
      </div>
      <div class="pitch-name-tag">${filled ? p.name.split(' ').pop() : slot.posKey}</div>
      ${filled ? `<div class="pitch-pos-tag pos-tag-${p.pos}">${p.pos}</div>` : ''}
    </div>`;
  }).join('');
}

function clickPitchSlot(i) {
  const slot = lineupState.slots[i];
  if(slot.player) {
    // If already has player, clicking opens replacement
    lineupState.selectedSlot = {posKey: slot.posKey, slotIdx: slot.slotIdx, slotArrayIdx: i};
    showSlotInfo(`Reemplazar ${slot.player.name} · posición ${slot.posKey}`);
  } else {
    lineupState.selectedSlot = {posKey: slot.posKey, slotIdx: slot.slotIdx, slotArrayIdx: i};
    showSlotInfo(`Selecciona un ${slot.posKey} para esta posición`);
  }
  lineupState.filterPos = slot.posKey;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.textContent === slot.posKey);
  });
  refreshPickerList();
  renderPitch();
}

function showSlotInfo(msg) {
  const el = document.getElementById('picker-slot-info');
  if(el) { el.style.display='block'; el.textContent = msg; }
}

window.removeFromSlot = function(i) {
  lineupState.slots[i].player = null;
  lineupState.selectedSlot = null;
  const el = document.getElementById('picker-slot-info');
  if(el) el.style.display='none';
  renderPitch();
  refreshPickerList();
  updateRating();
};

window.changeFormation = function(f) {
  // Keep placed players, rebuild slots
  const oldPlayers = lineupState.slots.filter(s=>s.player).map(s=>s.player);
  lineupState.formation = f;
  lineupState.slots = buildSlots(f);
  lineupState.selectedSlot = null;

  // Re-place players by position
  oldPlayers.forEach(p => {
    const slot = lineupState.slots.find(s => s.posKey === p.pos && !s.player);
    if(slot) slot.player = p;
  });

  renderLineup(document.getElementById('page'));
};

window.setFilterPos = function(pos) {
  lineupState.filterPos = pos;
  document.querySelectorAll('.filter-btn').forEach(b => {
    if(['ALL','POR','DEF','MED','DEL'].includes(b.textContent)) {
      b.classList.toggle('active', b.textContent === pos);
    }
  });
  refreshPickerList();
};

window.toggleFilterOwned = function() {
  lineupState.filterOwned = !lineupState.filterOwned;
  const btn = document.querySelector('.filter-btn[onclick="toggleFilterOwned()"]');
  if(btn) {
    btn.classList.toggle('active', lineupState.filterOwned);
    btn.textContent = lineupState.filterOwned ? '🔒 Tengo' : '🌐 Todos';
  }
  refreshPickerList();
};

function refreshPickerList() {
  const list = document.getElementById('picker-list');
  if(!list) return;

  const usedIds = new Set(lineupState.slots.filter(s=>s.player).map(s=>s.player.id));
  let players = getPlayersList();

  if(lineupState.filterPos !== 'ALL')
    players = players.filter(p => p.pos === lineupState.filterPos);
  if(lineupState.search.trim())
    players = players.filter(p =>
      p.name.toLowerCase().includes(lineupState.search.toLowerCase()) ||
      p.countryName.toLowerCase().includes(lineupState.search.toLowerCase()) ||
      p.club.toLowerCase().includes(lineupState.search.toLowerCase())
    );

  // Sort: owned first, then by rarity weight
  const rarityOrder = {icon:0,legendary:1,rare:2,common:3};
  players.sort((a,b) => {
    const ao = state.collected.has(a.id)?0:1, bo = state.collected.has(b.id)?0:1;
    if(ao !== bo) return ao - bo;
    return (rarityOrder[a.rarity]||3) - (rarityOrder[b.rarity]||3);
  });

  if(!players.length) {
    list.innerHTML = `<div style="padding:20px;text-align:center;color:var(--muted);font-size:12px;font-family:var(--fs);">
      Sin resultados para esta búsqueda</div>`;
    return;
  }

  list.innerHTML = players.map(p => {
    const owned = state.collected.has(p.id);
    const used = usedIds.has(p.id);
    const disabled = used || (lineupState.filterOwned && !owned);
    return `<div class="picker-item${used?' already-used':''}${(!owned&&lineupState.filterOwned)?' not-owned':''}"
      onclick="${disabled?'':'pickPlayer(''+p.id+'')'}">
      <span class="picker-emoji">${p.e}</span>
      <div class="picker-info">
        <div class="picker-name">${p.name}</div>
        <div class="picker-meta">${p.club} · ${p.countryName}</div>
      </div>
      <img class="picker-flag-sm" src="https://flagcdn.com/${p.flag}.svg" alt="${p.flag}" loading="lazy">
      <span class="picker-rarity r-${p.rarity}">${p.rarity.toUpperCase()}</span>
      ${used?'<span style="font-size:9px;color:var(--muted);font-family:var(--fm);margin-left:4px;">EN CAMPO</span>':''}
      ${!owned?'<span style="font-size:9px;color:var(--muted2);font-family:var(--fm);margin-left:4px;">🔒</span>':''}
    </div>`;
  }).join('');
}

window.pickPlayer = function(playerId) {
  if(!lineupState.selectedSlot) {
    toast('Primero toca una posición en el campo', 'error');
    return;
  }

  const player = getPlayersList().find(p => p.id === playerId);
  if(!player) return;

  // Warn if position mismatch but allow
  const targetPos = lineupState.selectedSlot.posKey;
  if(player.pos !== targetPos) {
    const ok = confirm(`${player.name} es ${player.pos} pero estás colocándolo como ${targetPos}. ¿Continuar?`);
    if(!ok) return;
  }

  const idx = lineupState.selectedSlot.slotArrayIdx;
  lineupState.slots[idx].player = player;
  lineupState.selectedSlot = null;

  const el = document.getElementById('picker-slot-info');
  if(el) el.style.display = 'none';

  renderPitch();
  refreshPickerList();
  updateRating();
  toast(`${player.name} colocado en el campo ✓`, 'success');
};

function updateRating() {
  const r = computeRating(lineupState.slots);
  const filled = lineupState.slots.filter(s=>s.player).length;
  const num = document.getElementById('rating-num');
  const stars = document.getElementById('rating-stars');
  const desc = document.getElementById('rating-desc');
  const cnt = document.getElementById('filled-count');
  if(num) num.textContent = r || '--';
  if(stars) stars.textContent = r ? ratingStars(r) : '☆☆☆☆☆';
  if(cnt) cnt.textContent = `${filled}/11`;
  if(desc) {
    const labels = [
      [90,'¡Equipo de élite mundial!'],
      [82,'Candidato al título'],
      [74,'Equipo competitivo'],
      [60,'En construcción'],
      [0,'Selecciona jugadores'],
    ];
    desc.textContent = labels.find(l => r >= l[0])?.[1] || 'Selecciona jugadores';
  }
}

window.saveLineup = function() {
  const filled = lineupState.slots.filter(s=>s.player).length;
  if(filled < 11) {
    toast(`Faltan ${11-filled} jugadores para completar el equipo`, 'error');
    return;
  }
  const entry = {
    id: Date.now(),
    name: lineupState.name || 'Mi Equipo',
    formation: lineupState.formation,
    rating: computeRating(lineupState.slots),
    slots: lineupState.slots.map(s => ({
      posKey: s.posKey, slotIdx: s.slotIdx, x: s.x, y: s.y,
      player: s.player ? {
        id:s.player.id, name:s.player.name, e:s.player.e,
        pos:s.player.pos, rarity:s.player.rarity, club:s.player.club,
        flag:s.player.flag
      } : null
    })),
  };
  lineupState.savedLineups.unshift(entry);
  if(lineupState.savedLineups.length > 6) lineupState.savedLineups.pop();
  localStorage.setItem('album26_lineups', JSON.stringify(lineupState.savedLineups));
  renderSavedList();
  toast(`"${entry.name}" guardado · Valoración ${entry.rating}`, 'success');
};

function renderSavedList() {
  const el = document.getElementById('saved-list');
  if(!el) return;
  if(!lineupState.savedLineups.length) { el.innerHTML=''; return; }
  el.innerHTML = `<div class="section-label" style="margin-top:16px;">Equipos guardados</div>` +
    lineupState.savedLineups.map(e =>
      `<div class="saved-entry" onclick="loadLineup(${e.id})">
        <div style="font-size:18px;">${e.slots.find(s=>s.player)?.player?.e||'⚽'}</div>
        <div class="saved-entry-name">${e.name} <span style="font-size:10px;color:var(--muted);font-family:var(--fm);">${e.formation}</span></div>
        <div class="saved-entry-rating">${e.rating}</div>
        <div style="font-size:9px;color:var(--muted);font-family:var(--fm);margin-right:4px;">${ratingStars(e.rating)}</div>
        <button class="saved-entry-del" onclick="event.stopPropagation();deleteLineup(${e.id})">✕</button>
      </div>`
    ).join('');
}

window.loadLineup = function(id) {
  const entry = lineupState.savedLineups.find(e=>e.id===id);
  if(!entry) return;
  lineupState.formation = entry.formation;
  lineupState.slots = entry.slots;
  lineupState.name = entry.name;
  const inp = document.getElementById('lineup-name-inp');
  if(inp) inp.value = entry.name;
  document.querySelectorAll('.formation-btn').forEach(b => {
    b.classList.toggle('active', b.textContent === entry.formation);
  });
  renderPitch();
  refreshPickerList();
  updateRating();
  toast(`"${entry.name}" cargado`, 'success');
};

window.deleteLineup = function(id) {
  lineupState.savedLineups = lineupState.savedLineups.filter(e=>e.id!==id);
  localStorage.setItem('album26_lineups', JSON.stringify(lineupState.savedLineups));
  renderSavedList();
  toast('Equipo eliminado');
};

window.clearLineup = function() {
  if(!confirm('¿Limpiar todos los jugadores del campo?')) return;
  lineupState.slots.forEach(s => s.player = null);
  lineupState.selectedSlot = null;
  renderPitch();
  refreshPickerList();
  updateRating();
  toast('Campo despejado');
};

window.shareLineup = function() {
  const filled = lineupState.slots.filter(s=>s.player);
  if(!filled.length) { toast('Agrega jugadores antes de compartir', 'error'); return; }
  const names = filled.map(s=>s.player.name).join(', ');
  const r = computeRating(lineupState.slots);
  const text = `⚽ Mi 11 Ideal para el Mundial 2026
📋 ${lineupState.formation} · Valoración: ${r}
👕 ${names}
🔗 #AlbumMundial2026 #FIFAWorldCup`;
  navigator.clipboard.writeText(text)
    .then(()=>toast('Equipo copiado al portapapeles ✓','success'))
    .catch(()=>toast('No se pudo copiar'));
};


function renderExchange(page) {
  const dups = [];
  COUNTRIES.forEach(c => {
    c.players.forEach(p => {
      if(state.duplicates[p.id]) {
        dups.push({...p, countryFlag:c.flag, countryName:c.name, count:state.duplicates[p.id]});
      }
    });
  });

  const wishlist = COUNTRIES.flatMap(c=>c.players).filter(p=>!state.collected.has(p.id)).slice(0,12);

  let selectedDup = null;

  page.innerHTML = `<div class="page-enter">
    <div style="font-family:var(--fd);font-size:38px;letter-spacing:3px;margin-bottom:4px;">INTERCAMBIOS</div>
    <div style="font-size:12px;color:var(--muted);font-family:var(--fs);margin-bottom:24px;">Ofrece tus duplicados a otros coleccionistas generando un link de intercambio.</div>

    <div class="exchange-grid">
      <div class="exchange-panel">
        <h3>MIS DUPLICADOS</h3>
        <p>${dups.length ? `Tienes ${dups.length} láminas repetidas disponibles para intercambiar` : 'Aún no tienes duplicados. ¡Sigue abriendo sobres!'}</p>
        <div class="dup-grid" id="dup-grid">
          ${dups.map(p=>`
            <div class="dup-card" id="dup-${p.id}" onclick="selectDup('${p.id}')">
              <div class="dup-count">×${p.count}</div>
              <div class="dup-emoji">${p.e}</div>
              <div class="dup-name">${p.name.split(' ').pop()}</div>
            </div>`).join('')}
          ${dups.length===0?'<div style="grid-column:1/-1;text-align:center;color:var(--muted);font-size:12px;padding:20px;">📦 Abre más sobres para obtener duplicados</div>':''}
        </div>
        <div id="trade-offer-area" style="display:none;margin-top:16px;">
          <div class="trade-link-box" id="trade-link-text">—</div>
          <button class="trade-link-btn" onclick="copyTradeLink()">📋 Copiar link de intercambio</button>
        </div>
      </div>

      <div class="exchange-panel">
        <h3>ME FALTA</h3>
        <p>Láminas que buscas — muéstraselas a otros coleccionistas</p>
        <div class="dup-grid">
          ${wishlist.map(p=>`
            <div class="dup-card" style="opacity:.7;cursor:default;">
              <div class="dup-emoji">${p.e}</div>
              <div class="dup-name">${p.name.split(' ').pop()}</div>
            </div>`).join('')}
          ${wishlist.length===0?'<div style="grid-column:1/-1;text-align:center;color:var(--green);font-size:12px;padding:20px;">🎉 ¡Álbum completo!</div>':''}
        </div>
        <div style="margin-top:16px;padding:12px;background:var(--surface3);border-radius:8px;font-size:11px;color:var(--muted);font-family:var(--fs);">
          💡 Comparte el link de intercambio con amigos. Cuando acepten, las láminas se marcarán automáticamente en sus álbumes.
        </div>
      </div>
    </div>
  </div>`;

  window.selectDup = function(id) {
    document.querySelectorAll('.dup-card').forEach(c=>c.classList.remove('selected'));
    const card = document.getElementById(`dup-${id}`);
    if(card) card.classList.add('selected');
    selectedDup = id;
    const p = COUNTRIES.flatMap(c=>c.players).find(p=>p.id===id);
    const link = `${window.location.href.split('?')[0]}?trade=${state.userId||'demo'}&offer=${id}&name=${encodeURIComponent(p?.name||'Jugador')}`;
    document.getElementById('trade-offer-area').style.display = 'block';
    document.getElementById('trade-link-text').textContent = link;
  };

  window.copyTradeLink = function() {
    const link = document.getElementById('trade-link-text').textContent;
    navigator.clipboard.writeText(link).then(()=>toast('Link copiado ✓','success')).catch(()=>toast('No se pudo copiar'));
  };

  // Check for incoming trade in URL
  const params = new URLSearchParams(window.location.search);
  if(params.get('trade') && params.get('offer')) {
    const offeredId = params.get('offer');
    const offererName = params.get('name')||'Jugador';
    const offered = COUNTRIES.flatMap(c=>c.players).find(p=>p.id===offeredId);
    if(offered) {
      setTimeout(() => {
        const msg = confirm(`¿Aceptar intercambio?\n\nTe ofrecen: ${offered.name} (${offered.club})\n\nSe añadirá a tu colección.`);
        if(msg) {
          state.collected.add(offeredId);
          saveState(); updateProgress();
          toast(`¡Intercambio aceptado! ${offered.name} añadido`, 'success');
        }
      }, 500);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// STADIUMS
// ═══════════════════════════════════════════════════════════
function renderStadiums(page) {
  let html = `<div class="page-enter">
    <div class="country-header" style="margin-bottom:20px;padding-bottom:20px;">
      <div class="country-flag-big">🏟️</div>
      <div class="country-title">
        <h1>ESTADIOS 2026</h1>
        <div class="conf">USA · CANADA · MEXICO</div>
        <div class="history">16 estadios en 3 países. El torneo más grande de la historia del fútbol.</div>
      </div>
      <div class="country-stats">
        <div class="stat-item">Coleccionados: <strong style="color:var(--green)">${state.stadiumsCollected.size}/16</strong></div>
      </div>
    </div>
    <div class="section-label">Todos los recintos</div>
    <div class="stadiums-grid">`;

  STADIUMS.forEach(s => {
    const has = state.stadiumsCollected.has(s.id);
    html += `<div class="stadium-card${has?' collected':''}" onclick="toggleStadium('${s.id}')">
      <div class="stad-header">
        <div class="stad-flag">${flagImg(s.flag,'std-flag')}</div>
        <div style="flex:1">
          <div class="stad-name">${s.name}</div>
          <div class="stad-city">${s.city}, ${s.country}</div>
        </div>
        <div class="stad-slot">${has?'🏟️':'?'}</div>
      </div>
      <div class="stad-cap">⚡ ${s.cap.toLocaleString()} espectadores</div>
      <div class="stad-matches">
        <span class="stad-tag">${s.role}</span>
        ${has?'<span class="stad-tag" style="background:rgba(0,166,80,.1);color:var(--green)">✓ Coleccionado</span>':''}
      </div>
    </div>`;
  });

  html += `</div></div>`;
  page.innerHTML = html;
}

window.toggleStadium = function(id) {
  if(state.stadiumsCollected.has(id)) {
    state.stadiumsCollected.delete(id); toast('Lámina removida');
  } else {
    state.stadiumsCollected.add(id); toast('¡Estadio coleccionado! 🏟️', 'success');
  }
  saveState(); updateProgress();
  renderStadiums(document.getElementById('page'));
};

// ═══════════════════════════════════════════════════════════
// BRACKET
// ═══════════════════════════════════════════════════════════
function renderBracket(page) {
  const getC = code => code ? (COUNTRIES.find(c=>c.code===code)||{flag:null,name:code}) : {flag:null,name:'Por definir'};

  function matchHTML(m, pkey) {
    const hc=getC(m.home), ac=getC(m.away);
    const hw=m.winner===m.home, aw=m.winner===m.away;
    return `<div class="bracket-match${m.winner?' has-winner':''}" onclick="openMatchModal('${pkey}','${m.id}')">
      <div class="bm-team${hw?' winner':m.winner&&!hw?' loser':''}">
        <span class="bm-flag">${hc.flag?flagImgSized(hc.flag,14,10):'?'}</span>${m.home?hc.name:'Por definir'}
        ${m.hs!==null?`<span class="bm-score">${m.hs}</span>`:''}
      </div>
      <div class="bm-divider"></div>
      <div class="bm-team${aw?' winner':m.winner&&!aw?' loser':''}">
        <span class="bm-flag">${ac.flag?flagImgSized(ac.flag,14,10):'?'}</span>${m.away?ac.name:'Por definir'}
        ${m.as!==null?`<span class="bm-score">${m.as}</span>`:''}
      </div>
    </div>`;
  }

  const phases=[
    {key:'r32',label:'Octavos de Final'},
    {key:'qf',label:'Cuartos de Final'},
    {key:'sf',label:'Semifinales'},
    {key:'f',label:'⭐ FINAL'},
  ];

  let html=`<div class="page-enter">
    <div style="margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border);">
      <div style="font-family:var(--fd);font-size:40px;letter-spacing:3px;">LLAVES DEL TORNEO</div>
      <div style="font-size:11px;color:var(--muted);font-family:var(--fm);margin-top:4px;">Haz clic en un partido para ingresar el resultado · El ganador avanza automáticamente</div>
    </div>
    <div class="bracket-container"><div class="bracket-wrap">`;

  phases.forEach(ph => {
    const matches = state.bracket[ph.key]||[];
    html += `<div class="bracket-phase"><div class="bracket-phase-label">${ph.label}</div>`;
    matches.forEach(m => { html += matchHTML(m, ph.key); });
    html += `</div>`;
  });

  html += `</div></div></div>`;
  page.innerHTML = html;
}

const PHASE_LABELS={r32:'Octavos de Final',qf:'Cuartos de Final',sf:'Semifinal',f:'Gran Final 🏆'};

window.openMatchModal = function(phaseKey, matchId) {
  const m = state.bracket[phaseKey].find(x=>x.id===matchId);
  if(!m) return;
  state.currentMatch = {phaseKey, matchId};
  const hc = COUNTRIES.find(c=>c.code===m.home)||{flag:null,name:m.home||'TBD'};
  const ac = COUNTRIES.find(c=>c.code===m.away)||{flag:null,name:m.away||'TBD'};
  document.getElementById('modal-title').textContent = PHASE_LABELS[phaseKey]||phaseKey;
  document.getElementById('modal-teams').innerHTML = `
    <div class="modal-team">
      <div class="mflag">${hc.flag?flagImgSized(hc.flag,40,29):'🏳️'}</div>
      <div class="mname">${hc.name}</div>
    </div>
    <div class="modal-vs">VS</div>
    <div class="modal-team">
      <div class="mflag">${ac.flag?flagImgSized(ac.flag,40,29):'🏳️'}</div>
      <div class="mname">${ac.name}</div>
    </div>`;
  document.getElementById('score-home').value = m.hs!==null?m.hs:0;
  document.getElementById('score-away').value = m.as!==null?m.as:0;
  document.getElementById('modal-overlay').classList.add('open');
};

window.closeModal = () => document.getElementById('modal-overlay').classList.remove('open');

window.confirmResult = function() {
  if(!state.currentMatch) return;
  const {phaseKey, matchId} = state.currentMatch;
  const m = state.bracket[phaseKey].find(x=>x.id===matchId);
  const hs = parseInt(document.getElementById('score-home').value)||0;
  const as = parseInt(document.getElementById('score-away').value)||0;
  m.hs=hs; m.as=as;
  m.winner = hs>as ? m.home : hs<as ? m.away : m.home;
  propagateWinner(phaseKey, matchId, m.winner);
  saveState(); closeModal(); renderBracket(document.getElementById('page'));
  toast(`Resultado guardado: ${hs}–${as}`, 'success');
};

function propagateWinner(phaseKey, matchId, winner) {
  const orders={r32:'qf',qf:'sf',sf:'f'};
  const next = orders[phaseKey]; if(!next) return;
  const idx = state.bracket[phaseKey].findIndex(x=>x.id===matchId);
  const nextIdx = Math.floor(idx/2);
  const nextMatch = state.bracket[next][nextIdx];
  if(!nextMatch) return;
  if(idx%2===0) nextMatch.home=winner; else nextMatch.away=winner;
}

// ═══════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════
let toastTimer;
window.toast = function(msg, type='') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show' + (type ? ' '+type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.className = '', 2500);
};

// ═══════════════════════════════════════════════════════════
// ANIMATED AUTH BACKGROUND
// ═══════════════════════════════════════════════════════════
function buildAuthBg() {
  const bg = document.getElementById('auth-bg');
  const colors = ['#E31E24','#004F9F','#00A650','#FFD700','#E31E24'];
  let html = '';
  for(let i=0;i<8;i++) {
    const top = Math.random()*100;
    const delay = Math.random()*8;
    const dur = 8 + Math.random()*6;
    const color = colors[i%colors.length];
    html += `<div class="auth-bg-stripe" style="top:${top}%;background:${color};animation-delay:${delay}s;animation-duration:${dur}s;opacity:0.15;"></div>`;
  }
  bg.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
buildAuthBg();

// Try to setup Firebase auth, fall back gracefully if not configured
try {
  // Wait for firebase module to load
  const checkFb = setInterval(() => {
    if(window._firebase) {
      clearInterval(checkFb);
      setupAuth();
    }
  }, 100);
  // Timeout fallback
  setTimeout(() => {
    clearInterval(checkFb);
    if(!window._firebase) {
      // Firebase not loaded - show demo only
      document.getElementById('btn-google').style.display = 'none';
      document.getElementById('btn-demo').textContent = '⚽ Entrar al álbum';
    }
  }, 3000);
} catch(e) {
  document.getElementById('btn-google').style.display = 'none';
}

// Handle btn-demo directly as fallback
document.getElementById('btn-demo').addEventListener('click', function() {
  if(!window._firebase || state.userMode==='demo') {
    state.userMode = 'demo';
    loadLocalFallback();
    updateUserUI(null);
    showApp();
  }
});