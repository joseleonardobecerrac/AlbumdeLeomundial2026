// ═══════════════════════════════════════════════════════════
// LÁMINAS ANIMADAS — Sistema de efectos visuales por rareza
// CSS animations + Canvas particles, sin librerías externas
// ═══════════════════════════════════════════════════════════

(function initAnimatedStickers() {

// ── CSS: nuevas capas de animación sobre las existentes ───
const css = `
/* ══════════════════════════════════════════════════════════
   ANIMATED STICKERS — override & extend existing rarity CSS
══════════════════════════════════════════════════════════ */

/* ── COMMON: subtle breathe ── */
.sticker-slot.common.collected .slot-silhouette {
  animation: commonBreathe 4s ease-in-out infinite;
}
@keyframes commonBreathe {
  0%,100% { transform: scale(1);   opacity: .85; }
  50%      { transform: scale(1.04); opacity: 1;   }
}

/* ── RARE: blue pulse ring ── */
.sticker-slot.rare.collected {
  animation: rarePulse 3s ease-in-out infinite;
}
@keyframes rarePulse {
  0%,100% { box-shadow: 0 0 14px rgba(91,164,245,0.12); }
  50%      { box-shadow: 0 0 32px rgba(91,164,245,0.35), 0 0 60px rgba(91,164,245,0.1); }
}
.sticker-slot.rare.collected .slot-silhouette {
  animation: rareFloat 3.5s ease-in-out infinite;
}
@keyframes rareFloat {
  0%,100% { transform: translateY(0)   scale(1); }
  50%      { transform: translateY(-4px) scale(1.06); }
}
/* Rare top bar shimmer */
.sticker-slot.rare.collected::before {
  background: linear-gradient(90deg, var(--rare-c), #a8d4ff, var(--rare-c));
  background-size: 200%;
  animation: rareBarShimmer 2s linear infinite;
}
@keyframes rareBarShimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
/* Rare: scan line */
.sticker-slot.rare.collected .slot-anim-layer::before {
  content: '';
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(91,164,245,0.5), transparent);
  animation: rareScan 2.5s ease-in-out infinite;
}
@keyframes rareScan {
  0%   { top: 10%;  opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { top: 90%;  opacity: 0; }
}

/* ── LEGENDARY: gold shimmer + corona ── */
.sticker-slot.legendary.collected {
  animation: legendaryGlow 2.5s ease-in-out infinite;
}
@keyframes legendaryGlow {
  0%,100% { box-shadow: 0 0 22px rgba(239,159,39,0.25), 0 0 0 0 rgba(239,159,39,0); }
  50%      { box-shadow: 0 0 40px rgba(239,159,39,0.5),  0 0 70px rgba(239,159,39,0.15); }
}
.sticker-slot.legendary.collected .slot-silhouette {
  animation: legendaryBounce 2s cubic-bezier(.36,.07,.19,.97) infinite;
}
@keyframes legendaryBounce {
  0%,100% { transform: translateY(0)   scale(1);    filter: drop-shadow(0 0 0px gold); }
  40%      { transform: translateY(-6px) scale(1.08); filter: drop-shadow(0 0 8px rgba(239,159,39,.7)); }
  60%      { transform: translateY(-4px) scale(1.06); }
}
/* Legendary top bar rainbow pulse */
.sticker-slot.legendary.collected::before {
  background: linear-gradient(90deg, #EF9F27, #FFD700, #EF9F27, #FF8C00, #EF9F27);
  background-size: 300%;
  animation: legendaryBarFlow 1.5s linear infinite;
  height: 4px;
}
@keyframes legendaryBarFlow {
  from { background-position: 300% 0; }
  to   { background-position: -300% 0; }
}
/* Legendary: corner stars */
.sticker-slot.legendary.collected .slot-corner-star {
  position: absolute;
  font-size: 8px;
  animation: starTwinkle 1.5s ease-in-out infinite;
}
.sticker-slot.legendary.collected .slot-corner-star:nth-child(1) { top: 12px; right: 6px; animation-delay: 0s; }
.sticker-slot.legendary.collected .slot-corner-star:nth-child(2) { top: 12px; left:  6px; animation-delay: 0.3s; }
@keyframes starTwinkle {
  0%,100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1.2) rotate(20deg); }
}

/* ── ICON: full spectral explosion ── */
.sticker-slot.icon.collected {
  animation: iconAura 2s ease-in-out infinite;
  border-image: linear-gradient(135deg,#E31E24,#EF9F27,#E535AB,#7F77DD,#5BA4F5) 1;
  border-style: solid;
}
@keyframes iconAura {
  0%,100% { box-shadow: 0 0 30px rgba(229,53,171,0.3),  0 0 60px  rgba(239,159,39,0.1); }
  33%      { box-shadow: 0 0 40px rgba(91,164,245,0.35),  0 0 80px  rgba(229,53,171,0.15); }
  66%      { box-shadow: 0 0 40px rgba(239,159,39,0.4),   0 0 80px  rgba(91,164,245,0.15); }
}
/* ICON top bar — full rainbow */
.sticker-slot.icon.collected::before {
  background: linear-gradient(90deg,#E31E24,#EF9F27,#00A650,#004F9F,#E535AB,#7F77DD,#E31E24);
  background-size: 400%;
  animation: iconBarRainbow 1.2s linear infinite;
  height: 4px;
}
@keyframes iconBarRainbow {
  from { background-position: 400% 0; }
  to   { background-position: -400% 0; }
}
/* ICON silhouette: orbit + scale */
.sticker-slot.icon.collected .slot-silhouette {
  animation: iconFloat 1.8s ease-in-out infinite;
  position: relative;
}
@keyframes iconFloat {
  0%,100% { transform: scale(1)    rotate(0deg); filter: drop-shadow(0 0 8px rgba(229,53,171,.6)); }
  25%      { transform: scale(1.12) rotate(-2deg); filter: drop-shadow(0 0 14px rgba(239,159,39,.8)); }
  75%      { transform: scale(1.08) rotate(2deg);  filter: drop-shadow(0 0 12px rgba(91,164,245,.7)); }
}

/* ── ANIMATION LAYER (canvas + overlay elements) ── */
.slot-anim-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
  border-radius: inherit;
}

/* Canvas particle overlay */
.slot-particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
  border-radius: inherit;
}

/* ── REVEAL ANIMATION (when card appears from pack) ── */
.pack-sticker-reveal.shown .sticker-slot.legendary {
  animation: cardRevealGold .6s cubic-bezier(.34,1.56,.64,1) forwards, legendaryGlow 2.5s ease-in-out 0.6s infinite;
}
.pack-sticker-reveal.shown .sticker-slot.icon {
  animation: cardRevealIcon .5s cubic-bezier(.34,1.56,.64,1) forwards, iconAura 2s ease-in-out 0.5s infinite;
}
@keyframes cardRevealGold {
  from { transform: scale(0.8) rotateY(90deg); opacity: 0; box-shadow: none; }
  to   { transform: none; opacity: 1; }
}
@keyframes cardRevealIcon {
  from { transform: scale(0.7) rotateY(180deg); opacity: 0; }
  to   { transform: none; opacity: 1; }
}

/* ── HOVER INTERACTIONS per rarity ── */
.sticker-slot.legendary.collected:hover {
  transform: translateY(-5px) scale(1.04);
  box-shadow: 0 12px 40px rgba(239,159,39,0.45), 0 0 0 1px rgba(239,159,39,0.3);
  transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
}
.sticker-slot.icon.collected:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 16px 50px rgba(229,53,171,0.5), 0 0 0 1px rgba(229,53,171,0.4);
  transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
}

/* ── ICON: orbital rings ── */
.slot-orbit {
  position: absolute; inset: 8px;
  border-radius: 50%;
  border: 1px solid transparent;
  pointer-events: none;
}
.slot-orbit-1 {
  border-color: rgba(229,53,171,0.3);
  animation: orbit1 3s linear infinite;
}
.slot-orbit-2 {
  inset: 14px;
  border-color: rgba(239,159,39,0.25);
  animation: orbit2 4s linear infinite reverse;
}
.slot-orbit-3 {
  inset: 20px;
  border-color: rgba(91,164,245,0.2);
  animation: orbit3 5s linear infinite;
}
@keyframes orbit1 { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
@keyframes orbit2 { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
@keyframes orbit3 { from { transform: rotate(45deg); }  to { transform: rotate(405deg); } }

/* Orbit dot */
.slot-orbit::before {
  content: '';
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 50%;
  top: -2px; left: 50%;
  transform: translateX(-50%);
}
.slot-orbit-1::before { background: rgba(229,53,171,0.8); box-shadow: 0 0 4px var(--icon-c); }
.slot-orbit-2::before { background: rgba(239,159,39,0.8); box-shadow: 0 0 4px var(--gold); }
.slot-orbit-3::before { background: rgba(91,164,245,0.8); box-shadow: 0 0 4px var(--rare-c); }

/* ── LEGENDARY: floating sparks ── */
.slot-spark {
  position: absolute;
  width: 2px; height: 2px;
  border-radius: 50%;
  background: var(--gold);
  pointer-events: none;
  animation: sparkFloat var(--dur, 3s) ease-in-out var(--delay, 0s) infinite;
}
@keyframes sparkFloat {
  0%   { transform: translate(0,0) scale(1); opacity: 0; }
  20%  { opacity: 1; }
  100% { transform: translate(var(--dx,0px), var(--dy,-30px)) scale(0); opacity: 0; }
}

/* ── PACK OPEN special flash ── */
.pack-flash {
  position: fixed; inset: 0; pointer-events: none; z-index: 999;
  background: white;
  animation: packFlash 0.4s ease forwards;
}
@keyframes packFlash {
  0%   { opacity: 0.6; }
  100% { opacity: 0; }
}

/* ── ICON label badge ── */
.slot-icon-crown {
  position: absolute;
  top: -4px; left: 50%; transform: translateX(-50%);
  font-size: 11px;
  animation: crownBob 2s ease-in-out infinite;
  z-index: 5;
}
@keyframes crownBob {
  0%,100% { transform: translateX(-50%) translateY(0) rotate(-5deg); }
  50%      { transform: translateX(-50%) translateY(-3px) rotate(5deg); }
}
`;

const styleEl = document.createElement('style');
styleEl.id = 'animated-stickers-css';
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ═══════════════════════════════════════════════════════════
// PARTICLE SYSTEMS PER RARITY
// ═══════════════════════════════════════════════════════════

const PARTICLE_CONFIGS = {
  rare: {
    count: 8,
    colors: ['rgba(91,164,245,0.7)', 'rgba(160,210,255,0.5)', 'rgba(91,164,245,0.4)'],
    size: { min: 1, max: 2.5 },
    speed: { min: 0.2, max: 0.6 },
    type: 'sparkle',
  },
  legendary: {
    count: 14,
    colors: ['rgba(239,159,39,0.8)', 'rgba(255,215,0,0.6)', 'rgba(255,165,0,0.5)', 'rgba(255,200,0,0.4)'],
    size: { min: 1.5, max: 3 },
    speed: { min: 0.3, max: 0.8 },
    type: 'star',
  },
  icon: {
    count: 20,
    colors: ['rgba(229,53,171,0.8)', 'rgba(239,159,39,0.7)', 'rgba(91,164,245,0.7)', 'rgba(255,255,255,0.5)'],
    size: { min: 1.5, max: 3.5 },
    speed: { min: 0.4, max: 1.0 },
    type: 'confetti',
  },
};

class ParticleSystem {
  constructor(canvas, config) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.config  = config;
    this.particles = [];
    this.raf     = null;
    this.running = false;
    this.init();
  }

  init() {
    this.resize();
    this.particles = Array.from({ length: this.config.count }, () => this.spawn());
    this.running = true;
    this.loop();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width  = r.width  || 120;
    this.canvas.height = r.height || 160;
  }

  spawn(y) {
    const cfg = this.config;
    const w = this.canvas.width, h = this.canvas.height;
    return {
      x:     Math.random() * w,
      y:     y !== undefined ? y : Math.random() * h,
      vx:    (Math.random() - 0.5) * cfg.speed.max,
      vy:    -(cfg.speed.min + Math.random() * (cfg.speed.max - cfg.speed.min)),
      size:  cfg.size.min + Math.random() * (cfg.size.max - cfg.size.min),
      color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      life:  1,
      decay: 0.004 + Math.random() * 0.006,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.15,
    };
  }

  loop() {
    if(!this.running) return;
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    for(let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.01; // gravity
      p.life -= p.decay;
      p.angle += p.spin;

      if(p.life <= 0 || p.y < -10) {
        this.particles[i] = this.spawn(h + 5);
        continue;
      }

      ctx.globalAlpha = p.life;

      if(this.config.type === 'star') {
        this.drawStar(ctx, p.x, p.y, p.size, p.color, p.angle);
      } else if(this.config.type === 'confetti') {
        this.drawConfetti(ctx, p.x, p.y, p.size, p.color, p.angle);
      } else {
        // sparkle — simple glow dot
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    this.raf = requestAnimationFrame(() => this.loop());
  }

  drawStar(ctx, x, y, r, color, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    for(let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.lineTo(Math.cos(a) * r * 2, Math.sin(a) * r * 2);
      ctx.lineTo(Math.cos(a + Math.PI/4) * r * 0.5, Math.sin(a + Math.PI/4) * r * 0.5);
    }
    ctx.closePath();
    ctx.fill();
    // glow
    ctx.shadowBlur = 6;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  drawConfetti(ctx, x, y, r, color, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.fillRect(-r, -r * 0.4, r * 2, r * 0.8);
    ctx.restore();
  }

  destroy() {
    this.running = false;
    if(this.raf) cancelAnimationFrame(this.raf);
    this.particles = [];
  }
}

// ═══════════════════════════════════════════════════════════
// DOM ENHANCER — inject animation layers into sticker slots
// ═══════════════════════════════════════════════════════════

const particleSystems = new WeakMap();

function enhanceSlot(slot) {
  // Already enhanced?
  if(slot.dataset.animated) return;
  slot.dataset.animated = '1';

  const rarity = ['icon','legendary','rare','common'].find(r => slot.classList.contains(r));
  const isCollected = slot.classList.contains('collected');
  if(!isCollected || !rarity || rarity === 'common') return;

  // Create animation layer container
  const layer = document.createElement('div');
  layer.className = 'slot-anim-layer';

  // ── RARE: scan line already handled by CSS ::before on layer ──
  if(rarity === 'rare') {
    slot.appendChild(layer);
  }

  // ── LEGENDARY: floating sparks + corner stars ──
  if(rarity === 'legendary') {
    // Corner stars
    const s1 = document.createElement('span');
    s1.className = 'slot-corner-star'; s1.textContent = '✦';
    const s2 = document.createElement('span');
    s2.className = 'slot-corner-star'; s2.textContent = '✦';
    slot.appendChild(s1); slot.appendChild(s2);

    // Floating sparks
    for(let i = 0; i < 4; i++) {
      const spark = document.createElement('div');
      spark.className = 'slot-spark';
      const dx = (Math.random() - 0.5) * 30;
      spark.style.setProperty('--dur',   (2.5 + Math.random() * 2) + 's');
      spark.style.setProperty('--delay', (Math.random() * 2) + 's');
      spark.style.setProperty('--dx',    dx + 'px');
      spark.style.setProperty('--dy',    (-20 - Math.random() * 20) + 'px');
      spark.style.left  = (20 + Math.random() * 60) + '%';
      spark.style.bottom = (20 + Math.random() * 40) + '%';
      layer.appendChild(spark);
    }
    slot.appendChild(layer);

    // Canvas particles
    const canvas = document.createElement('canvas');
    canvas.className = 'slot-particle-canvas';
    slot.appendChild(canvas);

    // Init particles after layout
    requestAnimationFrame(() => {
      const ps = new ParticleSystem(canvas, PARTICLE_CONFIGS.legendary);
      particleSystems.set(slot, ps);
    });
  }

  // ── ICON: orbits + crown + canvas particles ──
  if(rarity === 'icon') {
    // Crown
    const crown = document.createElement('span');
    crown.className = 'slot-icon-crown';
    crown.textContent = '👑';
    slot.appendChild(crown);

    // Orbital rings
    for(let i = 1; i <= 3; i++) {
      const ring = document.createElement('div');
      ring.className = `slot-orbit slot-orbit-${i}`;
      slot.appendChild(ring);
    }

    // Canvas particles
    const canvas = document.createElement('canvas');
    canvas.className = 'slot-particle-canvas';
    slot.appendChild(canvas);

    requestAnimationFrame(() => {
      const ps = new ParticleSystem(canvas, PARTICLE_CONFIGS.icon);
      particleSystems.set(slot, ps);
    });

    slot.appendChild(layer);
  }

  // ── RARE: canvas particles ──
  if(rarity === 'rare') {
    const canvas = document.createElement('canvas');
    canvas.className = 'slot-particle-canvas';
    slot.appendChild(canvas);

    requestAnimationFrame(() => {
      const ps = new ParticleSystem(canvas, PARTICLE_CONFIGS.rare);
      particleSystems.set(slot, ps);
    });
  }
}

function destroySlotParticles(slot) {
  const ps = particleSystems.get(slot);
  if(ps) { ps.destroy(); particleSystems.delete(slot); }
}

// ── MutationObserver: watch for new sticker slots ─────────
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if(node.nodeType !== 1) return;
      // Direct slot
      if(node.classList?.contains('sticker-slot')) {
        enhanceSlot(node);
      }
      // Children
      node.querySelectorAll?.('.sticker-slot').forEach(enhanceSlot);
    });
    m.removedNodes.forEach(node => {
      if(node.nodeType !== 1) return;
      node.querySelectorAll?.('.sticker-slot').forEach(destroySlotParticles);
      if(node.classList?.contains('sticker-slot')) destroySlotParticles(node);
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// ── Enhance already-existing slots on load ─────────────────
setTimeout(() => {
  document.querySelectorAll('.sticker-slot').forEach(enhanceSlot);
}, 500);

// ═══════════════════════════════════════════════════════════
// PACK OPENING SPECIAL EFFECTS
// ═══════════════════════════════════════════════════════════

// Hook into pack reveal to add special effects on legendary/icon
function patchPackReveal() {
  const _orig = window.openPack;
  if(!_orig) { setTimeout(patchPackReveal, 300); return; }

  window.openPack = function() {
    _orig.apply(this, arguments);
    // After cards are revealed, add screen flash for legendary/icon
    setTimeout(() => {
      const revealSlots = document.querySelectorAll('.pack-sticker-reveal');
      revealSlots.forEach((wrap, i) => {
        const slot = wrap.querySelector('.sticker-slot');
        if(!slot) return;
        const isLegendary = slot.classList.contains('legendary');
        const isIcon      = slot.classList.contains('icon');
        if(isIcon || isLegendary) {
          setTimeout(() => {
            triggerRevealFlash(slot, isIcon ? 'icon' : 'legendary');
          }, 100 + i * 180 + 200);
        }
      });
    }, 600);
  };
}

function triggerRevealFlash(slot, rarity) {
  // Screen flash
  const flash = document.createElement('div');
  flash.className = 'pack-flash';
  flash.style.background = rarity === 'icon'
    ? 'radial-gradient(ellipse at center, rgba(229,53,171,0.6), transparent)'
    : 'radial-gradient(ellipse at center, rgba(239,159,39,0.5), transparent)';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 500);

  // Burst particles from card position
  const rect = slot.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  burstParticles(cx, cy, rarity);
}

function burstParticles(cx, cy, rarity) {
  const colors = rarity === 'icon'
    ? ['#E535AB','#EF9F27','#5BA4F5','#FFD700','#fff']
    : ['#EF9F27','#FFD700','#FF8C00','#fff'];
  const count = rarity === 'icon' ? 24 : 16;

  for(let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:fixed; z-index:1000; pointer-events:none;
      width:${2+Math.random()*4}px; height:${2+Math.random()*4}px;
      border-radius:50%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${cx}px; top:${cy}px;
    `;
    document.body.appendChild(p);

    const angle  = (i / count) * Math.PI * 2;
    const speed  = 80 + Math.random() * 120;
    const dx     = Math.cos(angle) * speed;
    const dy     = Math.sin(angle) * speed - 50;
    const dur    = 600 + Math.random() * 400;

    p.animate([
      { transform: 'translate(-50%,-50%) scale(1)',   opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 },
    ], { duration: dur, easing: 'cubic-bezier(0,0.9,0.57,1)', fill: 'forwards' })
    .finished.then(() => p.remove());
  }
}

// ── HOVER: temporary particle burst ───────────────────────
document.addEventListener('mouseenter', e => {
  const slot = e.target.closest('.sticker-slot.icon.collected, .sticker-slot.legendary.collected');
  if(!slot || slot._hoverBursting) return;
  slot._hoverBursting = true;

  // Small burst at cursor
  const rect = slot.getBoundingClientRect();
  burstParticles(
    rect.left + rect.width * (0.3 + Math.random() * 0.4),
    rect.top  + rect.height * 0.4,
    slot.classList.contains('icon') ? 'icon' : 'legendary'
  );
  setTimeout(() => { slot._hoverBursting = false; }, 1200);
}, true);

// ── FULLSCREEN view (click on legendary/icon) ──────────────
document.addEventListener('click', e => {
  const slot = e.target.closest('.sticker-slot.icon.collected, .sticker-slot.legendary.collected');
  // Only trigger if clicking the silhouette area directly
  if(!slot || e.target.closest('.slot-info') || e.target.closest('[onclick]')) return;
  // Don't intercept if there's a direct onclick on the slot
  if(slot.getAttribute('onclick')) return;
}, true);

// Start patching after DOM is ready
patchPackReveal();

})(); // end IIFE
