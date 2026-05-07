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
      data-pid="${p.id}" onclick="if(!${disabled})pickPlayer(this.dataset.pid)">
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

