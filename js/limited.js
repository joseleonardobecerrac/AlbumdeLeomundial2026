// ═══════════════════════════════════════════════════════════
// LÁMINAS ESPECIALES — EDICIÓN LIMITADA
// ═══════════════════════════════════════════════════════════

// ── CSS ───────────────────────────────────────────────────
(function injectLimitedCSS() {
  if(document.getElementById('limited-styles')) return;
  const s = document.createElement('style');
  s.id = 'limited-styles';
  s.textContent = `
/* ══ EDICIÓN LIMITADA ══════════════════════════════════════ */

/* Sidebar badge indicator */
#nav-limited .sb-flag::after {
  content: '●';
  color: var(--icon-c);
  font-size: 7px;
  position: absolute;
  margin-left: 2px;
  animation: limitedPing 2s ease-in-out infinite;
}
@keyframes limitedPing { 0%,100%{opacity:1} 50%{opacity:.3} }

/* SPECIAL RARITY — "limited" tier above icon */
.sticker-slot.limited { border-style: solid; }
.sticker-slot.limited::before { background: linear-gradient(90deg,#E31E24,#EF9F27,#00A650,#004F9F,#E31E24); background-size:200%; animation:rainbowBar 3s linear infinite; }
@keyframes rainbowBar { to{ background-position: 200% 0; } }
.sticker-slot.limited.collected {
  border-color: rgba(229,53,171,0.7);
  box-shadow: 0 0 28px rgba(229,53,171,0.35), 0 0 60px rgba(239,159,39,0.1);
  background: linear-gradient(160deg,rgba(229,53,171,0.08),rgba(239,159,39,0.04),transparent);
}
.sticker-slot.limited.collected::after {
  background: linear-gradient(135deg,transparent 20%,rgba(255,255,255,0.08) 50%,transparent 80%);
  animation: sheen 2.5s ease-in-out infinite;
}
.limited .slot-rarity-dot {
  background: linear-gradient(135deg,#E31E24,#EF9F27,#E535AB);
  box-shadow: 0 0 8px rgba(229,53,171,0.8);
}

/* Main limited page */
.ltd-wrap { max-width: 960px; margin: 0 auto; padding-bottom: 60px; }

.ltd-hero {
  position: relative; overflow: hidden;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 20px; padding: 36px 32px 30px; margin-bottom: 24px;
}
.ltd-hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 10% 50%, rgba(229,53,171,0.12),transparent 55%),
              radial-gradient(ellipse at 90% 50%, rgba(239,159,39,0.09),transparent 55%);
}
.ltd-hero-stripe {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg,#E31E24,#EF9F27,#00A650,#004F9F,#E535AB,#E31E24);
  background-size: 200%; animation: rainbowBar 3s linear infinite;
}
.ltd-hero h2 {
  font-family: var(--fd); font-size: 44px; letter-spacing: 4px; position: relative;
  background: linear-gradient(90deg, #E535AB, #EF9F27, #5BA4F5);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.ltd-hero p { font-size: 13px; color: var(--muted); font-family: var(--fs); margin-top: 6px; position: relative; max-width: 520px; line-height: 1.6; }
.ltd-hero-stats { display: flex; gap: 0; margin-top: 20px; position: relative; }
.ltd-hero-stat { padding: 10px 20px; border-left: 1px solid var(--border); text-align: center; }
.ltd-hero-stat:first-child { padding-left: 0; border: none; }
.ltd-hero-stat .n { font-family: var(--fd); font-size: 30px; }
.ltd-hero-stat .n.pink { color: var(--icon-c); }
.ltd-hero-stat .n.gold { color: var(--gold); }
.ltd-hero-stat .l { font-size: 9px; font-family: var(--fm); letter-spacing: 1.5px; color: var(--muted); margin-top: 1px; }

/* Section tabs */
.ltd-tabs { display: flex; gap: 6px; margin-bottom: 22px; flex-wrap: wrap; }
.ltd-tab {
  padding: 7px 18px; border-radius: 7px; font-family: var(--fb); font-size: 13px; font-weight: 600;
  border: 1px solid var(--border2); background: transparent; color: var(--muted);
  cursor: pointer; transition: all .12s; letter-spacing: .3px;
}
.ltd-tab.active { background: rgba(229,53,171,0.08); border-color: rgba(229,53,171,0.35); color: var(--icon-c); }
.ltd-tab:hover:not(.active) { color: var(--text); border-color: var(--border3); }
.ltd-tab .tab-badge {
  display: inline-block; font-size: 8px; font-family: var(--fm); padding: 1px 5px;
  border-radius: 3px; margin-left: 5px; vertical-align: middle;
}
.ltd-tab .tab-badge.live { background: rgba(0,166,80,.15); color: var(--green); }
.ltd-tab .tab-badge.soon { background: rgba(239,159,39,.15); color: var(--gold); }
.ltd-tab .tab-badge.n { background: var(--surface3); color: var(--muted); }

/* Active window banner */
.ltd-window-banner {
  display: flex; align-items: center; gap: 14px;
  background: rgba(229,53,171,0.06); border: 1px solid rgba(229,53,171,0.25);
  border-radius: 14px; padding: 14px 20px; margin-bottom: 22px;
}
.ltd-window-icon { font-size: 28px; flex-shrink: 0; }
.ltd-window-info { flex: 1; }
.ltd-window-title { font-family: var(--fd); font-size: 18px; letter-spacing: 1px; color: var(--icon-c); margin-bottom: 2px; }
.ltd-window-desc { font-size: 12px; color: var(--muted); font-family: var(--fs); line-height: 1.5; }
.ltd-window-timer { text-align: right; flex-shrink: 0; }
.ltd-window-time { font-family: var(--fm); font-size: 13px; color: var(--gold); letter-spacing: 1px; }
.ltd-window-time-label { font-size: 9px; color: var(--muted); font-family: var(--fm); letter-spacing: 1px; margin-top: 2px; }

/* Card grid for limited editions */
.ltd-cards-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px;
  margin-bottom: 28px;
}

/* Limited sticker card */
.ltd-card {
  aspect-ratio: 3/4; border-radius: 14px; position: relative;
  overflow: hidden; cursor: pointer; transition: transform .2s, box-shadow .2s;
  border: 1.5px solid transparent;
}
.ltd-card:hover { transform: translateY(-6px) scale(1.02); }

/* Locked state */
.ltd-card.locked {
  background: var(--surface2); border-color: var(--border);
  cursor: default;
}
.ltd-card.locked:hover { transform: none; }

/* Available (can claim) */
.ltd-card.available {
  border-color: rgba(229,53,171,0.5);
  box-shadow: 0 0 20px rgba(229,53,171,0.2);
  animation: availablePulse 2.5s ease-in-out infinite;
}
@keyframes availablePulse {
  0%,100% { box-shadow: 0 0 20px rgba(229,53,171,0.2); }
  50%      { box-shadow: 0 0 40px rgba(229,53,171,0.45); }
}

/* Owned */
.ltd-card.owned {
  border-color: rgba(239,159,39,0.55);
  box-shadow: 0 0 22px rgba(239,159,39,0.2);
}

/* Rainbow border for "ultra rare" */
.ltd-card.ultra::before {
  content: ''; position: absolute; inset: -2px; z-index: -1; border-radius: 15px;
  background: linear-gradient(90deg,#E31E24,#EF9F27,#00A650,#004F9F,#E535AB,#E31E24);
  background-size: 300%; animation: rainbowBar 2s linear infinite;
}

.ltd-card-bg {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
}
.ltd-card-top { flex: 1; display: flex; align-items: center; justify-content: center; }
.ltd-card-emoji { font-size: 52px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); }
.ltd-card-emoji.locked-emoji { font-size: 40px; opacity: .15; filter: grayscale(1); }

.ltd-card-info {
  padding: 8px 9px 9px;
  background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%);
}
.ltd-card-name { font-family: var(--fd); font-size: 11px; letter-spacing: .5px; color: #fff; margin-bottom: 2px; line-height: 1.2; }
.ltd-card-type { font-size: 8px; font-family: var(--fm); letter-spacing: 1px; margin-bottom: 4px; }
.ltd-card-type.limited { color: var(--icon-c); }
.ltd-card-type.seasonal { color: var(--gold); }
.ltd-card-type.achievement { color: var(--green); }
.ltd-card-type.event { color: var(--rare-c); }

/* Timer on card */
.ltd-card-timer {
  font-size: 8px; font-family: var(--fm); color: var(--gold);
  letter-spacing: .5px; display: flex; align-items: center; gap: 3px;
}
.ltd-card-timer-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--green); animation: rkLivePulse 1.5s infinite; }

/* Claim button overlay */
.ltd-claim-overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: flex-end; padding-bottom: 10px;
  background: linear-gradient(0deg, rgba(229,53,171,0.3) 0%, transparent 60%);
  opacity: 0; transition: opacity .2s;
}
.ltd-card.available:hover .ltd-claim-overlay { opacity: 1; }
.ltd-claim-btn-overlay {
  padding: 5px 14px; border-radius: 6px; font-family: var(--fd); font-size: 12px;
  letter-spacing: 1px; background: var(--icon-c); color: #fff; border: none; cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

/* Owned badge */
.ltd-owned-badge {
  position: absolute; top: 8px; right: 8px;
  background: rgba(0,0,0,0.7); border: 1px solid var(--gold);
  border-radius: 4px; padding: 2px 6px;
  font-size: 8px; font-family: var(--fm); color: var(--gold); letter-spacing: .5px;
}

/* Lock overlay */
.ltd-lock-overlay {
  position: absolute; inset: 0;
  background: rgba(7,10,16,0.75); backdrop-filter: blur(2px);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
}
.ltd-lock-icon { font-size: 24px; opacity: .5; }
.ltd-lock-label {
  font-size: 9px; font-family: var(--fm); color: var(--muted);
  letter-spacing: 1px; text-align: center; padding: 0 10px; line-height: 1.5;
}

/* Rarity bar */
.ltd-card-rarity-bar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
}
.ltd-card-rarity-bar.limited { background: linear-gradient(90deg,#E31E24,#E535AB,#EF9F27); }
.ltd-card-rarity-bar.seasonal { background: linear-gradient(90deg,#EF9F27,#FFD700); }
.ltd-card-rarity-bar.event { background: linear-gradient(90deg,var(--rare-c),var(--blue)); }
.ltd-card-rarity-bar.achievement { background: linear-gradient(90deg,var(--green),var(--rare-c)); }

/* Detail modal */
.ltd-modal {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
  z-index: 400; display: none; align-items: center; justify-content: center;
}
.ltd-modal.open { display: flex; }
.ltd-modal-box {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 20px; width: 380px; max-width: 92vw;
  animation: modalIn .25s cubic-bezier(.34,1.56,.64,1);
  overflow: hidden;
}
.ltd-modal-header {
  padding: 20px 22px 16px;
  background: linear-gradient(135deg,rgba(229,53,171,0.08),rgba(239,159,39,0.04));
  border-bottom: 1px solid var(--border);
}
.ltd-modal-emoji { font-size: 52px; margin-bottom: 10px; display: block; text-align: center; }
.ltd-modal-title { font-family: var(--fd); font-size: 24px; letter-spacing: 2px; text-align: center; margin-bottom: 3px; }
.ltd-modal-type { font-size: 10px; font-family: var(--fm); letter-spacing: 2px; text-align: center; color: var(--icon-c); }

.ltd-modal-body { padding: 20px 22px; }
.ltd-modal-desc { font-size: 13px; color: var(--muted); font-family: var(--fs); line-height: 1.65; margin-bottom: 16px; }
.ltd-modal-meta { display: flex; flex-direction: column; gap: 7px; margin-bottom: 20px; }
.ltd-modal-meta-row { display: flex; justify-content: space-between; font-size: 11px; font-family: var(--fm); }
.ltd-modal-meta-row .k { color: var(--muted); letter-spacing: 1px; }
.ltd-modal-meta-row .v { color: var(--text); font-weight: 500; }
.ltd-modal-meta-row .v.green { color: var(--green); }
.ltd-modal-meta-row .v.pink { color: var(--icon-c); }
.ltd-modal-meta-row .v.gold { color: var(--gold); }

.ltd-modal-claim-btn {
  width: 100%; padding: 13px; border-radius: 10px; font-family: var(--fd);
  font-size: 18px; letter-spacing: 3px; border: none; cursor: pointer; transition: all .15s;
  background: linear-gradient(135deg,#E535AB,#7F77DD); color: #fff;
  box-shadow: 0 4px 20px rgba(229,53,171,0.3);
}
.ltd-modal-claim-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(229,53,171,0.45); }
.ltd-modal-claim-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.ltd-modal-already { text-align: center; font-size: 13px; font-family: var(--fb); color: var(--green); padding: 12px; }
.ltd-modal-close {
  position: absolute; top: 14px; right: 14px; background: none; border: none;
  color: var(--muted); cursor: pointer; font-size: 18px; padding: 4px 8px;
  border-radius: 4px; transition: color .12s;
}
.ltd-modal-close:hover { color: var(--red); }

/* Countdown */
.ltd-countdown {
  font-family: var(--fm); font-size: 11px; color: var(--gold); letter-spacing: 1px;
  text-align: center; margin-top: 6px;
}

/* Sparkle animation on claim */
.ltd-sparkle {
  position: fixed; pointer-events: none; z-index: 500;
  font-size: 20px; animation: sparkleUp 1.2s ease forwards;
}
@keyframes sparkleUp {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-80px) scale(0.5); }
}

/* Progress section */
.ltd-progress-section { margin-bottom: 28px; }
.ltd-progress-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.ltd-progress-label { font-size: 11px; font-family: var(--fm); color: var(--muted); letter-spacing: 1px; width: 120px; flex-shrink: 0; }
.ltd-progress-bar { flex: 1; height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; }
.ltd-progress-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
.ltd-progress-count { font-size: 11px; font-family: var(--fm); color: var(--text); width: 40px; text-align: right; flex-shrink: 0; }
`;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// LIMITED EDITION DATA
// Time windows: { start: hour(0-23), end: hour }, days: [0-6] (0=Sun), event triggers, etc.
// ═══════════════════════════════════════════════════════════
const LIMITED_CARDS = [
  // ── HORARIAS (disponibles cierto rango de hora cada día) ─
  {
    id: 'LTD-DAWN',
    name: 'Amanecer del Gol',
    emoji: '🌅',
    type: 'limited',
    tier: 'ultra',
    desc: 'Solo disponible al amanecer (5:00 – 7:00 AM). El primer gol de un torneo siempre llega cuando el mundo duerme.',
    condition: 'hour',
    hourStart: 5, hourEnd: 7,
    days: null, // any day
    claimable: () => { const h = new Date().getHours(); return h >= 5 && h < 7; },
    windowDesc: () => {
      const h = new Date().getHours();
      if(h >= 5 && h < 7) return '🟢 Disponible ahora · Cierra a las 7:00 AM';
      if(h < 5) return `⏳ Disponible en ${5-h}h`;
      return `⏳ Vuelve mañana a las 5:00 AM`;
    },
    bg: 'linear-gradient(160deg,#1a0a2e,#2e1a0a)',
    bgCollected: 'linear-gradient(160deg,#2e0a1e,#1a1a0e)',
  },
  {
    id: 'LTD-MIDNIGHT',
    name: 'Gol en la Media Noche',
    emoji: '🌙',
    type: 'limited',
    tier: 'ultra',
    desc: 'Solo aparece a medianoche (00:00 – 01:00 AM). Los héroes del Mundial marcaron cuando nadie lo esperaba.',
    condition: 'hour',
    hourStart: 0, hourEnd: 1,
    days: null,
    claimable: () => new Date().getHours() === 0,
    windowDesc: () => {
      const h = new Date().getHours();
      return h === 0 ? '🟢 Disponible ahora · Cierra a la 1:00 AM' : `⏳ Disponible en ${24-h}h`;
    },
    bg: 'linear-gradient(160deg,#050510,#0a0a1e)',
    bgCollected: 'linear-gradient(160deg,#100a20,#050510)',
  },
  {
    id: 'LTD-GOLDEN',
    name: 'La Hora Dorada',
    emoji: '⚡',
    type: 'limited',
    tier: 'limited',
    desc: 'Disponible solo entre 18:00 y 20:00. La "Golden Hour" del fútbol — cuando los estadios se llenan y los focos brillan.',
    condition: 'hour',
    hourStart: 18, hourEnd: 20,
    days: null,
    claimable: () => { const h = new Date().getHours(); return h >= 18 && h < 20; },
    windowDesc: () => {
      const h = new Date().getHours();
      if(h >= 18 && h < 20) return '🟢 Disponible ahora · Cierra a las 20:00';
      if(h < 18) return `⏳ Disponible en ${18-h}h`;
      return `⏳ Vuelve mañana a las 18:00`;
    },
    bg: 'linear-gradient(160deg,#1a0f00,#2a1800)',
    bgCollected: 'linear-gradient(160deg,#2a1500,#1a0a00)',
  },

  // ── POR DÍA DE LA SEMANA ──────────────────────────────────
  {
    id: 'LTD-WEEKEND',
    name: 'Clásico del Fin de Semana',
    emoji: '🏆',
    type: 'seasonal',
    tier: 'limited',
    desc: 'Solo disponible sábado y domingo. Los grandes clásicos siempre se juegan en fin de semana.',
    condition: 'day',
    days: [0, 6], // Sun, Sat
    claimable: () => [0, 6].includes(new Date().getDay()),
    windowDesc: () => {
      const d = new Date().getDay();
      if([0,6].includes(d)) return '🟢 Disponible todo el fin de semana';
      const daysLeft = d === 5 ? 1 : 6 - d;
      return `⏳ Disponible en ${daysLeft} día${daysLeft!==1?'s':''}`;
    },
    bg: 'linear-gradient(160deg,#0a1a0a,#001a00)',
    bgCollected: 'linear-gradient(160deg,#0a2a0a,#001500)',
  },
  {
    id: 'LTD-MONDAY',
    name: 'El Lunes del Campeón',
    emoji: '💪',
    type: 'seasonal',
    tier: 'limited',
    desc: 'Solo el lunes. El campeón entrena cuando todos descansan. Los lunes construyen las victorias del domingo.',
    condition: 'day',
    days: [1],
    claimable: () => new Date().getDay() === 1,
    windowDesc: () => {
      const d = new Date().getDay();
      if(d === 1) return '🟢 Disponible hoy (lunes)';
      const diff = (1 - d + 7) % 7;
      return `⏳ Disponible en ${diff} día${diff!==1?'s':''}`;
    },
    bg: 'linear-gradient(160deg,#001a10,#001020)',
    bgCollected: 'linear-gradient(160deg,#002a15,#001530)',
  },

  // ── LOGROS / ACHIEVEMENTS ─────────────────────────────────
  {
    id: 'LTD-ACH-COLLECTOR',
    name: 'Gran Coleccionista',
    emoji: '📚',
    type: 'achievement',
    tier: 'limited',
    desc: 'Pega 50 láminas o más en tu álbum. El verdadero coleccionista no para hasta llenar cada página.',
    condition: 'achievement',
    claimable: () => (state.collected?.size || 0) >= 50,
    windowDesc: () => {
      const n = state.collected?.size || 0;
      return n >= 50 ? '🟢 Logro desbloqueado · ¡Ya tienes 50+ láminas!' : `⏳ Necesitas ${50-n} láminas más (tienes ${n})`;
    },
    bg: 'linear-gradient(160deg,#0a0a1e,#1a0a2e)',
    bgCollected: 'linear-gradient(160deg,#1a0a2e,#0a1a2e)',
  },
  {
    id: 'LTD-ACH-ICONS',
    name: 'Cazador de Íconos',
    emoji: '🌟',
    type: 'achievement',
    tier: 'ultra',
    desc: 'Consigue 3 láminas ICON en tu álbum. Messi, Mbappé, Haaland — solo los mejores coleccionistas los tienen todos.',
    condition: 'achievement',
    claimable: () => {
      const allPlayers = typeof COUNTRIES !== 'undefined'
        ? COUNTRIES.flatMap(c=>c.players).filter(p=>p.rarity==='icon')
        : [];
      return allPlayers.filter(p=>state.collected?.has(p.id)).length >= 3;
    },
    windowDesc: () => {
      const allPlayers = typeof COUNTRIES !== 'undefined'
        ? COUNTRIES.flatMap(c=>c.players).filter(p=>p.rarity==='icon')
        : [];
      const n = allPlayers.filter(p=>state.collected?.has(p.id)).length;
      return n >= 3 ? '🟢 Logro desbloqueado · Tienes '+n+' íconos' : `⏳ Necesitas ${3-n} ícono${3-n!==1?'s':''}  más (tienes ${n})`;
    },
    bg: 'linear-gradient(160deg,#1a0a00,#0a001a)',
    bgCollected: 'linear-gradient(160deg,#2a1000,#1a0a2a)',
  },
  {
    id: 'LTD-ACH-TRIVIA',
    name: 'Maestro de la Trivia',
    emoji: '🧠',
    type: 'achievement',
    tier: 'limited',
    desc: 'Alcanza 500 puntos en el modo Trivia Mundialista. El conocimiento también es un trofeo.',
    condition: 'achievement',
    claimable: () => (state.gameScore || 0) >= 500,
    windowDesc: () => {
      const n = state.gameScore || 0;
      return n >= 500 ? '🟢 Logro desbloqueado · Score: '+n+' pts' : `⏳ Necesitas ${500-n} pts más en Trivia (tienes ${n})`;
    },
    bg: 'linear-gradient(160deg,#0a1a10,#0a0a1e)',
    bgCollected: 'linear-gradient(160deg,#0a2a15,#0a0a2e)',
  },
  {
    id: 'LTD-ACH-COUNTRIES',
    name: 'Viajero del Mundial',
    emoji: '✈️',
    type: 'achievement',
    tier: 'limited',
    desc: 'Completa al menos una lámina de 20 países distintos. El Mundial 2026 se juega en 3 países — el álbum en 48.',
    condition: 'achievement',
    claimable: () => {
      if(typeof COUNTRIES === 'undefined') return false;
      return COUNTRIES.filter(c=>c.players.some(p=>state.collected?.has(p.id))).length >= 20;
    },
    windowDesc: () => {
      if(typeof COUNTRIES === 'undefined') return '⏳ Cargando…';
      const n = COUNTRIES.filter(c=>c.players.some(p=>state.collected?.has(p.id))).length;
      return n >= 20 ? '🟢 Logro desbloqueado · '+n+' países' : `⏳ Necesitas ${20-n} países más (tienes ${n})`;
    },
    bg: 'linear-gradient(160deg,#001020,#001a10)',
    bgCollected: 'linear-gradient(160deg,#001a30,#002a15)',
  },

  // ── EVENTOS ESPECIALES (fechas reales del Mundial 2026) ───
  {
    id: 'LTD-EV-INAUGURAL',
    name: 'Partido Inaugural',
    emoji: '🎉',
    type: 'event',
    tier: 'ultra',
    desc: 'Lámina conmemorativa del partido inaugural del Mundial 2026 en el Estadio Azteca, Ciudad de México.',
    condition: 'date',
    dateStart: new Date('2026-06-11T00:00:00'),
    dateEnd:   new Date('2026-06-11T23:59:59'),
    claimable: () => {
      const now = new Date();
      return now >= new Date('2026-06-11') && now <= new Date('2026-06-11T23:59:59');
    },
    windowDesc: () => {
      const now = new Date(), target = new Date('2026-06-11');
      if(now < target) {
        const days = Math.ceil((target-now)/86400000);
        return `⏳ En ${days} días — 11 de junio 2026`;
      }
      if(now.toDateString() === target.toDateString()) return '🟢 ¡HOY ES EL DÍA! Disponible solo hoy';
      return '🔴 Expirada — fue el 11 junio 2026';
    },
    bg: 'linear-gradient(160deg,#1a0000,#001a1a)',
    bgCollected: 'linear-gradient(160deg,#2a0000,#002a2a)',
  },
  {
    id: 'LTD-EV-FINAL',
    name: 'La Gran Final',
    emoji: '🏆',
    type: 'event',
    tier: 'ultra',
    desc: 'La lámina más exclusiva de todo el álbum. Solo disponible el día de la Final en MetLife Stadium, Nueva York.',
    condition: 'date',
    dateStart: new Date('2026-07-19T00:00:00'),
    dateEnd:   new Date('2026-07-19T23:59:59'),
    claimable: () => {
      const now = new Date();
      return now >= new Date('2026-07-19') && now <= new Date('2026-07-19T23:59:59');
    },
    windowDesc: () => {
      const now = new Date(), target = new Date('2026-07-19');
      if(now < target) {
        const days = Math.ceil((target-now)/86400000);
        return `⏳ En ${days} días — 19 de julio 2026`;
      }
      if(now.toDateString() === target.toDateString()) return '🟢 ¡FINAL HOY! Disponible solo hoy';
      return '🔴 Expirada — fue el 19 julio 2026';
    },
    bg: 'linear-gradient(160deg,#1a1000,#001a00)',
    bgCollected: 'linear-gradient(160deg,#2a1800,#002a00)',
  },
];

// ── STATE ─────────────────────────────────────────────────
function getLimitedOwned() {
  try { return JSON.parse(localStorage.getItem('album26_limited') || '{}'); } catch(e) { return {}; }
}
function saveLimitedOwned(owned) {
  localStorage.setItem('album26_limited', JSON.stringify(owned));
}

let ltdActiveTab = 'all';
let ltdModalCard = null;

// ── MAIN RENDER ───────────────────────────────────────────
function renderLimited(page) {
  const owned = getLimitedOwned();
  const available = LIMITED_CARDS.filter(c => c.claimable());
  const totalOwned = Object.keys(owned).length;

  page.innerHTML = `<div class="ltd-wrap page-enter">
    <div class="ltd-hero">
      <div class="ltd-hero-bg"></div>
      <h2>💎 EDICIÓN LIMITADA</h2>
      <p>Láminas exclusivas que solo aparecen en momentos específicos — por hora, día, logro o evento del Mundial 2026. Una vez que se cierra la ventana, desaparecen para siempre.</p>
      <div class="ltd-hero-stats">
        <div class="ltd-hero-stat"><div class="n pink">${totalOwned}</div><div class="l">CONSEGUIDAS</div></div>
        <div class="ltd-hero-stat"><div class="n">${LIMITED_CARDS.length}</div><div class="l">EN TOTAL</div></div>
        <div class="ltd-hero-stat"><div class="n gold">${available.length}</div><div class="l">DISPONIBLES HOY</div></div>
        <div class="ltd-hero-stat"><div class="n">${Math.round(totalOwned/LIMITED_CARDS.length*100)}%</div><div class="l">COMPLETADO</div></div>
      </div>
      <div class="ltd-hero-stripe"></div>
    </div>

    ${available.length > 0 ? `<div class="ltd-window-banner">
      <div class="ltd-window-icon">⚡</div>
      <div class="ltd-window-info">
        <div class="ltd-window-title">¡${available.length} LÁMINA${available.length>1?'S':''} DISPONIBLE${available.length>1?'S':''}!</div>
        <div class="ltd-window-desc">${available.map(c=>c.name).join(' · ')} — No dejes pasar esta ventana.</div>
      </div>
    </div>` : ''}

    <div class="ltd-tabs">
      <button class="ltd-tab${ltdActiveTab==='all'?' active':''}" onclick="setLtdTab('all')">
        Todas <span class="tab-badge n">${LIMITED_CARDS.length}</span>
      </button>
      <button class="ltd-tab${ltdActiveTab==='available'?' active':''}" onclick="setLtdTab('available')">
        Disponibles <span class="tab-badge live">${available.length}</span>
      </button>
      <button class="ltd-tab${ltdActiveTab==='achievement'?' active':''}" onclick="setLtdTab('achievement')">
        Logros <span class="tab-badge n">${LIMITED_CARDS.filter(c=>c.condition==='achievement').length}</span>
      </button>
      <button class="ltd-tab${ltdActiveTab==='event'?' active':''}" onclick="setLtdTab('event')">
        Eventos <span class="tab-badge soon">${LIMITED_CARDS.filter(c=>c.condition==='date').length}</span>
      </button>
      <button class="ltd-tab${ltdActiveTab==='owned'?' active':''}" onclick="setLtdTab('owned')">
        Conseguidas <span class="tab-badge n">${totalOwned}</span>
      </button>
    </div>

    <div class="ltd-cards-grid" id="ltd-grid"></div>

    <!-- Progress bars -->
    <div class="section-label">PROGRESO POR TIPO</div>
    <div class="ltd-progress-section">
      ${[
        {label:'Por hora',    type:'hour',        color:'linear-gradient(90deg,var(--icon-c),#7F77DD)'},
        {label:'Por día',     type:'day',         color:'linear-gradient(90deg,var(--gold),var(--green))'},
        {label:'Logros',      type:'achievement', color:'linear-gradient(90deg,var(--green),var(--rare-c))'},
        {label:'Eventos',     type:'date',        color:'linear-gradient(90deg,var(--rare-c),var(--blue))'},
      ].map(t => {
        const cards = LIMITED_CARDS.filter(c=>c.condition===t.type);
        const got = cards.filter(c=>owned[c.id]).length;
        const pct = cards.length>0?Math.round(got/cards.length*100):0;
        return `<div class="ltd-progress-row">
          <div class="ltd-progress-label">${t.label}</div>
          <div class="ltd-progress-bar"><div class="ltd-progress-fill" style="width:${pct}%;background:${t.color};"></div></div>
          <div class="ltd-progress-count">${got}/${cards.length}</div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- Detail modal -->
  <div class="ltd-modal" id="ltd-modal" onclick="if(event.target===this)closeLtdModal()">
    <div class="ltd-modal-box" style="position:relative;" id="ltd-modal-inner"></div>
  </div>`;

  renderLtdGrid();
  // Auto-refresh every 60s (for time-based cards)
  clearInterval(window._ltdRefresh);
  window._ltdRefresh = setInterval(() => {
    if(document.getElementById('ltd-grid')) renderLtdGrid();
  }, 60000);
}

function renderLtdGrid() {
  const grid = document.getElementById('ltd-grid');
  if(!grid) return;
  const owned = getLimitedOwned();

  let cards = [...LIMITED_CARDS];
  if(ltdActiveTab === 'available') cards = cards.filter(c => c.claimable());
  else if(ltdActiveTab === 'achievement') cards = cards.filter(c => c.condition === 'achievement');
  else if(ltdActiveTab === 'event') cards = cards.filter(c => c.condition === 'date');
  else if(ltdActiveTab === 'owned') cards = cards.filter(c => owned[c.id]);

  if(!cards.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--muted);font-family:var(--fs);font-size:14px;">
      ${ltdActiveTab==='available'
        ? '⏳ No hay láminas disponibles en este momento.<br>Vuelve en diferentes horas del día o completa logros.'
        : ltdActiveTab==='owned'
        ? '📦 Aún no has conseguido láminas de edición limitada.'
        : 'Sin láminas en esta categoría.'}
    </div>`;
    return;
  }

  grid.innerHTML = cards.map(card => {
    const isOwned = !!owned[card.id];
    const isAvailable = card.claimable();
    const statusClass = isOwned ? 'owned' : isAvailable ? 'available' : 'locked';
    const isUltra = card.tier === 'ultra';

    return `<div class="ltd-card ${statusClass}${isUltra?' ultra':''}"
      onclick="openLtdModal('${card.id}')">
      <div class="ltd-card-bg" style="background:${isOwned?card.bgCollected:card.bg};">
        <div class="ltd-card-top">
          <div class="ltd-card-emoji${!isAvailable&&!isOwned?' locked-emoji':''}">${card.emoji}</div>
        </div>
        <div class="ltd-card-info">
          <div class="ltd-card-name">${card.name}</div>
          <div class="ltd-card-type ${card.type}">${
            card.type==='limited'?'✦ LIMITADA':
            card.type==='seasonal'?'🗓 TEMPORAL':
            card.type==='achievement'?'🏅 LOGRO':
            '⚡ EVENTO'
          }</div>
          ${isAvailable && !isOwned ? `<div class="ltd-card-timer"><div class="ltd-card-timer-dot"></div>DISPONIBLE</div>` : ''}
        </div>
      </div>
      ${isOwned ? '<div class="ltd-owned-badge">✓ CONSEGUIDA</div>' : ''}
      ${!isAvailable && !isOwned ? `<div class="ltd-lock-overlay">
        <div class="ltd-lock-icon">🔒</div>
        <div class="ltd-lock-label">${card.condition==='hour'?'Solo en horario específico':card.condition==='day'?'Solo ciertos días':card.condition==='achievement'?'Requiere logro':'Evento especial'}</div>
      </div>` : ''}
      ${isAvailable && !isOwned ? `<div class="ltd-claim-overlay"><button class="ltd-claim-btn-overlay">RECLAMAR</button></div>` : ''}
      <div class="ltd-card-rarity-bar ${card.type}"></div>
    </div>`;
  }).join('');
}

window.setLtdTab = function(tab) {
  ltdActiveTab = tab;
  document.querySelectorAll('.ltd-tab').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  renderLtdGrid();
};

// ── MODAL ─────────────────────────────────────────────────
window.openLtdModal = function(id) {
  const card = LIMITED_CARDS.find(c => c.id === id);
  if(!card) return;
  ltdModalCard = card;
  const owned = getLimitedOwned();
  const isOwned = !!owned[id];
  const isAvailable = card.claimable();
  const modal = document.getElementById('ltd-modal');
  const inner = document.getElementById('ltd-modal-inner');
  if(!modal || !inner) return;

  const typeLabel = {limited:'✦ EDICIÓN LIMITADA',seasonal:'🗓 TEMPORAL',achievement:'🏅 LOGRO',event:'⚡ EVENTO ESPECIAL'};
  const tierLabel = card.tier === 'ultra' ? '💎 ULTRA RARA' : '🌟 ESPECIAL';

  inner.innerHTML = `
    <button class="ltd-modal-close" onclick="closeLtdModal()">✕</button>
    <div class="ltd-modal-header" style="background:${isOwned?card.bgCollected:card.bg};">
      <span class="ltd-modal-emoji">${card.emoji}</span>
      <div class="ltd-modal-title">${card.name}</div>
      <div class="ltd-modal-type">${typeLabel[card.type]||card.type} · ${tierLabel}</div>
    </div>
    <div class="ltd-modal-body">
      <div class="ltd-modal-desc">${card.desc}</div>
      <div class="ltd-modal-meta">
        <div class="ltd-modal-meta-row">
          <span class="k">ESTADO</span>
          <span class="v ${isOwned?'green':isAvailable?'pink':''}">
            ${isOwned?'✓ Conseguida':isAvailable?'⚡ Disponible ahora':'🔒 No disponible'}
          </span>
        </div>
        <div class="ltd-modal-meta-row">
          <span class="k">VENTANA</span>
          <span class="v">${card.windowDesc()}</span>
        </div>
        <div class="ltd-modal-meta-row">
          <span class="k">RAREZA</span>
          <span class="v ${card.tier==='ultra'?'pink':'gold'}">${tierLabel}</span>
        </div>
        ${isOwned && owned[id]?.claimedAt ? `<div class="ltd-modal-meta-row">
          <span class="k">CONSEGUIDA</span>
          <span class="v green">${new Date(owned[id].claimedAt).toLocaleDateString('es-CO',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</span>
        </div>` : ''}
      </div>
      ${isOwned
        ? '<div class="ltd-modal-already">✓ Ya tienes esta lámina en tu álbum</div>'
        : `<button class="ltd-modal-claim-btn" ${!isAvailable?'disabled':''} onclick="claimLimited('${id}')">
             ${isAvailable ? '💎 RECLAMAR LÁMINA' : '🔒 NO DISPONIBLE AÚN'}
           </button>
           ${!isAvailable ? `<div class="ltd-countdown">${card.windowDesc()}</div>` : ''}`}
    </div>`;

  modal.classList.add('open');
};

window.closeLtdModal = function() {
  document.getElementById('ltd-modal')?.classList.remove('open');
  ltdModalCard = null;
};

// ── CLAIM ─────────────────────────────────────────────────
window.claimLimited = function(id) {
  const card = LIMITED_CARDS.find(c => c.id === id);
  if(!card || !card.claimable()) return;
  const owned = getLimitedOwned();
  if(owned[id]) { toast('Ya tienes esta lámina', 'error'); return; }

  // Save
  owned[id] = { id, name: card.name, claimedAt: new Date().toISOString() };
  saveLimitedOwned(owned);

  // Sparkles
  for(let i = 0; i < 8; i++) {
    const sp = document.createElement('div');
    sp.className = 'ltd-sparkle';
    sp.textContent = ['✨','💫','⭐','🌟','💎','🎉'][Math.floor(Math.random()*6)];
    sp.style.left = (30 + Math.random()*40) + 'vw';
    sp.style.top  = (30 + Math.random()*40) + 'vh';
    sp.style.animationDelay = (Math.random() * 0.4) + 's';
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 1400);
  }

  closeLtdModal();
  toast(`💎 ¡${card.name} conseguida!`, 'success');

  // Refresh grid if still on page
  if(document.getElementById('ltd-grid')) {
    renderLimited(document.getElementById('page'));
  }
};

// ── Hook into sidebar — show live badge if cards available ──
(function patchSidebarBadge() {
  const check = () => {
    const navEl = document.getElementById('nav-limited');
    if(!navEl) return;
    const n = LIMITED_CARDS.filter(c => c.claimable()).length;
    const owned = getLimitedOwned();
    const unclaimed = LIMITED_CARDS.filter(c => c.claimable() && !owned[c.id]).length;
    // Update badge
    const badge = navEl.querySelector('.sb-badge') || document.createElement('span');
    badge.className = 'sb-badge';
    if(unclaimed > 0) {
      badge.textContent = unclaimed + ' new';
      badge.style.background = 'rgba(229,53,171,0.15)';
      badge.style.color = 'var(--icon-c)';
      if(!navEl.querySelector('.sb-badge')) navEl.appendChild(badge);
    } else {
      badge.remove();
    }
  };
  // Check on load and every 5 minutes
  setTimeout(check, 500);
  setInterval(check, 300000);
})();

// ── Navigate cleanup ──────────────────────────────────────
const _origNavLtd = window.navigate;
window.navigate = function(view, code) {
  if(view !== 'limited') clearInterval(window._ltdRefresh);
  _origNavLtd(view, code);
};
