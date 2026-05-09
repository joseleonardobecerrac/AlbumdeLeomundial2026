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
    <button class="trivia-rank-btn" onclick="showTriviaRanking(document.getElementById('page'))">
      🏅 Ver Ranking Global
    </button>
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

  // Guardar en ranking global de Firestore
  saveTriviaScore(score, pct, correct, answered.length);

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
      <button class="res-btn secondary" onclick="showTriviaRanking(document.getElementById('page'))">🏅 RANKING</button>
      <button class="res-btn secondary" onclick="navigate('home')">AL ÁLBUM</button>
    </div>
  </div>`;
}


// ═══════════════════════════════════════════════════════════
// TRIVIA RANKING GLOBAL
// ═══════════════════════════════════════════════════════════

async function saveTriviaScore(score, pct, correct, total) {
  if (!state.userId || !window._firebase) return;
  try {
    const { db, doc, setDoc, getDoc } = window._firebase;
    const ref = doc(db, 'triviaRanking', state.userId);
    const snap = await getDoc(ref);
    const prev = snap.exists() ? snap.data() : {};

    // Solo actualizar si es nuevo récord
    if ((prev.bestScore || 0) >= score) return;

    const userName = state.displayName || state.userEmail?.split('@')[0] || 'Anónimo';
    await setDoc(ref, {
      userId: state.userId,
      name: userName,
      bestScore: score,
      bestPct: pct,
      bestCorrect: correct,
      bestTotal: total,
      updatedAt: new Date().toISOString(),
    });
    toast('🏅 ¡Nuevo récord guardado en el ranking!', 'success');
  } catch(e) {
    console.warn('[Trivia] No se pudo guardar ranking:', e);
  }
}

window.showTriviaRanking = async function(page) {
  page.innerHTML = `<div class="page-enter" style="max-width:700px;margin:0 auto;">
    <div style="font-family:var(--fd);font-size:40px;letter-spacing:3px;margin-bottom:4px;">🏅 RANKING TRIVIA</div>
    <div style="font-size:11px;color:var(--muted);font-family:var(--fm);margin-bottom:24px;">Top jugadores de trivia mundialista</div>
    <div id="trivia-rank-body">
      <div style="text-align:center;padding:40px;color:var(--muted);font-family:var(--fs);">Cargando ranking...</div>
    </div>
    <div style="display:flex;gap:10px;margin-top:20px;">
      <button class="res-btn primary" onclick="triviaState.phase='lobby';triviaState.questions=[];renderTrivia(document.getElementById('page'))">
        ▶ Jugar
      </button>
      <button class="res-btn secondary" onclick="navigate('home')">← Álbum</button>
    </div>
  </div>`;

  if (!window._firebase) {
    document.getElementById('trivia-rank-body').innerHTML =
      '<div style="text-align:center;color:var(--muted);font-family:var(--fs);padding:20px;">Firebase no disponible</div>';
    return;
  }

  try {
    const { db, collection, getDocs, query } = window._firebase;
    // Necesitamos orderBy — usar getDocs y ordenar client-side (sin índice)
    const snap = await getDocs(collection(db, 'triviaRanking'));
    const entries = [];
    snap.forEach(d => entries.push(d.data()));
    entries.sort((a,b) => (b.bestScore||0) - (a.bestScore||0));
    const top = entries.slice(0, 25);

    const myPos = entries.findIndex(e => e.userId === state.userId) + 1;
    const myEntry = entries.find(e => e.userId === state.userId);

    const podiumIcons = ['🥇','🥈','🥉'];

    let html = '';

    // Mi posición
    if (myEntry) {
      html += `<div class="trk-my-row">
        <span class="trk-my-label">Tu posición: <strong>#${myPos}</strong></span>
        <span class="trk-my-score">${myEntry.bestScore} pts</span>
      </div>`;
    }

    // Tabla
    html += `<div class="trk-table">
      <div class="trk-header">
        <span>#</span><span>Jugador</span><span>Puntos</span><span>Precisión</span>
      </div>`;

    top.forEach((e, i) => {
      const isMe = e.userId === state.userId;
      const icon = i < 3 ? podiumIcons[i] : `${i+1}`;
      html += `<div class="trk-row${isMe?' trk-row-me':''}">
        <span class="trk-pos">${icon}</span>
        <span class="trk-name">${e.name || 'Anónimo'}</span>
        <span class="trk-score" style="color:var(--gold);font-family:var(--fd);font-size:18px;">${e.bestScore}</span>
        <span class="trk-pct" style="color:var(--${e.bestPct>=80?'green':e.bestPct>=50?'gold':'muted'})">${e.bestPct||0}%</span>
      </div>`;
    });

    html += '</div>';

    if (top.length === 0) {
      html = '<div style="text-align:center;color:var(--muted);font-family:var(--fs);padding:40px;">Sé el primero en jugar y aparecer en el ranking 🏆</div>';
    }

    document.getElementById('trivia-rank-body').innerHTML = html;
  } catch(e) {
    console.error('[Trivia Ranking]', e);
    document.getElementById('trivia-rank-body').innerHTML =
      `<div style="text-align:center;color:var(--muted);font-family:var(--fs);padding:20px;">Error al cargar: ${e.message}</div>`;
  }
};
