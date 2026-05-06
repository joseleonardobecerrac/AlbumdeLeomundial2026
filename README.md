# 🏆 Álbum Digital Mundial 2026 — FIFA

Álbum de láminas digital para el **FIFA World Cup™ 2026** (USA · Canadá · México).  
Construido en HTML/CSS/JS vanilla + Firebase para sincronización en la nube.

## ✨ Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| 📦 **Apertura de sobres** | Animación 3D, rareza ponderada, 5 láminas por sobre |
| 🗺️ **Mapa mundial** | SVG interactivo con los 48 países clasificados, filtros por grupo/confederación/colección |
| ⚖️ **Comparador** | Stats cara a cara de cualquier par de jugadores |
| ⚽ **Mi 11 Ideal** | Cancha táctica con 6 formaciones, solo jugadores de tu álbum |
| 🧠 **Trivia** | 50 preguntas · 4 modos · 5 categorías · racha y bonus de tiempo |
| 🤖 **Predictor IA** | Partido · Grupo · Campeón — powered by Claude API |
| 🎮 **¿Quién soy?** | Adivina el jugador y gana su lámina |
| 📊 **Posiciones** | Tabla editable PJ/PG/PE/PP/GF/GC/DIF/PTS por los 12 grupos |
| 🏆 **Llaves** | Bracket completo octavos → final, con propagación automática de ganadores |
| 🔄 **Intercambios** | Genera links para intercambiar duplicados entre usuarios |
| ⏱️ **Historial** | Timeline mundialista por selección + top 5 goleadores históricos |


## 🔐 Autorizar dominio en Firebase (obligatorio)

Para que Google Sign-In funcione en GitHub Pages:

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Haz clic en **Add domain**
3. Agrega: `tu-usuario.github.io`
4. Si usas dominio personalizado, agrégalo también
5. `localhost` ya está incluido por defecto (para desarrollo)

Sin este paso el login con Google mostrará error `auth/unauthorized-domain`.

## 🚀 Setup rápido

### 1. Clonar
```bash
git clone https://github.com/tu-usuario/album-mundial-2026
cd album-mundial-2026
```

### 2. Firebase
1. Crea un proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Activa **Authentication → Google**
3. Activa **Firestore Database**
4. Copia tu config en `js/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 3. Predictor IA (opcional)
El predictor usa la API de Claude (Anthropic). Las llamadas se hacen desde el frontend.  
Agrega tu API key en el código de `app.js` en la función `callClaude()`.

### 4. GitHub Pages
En tu repo: **Settings → Pages → Branch: main → / (root)**  
Tu álbum estará en `https://tu-usuario.github.io/album-mundial-2026`

## 📁 Estructura

```
album-mundial-2026/
├── index.html          ← Entrada principal
├── manifest.json       ← PWA config
├── css/
│   └── style.css       ← Todos los estilos (FIFA 26 design system)
└── js/
    ├── firebase.js     ← Config Firebase + Auth
    ├── data.js         ← 48 países + estadios (datos)
    ├── state.js        ← Estado global + sync Firestore
    ├── scorers.js      ← Goleadores históricos
    ├── gamedata.js     ← Formaciones + Trivia bank + Pred modes
    ├── app.js          ← Toda la lógica de render y juego
    └── worldmap.js     ← Mapa SVG interactivo
```

## 🎨 Design System

Paleta oficial FIFA 2026:
- Rojo `#E31E24` · Verde `#00A650` · Azul `#004F9F` · Oro `#EF9F27`

Tipografía: **Bebas Neue** (headings) · **Barlow Condensed** (UI) · **JetBrains Mono** (datos)

## 📊 Datos incluidos

- **48 selecciones** clasificadas al Mundial 2026 con datos reales (ranking FIFA, historial, grupo)
- **16 estadios** (USA 11 · México 3 · Canadá 2)
- **200+ jugadores** con rareza, posición y club
- **Top 5 goleadores** históricos de cada selección
- **50 preguntas** de trivia en 5 categorías

## 🔒 Reglas Firestore sugeridas

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /albums/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
    match /ranking/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.auth.uid == userId;
    }
    match /preferences/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

> **Importante:** Cada usuario solo puede leer/escribir **su propio álbum**. El ranking es de solo lectura para todos los usuarios autenticados. Cambiar de cuenta inicia un álbum limpio desde cero.

## 📝 Licencia

MIT — Proyecto personal educativo. FIFA™ y World Cup™ son marcas registradas de FIFA.
