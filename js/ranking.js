// ═══════════════════════════════════════════════════════════
// RANKING GLOBAL DE COLECCIONISTAS — Firestore real-time
// ═══════════════════════════════════════════════════════════

// CSS injected once
(function injectRankingCSS() {
  if(document.getElementById('ranking-styles')) return;
  const s = document.createElement('style');
  s.id = 'ranking-styles';
  s.textContent = `
/* ══ RANKING GLOBAL ══════════════════════════════════════ */
.rk-wrap{max-width:900px;margin:0 auto;padding-bottom:60px;}

.rk-hero{
  background:var(--surface2);border:1px solid var(--border);border-radius:18px;
  padding:32px 32px 28px;margin-bottom:22px;position:relative;overflow:hidden;
}
.rk-hero::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(ellipse at 15% 50%,rgba(239,159,39,0.09),transparent 55%),
    radial-gradient(ellipse at 85% 50%,rgba(91,164,245,0.07),transparent 55%);
}
.rk-hero-inner{position:relative;display:flex;align-items:flex-end;gap:24px;flex-wrap:wrap;}
.rk-hero h2{font-family:var(--fd);font-size:42px;letter-spacing:4px;line-height:1;flex:1;}
.rk-hero-stats{display:flex;gap:0;}
.rk-hero-stat{padding:10px 20px;border-left:1px solid var(--border);text-align:center;}
.rk-hero-stat:first-child{border:none;}
.rk-hero-stat .n{font-family:var(--fd);font-size:28px;color:var(--gold);}
.rk-hero-stat .l{font-size:9px;font-family:var(--fm);letter-spacing:1.5px;color:var(--muted);margin-top:1px;}

/* Tabs */
.rk-tabs{display:flex;gap:6px;margin-bottom:20px;}
.rk-tab{
  padding:7px 18px;border-radius:7px;font-family:var(--fb);font-size:13px;font-weight:600;
  border:1px solid var(--border2);background:transparent;color:var(--muted);
  cursor:pointer;transition:all .12s;letter-spacing:.3px;
}
.rk-tab.active{background:var(--gold-dim);border-color:rgba(239,159,39,0.4);color:var(--gold);}
.rk-tab:hover:not(.active){color:var(--text);border-color:var(--border3);}

/* My rank card */
.rk-my-card{
  display:flex;align-items:center;gap:16px;
  background:rgba(239,159,39,0.06);border:1px solid rgba(239,159,39,0.25);
  border-radius:14px;padding:16px 20px;margin-bottom:20px;
}
.rk-my-pos{font-family:var(--fd);font-size:44px;letter-spacing:-1px;color:var(--gold);
  line-height:1;min-width:56px;text-align:center;}
.rk-my-pos.unranked{font-size:22px;letter-spacing:0;}
.rk-my-info{flex:1;}
.rk-my-name{font-family:var(--fd);font-size:22px;letter-spacing:1px;}
.rk-my-stats{font-size:11px;font-family:var(--fm);color:var(--muted);margin-top:3px;}
.rk-my-progress{
  text-align:right;
}
.rk-my-pct{font-family:var(--fd);font-size:36px;color:var(--green);letter-spacing:-1px;}
.rk-my-pct-label{font-size:9px;font-family:var(--fm);color:var(--muted);letter-spacing:1px;}

/* Podium */
.rk-podium{
  display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;
  margin-bottom:22px;align-items:end;
}
.rk-podium-card{
  background:var(--surface2);border:1px solid var(--border);
  border-radius:14px;padding:16px 12px;text-align:center;
  position:relative;overflow:hidden;transition:border-color .15s;
}
.rk-podium-card:hover{border-color:var(--border2);}
.rk-podium-card.p1{
  border-color:rgba(239,159,39,0.5);
  background:linear-gradient(160deg,rgba(239,159,39,0.06),var(--surface2));
  order:-1;
}
.rk-podium-card.p2{order:-2;}
.rk-podium-card.p3{order:0;}
.rk-podium-medal{font-size:28px;margin-bottom:6px;}
.rk-podium-avatar{
  width:48px;height:48px;border-radius:50%;margin:0 auto 8px;
  display:flex;align-items:center;justify-content:center;
  font-size:18px;font-weight:700;color:#fff;overflow:hidden;
  border:2px solid var(--border2);
}
.rk-podium-avatar img{width:100%;height:100%;object-fit:cover;}
.p1 .rk-podium-avatar{border-color:rgba(239,159,39,0.6);box-shadow:0 0 16px rgba(239,159,39,0.25);}
.p2 .rk-podium-avatar{border-color:rgba(192,192,192,0.4);}
.p3 .rk-podium-avatar{border-color:rgba(176,141,87,0.4);}
.rk-podium-name{font-family:var(--fd);font-size:15px;letter-spacing:.5px;margin-bottom:2px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rk-podium-pct{font-family:var(--fd);font-size:26px;letter-spacing:-1px;}
.p1 .rk-podium-pct{color:var(--gold);}
.p2 .rk-podium-pct{color:#C0C0C0;}
.p3 .rk-podium-pct{color:#B08D57;}
.rk-podium-detail{font-size:10px;color:var(--muted);font-family:var(--fm);margin-top:2px;}
.rk-crown{
  position:absolute;top:-2px;left:50%;transform:translateX(-50%);
  font-size:20px;
}

/* Full leaderboard table */
.rk-table{
  background:var(--surface2);border:1px solid var(--border);
  border-radius:14px;overflow:hidden;
}
.rk-table-head{
  display:grid;grid-template-columns:48px 1fr 90px 90px 80px;
  padding:8px 16px;border-bottom:1px solid var(--border);
  font-size:9px;font-family:var(--fm);letter-spacing:1.5px;color:var(--muted);
}
.rk-row{
  display:grid;grid-template-columns:48px 1fr 90px 90px 80px;
  padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.03);
  align-items:center;transition:background .1s;
}
.rk-row:last-child{border:none;}
.rk-row:hover{background:rgba(255,255,255,0.02);}
.rk-row.me{
  background:rgba(239,159,39,0.05);
  border-color:rgba(239,159,39,0.1);
}
.rk-row.me:hover{background:rgba(239,159,39,0.08);}
.rk-pos{
  font-family:var(--fd);font-size:18px;letter-spacing:.5px;
  text-align:center;
}
.rk-pos.p1{color:var(--gold);}
.rk-pos.p2{color:#C0C0C0;}
.rk-pos.p3{color:#B08D57;}
.rk-pos.pn{color:var(--muted);}
.rk-user{display:flex;align-items:center;gap:10px;}
.rk-avatar-sm{
  width:32px;height:32px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--red),var(--blue));
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;color:#fff;overflow:hidden;
  border:1px solid var(--border2);
}
.rk-avatar-sm img{width:100%;height:100%;object-fit:cover;}
.rk-user-name{font-family:var(--fb);font-size:13px;font-weight:700;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;}
.rk-user-sub{font-size:10px;color:var(--muted);font-family:var(--fm);margin-top:1px;}
.rk-cell{font-family:var(--fd);font-size:17px;letter-spacing:.5px;text-align:center;}
.rk-cell.green{color:var(--green);}
.rk-cell-bar-wrap{height:4px;background:var(--border);border-radius:2px;margin-top:3px;}
.rk-cell-bar{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--green),var(--blue));}
.rk-badge-me{
  font-size:8px;font-family:var(--fm);letter-spacing:1px;
  background:var(--gold-dim);color:var(--gold);border:1px solid rgba(239,159,39,0.3);
  padding:1px 5px;border-radius:3px;margin-left:6px;
}

/* Trend arrows */
.rk-trend-up{color:var(--green);font-size:11px;}
.rk-trend-dn{color:var(--red);font-size:11px;}
.rk-trend-eq{color:var(--muted);font-size:11px;}

/* Loading skeleton */
.rk-skeleton{
  background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);
  background-size:200% 100%;animation:skeletonShimmer 1.5s infinite;
  border-radius:6px;height:14px;
}
@keyframes skeletonShimmer{0%{background-position:200%}100%{background-position:-200%}}

/* Live dot */
.rk-live{
  display:inline-flex;align-items:center;gap:5px;
  font-size:9px;font-family:var(--fm);letter-spacing:1px;color:var(--green);
  padding:3px 8px;border-radius:4px;background:rgba(0,166,80,0.08);
  border:1px solid rgba(0,166,80,0.2);
}
.rk-live-dot{width:5px;height:5px;border-radius:50%;background:var(--green);
  animation:rkLivePulse 1.5s ease-in-out infinite;}
@keyframes rkLivePulse{0%,100%{opacity:1}50%{opacity:.3}}

/* Fav selection */
.rk-fav{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:10px;}
.rk-fav-label{font-size:9px;font-family:var(--fm);letter-spacing:1px;color:var(--muted);}
.rk-fav-flag{width:18px;height:13px;object-fit:cover;border-radius:2px;cursor:pointer;
  opacity:.5;transition:opacity .12s;border:1px solid transparent;}
.rk-fav-flag.selected{opacity:1;border-color:var(--gold);}
.rk-fav-flag:hover{opacity:.8;}

/* Share profile */
.rk-share-btn{
  padding:8px 18px;border-radius:8px;font-family:var(--fb);font-size:13px;font-weight:600;
  border:1px solid var(--border2);background:transparent;color:var(--muted);
  cursor:pointer;transition:all .12s;
}
.rk-share-btn:hover{border-color:var(--gold);color:var(--gold);}

/* Confetti sparkles for top 3 */
.rk-sparkle{pointer-events:none;position:absolute;
  animation:sparkFade 2s ease forwards;font-size:12px;}
@keyframes sparkFade{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-30px)}}
`;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// RANKING STATE
// ═══════════════════════════════════════════════════════════
let rankingState = {
  tab: 'global',      // global | friends | country
  data: [],           // full leaderboard from Firestore
  myRank: null,
  loading: true,
  unsubscribe: null,  // Firestore onSnapshot unsubscribe
  lastUpdated: null,
  totalUsers: 0,
};

// Compute my score (same formula used to write to Firestore)
function computeMyScore() {
  const totalPlayers = COUNTRIES.reduce((a,c)=>a+c.players.length,0);
  const totalStadiums = (typeof STADIUMS !== 'undefined') ? STADIUMS.length : 16;
  const totalItems = totalPlayers + totalStadiums;
  const collected = (state.collected?.size || 0) + (state.stadiumsCollected?.size || 0);
  const pct = totalItems > 0 ? Math.round((collected/totalItems)*100) : 0;
  // Score = percentage * 100 + tiebreaker (legendaries * 3 + icons * 10)
  const icons = COUNTRIES.flatMap(c=>c.players).filter(p=>p.rarity==='icon'&&state.collected?.has(p.id)).length;
  const legendaries = COUNTRIES.flatMap(c=>c.players).filter(p=>p.rarity==='legendary'&&state.collected?.has(p.id)).length;
  const tiebreak = icons * 10 + legendaries * 3;
  return { pct, collected, totalItems, score: pct * 100 + tiebreak, icons, legendaries, gameScore: state.gameScore || 0 };
}

// Write my entry to Firestore
async function publishMyRanking() {
  if(!state.userId || state.userMode !== 'firebase') return;
  if(!window._firebase) return;
  const { db, doc, setDoc } = window._firebase;
  const me = computeMyScore();
  const user = window._firebase.auth.currentUser;
  const entry = {
    uid: state.userId,
    displayName: user?.displayName || 'Coleccionista',
    photoURL: user?.photoURL || null,
    pct: me.pct,
    collected: me.collected,
    totalItems: me.totalItems,
    score: me.score,
    icons: me.icons,
    legendaries: me.legendaries,
    gameScore: me.gameScore,
    updatedAt: new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'ranking', state.userId), entry);
  } catch(e) { console.error('Ranking write error:', e); }
}

// ═══════════════════════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════════════════════
function renderRanking(page) {
  // Publish my stats first
  publishMyRanking();

  page.innerHTML = `<div class="rk-wrap page-enter">
    <div class="rk-hero">
      <div class="rk-hero-inner">
        <div>
          <h2>🏅 RANKING GLOBAL</h2>
          <p style="font-size:12px;color:var(--muted);font-family:var(--fs);margin-top:6px;">
            Coleccionistas del álbum FIFA World Cup™ 2026 en tiempo real
          </p>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-left:auto;">
          <span class="rk-live"><span class="rk-live-dot"></span>EN VIVO</span>
          <button class="rk-share-btn" onclick="shareMyProfile()">📤 Mi perfil</button>
        </div>
      </div>
      <div class="rk-hero-stats" id="rk-hero-stats" style="margin-top:14px;">
        <div class="rk-hero-stat"><div class="n rk-skeleton" style="width:60px;height:28px;"></div><div class="l">COLECCIONISTAS</div></div>
        <div class="rk-hero-stat"><div class="n rk-skeleton" style="width:50px;height:28px;"></div><div class="l">ÁLBUM COMPLETO</div></div>
        <div class="rk-hero-stat"><div class="n rk-skeleton" style="width:50px;height:28px;"></div><div class="l">PROMEDIO GLOBAL</div></div>
      </div>
    </div>

    <!-- My rank card -->
    <div id="rk-my-card-wrap"></div>

    <!-- Tabs -->
    <div class="rk-tabs">
      <button class="rk-tab active" id="rkt-global"  onclick="setRkTab('global')">🌍 Global</button>
      <button class="rk-tab"        id="rkt-country" onclick="setRkTab('country')">🚩 Por país favorito</button>
      <button class="rk-tab"        id="rkt-icons"   onclick="setRkTab('icons')">⭐ Cazadores de iconos</button>
    </div>

    <!-- Podium -->
    <div class="rk-podium" id="rk-podium">
      ${[1,2,3].map(i=>`
        <div class="rk-podium-card p${i}">
          ${i===1?'<div class="rk-crown">👑</div>':''}
          <div class="rk-podium-medal">${['🥇','🥈','🥉'][i-1]}</div>
          <div class="rk-podium-avatar" style="background:linear-gradient(135deg,var(--surface3),var(--border))"></div>
          <div class="rk-podium-name rk-skeleton" style="width:80%;height:14px;margin:6px auto;"></div>
          <div class="rk-podium-pct rk-skeleton" style="width:60px;height:26px;margin:4px auto;"></div>
        </div>`).join('')}
    </div>

    <!-- Full table -->
    <div class="rk-table">
      <div class="rk-table-head">
        <div>#</div><div>Coleccionista</div><div>LÁMINAS</div><div>ÍCONOS</div><div>%</div>
      </div>
      <div id="rk-table-body">
        ${Array.from({length:8}).map(()=>`
          <div class="rk-row">
            <div class="rk-skeleton" style="width:24px;height:18px;margin:auto;"></div>
            <div style="display:flex;align-items:center;gap:10px;">
              <div class="rk-avatar-sm"></div>
              <div class="rk-skeleton" style="width:120px;height:13px;"></div>
            </div>
            <div class="rk-skeleton" style="width:40px;height:17px;margin:auto;"></div>
            <div class="rk-skeleton" style="width:30px;height:17px;margin:auto;"></div>
            <div class="rk-skeleton" style="width:35px;height:17px;margin:auto;"></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;

  startRankingListener();
}

// ── FIRESTORE REAL-TIME LISTENER ──────────────────────────
function startRankingListener() {
  if(rankingState.unsubscribe) {
    rankingState.unsubscribe();
    rankingState.unsubscribe = null;
  }

  if(!window._firebase) {
    // Demo mode: use mock data
    setTimeout(() => {
      renderDemoRanking();
    }, 800);
    return;
  }

  const { db, collection, query, onSnapshot } = window._firebase;

  try {
    // Query top 50 by score descending
    const q = query(collection(db, 'ranking'));
    rankingState.unsubscribe = onSnapshot(q, (snap) => {
      const docs = [];
      snap.forEach(d => docs.push({id: d.id, ...d.data()}));
      // Sort by score desc
      docs.sort((a,b) => (b.score||0) - (a.score||0));
      rankingState.data = docs;
      rankingState.totalUsers = docs.length;
      rankingState.loading = false;
      rankingState.lastUpdated = new Date();
      renderRankingData(docs);
    }, (err) => {
      console.error('Ranking listener error:', err);
      renderDemoRanking();
    });
  } catch(e) {
    console.error('Ranking setup error:', e);
    renderDemoRanking();
  }
}

// ── DEMO DATA (when Firebase not configured) ──────────────
function renderDemoRanking() {
  const me = computeMyScore();
  const demoData = [
    {uid:'demo1', displayName:'⚽ CraqueDigital',    photoURL:null, pct:94, collected:144, icons:8, legendaries:28, score:9440, gameScore:1850},
    {uid:'demo2', displayName:'🇧🇷 Vinicius_Fan',   photoURL:null, pct:88, collected:134, icons:7, legendaries:24, score:8800, gameScore:1420},
    {uid:'demo3', displayName:'🏆 AlbumMaster',       photoURL:null, pct:82, collected:125, icons:6, legendaries:20, score:8200, gameScore:1200},
    {uid:'demo4', displayName:'⭐ MundialFaraon',     photoURL:null, pct:76, collected:116, icons:5, legendaries:17, score:7600, gameScore:980},
    {uid:'demo5', displayName:'🐐 MessiEterno',       photoURL:null, pct:71, collected:108, icons:4, legendaries:15, score:7100, gameScore:860},
    {uid:'demo6', displayName:'🔥 HaalandBeast',      photoURL:null, pct:65, collected:99,  icons:3, legendaries:12, score:6500, gameScore:740},
    {uid:'demo7', displayName:'💪 LaGarraCharrua',    photoURL:null, pct:58, collected:88,  icons:2, legendaries:10, score:5800, gameScore:620},
    {uid:'demo8', displayName:'⚡ ElTri_Siempre',     photoURL:null, pct:47, collected:71,  icons:1, legendaries:7,  score:4700, gameScore:410},
    {uid: state.userId||'me', displayName: window._firebase?.auth?.currentUser?.displayName||'Tú',
     photoURL: window._firebase?.auth?.currentUser?.photoURL||null,
     pct: me.pct, collected: me.collected, icons: me.icons, legendaries: me.legendaries,
     score: me.score, gameScore: me.gameScore},
  ].sort((a,b)=>b.score-a.score);
  rankingState.data = demoData;
  rankingState.totalUsers = demoData.length;
  rankingState.loading = false;
  renderRankingData(demoData);
}

// ── RENDER DATA ───────────────────────────────────────────
function renderRankingData(data) {
  if(!data.length) return;
  const myUid = state.userId;
  const myIdx = data.findIndex(d => d.uid === myUid);
  const myPos = myIdx >= 0 ? myIdx + 1 : null;
  const me = computeMyScore();

  // Update hero stats
  const heroStats = document.getElementById('rk-hero-stats');
  if(heroStats) {
    const completes = data.filter(d=>d.pct>=100).length;
    const avgPct = data.length ? Math.round(data.reduce((a,d)=>a+(d.pct||0),0)/data.length) : 0;
    heroStats.innerHTML = `
      <div class="rk-hero-stat"><div class="n">${data.length}</div><div class="l">COLECCIONISTAS</div></div>
      <div class="rk-hero-stat"><div class="n" style="color:var(--green)">${completes}</div><div class="l">ÁLBUM COMPLETO</div></div>
      <div class="rk-hero-stat"><div class="n">${avgPct}%</div><div class="l">PROMEDIO GLOBAL</div></div>`;
  }

  // My rank card
  const myWrap = document.getElementById('rk-my-card-wrap');
  if(myWrap) {
    const myEntry = data[myIdx] || {pct: me.pct, collected: me.collected, icons: me.icons};
    myWrap.innerHTML = `<div class="rk-my-card">
      <div class="rk-my-pos${!myPos?' unranked':''}">${myPos ? '#'+myPos : 'Sin ranking'}</div>
      <div class="rk-my-info">
        <div class="rk-my-name">${window._firebase?.auth?.currentUser?.displayName||'Tú'}</div>
        <div class="rk-my-stats">
          ${myEntry.collected||0} láminas · ${myEntry.icons||0} íconos · ${myEntry.legendaries||0} legendarias
          ${state.userMode==='demo'?'<span style="color:var(--muted);margin-left:6px;">(Modo demo)</span>':''}
        </div>
        ${data.length > 1 && myPos ? `<div style="font-size:10px;color:var(--muted);font-family:var(--fm);margin-top:4px;">
          Superas al ${Math.round(((data.length-myPos)/data.length)*100)}% de coleccionistas
        </div>` : ''}
      </div>
      <div class="rk-my-progress">
        <div class="rk-my-pct">${myEntry.pct||me.pct}%</div>
        <div class="rk-my-pct-label">COMPLETADO</div>
        ${state.userMode==='demo'?`<button onclick="publishMyRanking().then(()=>toast('Publicado ✓','success'))"
          style="margin-top:6px;padding:5px 10px;border-radius:5px;border:1px solid var(--gold);
          background:var(--gold-dim);color:var(--gold);font-family:var(--fb);font-size:11px;cursor:pointer;">
          Publicar mi score</button>`:''}
      </div>
    </div>`;
  }

  // Podium (top 3)
  const podium = document.getElementById('rk-podium');
  if(podium) {
    const top3 = data.slice(0,3);
    const medals = ['🥇','🥈','🥉'];
    const pClasses = ['p1','p2','p3'];
    const colors = [
      'linear-gradient(135deg,rgba(239,159,39,0.25),rgba(239,159,39,0.05))',
      'linear-gradient(135deg,rgba(192,192,192,0.15),rgba(192,192,192,0.03))',
      'linear-gradient(135deg,rgba(176,141,87,0.15),rgba(176,141,87,0.03))',
    ];
    podium.innerHTML = top3.map((u,i) => {
      const isMe = u.uid === myUid;
      const initials = (u.displayName||'?').replace(/[^a-zA-Z\u00C0-\u024F\u4e00-\u9fa5 ]/g,'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?';
      return `<div class="rk-podium-card ${pClasses[i]}" style="${i===0?'background:'+colors[i]+';':''}" onclick="if('${u.uid}'!=='${myUid}')toast('${u.displayName||'Usuario'} — ${u.pct}% completado')">
        ${i===0?'<div class="rk-crown">👑</div>':''}
        <div class="rk-podium-medal">${medals[i]}</div>
        <div class="rk-podium-avatar" style="background:${avatarGradient(u.uid)}">
          ${u.photoURL
            ? `<img src="${u.photoURL}" onerror="this.style.display='none'">`
            : `<span>${initials}</span>`}
        </div>
        <div class="rk-podium-name">${u.displayName||'Coleccionista'}${isMe?' <span class="rk-badge-me">TÚ</span>':''}</div>
        <div class="rk-podium-pct">${u.pct||0}%</div>
        <div class="rk-podium-detail">${u.collected||0} láminas · ${u.icons||0} íconos</div>
      </div>`;
    }).join('');
  }

  // Full table
  const tbody = document.getElementById('rk-table-body');
  if(!tbody) return;

  const maxScore = data[0]?.score || 1;

  tbody.innerHTML = data.map((u, idx) => {
    const pos = idx + 1;
    const isMe = u.uid === myUid;
    const posClass = pos===1?'p1':pos===2?'p2':pos===3?'p3':'pn';
    const posLabel = pos<=3 ? ['🥇','🥈','🥉'][pos-1] : pos;
    const barW = Math.round((u.score||0)/maxScore*100);
    const initials = (u.displayName||'?').replace(/[^a-zA-Z\u00C0-\u024F ]/g,'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?';

    return `<div class="rk-row${isMe?' me':''}">
      <div class="rk-pos ${posClass}">${posLabel}</div>
      <div class="rk-user">
        <div class="rk-avatar-sm" style="background:${avatarGradient(u.uid)}">
          ${u.photoURL
            ? `<img src="${u.photoURL}" onerror="this.style.display='none'">`
            : `<span>${initials}</span>`}
        </div>
        <div>
          <div class="rk-user-name">${u.displayName||'Coleccionista'}${isMe?'<span class="rk-badge-me">TÚ</span>':''}</div>
          <div class="rk-user-sub">Trivia: ${u.gameScore||0} pts</div>
        </div>
      </div>
      <div>
        <div class="rk-cell">${u.collected||0}</div>
        <div class="rk-cell-bar-wrap"><div class="rk-cell-bar" style="width:${barW}%"></div></div>
      </div>
      <div class="rk-cell">${u.icons||0}</div>
      <div class="rk-cell green">${u.pct||0}%</div>
    </div>`;
  }).join('');
}

// ── TABS ──────────────────────────────────────────────────
window.setRkTab = function(tab) {
  rankingState.tab = tab;
  document.querySelectorAll('.rk-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(`rkt-${tab}`)?.classList.add('active');

  let sorted = [...rankingState.data];
  if(tab === 'icons') {
    sorted.sort((a,b) => (b.icons||0) - (a.icons||0) || (b.score||0) - (a.score||0));
  } else {
    sorted.sort((a,b) => (b.score||0) - (a.score||0));
  }
  renderRankingData(sorted);
};

// ── HELPERS ───────────────────────────────────────────────
function avatarGradient(uid) {
  const seed = (uid||'x').split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const colors = [
    ['#E31E24','#004F9F'], ['#00A650','#004F9F'], ['#E31E24','#00A650'],
    ['#9C27B0','#E31E24'], ['#FF6600','#9C27B0'], ['#004F9F','#00A650'],
    ['#E31E24','#FF6600'], ['#00BCD4','#004F9F'],
  ];
  const pair = colors[seed % colors.length];
  return `linear-gradient(135deg,${pair[0]},${pair[1]})`;
}

window.shareMyProfile = function() {
  const me = computeMyScore();
  const pos = rankingState.data.findIndex(d=>d.uid===state.userId) + 1;
  const posStr = pos > 0 ? `#${pos} en el ranking global` : 'en el ranking';
  const text = `🏅 Soy ${posStr} del Álbum Mundial 2026\n\n⚽ ${me.collected}/${me.totalItems} láminas (${me.pct}%)\n⭐ ${me.icons} íconos · 🌟 ${me.legendaries} legendarias\n🎮 Trivia: ${me.gameScore} pts\n\n#AlbumMundial2026 #FIFAWorldCup2026`;
  navigator.clipboard.writeText(text)
    .then(() => toast('Perfil copiado al portapapeles ✓', 'success'))
    .catch(() => toast('No se pudo copiar'));
};

// Auto-publish when state changes (hook into saveState)
const _origSave = window.saveState;
if(_origSave) {
  window.saveState = function() {
    _origSave();
    // Debounced publish to ranking
    clearTimeout(window._rkPublishTimer);
    window._rkPublishTimer = setTimeout(publishMyRanking, 5000);
  };
}

// Cleanup listener when navigating away
const _origNav = window.navigate;
window.navigate = function(view, code) {
  if(view !== 'ranking' && rankingState.unsubscribe) {
    rankingState.unsubscribe();
    rankingState.unsubscribe = null;
  }
  _origNav(view, code);
};
