# 🚀 DEPLOY — Álbum Mundial 2026 (Versión mejorada)

Guía para aplicar todas las mejoras de seguridad, refactorización y UX.

---

## 📁 Cambios en la estructura de archivos

```
album-mundial-2026/
├── index.html              ← MODIFICADO (nuevos script tags + CLOUD_FUNCTION_BASE)
├── generate-icons.py       ← MODIFICADO (Pillow + fallback LCD, "26" legible)
├── icon-96.png             ← REGENERADO con Pillow
├── icon-192.png            ← REGENERADO con Pillow
├── icon-512.png            ← REGENERADO con Pillow
├── manifest.json           ← sin cambios
├── offline.html            ← sin cambios
├── sw.js                   ← sin cambios
│
├── css/
│   └── style.css           ← sin cambios
│
├── js/
│   ├── firebase.js         ← sin cambios
│   ├── theme.js            ← sin cambios
│   ├── data.js             ← sin cambios
│   ├── state.js            ← MODIFICADO (rate limit sobres + getFirebaseIdToken)
│   ├── scorers.js          ← sin cambios
│   ├── gamedata.js         ← sin cambios
│   │
│   │   ── Módulos extraídos de app.js (refactor) ──
│   ├── comparator.js       ← NUEVO (era parte de app.js) + bug onclick corregido
│   ├── predictor.js        ← NUEVO (era parte de app.js) + usa proxy Cloud Function
│   ├── trivia.js           ← NUEVO (era parte de app.js)
│   ├── lineup.js           ← NUEVO (era parte de app.js)
│   ├── app_core.js         ← NUEVO (resto de app.js: exchange, stadiums, bracket, toast)
│   │                              NOTA: app.js original ya NO se usa
│   │
│   ├── worldmap.js         ← sin cambios
│   ├── ranking.js          ← sin cambios
│   ├── limited.js          ← sin cambios
│   ├── favorite.js         ← sin cambios
│   ├── animated-stickers.js← sin cambios
│   ├── chatbot.js          ← MODIFICADO (usa proxy Cloud Function)
│   ├── search.js           ← sin cambios
│   └── pwa.js              ← sin cambios
│
└── functions/              ← NUEVO — Firebase Cloud Functions
    ├── index.js            ← Proxy Anthropic + rate limit sobres server-side
    └── package.json
```

> ⚠️ **El archivo `app.js` original ya no se usa.** Fue reemplazado por los
> 5 módulos: `comparator.js`, `predictor.js`, `trivia.js`, `lineup.js`, `app_core.js`.
> Puedes borrarlo del repositorio o dejarlo como backup.

---

## 1️⃣ Proteger la API Key de Anthropic (Cloud Function)

La API key de Anthropic ya **nunca sale al navegador**. Vive en Firebase Secret Manager
y la Cloud Function actúa como proxy autenticado. Solo usuarios con sesión activa
en Firebase pueden usarla.

### Pasos de deploy

```bash
# 1. Instalar Firebase CLI si no la tienes
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Guardar la API key de Anthropic en Secret Manager
firebase functions:secrets:set ANTHROPIC_API_KEY
# Te pedirá el valor — pega tu sk-ant-...

# 4. Entrar a la carpeta de functions e instalar dependencias
cd functions
npm install

# 5. Deploy de las funciones
firebase deploy --only functions
```

Después del deploy verás una URL como:
```
https://us-central1-algum-mundial-2026.cloudfunctions.net/claudeProxy
https://us-central1-algum-mundial-2026.cloudfunctions.net/openPack
```

### Configurar la URL en el frontend

Abre `index.html` y actualiza esta línea con tu URL real:

```html
<script>
window.CLOUD_FUNCTION_BASE = 'https://us-central1-algum-mundial-2026.cloudfunctions.net';
</script>
```

### Modo desarrollo local (sin deploy)

Si quieres probar localmente sin la Cloud Function:

```javascript
// En index.html — modo dev (NUNCA en producción)
window.CLOUD_FUNCTION_BASE = ''; // vacío = modo local
window.ANTHROPIC_API_KEY = 'sk-ant-TU-KEY-AQUI'; // solo local
```

O usa los emuladores de Firebase:
```bash
firebase emulators:start --only functions
# La URL local será: http://localhost:5001/algum-mundial-2026/us-central1
window.CLOUD_FUNCTION_BASE = 'http://localhost:5001/algum-mundial-2026/us-central1';
```

---

## 2️⃣ Refactorización de app.js

`app.js` se dividió en 5 módulos especializados. El orden de carga en `index.html`
ya está actualizado correctamente:

```html
<script src="js/comparator.js"></script>   <!-- Comparador de jugadores -->
<script src="js/predictor.js"></script>    <!-- Predictor IA -->
<script src="js/trivia.js"></script>       <!-- Trivia mundialista -->
<script src="js/lineup.js"></script>       <!-- Mi 11 Ideal -->
<script src="js/app_core.js"></script>     <!-- Resto: exchange, stadiums, bracket, toast, init -->
```

Todos los módulos se cargan en el scope global igual que antes — sin cambios
en la forma de llamar a las funciones desde HTML.

---

## 3️⃣ Bug doble onclick en el Comparador

**Archivo:** `js/comparator.js` — ya corregido.

```javascript
// ANTES (bug): dos atributos onclick en el mismo botón
<button onclick="" disabled onclick="pickCmpPlayer('...')">

// DESPUÉS (fix): un solo manejador limpio
<button disabled aria-disabled="true">          // si ya está elegido
<button onclick="pickCmpPlayer('...')">         // si está disponible
```

---

## 4️⃣ Rate limiting de sobres — arquitectura por usuario

El progreso de cada usuario se identifica por su `uid` de Firebase, que es
único e inmutable por cuenta. El rate limit opera en tres capas:

```
┌─────────────────────────────────────────────────────────┐
│  CAPA 1 — UI (client-side, instantánea)                 │
│  state.packOpens['YYYY-MM-DD'] — feedback visual        │
│  Muestra cuántos sobres quedan, bloquea el botón        │
│                                                         │
│  CAPA 2 — Firestore (por uid, persistente)              │
│  /packOpens/{uid} → { date, count }                     │
│  La Cloud Function es la única que puede escribir aquí  │
│                                                         │
│  CAPA 3 — Cloud Function (server-side, inviolable)      │
│  Verifica el ID token de Firebase → obtiene uid real    │
│  Si count >= MAX_PACKS_PER_DAY → devuelve HTTP 429      │
│  Si ok → elige cartas, actualiza /albums/{uid}          │
└─────────────────────────────────────────────────────────┘
```

**Cada usuario tiene su propio documento en `/packOpens/{uid}`.**
Cambiar de cuenta reinicia el contador (cada uid es independiente).
El estado local (`state.packOpens`) también se resetea en `resetStateCompletely()`
al hacer logout o cambiar de cuenta.

### Límite diario

Configurado en `functions/index.js`:
```javascript
const MAX_PACKS_PER_DAY = 5; // ← cambia este valor
```

Y en `js/state.js` (para la UI):
```javascript
const MAX_PACKS_PER_DAY = 5; // ← mismo valor
```

### Reglas de Firestore — agregar colección packOpens

Añade esto a tus reglas de Firestore:

```
match /packOpens/{userId} {
  // Solo la Cloud Function puede escribir (service account)
  // Los usuarios solo pueden leer su propio contador
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if false; // Solo Cloud Function via Admin SDK
}
```

---

## 5️⃣ Iconos regenerados con Pillow

El script `generate-icons.py` ahora usa Pillow para un "26" nítido y legible.
Tiene fallback automático si Pillow no está instalado (usa segmentos LCD).

```bash
# Instalar Pillow (una sola vez)
pip install Pillow

# Regenerar iconos
python3 generate-icons.py
```

Los tres iconos (`icon-96.png`, `icon-192.png`, `icon-512.png`) ya están
regenerados y listos en esta carpeta.

---

## ✅ Checklist de deploy completo

```
[ ] Hacer git pull / subir archivos al repositorio
[ ] firebase functions:secrets:set ANTHROPIC_API_KEY
[ ] cd functions && npm install
[ ] firebase deploy --only functions
[ ] Copiar URL de las functions → actualizar CLOUD_FUNCTION_BASE en index.html
[ ] Actualizar reglas de Firestore (agregar /packOpens)
[ ] Verificar dominio en Firebase Auth → Authorized domains
[ ] Probar apertura de sobre: abrir 5, verificar bloqueo del 6°
[ ] Probar chatbot y predictor IA desde el navegador
[ ] Verificar en DevTools → Network que NO aparece ninguna x-api-key en requests
```

---

## 🔒 Verificación de seguridad post-deploy

Abre Chrome DevTools → Network → filtra por `anthropic`:

- **Antes:** veías llamadas directas a `api.anthropic.com` con la key en headers
- **Después:** no debe aparecer ninguna llamada a `api.anthropic.com` desde el navegador.
  Solo verás llamadas a `cloudfunctions.net` sin ninguna key expuesta.
