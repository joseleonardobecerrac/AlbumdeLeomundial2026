// ═══════════════════════════════════════════════════════════
// ORÁCULO DEL FÚTBOL — Chatbot powered by Claude API
// Especializado en historia del fútbol y el Mundial 2026
// ═══════════════════════════════════════════════════════════

(function initChatbot() {

// ── CSS ───────────────────────────────────────────────────
const css = `
/* ══ ORÁCULO DEL FÚTBOL ════════════════════════════════════ */
.chat-wrap {
  max-width: 860px; margin: 0 auto;
  display: flex; flex-direction: column;
  height: calc(100vh - var(--topbar) - 56px);
  padding-bottom: 0;
}

/* Header */
.chat-header {
  flex-shrink: 0;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 16px; padding: 18px 22px;
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 14px; position: relative; overflow: hidden;
}
.chat-header::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 0% 50%, rgba(91,164,245,0.07), transparent 55%),
              radial-gradient(ellipse at 100% 50%, rgba(229,53,171,0.05), transparent 55%);
}
.chat-avatar {
  width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
  background: linear-gradient(135deg, #1a0a2e, #0a1a35);
  border: 1px solid rgba(127,119,221,0.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; position: relative;
  box-shadow: 0 0 20px rgba(127,119,221,0.2);
}
.chat-avatar-pulse {
  position: absolute; inset: -3px; border-radius: 16px;
  border: 1px solid rgba(127,119,221,0.3);
  animation: avatarPulse 2.5s ease-in-out infinite;
}
@keyframes avatarPulse {
  0%,100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.04); }
}
.chat-header-info { flex: 1; position: relative; }
.chat-header-name {
  font-family: var(--fd); font-size: 22px; letter-spacing: 2px;
  background: linear-gradient(90deg, #a09ae8, #5BA4F5, #D4537E);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.chat-header-desc {
  font-size: 11px; color: var(--muted); font-family: var(--fs);
  margin-top: 3px; line-height: 1.5;
}
.chat-header-status {
  display: flex; align-items: center; gap: 5px;
  font-size: 9px; font-family: var(--fm); letter-spacing: 1px;
  color: var(--green); margin-top: 5px;
}
.chat-status-dot {
  width: 5px; height: 5px; border-radius: 50%; background: var(--green);
  animation: statusPulse 2s ease-in-out infinite;
}
@keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.chat-header-actions { display: flex; gap: 6px; position: relative; }
.chat-action-btn {
  padding: 6px 12px; border-radius: 7px; font-family: var(--fm);
  font-size: 10px; letter-spacing: .5px; border: 1px solid var(--border2);
  background: transparent; color: var(--muted); cursor: pointer;
  transition: all .12s;
}
.chat-action-btn:hover { border-color: var(--border3); color: var(--text); }
.chat-action-btn.danger:hover { border-color: var(--red); color: var(--red); }

/* Suggested questions chips */
.chat-suggestions {
  flex-shrink: 0; display: flex; gap: 7px; flex-wrap: wrap;
  margin-bottom: 12px;
}
.chat-chip {
  padding: 6px 13px; border-radius: 20px;
  background: var(--surface2); border: 1px solid var(--border);
  font-size: 11px; font-family: var(--fb); font-weight: 600;
  color: var(--muted); cursor: pointer; transition: all .15s;
  white-space: nowrap;
}
.chat-chip:hover {
  border-color: rgba(127,119,221,0.5);
  color: #a09ae8; background: rgba(127,119,221,0.06);
}

/* Messages area */
.chat-messages {
  flex: 1; overflow-y: auto; padding: 4px 0 12px;
  display: flex; flex-direction: column; gap: 16px;
}
.chat-messages::-webkit-scrollbar { width: 3px; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--border2); }

/* Message bubbles */
.chat-msg {
  display: flex; gap: 10px; align-items: flex-start;
  animation: msgIn .3s cubic-bezier(.34,1.56,.64,1);
}
@keyframes msgIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

.chat-msg.user { flex-direction: row-reverse; }

.chat-msg-avatar {
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
}
.chat-msg.bot .chat-msg-avatar {
  background: linear-gradient(135deg,#1a0a2e,#0a1a35);
  border: 1px solid rgba(127,119,221,0.3);
}
.chat-msg.user .chat-msg-avatar {
  background: linear-gradient(135deg, var(--red), var(--blue));
}

.chat-msg-bubble {
  max-width: 78%; padding: 12px 16px;
  border-radius: 14px; font-family: var(--fs);
  font-size: 14px; line-height: 1.7;
}
.chat-msg.bot .chat-msg-bubble {
  background: var(--surface2); border: 1px solid var(--border);
  border-top-left-radius: 4px; color: var(--text);
}
.chat-msg.user .chat-msg-bubble {
  background: linear-gradient(135deg,rgba(127,119,221,0.15),rgba(91,164,245,0.1));
  border: 1px solid rgba(127,119,221,0.25);
  border-top-right-radius: 4px; color: var(--text);
}

/* Bot bubble typography */
.chat-msg.bot .chat-msg-bubble strong { color: var(--gold); font-weight: 700; }
.chat-msg.bot .chat-msg-bubble em { color: var(--rare-c); font-style: normal; font-weight: 600; }
.chat-msg.bot .chat-msg-bubble p { margin-bottom: 8px; }
.chat-msg.bot .chat-msg-bubble p:last-child { margin-bottom: 0; }
.chat-msg.bot .chat-msg-bubble ul { padding-left: 16px; margin: 6px 0; }
.chat-msg.bot .chat-msg-bubble li { margin-bottom: 4px; }
.chat-msg.bot .chat-msg-bubble hr {
  border: none; border-top: 1px solid var(--border); margin: 10px 0;
}

/* Timestamp */
.chat-msg-time {
  font-size: 9px; font-family: var(--fm); color: var(--muted2);
  margin-top: 4px; text-align: right; letter-spacing: .5px;
}
.chat-msg.bot .chat-msg-time { text-align: left; }

/* Typing indicator */
.chat-typing {
  display: flex; gap: 10px; align-items: flex-start;
}
.chat-typing-bubble {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 14px; border-top-left-radius: 4px;
  padding: 12px 16px; display: flex; gap: 4px; align-items: center;
}
.chat-typing-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(127,119,221,0.5);
  animation: typingDot 1.4s ease-in-out infinite;
}
.chat-typing-dot:nth-child(2) { animation-delay: .2s; }
.chat-typing-dot:nth-child(3) { animation-delay: .4s; }
@keyframes typingDot {
  0%,60%,100% { transform: translateY(0);   opacity: .5; }
  30%          { transform: translateY(-6px); opacity: 1; }
}

/* Stream cursor */
.chat-cursor {
  display: inline-block; width: 2px; height: 1em;
  background: #a09ae8; margin-left: 1px;
  vertical-align: middle; animation: cursorBlink .7s step-end infinite;
}
@keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Source cards (related stickers) */
.chat-sources {
  display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;
  padding-top: 10px; border-top: 1px solid var(--border);
}
.chat-source-card {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 10px; border-radius: 6px;
  background: var(--surface3); border: 1px solid var(--border);
  font-size: 11px; font-family: var(--fb); font-weight: 600;
  color: var(--muted); cursor: pointer; transition: all .12s;
}
.chat-source-card:hover { border-color: var(--gold); color: var(--gold); }
.chat-source-flag { width: 14px; height: 10px; object-fit: cover; border-radius: 1px; }

/* Input area */
.chat-input-area {
  flex-shrink: 0; margin-top: 10px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 14px; overflow: hidden;
  transition: border-color .15s;
}
.chat-input-area:focus-within { border-color: rgba(127,119,221,0.4); }

.chat-input-row {
  display: flex; align-items: flex-end; gap: 8px; padding: 10px 12px;
}
.chat-input {
  flex: 1; background: transparent; border: none; outline: none;
  color: var(--text); font-family: var(--fs); font-size: 14px;
  resize: none; min-height: 24px; max-height: 120px;
  line-height: 1.5; padding: 2px 0;
}
.chat-input::placeholder { color: var(--muted); }

.chat-send-btn {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg,#7F77DD,#5BA4F5);
  border: none; color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; transition: all .15s;
}
.chat-send-btn:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(127,119,221,0.4); }
.chat-send-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

.chat-input-footer {
  display: flex; align-items: center; gap: 8px;
  padding: 0 12px 8px; font-size: 9px;
  font-family: var(--fm); color: var(--muted2); letter-spacing: .5px;
}
.chat-char-count { margin-left: auto; }
.chat-char-count.warn { color: var(--gold); }
.chat-char-count.over { color: var(--red); }

/* Empty state */
.chat-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 20px;
}
.chat-empty-icon { font-size: 56px; margin-bottom: 16px; }
.chat-empty-title {
  font-family: var(--fd); font-size: 24px; letter-spacing: 2px;
  margin-bottom: 8px; color: var(--text);
}
.chat-empty-sub {
  font-size: 13px; color: var(--muted); font-family: var(--fs);
  line-height: 1.65; max-width: 360px;
}

/* Topic pills in empty state */
.chat-topics {
  display: flex; gap: 8px; flex-wrap: wrap;
  justify-content: center; margin-top: 20px;
}
.chat-topic {
  padding: 8px 16px; border-radius: 20px;
  background: var(--surface2); border: 1px solid var(--border);
  font-size: 13px; font-family: var(--fb); font-weight: 600;
  color: var(--muted); cursor: pointer; transition: all .15s;
}
.chat-topic:hover {
  border-color: rgba(127,119,221,0.4); color: #a09ae8;
  background: rgba(127,119,221,0.06); transform: translateY(-2px);
}

/* Reactions */
.chat-reactions {
  display: flex; gap: 4px; margin-top: 6px;
}
.chat-react-btn {
  padding: 3px 8px; border-radius: 4px; font-size: 11px;
  border: 1px solid var(--border); background: transparent;
  color: var(--muted); cursor: pointer; transition: all .12s;
  font-family: var(--fm);
}
.chat-react-btn:hover { border-color: var(--border2); color: var(--text); }
.chat-react-btn.active { background: var(--gold-dim); border-color: rgba(239,159,39,.3); color: var(--gold); }

/* Light mode */
:root.light .chat-msg.bot .chat-msg-bubble { background: #F5F7FC; }
:root.light .chat-typing-bubble { background: #F5F7FC; }
:root.light .chat-input-area { background: #fff; }
`;

const styleEl = document.createElement('style');
styleEl.id = 'chatbot-styles';
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
const chatHistory = [];   // { role: 'user'|'assistant', content: string }
let isStreaming = false;
let chatUserName = '';

// System prompt — the AI persona
function buildSystemPrompt() {
  const myTeam = state.favTeam
    ? (COUNTRIES.find(c=>c.code===state.favTeam)?.name || '')
    : null;
  const owned = state.collected?.size || 0;
  const total = COUNTRIES.reduce((a,c)=>a+c.players.length,0);

  const icons = COUNTRIES.flatMap(c=>c.players)
    .filter(p=>p.rarity==='icon'&&state.collected?.has(p.id))
    .map(p=>p.name).join(', ') || 'ninguna aún';

  return `Eres el Oráculo del Fútbol, un asistente experto en historia del fútbol mundial integrado en el Álbum Digital del FIFA World Cup™ 2026.

Tu personalidad:
- Apasionado, enciclopédico y entretenido. Hablas como un comentarista de televisión que también es historiador.
- Usas emojis con moderación (1-2 por respuesta máximo).
- Das respuestas concretas, con datos reales y anécdotas fascinantes.
- Si te preguntan sobre el álbum del usuario, accedes a esa información.
- Respondes SIEMPRE en español.
- Formato: usa **negrita** para nombres propios importantes, párrafos cortos, listas cuando convenga.

Información del usuario:
- Láminas coleccionadas: ${owned} de ${total}
- Selección favorita: ${myTeam || 'no definida aún'}
- Íconos que tiene: ${icons}

El Mundial 2026 se celebra en USA, Canadá y México con 48 selecciones clasificadas.

Tus especialidades:
1. Historia completa de los 22 Mundiales (1930–2022)
2. Estadísticas: goleadores, récords, curiosidades
3. Jugadores legendarios: Pelé, Maradona, Ronaldo, Messi, etc.
4. Tácticas y evolución del fútbol
5. Selecciones: historial, anécdotas, figuras
6. El Mundial 2026: sedes, grupos, selecciones clasificadas
7. El álbum del usuario: puedes comentar su colección

Cuando el usuario pregunte sobre un jugador o selección que está en el álbum, menciona que puede verlo en su colección. Sé conciso pero completo. Máximo 300 palabras por respuesta salvo que pidan algo extenso.`;
}

// ═══════════════════════════════════════════════════════════
// SUGGESTED QUESTIONS — rotativas por tema
// ═══════════════════════════════════════════════════════════
const SUGGESTIONS_POOL = [
  '⚽ ¿Quién marcó el gol más rápido en la historia del Mundial?',
  '🏆 ¿Cuántos mundiales ha ganado Brasil?',
  '🐐 ¿Por qué Messi es considerado el mejor de la historia?',
  '✋ Cuéntame del Gol de la Mano de Dios',
  '🌟 ¿Quién fue el mejor jugador del Mundial 2022?',
  '📊 ¿Quién tiene más goles en mundiales?',
  '🇩🇪 ¿Qué pasó en el Mineirazo de 2014?',
  '🦁 ¿Qué selecciones africanas han llegado más lejos?',
  '🎯 ¿Cómo fue la final de 1950 entre Uruguay y Brasil?',
  '⚡ ¿Quién es Erling Haaland y por qué es tan especial?',
  '🌍 ¿Cómo funciona el Mundial 2026 con 48 equipos?',
  '🏟️ ¿Cuál es la historia del Estadio Azteca?',
  '🇨🇴 ¿Cuál es el mejor resultado de Colombia en un Mundial?',
  '👑 ¿Qué récords tiene Luka Modrić?',
  '🔥 ¿Quién fue el goleador del Mundial 2018?',
  '🌺 Cuéntame de la selección de Marruecos en Qatar 2022',
];

function getRandomSuggestions(n=4) {
  const shuffled = [...SUGGESTIONS_POOL].sort(()=>Math.random()-0.5);
  return shuffled.slice(0, n);
}

// ═══════════════════════════════════════════════════════════
// RELATED STICKERS — find relevant players/countries to mention
// ═══════════════════════════════════════════════════════════
function findRelatedStickers(text) {
  const related = [];
  const lower = text.toLowerCase();
  COUNTRIES.forEach(c => {
    if(lower.includes(c.name.toLowerCase()) || lower.includes(c.code.toLowerCase())) {
      related.push({ type:'country', code:c.code, name:c.name, flag:c.flag });
    }
    c.players.forEach(p => {
      const lastName = p.name.split(' ').pop().toLowerCase();
      if(lower.includes(lastName) && lastName.length > 3) {
        related.push({ type:'player', id:p.id, name:p.name, flag:c.flag, code:c.code });
      }
    });
  });
  // Deduplicate
  const seen = new Set();
  return related.filter(r => {
    const key = r.type + (r.code||r.id);
    if(seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, 4);
}

// ═══════════════════════════════════════════════════════════
// SIMPLE MARKDOWN → HTML
// ═══════════════════════════════════════════════════════════
function md(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^#{1,3}\s+(.+)$/gm, '<strong>$1</strong>')
    .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[uop])(.+)$/gm, m => m.startsWith('<') ? m : `<p>${m}</p>`)
    .replace(/<p><\/p>/g, '')
    .replace(/\n/g, ' ');
}

function getTime() {
  return new Date().toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
}

// ═══════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════
function renderChatbot(page) {
  const user = window._firebase?.auth?.currentUser;
  chatUserName = user?.displayName?.split(' ')[0] || 'Tú';
  const userPhoto = user?.photoURL;
  const suggestions = getRandomSuggestions(4);

  page.innerHTML = `<div class="chat-wrap page-enter">

    <!-- Header -->
    <div class="chat-header">
      <div class="chat-avatar">
        ⚽
        <div class="chat-avatar-pulse"></div>
      </div>
      <div class="chat-header-info">
        <div class="chat-header-name">ORÁCULO DEL FÚTBOL</div>
        <div class="chat-header-desc">Powered by Claude · Experto en historia del fútbol mundial y el Mundial 2026</div>
        <div class="chat-header-status"><div class="chat-status-dot"></div>EN LÍNEA · LISTO PARA RESPONDER</div>
      </div>
      <div class="chat-header-actions">
        <button class="chat-action-btn" onclick="exportChat()">📄 Exportar</button>
        <button class="chat-action-btn danger" onclick="clearChat()">🗑 Limpiar</button>
      </div>
    </div>

    <!-- Suggested questions -->
    <div class="chat-suggestions" id="chat-chips">
      ${suggestions.map(s=>`<button class="chat-chip" onclick="sendSuggestion(this.textContent)">${s}</button>`).join('')}
    </div>

    <!-- Messages -->
    <div class="chat-messages" id="chat-messages">
      ${chatHistory.length === 0 ? renderEmptyState() : chatHistory.map((m,i) => renderMessage(m, i)).join('')}
    </div>

    <!-- Input -->
    <div class="chat-input-area">
      <div class="chat-input-row">
        <textarea class="chat-input" id="chat-input"
          placeholder="Pregunta sobre historia del fútbol, jugadores, el Mundial 2026…"
          rows="1"
          onkeydown="chatKeydown(event)"
          oninput="chatInputChange(this)"></textarea>
        <button class="chat-send-btn" id="chat-send" onclick="sendChatMessage()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <div class="chat-input-footer">
        <span>⌘↵ enviar · Shift+↵ nueva línea</span>
        <span class="chat-char-count" id="chat-char">0/500</span>
      </div>
    </div>
  </div>`;

  // Focus input
  setTimeout(() => document.getElementById('chat-input')?.focus(), 100);
}

function renderEmptyState() {
  return `<div class="chat-empty">
    <div class="chat-empty-icon">⚽</div>
    <div class="chat-empty-title">¡Pregúntame todo!</div>
    <div class="chat-empty-sub">Soy el Oráculo del Fútbol. Conozco cada gol, cada jugador, cada final mundialista desde 1930 hasta hoy.</div>
    <div class="chat-topics">
      <span class="chat-topic" onclick="sendSuggestion('¿Quién es el máximo goleador de la historia del Mundial?')">📊 Récords</span>
      <span class="chat-topic" onclick="sendSuggestion('Cuéntame de la historia de Colombia en los Mundiales')">🇨🇴 Colombia</span>
      <span class="chat-topic" onclick="sendSuggestion('¿Cómo quedaron los grupos del Mundial 2026?')">🌍 Mundial 2026</span>
      <span class="chat-topic" onclick="sendSuggestion('¿Quiénes son los jugadores ICON del álbum?')">⭐ Mi álbum</span>
      <span class="chat-topic" onclick="sendSuggestion('¿Cuál fue la mejor final de la historia del Mundial?')">🏆 Finales</span>
      <span class="chat-topic" onclick="sendSuggestion('Háblame de Pelé y por qué fue tan especial')">👑 Leyendas</span>
    </div>
  </div>`;
}

function renderMessage(msg, idx) {
  const isUser = msg.role === 'user';
  const user = window._firebase?.auth?.currentUser;
  const userPhoto = user?.photoURL;
  const initials = (user?.displayName||'T')[0].toUpperCase();

  const avatarHTML = isUser
    ? (userPhoto
        ? `<img src="${userPhoto}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`
        : `<span style="font-family:var(--fd);font-size:14px;color:#fff;">${initials}</span>`)
    : '⚽';

  const bubbleContent = isUser
    ? `<div>${msg.content}</div>`
    : buildBotBubble(msg.content, idx);

  return `<div class="chat-msg ${isUser?'user':'bot'}" id="msg-${idx}">
    <div class="chat-msg-avatar">${avatarHTML}</div>
    <div>
      <div class="chat-msg-bubble">${bubbleContent}</div>
      ${!isUser ? `<div class="chat-reactions">
        <button class="chat-react-btn" onclick="reactMsg(${idx},'👍')" title="Buena respuesta">👍</button>
        <button class="chat-react-btn" onclick="reactMsg(${idx},'❤️')" title="Me encantó">❤️</button>
        <button class="chat-react-btn" onclick="copyMsg(${idx})" title="Copiar">📋</button>
      </div>` : ''}
      <div class="chat-msg-time">${msg.time || getTime()}</div>
    </div>
  </div>`;
}

function buildBotBubble(content, idx) {
  const related = findRelatedStickers(content);
  const sourcesHTML = related.length > 0
    ? `<div class="chat-sources">
        <span style="font-size:9px;font-family:var(--fm);letter-spacing:1px;color:var(--muted);align-self:center;">EN TU ÁLBUM:</span>
        ${related.map(r => `
          <div class="chat-source-card" onclick="navigate('${r.type==='country'?'country':'country'}','${r.code||r.code}')">
            <img class="chat-source-flag" src="https://flagcdn.com/${r.flag}.svg" onerror="this.style.display='none'">
            ${r.name}
          </div>`).join('')}
      </div>`
    : '';

  return `${md(content)}${sourcesHTML}`;
}

// ═══════════════════════════════════════════════════════════
// SEND MESSAGE
// ═══════════════════════════════════════════════════════════
window.sendChatMessage = async function() {
  const input = document.getElementById('chat-input');
  const text  = input?.value.trim();
  if(!text || isStreaming) return;

  const MAX_CHARS = 500;
  if(text.length > MAX_CHARS) {
    toast('Mensaje muy largo. Máximo 500 caracteres.', 'error');
    return;
  }

  input.value = '';
  input.style.height = 'auto';
  updateCharCount(0);

  // Add to history
  const userMsg = { role:'user', content:text, time:getTime() };
  chatHistory.push(userMsg);

  // Hide empty state + render user message
  const msgArea = document.getElementById('chat-messages');
  if(!msgArea) return;
  const emptyEl = msgArea.querySelector('.chat-empty');
  if(emptyEl) emptyEl.remove();

  const userIdx = chatHistory.length - 1;
  msgArea.insertAdjacentHTML('beforeend', renderMessage(userMsg, userIdx));
  scrollChat();

  // Show typing indicator
  const typingId = 'typing-' + Date.now();
  msgArea.insertAdjacentHTML('beforeend', `
    <div class="chat-msg bot" id="${typingId}">
      <div class="chat-msg-avatar">⚽</div>
      <div class="chat-typing-bubble">
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
      </div>
    </div>`);
  scrollChat();

  // Disable input
  isStreaming = true;
  const sendBtn = document.getElementById('chat-send');
  if(sendBtn) sendBtn.disabled = true;
  if(input) input.disabled = true;

  try {
    const response = await callClaudeChat(text);

    // Remove typing indicator
    document.getElementById(typingId)?.remove();

    // Add bot response to history
    const botMsg = { role:'assistant', content:response, time:getTime() };
    chatHistory.push(botMsg);

    // Render bot message with streaming effect
    const botIdx = chatHistory.length - 1;
    msgArea.insertAdjacentHTML('beforeend', `
      <div class="chat-msg bot" id="msg-${botIdx}">
        <div class="chat-msg-avatar">⚽</div>
        <div>
          <div class="chat-msg-bubble" id="bubble-${botIdx}">
            <span id="stream-text-${botIdx}"></span><span class="chat-cursor"></span>
          </div>
          <div class="chat-msg-time">${botMsg.time}</div>
        </div>
      </div>`);
    scrollChat();

    // Typewriter effect
    await typewriterEffect(`stream-text-${botIdx}`, `bubble-${botIdx}`, response, botIdx);

  } catch(err) {
    document.getElementById(typingId)?.remove();
    const errMsg = { role:'assistant', content:`Lo siento, ocurrió un error al conectar con la IA. **Error:** ${err.message}\n\nVerifica que la API key de Anthropic esté configurada correctamente en \`js/firebase.js\`.`, time:getTime() };
    chatHistory.push(errMsg);
    msgArea.insertAdjacentHTML('beforeend', renderMessage(errMsg, chatHistory.length-1));
    scrollChat();
    console.error('Chat error:', err);
  } finally {
    isStreaming = false;
    if(sendBtn) sendBtn.disabled = false;
    if(input) { input.disabled = false; input.focus(); }
  }
};

// ═══════════════════════════════════════════════════════════
// CLAUDE API CALL
// ═══════════════════════════════════════════════════════════
async function callClaudeChat(userText) {
  // Build messages array (last 10 turns for context)
  const contextMsgs = chatHistory
    .slice(-10)
    .filter(m => m.content)
    .map(m => ({ role: m.role, content: m.content }));

  // Remove the last user message since we'll add it fresh
  if(contextMsgs.length > 0 && contextMsgs[contextMsgs.length-1].role === 'user') {
    contextMsgs.pop();
  }

  // Ensure alternating roles
  const cleanMsgs = [];
  let lastRole = null;
  for(const msg of contextMsgs) {
    if(msg.role !== lastRole) {
      cleanMsgs.push(msg);
      lastRole = msg.role;
    }
  }
  // Always end with user message
  cleanMsgs.push({ role:'user', content: userText });

  // ── Llamar via proxy Cloud Function (API key segura en servidor) ──
  // Si CLOUD_FUNCTION_BASE no está definido, intentar llamada directa
  // (solo útil en desarrollo local con emulators).
  const base = (typeof CLOUD_FUNCTION_BASE !== 'undefined' && CLOUD_FUNCTION_BASE)
    ? CLOUD_FUNCTION_BASE
    : '';

  let response, data;

  if (base) {
    // Modo producción: proxy seguro
    const token = await (typeof getFirebaseIdToken === 'function' ? getFirebaseIdToken() : Promise.resolve(null));
    response = await fetch(`${base}/claudeProxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        mode: 'chat',
        messages: cleanMsgs,
        system: buildSystemPrompt(),
      }),
    });
  } else {
    // Modo desarrollo: llamada directa (requiere ANTHROPIC_API_KEY en window)
    const apiKey = window.ANTHROPIC_API_KEY || '';
    if (!apiKey) throw new Error('Configura CLOUD_FUNCTION_BASE o window.ANTHROPIC_API_KEY para desarrollo local');
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
        max_tokens: 1000,
        system: buildSystemPrompt(),
        messages: cleanMsgs,
      }),
    });
  }

  if(!response.ok) {
    const err = await response.json().catch(()=>({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  data = await response.json();
  return data.content?.find(b=>b.type==='text')?.text || 'No pude generar una respuesta.';
}

// ═══════════════════════════════════════════════════════════
// TYPEWRITER EFFECT
// ═══════════════════════════════════════════════════════════
async function typewriterEffect(spanId, bubbleId, fullText, msgIdx) {
  const span = document.getElementById(spanId);
  if(!span) return;

  const speed = Math.max(6, Math.floor(2800 / fullText.length));
  let i = 0;

  await new Promise(resolve => {
    const interval = setInterval(() => {
      span.textContent = fullText.slice(0, i);
      i++;
      scrollChat();
      if(i > fullText.length) {
        clearInterval(interval);
        // Replace with proper rendered HTML
        const bubble = document.getElementById(bubbleId);
        if(bubble) {
          bubble.innerHTML = buildBotBubble(fullText, msgIdx);
          // Add reactions
          const reactionHtml = `<div class="chat-reactions">
            <button class="chat-react-btn" onclick="reactMsg(${msgIdx},'👍')">👍</button>
            <button class="chat-react-btn" onclick="reactMsg(${msgIdx},'❤️')">❤️</button>
            <button class="chat-react-btn" onclick="copyMsg(${msgIdx})">📋</button>
          </div>`;
          bubble.insertAdjacentHTML('afterend', reactionHtml);
        }
        resolve();
      }
    }, speed);
  });
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function scrollChat() {
  const area = document.getElementById('chat-messages');
  if(area) area.scrollTop = area.scrollHeight;
}

window.chatKeydown = function(e) {
  if(e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
};

window.chatInputChange = function(el) {
  // Auto-resize
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  updateCharCount(el.value.length);
};

function updateCharCount(n) {
  const el = document.getElementById('chat-char');
  if(!el) return;
  el.textContent = `${n}/500`;
  el.className = 'chat-char-count' + (n > 450 ? ' warn' : '') + (n > 500 ? ' over' : '');
}

window.sendSuggestion = function(text) {
  const input = document.getElementById('chat-input');
  if(input) {
    input.value = text;
    updateCharCount(text.length);
    sendChatMessage();
  }
};

window.reactMsg = function(idx, emoji) {
  const msg = document.getElementById(`msg-${idx}`);
  if(!msg) return;
  const btns = msg.querySelectorAll('.chat-react-btn');
  btns.forEach(b => b.classList.remove('active'));
  const map = { '👍':0, '❤️':1 };
  if(map[emoji] !== undefined && btns[map[emoji]]) {
    btns[map[emoji]].classList.add('active');
  }
  toast(emoji + ' Gracias por tu feedback');
};

window.copyMsg = function(idx) {
  const msg = chatHistory[idx];
  if(!msg) return;
  navigator.clipboard.writeText(msg.content)
    .then(() => toast('📋 Copiado al portapapeles', 'success'))
    .catch(() => toast('No se pudo copiar'));
};

window.clearChat = function() {
  if(!confirm('¿Borrar toda la conversación?')) return;
  chatHistory.length = 0;
  renderChatbot(document.getElementById('page'));
  toast('🗑 Conversación borrada');
};

window.exportChat = function() {
  if(!chatHistory.length) { toast('No hay mensajes para exportar', 'error'); return; }
  const text = chatHistory.map(m =>
    `[${m.time||''}] ${m.role === 'user' ? chatUserName : 'Oráculo'}: ${m.content}`
  ).join('\n\n---\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `oraculo-futbol-${Date.now()}.txt`; a.click();
  URL.revokeObjectURL(url);
  toast('📄 Conversación exportada', 'success');
};

// Refresh chips when navigating back
const _origNav = window.navigate;
window.navigate = function(view, code) {
  if(view !== 'chatbot') {
    // Keep history when leaving, rebuild on return
  }
  _origNav(view, code);
};

})(); // end IIFE
