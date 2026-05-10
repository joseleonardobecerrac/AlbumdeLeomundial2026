
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
    <button class="page-back-btn" onclick="navigate('home')">← Inicio</button>
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
    const owned = state.collected.has(p.id);
    const alreadyChosen = (cmpState.selecting==='A' && cmpState.playerB?.id===p.id) ||
                          (cmpState.selecting==='B' && cmpState.playerA?.id===p.id);
    const disabled = alreadyChosen;
    const flagHtml = `<img src="https://flagcdn.com/w20/${p.flag}.png" style="width:14px;height:10px;object-fit:cover;border-radius:1px;flex-shrink:0;" onerror="this.style.display='none'">`;
    const photoHtml = owned && typeof getPlayerPhoto==='function' && getPlayerPhoto(p.id)
      ? `<img src="${getPlayerPhoto(p.id)}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;object-position:top;flex-shrink:0;" onerror="this.outerHTML='<span style=\"font-size:18px\">${p.e}</span>'">`
      : `<span class="pe" style="opacity:${owned?1:0.35}">${owned ? p.e : '?'}</span>`;
    return `<button class="cmp-player-btn${disabled?' not-owned':''}${owned?'':' cmp-btn-locked'}"
      ${disabled ? 'disabled aria-disabled="true"' : `onclick="pickCmpPlayer('${p.id}')"`}
      title="${owned ? p.name : 'Aún no tienes esta lámina'}">
      ${photoHtml}
      <div class="pi">
        <div class="pn" style="${owned?'':'color:var(--muted)'}">
          ${owned ? p.name : p.name}
        </div>
        <div class="pm" style="display:flex;align-items:center;gap:4px;">
          ${flagHtml}
          <span>${owned ? p.club : p.countryName}</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;">
        <span class="pr" style="background:${rarityColors[p.rarity]};color:${rarityText[p.rarity]}">${p.rarity.slice(0,3).toUpperCase()}</span>
        ${owned
          ? `<span style="font-size:7px;color:var(--green);font-family:var(--fm);">✓ TENGO</span>`
          : `<span style="font-size:7px;color:var(--muted);font-family:var(--fm);">🔒 FALTA</span>`}
      </div>
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

// fin comparator
