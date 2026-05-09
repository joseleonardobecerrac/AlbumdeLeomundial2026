// ═══════════════════════════════════════════════════════════
// MAPA MUNDIAL INTERACTIVO + COMPARADOR CARA A CARA (v2)
// ═══════════════════════════════════════════════════════════

// ── Patch navigate to support worldmap ──
(function patchNavigate() {
  const _orig = window.navigate;
  window.navigate = function(view, code) {
    if (view === 'worldmap') {
      document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
      const el = document.getElementById('nav-worldmap');
      if (el) el.classList.add('active');
      document.getElementById('breadcrumb').innerHTML = 'Álbum · <span>Mapa Mundial</span>';
      renderWorldMap(document.getElementById('page'));
      updateProgress();
    } else {
      _orig(view, code);
    }
  };
})();

// ═══════════════════════════════════════════════════════════
// MAPA MUNDIAL SVG
// ═══════════════════════════════════════════════════════════

// ISO-2 flag codes for each classified country, mapped to SVG path IDs
// We use Natural Earth simplified country paths embedded inline
const MAP_COUNTRIES = {
  // code : { iso: 'iso2', name, group, conf, cx, cy (label position) }
  USA:  { iso:'us', group:'A', conf:'CONCACAF', cx:190, cy:195 },
  CAN:  { iso:'ca', group:'A', conf:'CONCACAF', cx:170, cy:160 },
  MEX:  { iso:'mx', group:'A', conf:'CONCACAF', cx:160, cy:225 },
  PAN:  { iso:'pa', group:'A', conf:'CONCACAF', cx:195, cy:248 },
  ARG:  { iso:'ar', group:'B', conf:'CONMEBOL', cx:230, cy:390 },
  MAR:  { iso:'ma', group:'B', conf:'CAF',      cx:440, cy:215 },
  GHA:  { iso:'gh', group:'B', conf:'CAF',      cx:455, cy:258 },
  CPV:  { iso:'cv', group:'B', conf:'CAF',      cx:415, cy:240 },
  SEN:  { iso:'sn', group:'C', conf:'CAF',      cx:430, cy:245 },
  TUN:  { iso:'tn', group:'C', conf:'CAF',      cx:470, cy:200 },
  CIV:  { iso:'ci', group:'C', conf:'CAF',      cx:450, cy:262 },
  SAF:  { iso:'za', group:'C', conf:'CAF',      cx:490, cy:340 },
  COL:  { iso:'co', group:'D', conf:'CONMEBOL', cx:210, cy:270 },
  PAR:  { iso:'py', group:'D', conf:'CONMEBOL', cx:235, cy:355 },
  ALG:  { iso:'dz', group:'D', conf:'CAF',      cx:465, cy:205 },
  EGI:  { iso:'eg', group:'D', conf:'CAF',      cx:495, cy:210 },
  BRA:  { iso:'br', group:'E', conf:'CONMEBOL', cx:250, cy:320 },
  ECU:  { iso:'ec', group:'E', conf:'CONMEBOL', cx:205, cy:282 },
  CRO:  { iso:'hr', group:'E', conf:'UEFA',     cx:490, cy:170 },
  NOR:  { iso:'no', group:'E', conf:'UEFA',     cx:470, cy:135 },
  POR:  { iso:'pt', group:'F', conf:'UEFA',     cx:443, cy:173 },
  URU:  { iso:'uy', group:'F', conf:'CONMEBOL', cx:240, cy:372 },
  ARS:  { iso:'sa', group:'F', conf:'AFC',      cx:540, cy:225 },
  AUS:  { iso:'au', group:'F', conf:'AFC',      cx:700, cy:335 },
  FRA:  { iso:'fr', group:'G', conf:'UEFA',     cx:462, cy:162 },
  NZL:  { iso:'nz', group:'G', conf:'OFC',      cx:755, cy:375 },
  CUW:  { iso:'cw', group:'G', conf:'CONCACAF', cx:215, cy:252 },
  HAI:  { iso:'ht', group:'G', conf:'CONCACAF', cx:202, cy:238 },
  ING:  { iso:'gb', group:'H', conf:'UEFA',     cx:455, cy:150 },
  KOR:  { iso:'kr', group:'H', conf:'AFC',      cx:660, cy:195 },
  JAP:  { iso:'jp', group:'H', conf:'AFC',      cx:675, cy:188 },
  JOR:  { iso:'jo', group:'H', conf:'AFC',      cx:517, cy:215 },
  ALE:  { iso:'de', group:'I', conf:'UEFA',     cx:470, cy:155 },
  IRA:  { iso:'ir', group:'I', conf:'AFC',      cx:548, cy:205 },
  BEL:  { iso:'be', group:'I', conf:'UEFA',     cx:460, cy:152 },
  UZB:  { iso:'uz', group:'I', conf:'AFC',      cx:575, cy:185 },
  HOL:  { iso:'nl', group:'J', conf:'UEFA',     cx:460, cy:150 },
  SUI:  { iso:'ch', group:'J', conf:'UEFA',     cx:467, cy:160 },
  ESP:  { iso:'es', group:'J', conf:'UEFA',     cx:447, cy:173 },
  ESC:  { iso:'gb', group:'J', conf:'UEFA',     cx:452, cy:145 },
  AUT:  { iso:'at', group:'K', conf:'UEFA',     cx:474, cy:158 },
  CAT:  { iso:'qa', group:'K', conf:'AFC',      cx:537, cy:223 },
  RDC:  { iso:'cd', group:'K', conf:'CAF',      cx:490, cy:280 },
  IRA2: { iso:'iq', group:'K', conf:'AFC',      cx:525, cy:210 },
  TUR:  { iso:'tr', group:'L', conf:'UEFA',     cx:505, cy:180 },
  SWE:  { iso:'se', group:'L', conf:'UEFA',     cx:475, cy:137 },
  RCH:  { iso:'cz', group:'L', conf:'UEFA',     cx:478, cy:157 },
  BOS:  { iso:'ba', group:'L', conf:'UEFA',     cx:487, cy:165 },
};

const GROUP_COLORS = {
  A:'#E31E24', B:'#FF6B35', C:'#FFD700',
  D:'#00A650', E:'#00BCD4', F:'#2196F3',
  G:'#9C27B0', H:'#E91E63', I:'#FF5722',
  J:'#4CAF50', K:'#607D8B', L:'#795548',
};

const CONF_COLORS = {
  UEFA:'#3B82F6', CONMEBOL:'#10B981', CAF:'#F59E0B',
  CONCACAF:'#EF4444', AFC:'#8B5CF6', OFC:'#EC4899',
};

function renderWorldMap(page) {
  const confCounts = {};
  Object.values(MAP_COUNTRIES).forEach(c => { confCounts[c.conf] = (confCounts[c.conf]||0)+1; });

  // Cargar Leaflet si no está disponible
  function loadLeaflet(cb) {
    if (window.L) { cb(); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = cb;
    document.head.appendChild(script);
  }

  page.innerHTML = `<div class="wm-wrap page-enter">
    <div class="wm-header">
      <div>
        <div style="font-family:var(--fd);font-size:40px;letter-spacing:3px;">🗺️ MAPA MUNDIAL 2026</div>
        <div style="font-size:12px;color:var(--muted);font-family:var(--fs);margin-top:4px;">
          48 selecciones clasificadas · Haz clic en un marcador para ver su página
        </div>
      </div>
      <div class="wm-legend" id="wm-legend"></div>
    </div>

    <div class="wm-filter-bar">
      <button class="wm-filter active" id="wf-group"   onclick="setMapFilter('group')">Por Grupo</button>
      <button class="wm-filter"        id="wf-conf"    onclick="setMapFilter('conf')">Por Confederación</button>
      <button class="wm-filter"        id="wf-collect" onclick="setMapFilter('collect')">Mi Colección</button>
    </div>

    <div class="wm-stats-bar">
      ${Object.entries(confCounts).map(([conf,n])=>`
        <div class="wm-stat-cell">
          <div class="wm-stat-dot" style="background:${CONF_COLORS[conf]||'#888'}"></div>
          <span class="wm-stat-conf">${conf}</span>
          <span class="wm-stat-n">${n}</span>
        </div>`).join('')}
    </div>

    <!-- Leaflet map container -->
    <div class="wm-map-container" style="border-radius:12px;overflow:hidden;height:480px;position:relative;">
      <div id="wm-leaflet-map" style="width:100%;height:100%;"></div>
    </div>

    <div class="section-label" style="margin-top:24px;">SELECCIONES CLASIFICADAS</div>
    <div class="wm-countries-grid" id="wm-grid"></div>
  </div>`;

  buildLegend('group');
  buildCountryGrid('group');

  loadLeaflet(() => initLeafletMap('group'));
}

let _leafletMap = null;
let _leafletMarkers = [];
let mapFilter = 'group';

function initLeafletMap(filter) {
  if (_leafletMap) {
    _leafletMap.remove();
    _leafletMap = null;
  }

  const isDark = !document.documentElement.classList.contains('light');

  // Tile layer: CartoDB dark/light según tema
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';

  const mapEl = document.getElementById('wm-leaflet-map');
  if (!mapEl) return;

  _leafletMap = L.map('wm-leaflet-map', {
    center: [20, 10],
    zoom: 2,
    minZoom: 2,
    maxZoom: 6,
    zoomControl: true,
    attributionControl: false,
  });

  L.tileLayer(tileUrl, {
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(_leafletMap);

  // Atribución discreta
  L.control.attribution({ position: 'bottomright', prefix: false })
    .addAttribution('© <a href="https://carto.com">CARTO</a> · © <a href="https://osm.org">OSM</a>')
    .addTo(_leafletMap);

  buildLeafletMarkers(filter);
}

function buildLeafletMarkers(filter) {
  if (!_leafletMap || !window.L) return;

  // Limpiar marcadores anteriores
  _leafletMarkers.forEach(m => m.remove());
  _leafletMarkers = [];

  Object.entries(MAP_COUNTRIES).forEach(([code, m]) => {
    const country = COUNTRIES.find(c => c.code === code);
    if (!country) return;

    const color = getCountryColor(code, filter);
    const owned = country.players.filter(p => state.collected.has(p.id)).length;
    const total = country.players.length;
    const pct   = total > 0 ? Math.round(owned / total * 100) : 0;
    const isComplete = pct === 100;

    // SVG personalizado del pin con bandera
    const pinSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
        <defs>
          <clipPath id="fc-${code}"><circle cx="18" cy="14" r="11"/></clipPath>
          <filter id="sh-${code}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
          </filter>
        </defs>
        <!-- Pin body -->
        <path d="M18 2 C9 2 2 9 2 18 C2 28 18 44 18 44 C18 44 34 28 34 18 C34 9 27 2 18 2 Z"
          fill="${color}" filter="url(#sh-${code})"/>
        <!-- White circle -->
        <circle cx="18" cy="14" r="12" fill="white" opacity="0.95"/>
        <!-- Flag -->
        <image href="https://flagcdn.com/w40/${m.iso}.png"
          x="7" y="8" width="22" height="12"
          clip-path="url(#fc-${code})" preserveAspectRatio="xMidYMid slice"/>
        <!-- Gold ring if complete -->
        ${isComplete ? `<circle cx="18" cy="14" r="12" fill="none" stroke="#FFD700" stroke-width="2"/>` : ''}
      </svg>`;

    const icon = L.divIcon({
      html: pinSvg,
      className: '',
      iconSize: [36, 46],
      iconAnchor: [18, 44],
      popupAnchor: [0, -46],
    });

    const marker = L.marker([m.lat, m.lng], { icon })
      .addTo(_leafletMap);

    // Popup con info del país
    const popupHTML = `
      <div style="font-family:'Barlow Condensed',sans-serif;min-width:160px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <img src="https://flagcdn.com/w40/${m.iso}.png" style="width:32px;height:22px;object-fit:cover;border-radius:3px;">
          <div>
            <div style="font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:1px;">${country.name.toUpperCase()}</div>
            <div style="font-size:10px;color:#888;">Grupo ${country.group} · ${country.conf}</div>
          </div>
        </div>
        <div style="height:4px;background:#eee;border-radius:2px;margin-bottom:6px;">
          <div style="height:100%;width:${pct}%;background:${pct===100?'#00A650':pct>50?'#EF9F27':'#5BA4F5'};border-radius:2px;"></div>
        </div>
        <div style="font-size:11px;color:#555;margin-bottom:8px;">
          ${owned}/${total} láminas (${pct}%)
        </div>
        <button onclick="navigate('country','${code}');if(_leafletMap)_leafletMap.closePopup();"
          style="width:100%;padding:6px;border-radius:6px;border:none;
          background:linear-gradient(135deg,#E31E24,#004F9F);color:#fff;
          font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1px;cursor:pointer;">
          VER ÁLBUM →
        </button>
      </div>`;

    marker.bindPopup(popupHTML, {
      maxWidth: 200,
      className: 'wm-popup',
    });

    _leafletMarkers.push(marker);
  });
}

let mapFilter = 'group';

window.setMapFilter = function(f) {
  mapFilter = f;
  document.querySelectorAll('.wm-filter').forEach(b => b.classList.remove('active'));
  document.getElementById(`wf-${f}`)?.classList.add('active');
  buildLegend(f);
  buildLeafletMarkers(f);
  buildCountryGrid(f);
};

function getCountryColor(code, filter) {
  const m = MAP_COUNTRIES[code];
  if(!m) return '#333';
  if(filter === 'collect') {
    const c = COUNTRIES.find(x=>x.code===code);
    if(!c) return '#333';
    const total = c.players.length;
    const owned = c.players.filter(p=>state.collected.has(p.id)).length;
    const pct = total > 0 ? owned/total : 0;
    if(pct === 0) return '#2a2a3a';
    if(pct < 0.33) return '#1a3a2a';
    if(pct < 0.66) return '#1a4a2a';
    return '#00A650';
  }
  if(filter === 'conf') return CONF_COLORS[m.conf] || '#555';
  return GROUP_COLORS[m.group] || '#555';
}

function buildLegend(filter) {
  const wrap = document.getElementById('wm-legend');
  if(!wrap) return;
  let items;
  if(filter === 'group') {
    items = Object.entries(GROUP_COLORS).map(([g,c])=>({label:`Grupo ${g}`,color:c}));
  } else if(filter === 'conf') {
    items = Object.entries(CONF_COLORS).map(([cf,c])=>({label:cf,color:c}));
  } else {
    items = [
      {label:'Completo',color:'#00A650'},
      {label:'>50%',color:'#1a4a2a'},
      {label:'Iniciado',color:'#1a3a2a'},
      {label:'Sin láminas',color:'#2a2a3a'},
    ];
  }
  wrap.innerHTML = items.map(i=>`
    <div class="wm-legend-item">
      <span class="wm-legend-dot" style="background:${i.color}"></span>
      <span class="wm-legend-label">${i.label}</span>
    </div>`).join('');
}

function buildSVGMap(filter) {
  const wrap = document.getElementById('wm-svg-wrap');
  if(!wrap) return;

  // Build pin markers for each classified country
  const pins = Object.entries(MAP_COUNTRIES).map(([code, m]) => {
    const country = COUNTRIES.find(c=>c.code===code);
    if(!country) return '';
    const color = getCountryColor(code, filter);
    const owned = country.players.filter(p=>state.collected.has(p.id)).length;
    const total = country.players.length;
    const pct = total > 0 ? Math.round(owned/total*100) : 0;

    return `<g class="map-pin" data-code="${code}" onclick="mapPinClick('${code}')"
      style="cursor:pointer;" transform="translate(${m.cx},${m.cy})">
      <!-- Pin shadow -->
      <ellipse cx="0" cy="16" rx="5" ry="2" fill="rgba(0,0,0,0.4)"/>
      <!-- Pin body -->
      <path d="M0,-16 C-8,-16 -8,0 0,16 C8,0 8,-16 0,-16 Z"
        fill="${color}" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"
        class="pin-body"/>
      <!-- Pin flag circle -->
      <circle cx="0" cy="-8" r="5.5" fill="rgba(255,255,255,0.12)"/>
      <!-- Flag image clipped -->
      <clipPath id="clip-${code}"><circle cx="0" cy="-8" r="5"/></clipPath>
      <image href="https://flagcdn.com/${country.flag}.svg"
        x="-5" y="-13" width="10" height="7"
        clip-path="url(#clip-${code})" preserveAspectRatio="xMidYMid slice"/>
      <!-- Collection ring -->
      ${pct === 100 ? `<circle cx="0" cy="-8" r="6.5" fill="none" stroke="#FFD700" stroke-width="1.2" opacity="0.9"/>` :
        pct > 0 ? `<circle cx="0" cy="-8" r="6.5" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>` : ''}
      <!-- Group label -->
      <text x="0" y="22" text-anchor="middle"
        font-family="'Bebas Neue',sans-serif" font-size="5"
        fill="rgba(255,255,255,0.55)" letter-spacing="0.5">${m.group}</text>
    </g>`;
  }).join('');

  // World SVG base map (simplified Natural Earth rectangles per continent)
  // Using a stylized flat map with continent silhouettes
  wrap.innerHTML = `
  <svg viewBox="0 0 860 440" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;height:100%;display:block;">
    <defs>
      <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stop-color="#0a1628"/>
        <stop offset="100%" stop-color="#060d1a"/>
      </radialGradient>
    </defs>

    <!-- Ocean background -->
    <rect width="860" height="440" fill="url(#oceanGrad)" rx="12"/>

    <!-- Latitude lines -->
    ${[80,60,40,20,0,-20,-40,-60].map(lat => {
      const y = 220 - lat*2.2;
      return `<line x1="0" y1="${y}" x2="860" y2="${y}"
        stroke="rgba(255,255,255,0.04)" stroke-width="0.5"
        ${lat===0?'stroke="rgba(255,255,255,0.1)" stroke-width="0.8"':''}/>`;
    }).join('')}
    <!-- Longitude lines -->
    ${[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lon => {
      const x = 430 + lon*2.39;
      return `<line x1="${x}" y1="0" x2="${x}" y2="440"
        stroke="rgba(255,255,255,0.04)" stroke-width="0.5"
        ${lon===0?'stroke="rgba(255,255,255,0.08)" stroke-width="0.8"':''}/>`;
    }).join('')}

    <!-- CONTINENTS (simplified polygon shapes) -->
    <!-- North America -->
    <path d="M95,90 L200,80 L240,100 L250,130 L235,160 L220,200 L210,230 L195,260
             L185,265 L180,250 L175,240 L170,220 L155,200 L140,185 L130,170
             L115,155 L105,135 L95,110 Z"
      fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
    <!-- Central America + Caribbean -->
    <path d="M170,225 L210,230 L225,255 L210,260 L195,265 L185,265 L175,250 Z"
      fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.07)" stroke-width="0.5"/>
    <!-- South America -->
    <path d="M195,265 L260,255 L280,270 L285,300 L275,340 L265,370 L250,395
             L235,400 L220,390 L205,370 L195,340 L185,310 L185,285 Z"
      fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
    <!-- Europe -->
    <path d="M435,120 L510,110 L520,130 L515,160 L500,175 L475,178
             L450,172 L440,160 L435,145 Z"
      fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
    <!-- Scandinavia extra -->
    <path d="M455,100 L490,90 L500,110 L480,118 L460,118 Z"
      fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" stroke-width="0.5"/>
    <!-- Africa -->
    <path d="M435,185 L510,180 L540,200 L545,240 L535,280 L520,320
             L505,350 L485,360 L465,345 L450,310 L440,275 L435,240
             L430,210 Z"
      fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
    <!-- Middle East -->
    <path d="M510,180 L575,175 L580,200 L565,215 L545,220 L530,215 L515,205 Z"
      fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" stroke-width="0.5"/>
    <!-- Asia (simplified) -->
    <path d="M520,100 L710,90 L730,130 L720,170 L700,200 L670,210
             L630,205 L590,195 L560,190 L540,180 L525,165 L520,140 Z"
      fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
    <!-- Southeast Asia -->
    <path d="M660,200 L700,195 L710,220 L695,235 L675,230 L660,215 Z"
      fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" stroke-width="0.5"/>
    <!-- Japan (island) -->
    <ellipse cx="678" cy="182" rx="12" ry="20" fill="rgba(255,255,255,0.045)"
      stroke="rgba(255,255,255,0.07)" stroke-width="0.5" transform="rotate(-15,678,182)"/>
    <!-- Australia -->
    <path d="M660,290 L750,285 L770,310 L765,350 L745,375 L710,380
             L680,365 L660,340 L655,315 Z"
      fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
    <!-- New Zealand -->
    <ellipse cx="757" cy="368" rx="8" ry="14" fill="rgba(255,255,255,0.04)"
      stroke="rgba(255,255,255,0.07)" stroke-width="0.5"/>

    <!-- Equator label -->
    <text x="8" y="222" font-family="'JetBrains Mono',monospace" font-size="6"
      fill="rgba(255,255,255,0.2)">EQ</text>

    <!-- PIN MARKERS for all 48 classified countries -->
    ${pins}

    <!-- Hover overlay (transparent, catches events) -->
    <rect width="860" height="440" fill="transparent" rx="12"
      onmousemove="mapHoverMove(event)" onmouseleave="mapHoverLeave()"/>
  </svg>`;
}

window.mapPinClick = function(code) {
  const c = COUNTRIES.find(x=>x.code===code);
  if(c) navigate('country', code);
};

window.mapHoverMove = function(evt) {
  // Find nearest pin
  const svg = evt.currentTarget;
  const rect = svg.getBoundingClientRect();
  const mx = (evt.clientX - rect.left) / rect.width * 860;
  const my = (evt.clientY - rect.top) / rect.height * 440;

  let nearest = null, nearD = 20;
  Object.entries(MAP_COUNTRIES).forEach(([code,m]) => {
    const d = Math.hypot(m.cx - mx, m.cy - my);
    if(d < nearD) { nearD = d; nearest = code; }
  });

  const tt = document.getElementById('wm-tooltip');
  if(!tt) return;
  if(!nearest) { tt.style.display='none'; return; }

  const c = COUNTRIES.find(x=>x.code===nearest);
  if(!c) { tt.style.display='none'; return; }
  const owned = c.players.filter(p=>state.collected.has(p.id)).length;
  const m = MAP_COUNTRIES[nearest];

  tt.style.display = 'block';
  tt.style.left = Math.min(evt.clientX + 12, window.innerWidth - 220) + 'px';
  tt.style.top  = (evt.clientY - 10) + 'px';
  tt.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
      <img src="https://flagcdn.com/${c.flag}.svg" style="width:24px;height:17px;object-fit:cover;border-radius:2px;">
      <strong style="font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1px;">${c.name}</strong>
    </div>
    <div style="font-size:10px;color:rgba(240,244,255,0.5);font-family:'JetBrains Mono',monospace;margin-bottom:4px;">
      Grupo ${m.group} · ${m.conf}
    </div>
    <div style="font-size:10px;color:rgba(240,244,255,0.6);">FIFA #${c.ranking} · ${c.world_cups} Mundiales</div>
    <div style="margin-top:6px;font-size:10px;color:${owned>0?'#00A650':'rgba(240,244,255,0.4)'};">
      ${owned}/${c.players.length} láminas ${owned===c.players.length&&c.players.length>0?'✓':''}
    </div>
    <div style="margin-top:3px;font-size:9px;color:rgba(239,159,39,0.7);">Click para ver la selección →</div>`;
};

window.mapHoverLeave = function() {
  const tt = document.getElementById('wm-tooltip');
  if(tt) tt.style.display = 'none';
};

function buildCountryGrid(filter) {
  const wrap = document.getElementById('wm-grid');
  if(!wrap) return;

  // Group by the current filter
  const groups = {};
  Object.entries(MAP_COUNTRIES).forEach(([code, m]) => {
    const key = filter==='conf' ? m.conf : filter==='collect' ? 'TODOS' : `Grupo ${m.group}`;
    if(!groups[key]) groups[key] = [];
    groups[key].push(code);
  });

  const sortedKeys = Object.keys(groups).sort();

  wrap.innerHTML = sortedKeys.map(key => {
    const codes = groups[key];
    return `<div class="wm-group-section">
      <div class="wm-group-title" style="color:${
        filter==='conf' ? (CONF_COLORS[key]||'var(--gold)') :
        filter==='group' ? (GROUP_COLORS[key.replace('Grupo ','')] || 'var(--gold)') :
        'var(--gold)'
      }">${key}</div>
      <div class="wm-group-pills">
        ${codes.map(code => {
          const c = COUNTRIES.find(x=>x.code===code);
          if(!c) return '';
          const owned = c.players.filter(p=>state.collected.has(p.id)).length;
          const pct = c.players.length > 0 ? Math.round(owned/c.players.length*100) : 0;
          return `<div class="wm-pill" onclick="navigate('country','${code}')" title="${c.name} — ${pct}% completado">
            <img src="https://flagcdn.com/${c.flag}.svg" class="wm-pill-flag" onerror="this.style.display='none'">
            <span class="wm-pill-name">${c.name}</span>
            <span class="wm-pill-pct" style="color:${pct===100?'var(--green)':pct>0?'var(--gold)':'var(--muted)'}">${pct}%</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

// ── CSS for world map (injected dynamically) ──────────────
(function injectMapCSS() {
  const style = document.createElement('style');
  style.textContent = `
.wm-wrap{max-width:960px;margin:0 auto;padding-bottom:60px;}
.wm-header{display:flex;align-items:flex-start;justify-content:space-between;
  gap:16px;margin-bottom:16px;flex-wrap:wrap;}
.wm-legend{display:flex;flex-wrap:wrap;gap:6px;max-width:420px;}
.wm-legend-item{display:flex;align-items:center;gap:4px;}
.wm-legend-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.wm-legend-label{font-size:9px;font-family:'JetBrains Mono',monospace;color:rgba(240,244,255,0.45);letter-spacing:.5px;}

.wm-filter-bar{display:flex;gap:6px;margin-bottom:12px;}
.wm-filter{
  padding:6px 16px;border-radius:6px;font-family:'Barlow Condensed',sans-serif;
  font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,0.1);
  background:transparent;color:rgba(240,244,255,0.45);cursor:pointer;transition:all .12s;
}
.wm-filter.active{background:rgba(239,159,39,0.12);border-color:rgba(239,159,39,0.4);color:#EF9F27;}
.wm-filter:hover:not(.active){color:rgba(240,244,255,0.8);}

.wm-stats-bar{
  display:flex;gap:0;background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.06);border-radius:8px;
  overflow:hidden;margin-bottom:14px;flex-wrap:wrap;
}
.wm-stat-cell{
  display:flex;align-items:center;gap:5px;padding:8px 14px;
  border-right:1px solid rgba(255,255,255,0.04);
}
.wm-stat-cell:last-child{border:none;}
.wm-stat-dot{width:7px;height:7px;border-radius:50%;}
.wm-stat-conf{font-size:9px;font-family:'JetBrains Mono',monospace;color:rgba(240,244,255,0.45);letter-spacing:.5px;}
.wm-stat-n{font-family:'Bebas Neue',sans-serif;font-size:15px;margin-left:2px;color:rgba(240,244,255,0.7);}

.wm-map-container{
  background:rgba(6,13,26,0.8);border:1px solid rgba(255,255,255,0.06);
  border-radius:14px;overflow:hidden;position:relative;
  margin-bottom:8px;
}
.wm-map-inner{width:100%;aspect-ratio:860/440;}

/* Pin hover effect */
.map-pin .pin-body{transition:filter .15s;}
.map-pin:hover .pin-body{filter:brightness(1.4);}
.map-pin:hover{transform:scale(1.25);}

/* Tooltip */
.wm-tooltip{
  position:fixed;z-index:300;pointer-events:none;
  background:rgba(12,16,25,0.96);border:1px solid rgba(255,255,255,0.12);
  border-radius:10px;padding:12px 14px;min-width:180px;max-width:210px;
  backdrop-filter:blur(8px);color:rgba(240,244,255,0.9);font-size:12px;
  box-shadow:0 8px 24px rgba(0,0,0,0.4);
}

/* Country grid below map */
.wm-countries-grid{display:flex;flex-direction:column;gap:16px;}
.wm-group-section{}
.wm-group-title{
  font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:2px;
  margin-bottom:8px;
}
.wm-group-pills{display:flex;flex-wrap:wrap;gap:6px;}
.wm-pill{
  display:flex;align-items:center;gap:6px;
  padding:6px 10px;border-radius:6px;
  background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);
  cursor:pointer;transition:all .12s;
}
.wm-pill:hover{background:rgba(239,159,39,0.07);border-color:rgba(239,159,39,0.2);}
.wm-pill-flag{width:18px;height:13px;object-fit:cover;border-radius:2px;flex-shrink:0;}
.wm-pill-name{font-size:11px;font-family:'Barlow Condensed',sans-serif;
  font-weight:600;color:rgba(240,244,255,0.8);white-space:nowrap;}
.wm-pill-pct{font-size:9px;font-family:'JetBrains Mono',monospace;margin-left:2px;}
  `;
  document.head.appendChild(style);
})();

// Re-renderizar mapa Leaflet cuando cambia el tema
window.addEventListener('themechange', () => {
  if (_leafletMap) initLeafletMap(mapFilter);
});

// Estilos popup Leaflet
(function injectLeafletPopupStyles() {
  if (document.getElementById('wm-popup-styles')) return;
  const s = document.createElement('style');
  s.id = 'wm-popup-styles';
  s.textContent = `
    .wm-popup .leaflet-popup-content-wrapper {
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.35) !important;
      padding: 0 !important;
      overflow: hidden;
    }
    .wm-popup .leaflet-popup-content {
      margin: 12px !important;
    }
    .wm-popup .leaflet-popup-tip-container {
      display: none;
    }
    .leaflet-control-zoom {
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 8px !important;
      overflow: hidden;
    }
    .leaflet-control-zoom a {
      background: var(--surface, #0C1019) !important;
      color: var(--text, #F0F4FF) !important;
      border-color: rgba(255,255,255,0.08) !important;
    }
    .leaflet-control-zoom a:hover {
      background: var(--surface2, #111827) !important;
    }
    .leaflet-control-attribution {
      background: rgba(7,10,16,0.7) !important;
      color: rgba(240,244,255,0.4) !important;
      font-size: 9px !important;
    }
    .leaflet-control-attribution a {
      color: rgba(240,244,255,0.5) !important;
    }
  `;
  document.head.appendChild(s);
})();
