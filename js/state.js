// ═══ APP STATE + FIREBASE AUTH ═══
const state = {
  userId: null,
  userMode: 'firebase',
  collected: new Set(),
  duplicates: {},       // { playerId: count }
  stadiumsCollected: new Set(),
  gameScore: 0,
  gameStreak: 0,
  gameBest: 0,
  bracket: {
    r32: Array.from({length:16},(_,i)=>({id:`R32-${i+1}`,home:null,away:null,hs:null,as:null,winner:null})),
    qf:  Array.from({length:8}, (_,i)=>({id:`QF-${i+1}`, home:null,away:null,hs:null,as:null,winner:null})),
    sf:  Array.from({length:2}, (_,i)=>({id:`SF-${i+1}`, home:null,away:null,hs:null,as:null,winner:null})),
    f:   [{id:"FIN",home:null,away:null,hs:null,as:null,winner:null}],
  },
  standings: {},        // { groupCode: { countryCode: {pj,pg,pe,pp,gf,gc} } }
  currentMatch: null,
  currentView: 'home',
  favTeam: null,       // country code of favorite team
  favMissions: {},     // { missionId: { completed, claimedAt } }
};

// ═══════════════════════════════════════════════════════════
// FLAG HELPER
// ═══════════════════════════════════════════════════════════
function flagImg(code, cls='') {
  if(!code) return '<span>🏳️</span>';
  return `<img src="https://flagcdn.com/${code}.svg" alt="${code}" class="${cls||'std-flag'}" loading="lazy" onerror="this.style.display='none'">`;
}
function flagImgSized(code, w=24, h=17) {
  if(!code) return '';
  return `<img src="https://flagcdn.com/${code}.svg" style="width:${w}px;height:${h}px;object-fit:cover;border-radius:3px;" loading="lazy">`;
}

// ═══════════════════════════════════════════════════════════
// FIREBASE / AUTH
// ═══════════════════════════════════════════════════════════
let _fb;
function fb(){ return window._firebase; }

function setSyncStatus(s) {
  const dot = document.getElementById('sync-dot');
  const lbl = document.getElementById('sync-label');
  if(!dot) return;
  dot.className = s;
  if(s==='syncing'){lbl.textContent='Sincronizando…';}
  else if(s==='error'){lbl.textContent='Sin conexión';}
  else{lbl.textContent='Sincronizado';}
}

async function saveToFirestore() {
  if(state.userMode !== 'firebase' || !state.userId) { saveLocalFallback(); return; }
  setSyncStatus('syncing');
  try {
    const { db, doc, setDoc } = fb();
    const data = {
      collected: [...state.collected],
      duplicates: state.duplicates,
      stadiumsCollected: [...state.stadiumsCollected],
      bracket: state.bracket,
      standings: state.standings,
      gameScore: state.gameScore,
      gameStreak: state.gameStreak,
      gameBest: state.gameBest,
      updatedAt: new Date().toISOString(),
      favTeam: state.favTeam,
      favMissions: state.favMissions,
    };
    await setDoc(doc(db,'albums',state.userId), data);
    setSyncStatus('');
  } catch(e) {
    console.error(e);
    setSyncStatus('error');
    saveLocalFallback();
  }
}

function saveLocalFallback() {
  try {
    localStorage.setItem('album26_v2', JSON.stringify({
      collected: [...state.collected],
      duplicates: state.duplicates,
      stadiumsCollected: [...state.stadiumsCollected],
      bracket: state.bracket,
      standings: state.standings,
      gameScore: state.gameScore,
      gameBest: state.gameBest,
      favTeam: state.favTeam,
      favMissions: state.favMissions,
    }));
  } catch(e){}
}

async function loadFromFirestore(uid) {
  setSyncStatus('syncing');
  try {
    const { db, doc, getDoc } = fb();
    const snap = await getDoc(doc(db, 'albums', uid));
    if(snap.exists()) {
      // Existing user — load their data
      const d = snap.data();
      state.collected         = new Set(d.collected || []);
      state.duplicates        = d.duplicates || {};
      state.stadiumsCollected = new Set(d.stadiumsCollected || []);
      if(d.bracket)    state.bracket    = d.bracket;
      if(d.standings)  state.standings  = d.standings;
      if(d.gameScore)  state.gameScore  = d.gameScore;
      if(d.gameBest)   state.gameBest   = d.gameBest;
      if(d.favTeam)    state.favTeam    = d.favTeam;
      if(d.favMissions)state.favMissions= d.favMissions;
      console.log('[Auth] Loaded existing album for', uid, '—', state.collected.size, 'stickers');
    } else {
      // New user — fresh album, starts from 0 (state already reset)
      console.log('[Auth] New user', uid, '— starting fresh album');
    }
    setSyncStatus('');
  } catch(e) {
    console.error('[Auth] Firestore load error:', e);
    setSyncStatus('error');
    // Don't load localStorage — keep state clean per user
  }
}

function loadLocalFallback() {
  try {
    const saved = localStorage.getItem('album26_v2');
    if(saved) {
      const d = JSON.parse(saved);
      state.collected = new Set(d.collected || []);
      state.duplicates = d.duplicates || {};
      state.stadiumsCollected = new Set(d.stadiumsCollected || []);
      if(d.bracket) state.bracket = d.bracket;
      if(d.standings) state.standings = d.standings;
      if(d.gameScore) state.gameScore = d.gameScore;
      if(d.gameBest) state.gameBest = d.gameBest;
      if(d.favTeam) state.favTeam = d.favTeam;
      if(d.favMissions) state.favMissions = d.favMissions;
    }
  } catch(e){}
}

let _lastUserId = null;  // track user switches

function setupAuth() {
  const { auth, onAuthStateChanged } = fb();

  onAuthStateChanged(auth, async (user) => {
    if(user) {
      // If switching accounts, FULLY reset state first
      if(_lastUserId && _lastUserId !== user.uid) {
        resetStateCompletely();
      }
      _lastUserId = user.uid;

      state.userId   = user.uid;
      state.userMode = 'firebase';
      updateUserUI(user);
      await loadFromFirestore(user.uid);
      showApp();
    } else {
      // Signed out — reset and show auth screen
      _lastUserId = null;
      resetStateCompletely();
      document.getElementById('app').classList.add('hidden');
      document.getElementById('auth-screen').style.display = 'flex';
    }
  });

  const googleBtn = document.getElementById('btn-google');
  if(googleBtn) {
    googleBtn.onclick = async () => {
      googleBtn.disabled = true;
      googleBtn.textContent = 'Conectando…';
      try {
        const { auth, signInWithPopup, provider } = fb();
        await signInWithPopup(auth, provider);
      } catch(e) {
        const msg = e.code === 'auth/popup-blocked'
          ? 'El navegador bloqueó el popup. Permite popups para este sitio.'
          : e.code === 'auth/unauthorized-domain'
          ? 'Dominio no autorizado. Agrégalo en Firebase → Authentication → Authorized domains.'
          : 'Error al iniciar sesión: ' + (e.message || e.code);
        toast(msg, 'error');
        console.error('[Auth]', e.code, e.message);
        googleBtn.disabled = false;
        googleBtn.innerHTML = \`<svg viewBox="0 0 24 24" fill="none" style="width:20px;height:20px;"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Continuar con Google\`;
      }
    };
  }
}

// Full state reset — called on logout or account switch
function resetStateCompletely() {
  state.userId            = null;
  state.userMode          = 'firebase';
  state.collected         = new Set();
  state.duplicates        = {};
  state.stadiumsCollected = new Set();
  state.gameScore         = 0;
  state.gameStreak        = 0;
  state.gameBest          = 0;
  state.standings         = {};
  state.favTeam           = null;
  state.favMissions       = {};
  state.bracket = {
    r32: Array.from({length:16},(_,i)=>({id:\`R32-\${i+1}\`,home:null,away:null,hs:null,as:null,winner:null})),
    qf:  Array.from({length:8}, (_,i)=>({id:\`QF-\${i+1}\`, home:null,away:null,hs:null,as:null,winner:null})),
    sf:  Array.from({length:2}, (_,i)=>({id:\`SF-\${i+1}\`, home:null,away:null,hs:null,as:null,winner:null})),
    f:   [{id:'FIN',home:null,away:null,hs:null,as:null,winner:null}],
  };
}

function updateUserUI(user) {
  const av = document.getElementById('sb-avatar-el');
  const nm = document.getElementById('sb-name-el');
  const em = document.getElementById('sb-email-el');
  if(user) {
    nm.textContent = user.displayName || 'Usuario';
    em.textContent = user.email || '';
    if(user.photoURL) {
      av.innerHTML = `<img src="${user.photoURL}" alt="">`;
    } else {
      av.textContent = (user.displayName||'U')[0].toUpperCase();
    }
  } else {
    nm.textContent = 'Usuario';
    em.textContent = '';
    av.textContent = '?';
  }
}

async function handleLogout() {
  // Save before logout
  if(state.userId) await saveToFirestore();

  // Sign out from Firebase — onAuthStateChanged will handle the rest
  try {
    const { auth, signOut } = fb();
    await signOut(auth);
  } catch(e) {
    console.error('[Auth] Logout error:', e);
    // Force reset anyway
    resetStateCompletely();
    document.getElementById('app').classList.add('hidden');
    document.getElementById('auth-screen').style.display = 'flex';
  }
}

function showApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').classList.remove('hidden');
  buildSidebar();
  navigate('home');
}

// ═══════════════════════════════════════════════════════════
// SAVE STATE
// ═══════════════════════════════════════════════════════════
let saveTimer;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveToFirestore, 1500);
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════
window.navigate = function(view, code) {
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById(`nav-${code||view}`);
  if(navEl) navEl.classList.add('active');
  state.currentView = view;
  const page = document.getElementById('page');

  if(view==='home') renderHome(page);
  else if(view==='pack') renderPack(page);
  else if(view==='bracket') renderBracket(page);
  else if(view==='stadiums') renderStadiums(page);
  else if(view==='country') renderCountry(page, code);
  else if(view==='standings') renderStandings(page);
  else if(view==='game') renderGame(page);
  else if(view==='exchange') renderExchange(page);
  else if(view==='lineup') renderLineup(page);
  else if(view==='trivia') renderTrivia(page);
  else if(view==='predictor') renderPredictor(page);
  else if(view==='compare') renderComparator(page);
  else if(view==='ranking') renderRanking(page);
  else if(view==='limited') renderLimited(page);
  else if(view==='favorite') renderFavorite(page);
  else if(view==='chatbot') renderChatbot(page);

  const labels = {home:'Inicio',pack:'Abrir Sobre',bracket:'Llaves del Torneo',stadiums:'Estadios',standings:'Posiciones por Grupo',game:'¿Quién soy?',exchange:'Intercambios',lineup:'Mi 11 Ideal',trivia:'Trivia Mundialista',predictor:'Predictor IA',compare:'Comparador de Jugadores',ranking:'Ranking Global',limited:'Edición Limitada',favorite:'Mi Selección',chatbot:'Oráculo del Fútbol'};
  const crumb = view==='country'
    ? `Álbum · <span>${COUNTRIES.find(c=>c.code===code)?.name||code}</span>`
    : `Álbum · <span>${labels[view]||view}</span>`;
  document.getElementById('breadcrumb').innerHTML = crumb;
  updateProgress();
};

// ═══════════════════════════════════════════════════════════
// SIDEBAR BUILD
// ═══════════════════════════════════════════════════════════
function buildSidebar() {
  const container = document.getElementById('nav-countries');
  container.innerHTML = '';
  GROUPS_ORDER.forEach(g => {
    const gcs = COUNTRIES.filter(c=>c.group===g);
    if(!gcs.length) return;
    const sec = document.createElement('div');
    sec.className = 'sb-section'; sec.textContent = `Grupo ${g}`;
    container.appendChild(sec);
    gcs.forEach(c => {
      const el = document.createElement('div');
      el.className = 'sb-item'; el.id = `nav-${c.code}`;
      el.innerHTML = `<span class="sb-flag">${flagImgSized(c.flag,18,13)}</span> ${c.name} <span class="sb-badge">${g}</span>`;
      el.onclick = () => navigate('country', c.code);
      container.appendChild(el);
    });
  });
}

// ═══════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════
function updateProgress() {
  const total = COUNTRIES.reduce((a,c)=>a+c.players.length,0) + STADIUMS.length;
  const col = state.collected.size + state.stadiumsCollected.size;
  const pct = total>0 ? Math.round((col/total)*100) : 0;
  document.getElementById('prog-pct').textContent = pct+'%';
  document.getElementById('prog-bar').style.width = pct+'%';
}

// ═══════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════
function renderHome(page) {
  const total = COUNTRIES.reduce((a,c)=>a+c.players.length,0) + STADIUMS.length;
  const col = state.collected.size + state.stadiumsCollected.size;
  const icons = COUNTRIES.filter(c=>c.players.some(p=>p.rarity==='icon' && state.collected.has(p.id)));

  page.innerHTML = `<div class="page-enter">
    <div class="home-hero">
      <div class="home-hero-bg"></div>
      <div class="home-hero-stripes"></div>
      <div class="home-logo-big">26<span class="fifa-tag">FIFA WORLD CUP™</span></div>
      <p class="home-tagline">Tu álbum digital oficial. Colecciona las 48 selecciones, descubre jugadores legendarios y completa las llaves del torneo más grande de la historia.</p>
      <div class="home-stats-row">
        <div class="home-stat"><div class="n green">${col}</div><div class="l">LÁMINAS</div></div>
        <div class="home-stat"><div class="n">${total}</div><div class="l">TOTAL</div></div>
        <div class="home-stat"><div class="n">${state.collected.size}</div><div class="l">JUGADORES</div></div>
        <div class="home-stat"><div class="n">${state.stadiumsCollected.size}</div><div class="l">ESTADIOS</div></div>
        <div class="home-stat"><div class="n green">${Math.round((col/total)*100)}%</div><div class="l">COMPLETADO</div></div>
      </div>
      <div class="home-actions">
        <button class="home-cta primary" onclick="navigate('pack')">📦 Abrir sobre diario</button>
        <button class="home-cta secondary" onclick="navigate('game')">🎮 ¿Quién soy?</button>
        <button class="home-cta secondary" onclick="navigate('standings')">📊 Posiciones</button>
      </div>
    </div>

    <div class="home-grid">
      <div class="home-card" onclick="navigate('standings')">
        <div class="home-card-icon">📊</div>
        <div class="home-card-title">GRUPOS</div>
        <div class="home-card-desc">Edita resultados, consulta posiciones y clasifica las 48 selecciones.</div>
        <div class="home-card-stat">12 grupos · ${COUNTRIES.length} países</div>
      </div>
      <div class="home-card" onclick="navigate('bracket')">
        <div class="home-card-icon">🏆</div>
        <div class="home-card-title">LLAVES</div>
        <div class="home-card-desc">Octavos, cuartos, semis y la gran final. Completa el camino al título.</div>
        <div class="home-card-stat">32 partidos en el torneo</div>
      </div>
      <div class="home-card" onclick="navigate('exchange')">
        <div class="home-card-icon">🔄</div>
        <div class="home-card-title">INTERCAMBIOS</div>
        <div class="home-card-desc">Tus duplicados se pueden intercambiar con otros coleccionistas vía link.</div>
        <div class="home-card-stat">${Object.values(state.duplicates).reduce((a,b)=>a+b,0)} láminas disponibles</div>
      </div>
      <div class="home-card" onclick="navigate('stadiums')">
        <div class="home-card-icon">🏟️</div>
        <div class="home-card-title">ESTADIOS</div>
        <div class="home-card-desc">Los 16 estadios de USA, Canadá y México, desde el Azteca al MetLife.</div>
        <div class="home-card-stat">${state.stadiumsCollected.size}/16 coleccionados</div>
      </div>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════
// PACK OPENING
// ═══════════════════════════════════════════════════════════
function renderPack(page) {
  const allPlayers = COUNTRIES.flatMap(c => c.players.map(p => ({...p, countryCode:c.code, flag:c.flag})));
  const allStadiums = STADIUMS.map(s => ({id:s.id,name:s.name,pos:null,club:s.city,rarity:'rare',e:'🏟️',isStadium:true,flag:s.flag}));
  const pool = [...allPlayers, ...allStadiums];

  page.innerHTML = `<div id="pack-scene" class="page-enter">
    <div class="pack-header">
      <h2>SOBRE DEL DÍA</h2>
      <div class="pack-date">${new Date().toLocaleDateString('es-CO',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).toUpperCase()}</div>
    </div>

    <div class="pack-card-wrap" id="pack-card-wrap" onclick="openPack()">
      <div class="pack-card" id="pack-card">
        <div class="pack-face pack-front">
          <div class="pack-shine"></div>
          <div class="pack-front-logo">26</div>
          <div class="pack-front-tag">WORLD CUP™</div>
          <div class="pack-front-count">5 LÁMINAS</div>
        </div>
        <div class="pack-face pack-back">📦</div>
      </div>
    </div>
    <div class="pack-hint" id="pack-hint">TAP PARA ABRIR</div>

    <div class="pack-reveal" id="pack-reveal">
      <div class="section-label" style="margin-bottom:16px;">Láminas obtenidas</div>
      <div class="pack-reveal-grid" id="pack-grid"></div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:8px;">
        <button class="tb-btn gold" onclick="navigate('home')" style="padding:8px 20px;">Ir al álbum</button>
        <button class="tb-btn" onclick="renderPack(document.getElementById('page'))" style="padding:8px 20px;">Otro sobre</button>
      </div>
    </div>
  </div>`;

  window.openPack = function() {
    const wrap = document.getElementById('pack-card-wrap');
    const card = document.getElementById('pack-card');
    const hint = document.getElementById('pack-hint');
    if(card.classList.contains('opening')) return;
    wrap.style.cursor = 'default';
    hint.style.display = 'none';
    card.classList.add('opening');

    setTimeout(() => {
      const drawn = drawCards(pool, 5);
      document.getElementById('pack-reveal').classList.add('show');
      renderDrawnCards(drawn);
    }, 500);
  };
}

function drawCards(pool, count) {
  // Weighted random: legendary 8%, rare 25%, icon 2%, common rest
  const weights = {icon:2, legendary:8, rare:25, common:65};
  const drawn = [];
  const used = new Set();

  // Force at least 1 rare
  const rares = pool.filter(p=>p.rarity==='rare'||p.rarity==='legendary'||p.rarity==='icon');

  for(let i=0; i<count; i++) {
    let pick;
    let attempts = 0;
    while(!pick || used.has(pick.id)) {
      if(attempts++ > 200) break;
      const roll = Math.random()*100;
      let filtered;
      if(roll < weights.icon) filtered = pool.filter(p=>p.rarity==='icon');
      else if(roll < weights.icon + weights.legendary) filtered = pool.filter(p=>p.rarity==='legendary');
      else if(roll < weights.icon + weights.legendary + weights.rare) filtered = pool.filter(p=>p.rarity==='rare');
      else filtered = pool.filter(p=>p.rarity==='common');
      if(filtered.length) pick = filtered[Math.floor(Math.random()*filtered.length)];
    }
    if(pick) {
      drawn.push(pick);
      used.add(pick.id);
    }
  }
  return drawn;
}

function renderDrawnCards(drawn) {
  const grid = document.getElementById('pack-grid');
  drawn.forEach((s, i) => {
    // Track collected / duplicates
    if(s.isStadium) {
      state.stadiumsCollected.add(s.id);
    } else {
      if(state.collected.has(s.id)) {
        state.duplicates[s.id] = (state.duplicates[s.id]||1) + 1;
      } else {
        state.collected.add(s.id);
      }
    }

    const slot = document.createElement('div');
    slot.className = `pack-sticker-reveal`;
    const rarityClass = s.rarity || 'common';
    slot.innerHTML = `<div class="sticker-slot ${rarityClass} collected" style="cursor:default;">
      <div class="slot-number">${s.id}</div>
      <div class="slot-rarity-dot"></div>
      <div class="slot-silhouette">${s.e}</div>
      <div class="slot-info">
        <div class="slot-name">${s.name}</div>
        <div class="slot-club">${s.club}</div>
        ${s.pos?`<span class="slot-pos pos-${s.pos}">${s.pos}</span>`:''}
      </div>
    </div>`;
    grid.appendChild(slot);

    setTimeout(() => {
      slot.classList.add('shown');
    }, 100 + i * 180);
  });

  saveState();
  updateProgress();
}

// ═══════════════════════════════════════════════════════════
// COUNTRY PAGE
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// GOLEADORES HISTÓRICOS POR SELECCIÓN
// ═══════════════════════════════════════════════════════════
