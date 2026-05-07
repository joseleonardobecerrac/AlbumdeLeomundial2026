
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
  // Timeout fallback — if Firebase doesn't load, show error
  setTimeout(() => {
    clearInterval(checkFb);
    if(!window._firebase) {
      const btn = document.getElementById('btn-google');
      if(btn) {
        btn.textContent = '⚠️ Error cargando Firebase';
        btn.style.opacity = '0.5';
        btn.disabled = true;
      }
    }
  }, 3000);
} catch(e) {
  console.error('Firebase init error:', e);
}