// ═══════════════════════════════════════════════════════════
// PLAYER PHOTOS — Álbum Mundial 2026
//
// Mapa de ID de jugador → ruta de imagen.
// Convención de nombres: assets/players/{ID}.png
//   Ejemplo: COL-10 → assets/players/COL-10.png
//
// Para agregar más fotos:
//   1. Sube la imagen a assets/players/ con el nombre del ID
//   2. Agrega la entrada aquí: 'ID': 'assets/players/ID.png'
// ═══════════════════════════════════════════════════════════

const PLAYER_PHOTOS = {

  // ── COLOMBIA ──────────────────────────────────────────────
  'COL-10':   'assets/players/COL-10.png',   // James Rodríguez
  'COL-11':   'assets/players/COL-11.png',   // Luis Díaz
  'COL-TEAM': 'assets/players/COL-TEAM.jpg', // Plantel Colombia (foto grupal)
  // 'COL-FLAG': bandera → se usa la de flagcdn.com automáticamente

  // ── Agrega más selecciones aquí ───────────────────────────
  // 'ARG-10': 'assets/players/ARG-10.png',  // Messi
  // 'BRA-07': 'assets/players/BRA-07.png',  // Vinicius Jr.
  // 'FRA-10': 'assets/players/FRA-10.png',  // Mbappé
  // ...
};

/**
 * Retorna la URL de la bandera de un país desde flagcdn.com
 * Usada para la lámina especial FLAG de cada selección.
 * @param {string} flagCode — ej: 'co', 'ar', 'br'
 */
function getFlagUrl(flagCode) {
  return `https://flagcdn.com/w320/${flagCode}.png`;
}
window.getFlagUrl = getFlagUrl;

/**
 * Retorna la URL de la foto de un jugador, o null si no tiene foto.
 * @param {string} playerId — ej: 'COL-10'
 * @returns {string|null}
 */
function getPlayerPhoto(playerId) {
  return PLAYER_PHOTOS[playerId] || null;
}

/**
 * Retorna el HTML del área de imagen de una lámina especial (FLAG o TEAM).
 * @param {object} player — objeto con type:'flag'|'team', id, e, name
 * @param {boolean} collected
 * @param {string} flagCode — código de bandera del país (ej: 'co')
 */
function getSpecialStickerImageHTML(player, collected, flagCode) {
  if (!collected) {
    return `<div class="slot-empty-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>`;
  }

  if (player.type === 'flag') {
    const url = getFlagUrl(flagCode || 'un');
    return `<div class="slot-img slot-flag-img">
      <img src="${url}" alt="Bandera"
        style="object-fit:cover;width:100%;height:100%;"
        onerror="this.parentElement.innerHTML='<div class=\'slot-silhouette\'>🏳️</div>'">
    </div>`;
  }

  if (player.type === 'team') {
    const photo = getPlayerPhoto(player.id);
    if (photo) {
      return `<div class="slot-img slot-team-img">
        <img src="${photo}" alt="${player.name}"
          style="object-fit:cover;object-position:center top;width:100%;height:100%;"
          onerror="this.parentElement.innerHTML='<div class=\'slot-silhouette\'>👥</div>'">
      </div>`;
    }
    return `<div class="slot-silhouette">${player.e}</div>`;
  }

  return `<div class="slot-silhouette">${player.e}</div>`;
}
window.getSpecialStickerImageHTML = getSpecialStickerImageHTML;

/**
 * Retorna el HTML del área de imagen de una lámina.
 * Si hay foto: muestra <img> con fallback al emoji.
 * Si no: muestra el emoji (comportamiento original).
 *
 * @param {object} player — objeto jugador de COUNTRIES[].players
 * @param {boolean} collected — si el usuario ya la tiene
 */
function getStickerImageHTML(player, collected) {
  const photo = getPlayerPhoto(player.id);

  if (!collected) {
    // Lámina no conseguida: silueta con ícono vacío
    return `<div class="slot-empty-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>`;
  }

  if (photo) {
    // Lámina conseguida con foto real
    return `<div class="slot-img">
      <img
        src="${photo}"
        alt="${player.name}"
        loading="lazy"
        onerror="this.parentElement.innerHTML='<div class=\\'slot-silhouette\\'>${player.e}</div>'"
      >
    </div>`;
  }

  // Lámina conseguida sin foto: emoji (comportamiento original)
  return `<div class="slot-silhouette">${player.e}</div>`;
}

// Exponer globalmente
window.PLAYER_PHOTOS    = PLAYER_PHOTOS;
window.getPlayerPhoto   = getPlayerPhoto;
window.getStickerImageHTML = getStickerImageHTML;
