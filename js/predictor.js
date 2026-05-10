function renderPredictor(page) {
  page.innerHTML = `<div class="predictor-wrap page-enter">
    <button class="page-back-btn" onclick="navigate('home')">← Inicio</button>
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
  // ── ESTRATEGIA: Cloud Function → fallback directo con API key ──
  const base = (typeof CLOUD_FUNCTION_BASE !== 'undefined' && CLOUD_FUNCTION_BASE)
    ? CLOUD_FUNCTION_BASE.replace(/\/$/, '')
    : '';

  // Intentar Cloud Function si está configurada
  if (base) {
    try {
      const token = typeof getFirebaseIdToken === 'function'
        ? await getFirebaseIdToken().catch(() => null)
        : null;

      const response = await fetch(`${base}/claudeProxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          mode: predState?.mode || 'match',
          prompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const raw = data.content?.find(b => b.type === 'text')?.text || '';
        return JSON.parse(raw.replace(/```json|```/g, '').trim());
      }
      // Si la CF respondió pero con error, caer a modo directo
      console.warn('[Predictor] Cloud Function error', response.status, '— intentando directo');
    } catch(cfErr) {
      console.warn('[Predictor] Cloud Function no disponible:', cfErr.message, '— intentando directo');
    }
  }

  // ── Fallback: llamada directa con API key ──────────────
  return callClaudeDirect(prompt);
}

// ── Llamada directa a Anthropic ─────────────────────────────
// Usa el header requerido para llamadas desde el navegador.
// API key: configura window.ANTHROPIC_API_KEY en index.html o en la consola.
async function callClaudeDirect(prompt) {
  const apiKey = window.ANTHROPIC_API_KEY || '';

  if (!apiKey) {
    throw new Error(
      'Configura tu API key de Anthropic.\n\n' +
      'Abre la consola del navegador y escribe:\n' +
      'window.ANTHROPIC_API_KEY = "sk-ant-...tu-key..."\n\n' +
      'O edita index.html y agrega:\n' +
      'window.ANTHROPIC_API_KEY = "sk-ant-...";'
    );
  }

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch(fetchErr) {
    throw new Error(
      'No se pudo conectar con la IA.\n' +
      'Verifica tu conexión a internet.\n' +
      'Detalle: ' + fetchErr.message
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err.error?.message || `HTTP ${response.status}`;
    if (response.status === 401) throw new Error('API key inválida. Verifica tu clave de Anthropic.');
    if (response.status === 429) throw new Error('Límite de uso alcanzado. Intenta en unos minutos.');
    throw new Error('Error de la IA: ' + msg);
  }

  const data = await response.json();
  const raw = data.content?.find(b => b.type === 'text')?.text || '';
  if (!raw) throw new Error('La IA no devolvió respuesta. Intenta de nuevo.');

  const clean = raw.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch(parseErr) {
    // Si no es JSON válido, intentar extraer JSON del texto
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('Respuesta inesperada de la IA. Intenta de nuevo.');
  }
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
      <div style="background:var(--surface2);border:1px solid rgba(227,30,36,0.2);
        border-radius:12px;padding:24px;text-align:center;font-family:var(--fb);">
        <div style="font-size:32px;margin-bottom:10px;">${err.message.includes('Configura')||err.message.includes('API key')?'🔑':'⚠️'}</div>
        <div style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--red);">
          ${err.message.includes('Configura')||err.message.includes('API key')?'API Key requerida':'Error al conectar con la IA'}
        </div>
        <div style="font-size:12px;color:var(--muted);font-family:var(--fs);line-height:1.7;margin-bottom:14px;max-width:380px;margin-left:auto;margin-right:auto;">
          ${err.message.includes('Configura')||err.message.includes('API key')
            ? 'Necesitas tu API key de Anthropic para usar el Predictor IA.'
            : 'Verifica tu conexión a internet.'}
          <br><code style="font-size:10px;font-family:var(--fm);opacity:.7;">${err.message}</code>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button onclick="runPredictor()" style="padding:8px 18px;border-radius:7px;
            border:1px solid var(--border2);background:transparent;color:var(--muted);
            font-family:var(--fb);cursor:pointer;">🔄 Reintentar</button>
          <button onclick="(function(){const k=prompt('Pega tu API key de Anthropic (empieza con sk-ant-):');if(k&&k.includes('sk-')){window.ANTHROPIC_API_KEY=k;toast('API key configurada ✓','success');runPredictor();}else if(k){toast('Formato inválido','error');}})()"
            style="padding:8px 18px;border-radius:7px;
            border:none;background:var(--gold);color:#1a0a00;
            font-family:var(--fb);cursor:pointer;font-weight:700;">🔑 Ingresar API Key</button>
        </div>
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

