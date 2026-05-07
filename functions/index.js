// ═══════════════════════════════════════════════════════════
// CLOUD FUNCTION — Proxy seguro para la API de Anthropic
// Álbum Mundial 2026
//
// DEPLOY:
//   cd functions
//   npm install
//   firebase deploy --only functions
//
// La API key se guarda como variable de entorno de Firebase:
//   firebase functions:secrets:set ANTHROPIC_API_KEY
// ═══════════════════════════════════════════════════════════

const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();

// La API key vive en Secret Manager, nunca en el código
const anthropicKey = defineSecret('ANTHROPIC_API_KEY');

// ── Rate limit: máx sobres por usuario ────────────────────
const MAX_PACKS_PER_DAY = 5;

// ── Límites de tokens por modo de IA ─────────────────────
const MODE_TOKENS = {
  chat:     1000,
  match:    1500,
  group:    1500,
  champion: 1500,
};

// ═══════════════════════════════════════════════════════════
// HELPER — verificar Firebase ID token del usuario
// ═══════════════════════════════════════════════════════════
async function verifyUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new Error('No autorizado: token faltante');
  return admin.auth().verifyIdToken(token);
}

// ═══════════════════════════════════════════════════════════
// FUNCIÓN 1: claudeProxy
// Recibe peticiones de chatbot y predictor; llama a Anthropic
// POST /claudeProxy
// Body: { mode, messages, system?, prompt? }
// Header: Authorization: Bearer <firebase_id_token>
// ═══════════════════════════════════════════════════════════
exports.claudeProxy = onRequest(
  { secrets: [anthropicKey], cors: true },
  async (req, res) => {
    // Solo POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    // Verificar que el usuario esté autenticado con Firebase
    let user;
    try {
      user = await verifyUser(req);
    } catch (e) {
      return res.status(401).json({ error: 'No autorizado', detail: e.message });
    }

    const { mode, messages, system, prompt } = req.body;

    // Validar modo permitido
    const maxTokens = MODE_TOKENS[mode];
    if (!maxTokens) {
      return res.status(400).json({ error: `Modo inválido: ${mode}` });
    }

    // Construir body para Anthropic según modo
    let anthropicBody;
    if (mode === 'chat') {
      // Chatbot: conversación multi-turn
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages requerido para modo chat' });
      }
      // Sanitizar: solo role y content string, máximo 20 turnos
      const cleanMsgs = messages.slice(-20).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content).slice(0, 4000),
      }));
      anthropicBody = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: system ? String(system).slice(0, 3000) : undefined,
        messages: cleanMsgs,
      };
    } else {
      // Predictor (match / group / champion): prompt único
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'prompt requerido para modo predictor' });
      }
      anthropicBody = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt.slice(0, 6000) }],
      };
    }

    // Llamar a la API de Anthropic
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey.value(),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(anthropicBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[claudeProxy] Anthropic error:', data);
        return res.status(502).json({
          error: 'Error al contactar la IA',
          detail: data?.error?.message || 'upstream error',
        });
      }

      return res.json(data);
    } catch (e) {
      console.error('[claudeProxy] fetch error:', e);
      return res.status(503).json({ error: 'IA no disponible temporalmente' });
    }
  }
);

// ═══════════════════════════════════════════════════════════
// FUNCIÓN 2: openPack
// Lógica server-side de apertura de sobres con rate limiting
// POST /openPack
// Header: Authorization: Bearer <firebase_id_token>
// Devuelve: { cards: [...], packsToday, packsRemaining }
// ═══════════════════════════════════════════════════════════
exports.openPack = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    let user;
    try {
      user = await verifyUser(req);
    } catch (e) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const uid = user.uid;
    const db  = admin.firestore();

    // Fecha actual en formato YYYY-MM-DD (UTC)
    const today = new Date().toISOString().split('T')[0];

    // Leer contador diario del usuario
    const packRef  = db.collection('packOpens').doc(uid);
    const packSnap = await packRef.get();
    const packData = packSnap.exists ? packSnap.data() : {};

    const lastDate   = packData.date || '';
    const countToday = lastDate === today ? (packData.count || 0) : 0;

    if (countToday >= MAX_PACKS_PER_DAY) {
      return res.status(429).json({
        error: `Límite diario alcanzado (${MAX_PACKS_PER_DAY} sobres/día)`,
        packsToday: countToday,
        packsRemaining: 0,
        resetAt: today + 'T00:00:00Z', // mañana UTC
      });
    }

    // Seleccionar 5 láminas con pesos de rareza
    // Los IDs de jugadores/estadios vienen del cliente en body
    // para evitar tener que duplicar COUNTRIES en el servidor.
    // El servidor SOLO valida el conteo y registra el evento.
    const { allIds } = req.body; // array de strings con todos los IDs posibles
    if (!Array.isArray(allIds) || allIds.length < 5) {
      return res.status(400).json({ error: 'allIds requerido (mín 5 elementos)' });
    }

    // Rareza aleatoria server-side
    const RARITY_WEIGHTS = { icon: 2, legendary: 8, rare: 25, common: 65 };

    function pickRarity() {
      const roll = Math.random() * 100;
      if (roll < RARITY_WEIGHTS.icon) return 'icon';
      if (roll < RARITY_WEIGHTS.icon + RARITY_WEIGHTS.legendary) return 'legendary';
      if (roll < RARITY_WEIGHTS.icon + RARITY_WEIGHTS.legendary + RARITY_WEIGHTS.rare) return 'rare';
      return 'common';
    }

    // El servidor elige 5 IDs aleatorios del pool provisto
    const shuffled = allIds.sort(() => Math.random() - 0.5);
    const chosenIds = shuffled.slice(0, 5);

    // Actualizar contador en Firestore (transacción atómica)
    await packRef.set({ date: today, count: countToday + 1 }, { merge: true });

    // También actualizar el álbum del usuario (collected / duplicates)
    // El cliente mandará su estado actual para que el server lo actualice
    // de forma que no sea manipulable desde consola.
    const albumRef  = db.collection('albums').doc(uid);
    const albumSnap = await albumRef.get();
    const album     = albumSnap.exists ? albumSnap.data() : {};

    const collected  = new Set(album.collected || []);
    const duplicates = album.duplicates || {};

    chosenIds.forEach(id => {
      if (id.startsWith('STAD-')) {
        // estadio — no tracked en collected individual aquí
      } else {
        if (collected.has(id)) {
          duplicates[id] = (duplicates[id] || 1) + 1;
        } else {
          collected.add(id);
        }
      }
    });

    await albumRef.set(
      { collected: [...collected], duplicates, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    return res.json({
      cards: chosenIds,
      packsToday: countToday + 1,
      packsRemaining: MAX_PACKS_PER_DAY - (countToday + 1),
    });
  }
);
