// ═══ FORMATIONS + TRIVIA BANK + PRED MODES ═══
const FORMATIONS = {
  '4-3-3': {
    POR:[{x:50,y:92}],
    DEF:[{x:15,y:74},{x:37,y:74},{x:63,y:74},{x:85,y:74}],
    MED:[{x:22,y:52},{x:50,y:52},{x:78,y:52}],
    DEL:[{x:18,y:22},{x:50,y:18},{x:82,y:22}]
  },
  '4-4-2': {
    POR:[{x:50,y:92}],
    DEF:[{x:15,y:74},{x:37,y:74},{x:63,y:74},{x:85,y:74}],
    MED:[{x:15,y:52},{x:38,y:52},{x:62,y:52},{x:85,y:52}],
    DEL:[{x:32,y:20},{x:68,y:20}]
  },
  '4-2-3-1': {
    POR:[{x:50,y:92}],
    DEF:[{x:15,y:76},{x:37,y:76},{x:63,y:76},{x:85,y:76}],
    MED:[{x:32,y:60},{x:68,y:60},{x:18,y:38},{x:50,y:35},{x:82,y:38}],
    DEL:[{x:50,y:16}]
  },
  '3-5-2': {
    POR:[{x:50,y:92}],
    DEF:[{x:25,y:76},{x:50,y:76},{x:75,y:76}],
    MED:[{x:10,y:52},{x:30,y:52},{x:50,y:52},{x:70,y:52},{x:90,y:52}],
    DEL:[{x:32,y:20},{x:68,y:20}]
  },
  '5-3-2': {
    POR:[{x:50,y:92}],
    DEF:[{x:10,y:76},{x:28,y:76},{x:50,y:76},{x:72,y:76},{x:90,y:76}],
    MED:[{x:22,y:52},{x:50,y:52},{x:78,y:52}],
    DEL:[{x:32,y:20},{x:68,y:20}]
  },
  '4-3-2-1': {
    POR:[{x:50,y:92}],
    DEF:[{x:15,y:76},{x:37,y:76},{x:63,y:76},{x:85,y:76}],
    MED:[{x:22,y:60},{x:50,y:60},{x:78,y:60},{x:35,y:36},{x:65,y:36}],
    DEL:[{x:50,y:16}]
  },
};

// Slot state: array of 11 objects {pos, slotIdx, player|null}
let lineupState = {
  formation: '4-3-3',
  slots: [],        // {posKey, slotIdx, player:null|{...}}
  selectedSlot: null,  // {posKey, slotIdx} waiting for a player pick
  name: 'Mi Equipo',
  savedLineups: [],
  filterPos: 'ALL',
  filterOwned: true,
  search: '',
};

function buildSlots(formation) {
  const f = FORMATIONS[formation];
  const slots = [];
  ['POR','DEF','MED','DEL'].forEach(pos => {
    if(!f[pos]) return;
    f[pos].forEach((coord, idx) => {
      slots.push({posKey: pos, slotIdx: idx, x: coord.x, y: coord.y, player: null});
    });
  });
  return slots;
}

function computeRating(slots) {
  const rarityPts = {icon:95, legendary:88, rare:80, common:72};
  const filled = slots.filter(s => s.player);
  if(!filled.length) return 0;
  const avg = filled.reduce((a,s) => a + (rarityPts[s.player.rarity]||72), 0) / filled.length;
  const completeness = filled.length / 11;
  return Math.round(avg * (0.4 + 0.6 * completeness));
}

function ratingStars(r) {
  if(r >= 90) return '★★★★★';
  if(r >= 82) return '★★★★☆';
  if(r >= 74) return '★★★☆☆';
  if(r >= 60) return '★★☆☆☆';
  return '★☆☆☆☆';
}

function getPlayersList() {
  return COUNTRIES.flatMap(c =>
    c.players.map(p => ({...p, countryName: c.name, flag: c.flag}))
  );
}


// ═══════════════════════════════════════════════════════════
// TRIVIA MUNDIALISTA
// ═══════════════════════════════════════════════════════════
const TRIVIA_BANK = [
  // ── HISTORIA ──────────────────────────────────────────
  {id:'H01',cat:'historia',diff:'easy',pts:10,
   q:'¿En qué año se celebró el primer Mundial de Fútbol?',
   opts:['1926','1930','1934','1938'],ans:1,
   explain:'Uruguay 1930 fue el primer Mundial. El anfitrión ganó el torneo derrotando a Argentina 4-2 en la final.'},
  {id:'H02',cat:'historia',diff:'easy',pts:10,
   q:'¿Qué país es el único que ha participado en TODOS los Mundiales?',
   opts:['Italia','Argentina','Brasil','Alemania'],ans:2,
   explain:'Brasil es el único país que ha clasificado a las 22 ediciones del Mundial hasta 2022.'},
  {id:'H03',cat:'historia',diff:'medium',pts:20,
   q:'¿En qué año y país ocurrió el famoso "Maracanazo"?',
   opts:['Argentina 1978','Brasil 1950','Chile 1962','México 1970'],ans:1,
   explain:'El Maracanazo fue en Brasil 1950. Uruguay venció 2-1 a los locales ante 200.000 espectadores en el Maracaná.'},
  {id:'H04',cat:'historia',diff:'easy',pts:10,
   q:'¿Cuántas veces ha ganado Brasil el Mundial?',
   opts:['3','4','5','6'],ans:2,
   explain:'Brasil ha ganado 5 Mundiales: 1958, 1962, 1970, 1994 y 2002. Es el país más ganador.'},
  {id:'H05',cat:'historia',diff:'medium',pts:20,
   q:'¿Qué selección ganó el Mundial 2022 en Qatar?',
   opts:['Francia','Brasil','Argentina','Portugal'],ans:2,
   explain:'Argentina venció a Francia en penales en una de las finales más épicas de la historia (3-3 en 120 min).'},
  {id:'H06',cat:'historia',diff:'hard',pts:30,
   q:'¿En qué edición del Mundial se usó por primera vez el VAR (arbitraje de video)?',
   opts:['Brasil 2014','Rusia 2018','Qatar 2022','Sudáfrica 2010'],ans:1,
   explain:'Rusia 2018 fue el primer Mundial con VAR. Se implementó tras años de pruebas en ligas nacionales.'},
  {id:'H07',cat:'historia',diff:'medium',pts:20,
   q:'¿Qué país organizó el Mundial 1994?',
   opts:['México','Estados Unidos','Brasil','Canadá'],ans:1,
   explain:'Estados Unidos organizó el Mundial 1994. Brasil ganó el torneo derrotando a Italia en penales.'},
  {id:'H08',cat:'historia',diff:'hard',pts:30,
   q:'¿Cuál fue el primer país africano en llegar a semifinales de un Mundial?',
   opts:['Senegal','Nigeria','Camerún','Marruecos'],ans:3,
   explain:'Marruecos llegó a semifinales en Qatar 2022, siendo el primer país africano en lograrlo. Cayó ante Francia 2-0.'},
  {id:'H09',cat:'historia',diff:'easy',pts:10,
   q:'¿Cada cuántos años se celebra el Mundial de Fútbol?',
   opts:['2 años','3 años','4 años','5 años'],ans:2,
   explain:'El Mundial se celebra cada 4 años desde 1930, con excepción de 1942 y 1946 por la Segunda Guerra Mundial.'},
  {id:'H10',cat:'historia',diff:'medium',pts:20,
   q:'¿Qué selección ganó los Mundiales de 1934 y 1938?',
   opts:['Alemania','Uruguay','Italia','Argentina'],ans:2,
   explain:'Italia ganó consecutivamente en 1934 (Italia) y 1938 (Francia), siendo el primero en conseguir títulos seguidos.'},
  {id:'H11',cat:'historia',diff:'hard',pts:30,
   q:'¿En qué partido del Mundial 2006 marcó Zinedine Zidane con el cabezazo a Materazzi?',
   opts:['Semifinal','Final','Cuartos','3er puesto'],ans:1,
   explain:'Fue en la Final del Mundial 2006 entre Francia e Italia. Zidane fue expulsado y Francia perdió en penales.'},
  {id:'H12',cat:'historia',diff:'medium',pts:20,
   q:'¿Qué continente organiza el Mundial 2026?',
   opts:['Europa','Sudamérica','América del Norte','Asia'],ans:2,
   explain:'USA, Canadá y México co-organizan el Mundial 2026. Es la primera vez que 3 países comparten la sede.'},
  {id:'H13',cat:'historia',diff:'hard',pts:30,
   q:'¿Cuántos países participarán en el Mundial 2026?',
   opts:['32','40','48','56'],ans:2,
   explain:'El Mundial 2026 amplió el formato a 48 selecciones, con 12 grupos de 4 equipos cada uno.'},
  {id:'H14',cat:'historia',diff:'easy',pts:10,
   q:'¿Qué país ganó el primer Mundial de la era moderna (post-WWII)?',
   opts:['Brasil','Uruguay','Inglaterra','Italia'],ans:1,
   explain:'Uruguay ganó el Mundial de 1950 en Brasil con el famoso Maracanazo. También habían ganado el de 1930.'},
  {id:'H15',cat:'historia',diff:'medium',pts:20,
   q:'¿Cuántos goles marcó Ronaldo Nazário en el Mundial 2002?',
   opts:['6','7','8','9'],ans:2,
   explain:'Ronaldo marcó 8 goles en el Mundial 2002, incluyendo 2 en la final ante Alemania. Ganó el Bota de Oro.'},

  // ── JUGADORES ──────────────────────────────────────────
  {id:'J01',cat:'jugadores',diff:'easy',pts:10,
   q:'¿Quién es el máximo goleador histórico de los Mundiales?',
   opts:['Pelé','Ronaldo Nazário','Miroslav Klose','Gerd Müller'],ans:2,
   explain:'Miroslav Klose (Alemania) marcó 16 goles en 4 Mundiales: 2002, 2006, 2010 y 2014. Es el récord histórico.'},
  {id:'J02',cat:'jugadores',diff:'easy',pts:10,
   q:'¿Con qué selección compite Lionel Messi en el Mundial?',
   opts:['España','Argentina','Brasil','Uruguay'],ans:1,
   explain:'Messi representa a Argentina desde su debut en 2006. Ganó su primer Mundial en Qatar 2022.'},
  {id:'J03',cat:'jugadores',diff:'medium',pts:20,
   q:'¿En qué Mundial marcó Maradona el "Gol del Siglo"?',
   opts:['España 1982','México 1986','Italia 1990','Argentina 1978'],ans:1,
   explain:'En México 1986, vs Inglaterra en cuartos. Maradona regateó a 6 rivales en 11 segundos. El "Gol del Siglo".'},
  {id:'J04',cat:'jugadores',diff:'medium',pts:20,
   q:'¿Qué jugador marcó el gol que le dio el título a España en 2010?',
   opts:['Xavi','Iniesta','Torres','Villa'],ans:1,
   explain:'Andrés Iniesta marcó en el minuto 116 de prórroga ante Países Bajos. El gol más importante en la historia de España.'},
  {id:'J05',cat:'jugadores',diff:'hard',pts:30,
   q:'¿Quién fue elegido Balón de Oro en el Mundial 2022?',
   opts:['Mbappé','Modric','Messi','Benzema'],ans:2,
   explain:'Lionel Messi ganó el Balón de Oro del Mundial 2022, su segunda vez tras el de 2014. Fue elegido el mejor jugador del torneo.'},
  {id:'J06',cat:'jugadores',diff:'easy',pts:10,
   q:'¿Con qué club juega Erling Haaland en la Premier League?',
   opts:['Arsenal','Liverpool','Manchester City','Chelsea'],ans:2,
   explain:'Haaland llegó al Manchester City en 2022 procedente del Borussia Dortmund. Rompe records goleadores constantemente.'},
  {id:'J07',cat:'jugadores',diff:'medium',pts:20,
   q:'¿Cuántos goles marcó Kylian Mbappé en el Mundial 2022?',
   opts:['6','7','8','9'],ans:2,
   explain:'Mbappé marcó 8 goles incluyendo un hat-trick en la final vs Argentina. Ganó el Bota de Oro del torneo.'},
  {id:'J08',cat:'jugadores',diff:'hard',pts:30,
   q:'¿En qué año debutó Pelé en un Mundial?',
   opts:['1954','1958','1962','1966'],ans:1,
   explain:'Pelé debutó en Suecia 1958 con apenas 17 años. Marcó 6 goles y Brasil ganó el título. Sigue siendo el campeón más joven.'},
  {id:'J09',cat:'jugadores',diff:'medium',pts:20,
   q:'¿Qué portero paró los tres penales en semifinales de Qatar 2022 para Argentina?',
   opts:['Alisson','Oblak','E. Martínez','Courtois'],ans:2,
   explain:'Emiliano "Dibu" Martínez fue héroe en penales ante Países Bajos y ganó el Guante de Oro del Mundial 2022.'},
  {id:'J10',cat:'jugadores',diff:'hard',pts:30,
   q:'¿Qué jugador ha sido capitán de Croacia llevándolos a dos finales mundialistas?',
   opts:['Ivan Perišić','Dejan Lovren','Luka Modrić','Mario Mandžukić'],ans:2,
   explain:'Luka Modrić capitaneó a Croacia en 2018 (final) y 2022 (3er puesto). Ganó el Balón de Oro del Mundial 2018.'},
  {id:'J11',cat:'jugadores',diff:'easy',pts:10,
   q:'¿Con qué club inglés juega Luis Díaz de Colombia?',
   opts:['Manchester City','Arsenal','Liverpool','Tottenham'],ans:2,
   explain:'Luis Díaz llegó al Liverpool en enero 2022 desde el Porto. Es uno de los extremos más desequilibrantes del mundo.'},
  {id:'J12',cat:'jugadores',diff:'medium',pts:20,
   q:'¿Quién marcó el gol de la "Mano de Dios" en México 1986?',
   opts:['Platini','Zico','Lineker','Maradona'],ans:3,
   explain:'Maradona marcó dos goles históricos a Inglaterra: la "Mano de Dios" y el "Gol del Siglo" en cuartos de final.'},
  {id:'J13',cat:'jugadores',diff:'hard',pts:30,
   q:'¿Qué jugador de Arabia Saudita marcó el gol que venció a Argentina en Qatar 2022?',
   opts:['Firas Al-Buraikan','Salem Al-Dawsari','Mohammed Al-Owais','Abdulelah Al-Amri'],ans:1,
   explain:'Salem Al-Dawsari marcó un golazo en el minuto 53 que le dio la victoria a Arabia Saudita 2-1 ante Argentina.'},
  {id:'J14',cat:'jugadores',diff:'easy',pts:10,
   q:'¿Con qué selección juega Mohamed Salah?',
   opts:['Marruecos','Argelia','Senegal','Egipto'],ans:3,
   explain:'Mohamed Salah es el capitán y estrella de la selección de Egipto. Juega en el Liverpool de la Premier League.'},
  {id:'J15',cat:'jugadores',diff:'medium',pts:20,
   q:'¿Qué jugador es conocido como "La Pulga"?',
   opts:['Neymar','Mbappé','Messi','Ronaldo'],ans:2,
   explain:'Lionel Messi recibió el apodo "La Pulga Atómica" por su baja estatura y velocidad explosiva desde joven.'},

  // ── ESTADIOS ──────────────────────────────────────────
  {id:'E01',cat:'estadios',diff:'easy',pts:10,
   q:'¿Cuál es el estadio donde se jugará la Final del Mundial 2026?',
   opts:['Estadio Azteca','Hard Rock Stadium','MetLife Stadium','SoFi Stadium'],ans:2,
   explain:'El MetLife Stadium de Nueva York/Nueva Jersey albergará la Final del Mundial 2026 con capacidad para 82.500 espectadores.'},
  {id:'E02',cat:'estadios',diff:'easy',pts:10,
   q:'¿En qué ciudad está el Estadio Azteca?',
   opts:['Guadalajara','Monterrey','Ciudad de México','Tijuana'],ans:2,
   explain:'El Estadio Azteca está en Ciudad de México. Con 87.523 aficionados es el más grande de México y sede del partido inaugural 2026.'},
  {id:'E03',cat:'estadios',diff:'medium',pts:20,
   q:'¿Cuántos estadios albergarán el Mundial 2026?',
   opts:['12','14','16','18'],ans:2,
   explain:'El Mundial 2026 se disputará en 16 estadios: 11 en USA, 3 en México y 2 en Canadá.'},
  {id:'E04',cat:'estadios',diff:'medium',pts:20,
   q:'¿Cuál es el estadio canadiense donde se jugará el Mundial 2026 en Vancouver?',
   opts:['Rogers Centre','BMO Field','BC Place','Stade Olympique'],ans:2,
   explain:'BC Place en Vancouver es uno de los dos estadios canadienses del Mundial 2026. Tiene techo retráctil con 54.500 de capacidad.'},
  {id:'E05',cat:'estadios',diff:'hard',pts:30,
   q:'¿Qué estadio mundialista de 2026 tiene la mayor capacidad?',
   opts:['SoFi Stadium','AT&T Stadium','MetLife Stadium','Estadio Azteca'],ans:3,
   explain:'El Estadio Azteca tiene capacidad para 87.523 espectadores, siendo el más grande de los 16 recintos del Mundial 2026.'},
  {id:'E06',cat:'estadios',diff:'medium',pts:20,
   q:'¿En qué estadio se jugó la Final del Mundial 2022 en Qatar?',
   opts:['Al Bayt','Lusail','Al Janoub','Ahmad Bin Ali'],ans:1,
   explain:'La Final Argentina vs Francia (3-3, Argentina campeón en penales) se jugó en el Estadio Lusail con 89.000 espectadores.'},
  {id:'E07',cat:'estadios',diff:'easy',pts:10,
   q:'¿En qué ciudad de USA está el SoFi Stadium?',
   opts:['Nueva York','Miami','Los Ángeles','Dallas'],ans:2,
   explain:'El SoFi Stadium está en Inglewood, Los Ángeles. Hogar de Los Angeles Rams y Chargers de la NFL.'},

  // ── RÉCORDS ──────────────────────────────────────────
  {id:'R01',cat:'records',diff:'medium',pts:20,
   q:'¿Cuál es el resultado más abultado en la historia de los Mundiales?',
   opts:['9-0','10-1','12-0','7-0'],ans:1,
   explain:'Hungría derrotó 10-1 a El Salvador en el Mundial de España 1982. Sandor Kocsis marcó hat-trick.'},
  {id:'R02',cat:'records',diff:'hard',pts:30,
   q:'¿Cuál fue el marcador de la histórica derrota de Brasil ante Alemania en 2014?',
   opts:['5-1','6-0','7-1','8-0'],ans:2,
   explain:'El "Mineirazo": Alemania aplastó a Brasil 7-1 en la semifinal de Brasil 2014. Klose marcó 2 y llegó a 16 goles mundiales.'},
  {id:'R03',cat:'records',diff:'medium',pts:20,
   q:'¿Cuántos Mundiales ha ganado Alemania?',
   opts:['3','4','5','2'],ans:1,
   explain:'Alemania ha ganado 4 Mundiales: 1954, 1974, 1990 y 2014. Además jugó 4 finales que perdió.'},
  {id:'R04',cat:'records',diff:'hard',pts:30,
   q:'¿Qué jugador marcó más rápido en un partido mundialista (11 segundos)?',
   opts:['Hakan Şükür','Roger Milla','Miroslav Klose','Just Fontaine'],ans:0,
   explain:'Hakan Şükür (Turquía) marcó a los 11 segundos ante Corea del Sur en el partido por el 3er puesto del Mundial 2002.'},
  {id:'R05',cat:'records',diff:'medium',pts:20,
   q:'¿Cuántos goles marcó Just Fontaine en el Mundial 1958, récord en una sola edición?',
   opts:['11','13','15','17'],ans:1,
   explain:'Just Fontaine (Francia) marcó 13 goles en el Mundial 1958, un récord en una sola edición que aún se mantiene.'},
  {id:'R06',cat:'records',diff:'easy',pts:10,
   q:'¿Qué equipo ganó el Mundial 2018?',
   opts:['Croacia','Bélgica','Francia','Inglaterra'],ans:2,
   explain:'Francia venció a Croacia 4-2 en la final de Moscú. Mbappé se convirtió en el segundo teenager en marcar en una final tras Pelé.'},
  {id:'R07',cat:'records',diff:'hard',pts:30,
   q:'¿Cuántos penales pararon los porteros en la final de Qatar 2022?',
   opts:['1','2','3','4'],ans:1,
   explain:'Emiliano Martínez paró a Coman y Tchouaméni falló, mientras Hugo Lloris paró a González. Argentina ganó 4-2 en penales.'},
  {id:'R08',cat:'records',diff:'medium',pts:20,
   q:'¿Qué país ganó el primer Balón de Oro en un Mundial?',
   opts:['Brasil','Italia','Alemania','Argentina'],ans:1,
   explain:'El Balón de Oro mundialista se entrega desde 1966. En ese año lo ganó Bobby Charlton (Inglaterra). Italia nunca lo ha ganado.'},

  // ── SELECCIONES ──────────────────────────────────────
  {id:'S01',cat:'selecciones',diff:'easy',pts:10,
   q:'¿Cuál es el apodo de la selección de Brasil?',
   opts:['La Albiceleste','La Canarinha','Los Blues','La Roja'],ans:1,
   explain:'Brasil es "A Canarinha" (La Canarinha) por el color amarillo de su camiseta, similar al del canario.'},
  {id:'S02',cat:'selecciones',diff:'easy',pts:10,
   q:'¿Cuál es el apodo de la selección de Argentina?',
   opts:['Los Gauchos','La Albiceleste','Los Pumas','La Vinotinto'],ans:1,
   explain:'Argentina es "La Albiceleste" por los colores blanco y celeste de su camiseta, tomados de la bandera nacional.'},
  {id:'S03',cat:'selecciones',diff:'medium',pts:20,
   q:'¿De qué país es la selección conocida como "Los Leones de Teranga"?',
   opts:['Ghana','Costa de Marfil','Senegal','Nigeria'],ans:2,
   explain:'Senegal es "Los Leones de Teranga". Teranga significa hospitalidad en wolof. Ganaron la Copa África 2021 y 2022.'},
  {id:'S04',cat:'selecciones',diff:'medium',pts:20,
   q:'¿Qué selección es conocida como "La Naranja Mecánica"?',
   opts:['Bélgica','Países Bajos','Alemania','Suecia'],ans:1,
   explain:'Países Bajos es "La Naranja Mecánica" por su estilo de juego total-football de los 70s y el color naranja de su camiseta.'},
  {id:'S05',cat:'selecciones',diff:'easy',pts:10,
   q:'¿Cuántas Copas del Mundo tiene Argentina?',
   opts:['2','3','4','1'],ans:1,
   explain:'Argentina tiene 3 Mundiales: 1978 (local), 1986 (Maradona) y 2022 (Messi). En Qatar completó la trinidad de generaciones.'},
  {id:'S06',cat:'selecciones',diff:'hard',pts:30,
   q:'¿Cuál de estas selecciones debuta en el Mundial 2026?',
   opts:['Paraguay','Uzbekistán','Ecuador','Escocia'],ans:1,
   explain:'Uzbekistán debuta en el Mundial 2026, siendo uno de los 5 debutantes junto a Jordania, Cabo Verde, Curazao e Irak.'},
  {id:'S07',cat:'selecciones',diff:'medium',pts:20,
   q:'¿En qué grupo del Mundial 2026 está Colombia?',
   opts:['Grupo B','Grupo C','Grupo D','Grupo E'],ans:2,
   explain:'Colombia quedó en el Grupo D junto a Paraguay, Argelia y Egipto. James Rodríguez liderará el ataque cafetero.'},
  {id:'S08',cat:'selecciones',diff:'easy',pts:10,
   q:'¿Cuál es la selección con más participaciones mundialistas?',
   opts:['Alemania','Italia','Argentina','Brasil'],ans:3,
   explain:'Brasil ha participado en los 23 Mundiales disputados (1930-2022) y es el único país con participación perfecta.'},
  {id:'S09',cat:'selecciones',diff:'medium',pts:20,
   q:'¿Qué selección africana llegó más lejos en la historia de los Mundiales?',
   opts:['Nigeria','Senegal','Camerún','Marruecos'],ans:3,
   explain:'Marruecos llegó a semifinales en Qatar 2022, el mejor resultado de África. Eliminaron a España y Portugal en el camino.'},
  {id:'S10',cat:'selecciones',diff:'hard',pts:30,
   q:'¿Qué selección ganó la Copa América 2024?',
   opts:['Argentina','Brasil','Colombia','Uruguay'],ans:2,
   explain:'Colombia ganó la Copa América 2024 invicta, con James Rodríguez como figura. Venció a Argentina en la final.'},
  {id:'S11',cat:'selecciones',diff:'medium',pts:20,
   q:'¿Cuál es el apodo de la selección de México?',
   opts:['Los Aztecas','El Tri','Los Verdes','Los Guerreros'],ans:1,
   explain:'México es "El Tri" por los tres colores de su bandera: verde, blanco y rojo. También se les llama "El Tricolor".'},
  {id:'S12',cat:'selecciones',diff:'easy',pts:10,
   q:'¿Qué selección es la actual campeona del mundo (2022)?',
   opts:['Francia','Brasil','Argentina','España'],ans:2,
   explain:'Argentina es la actual campeona del mundo tras ganar en Qatar 2022. Defenderá el título en el Mundial 2026.'},

  // ── NUEVAS PREGUNTAS — HISTORIA ──────────────────────────
  {id:'H21',cat:'historia',diff:'medium',pts:15,
   q:'¿Qué selección ganó el Mundial de 2022 en Qatar?',
   opts:['Francia','Brasil','Argentina','Croacia'],ans:2,
   explain:'Argentina venció a Francia en la final por penales (3-3 en 90 min), con Messi como figura.'},
  {id:'H22',cat:'historia',diff:'easy',pts:10,
   q:'¿Cuántas veces ha ganado Brasil el Mundial?',
   opts:['3','4','5','6'],ans:2,
   explain:'Brasil es el país más exitoso: 1958, 1962, 1970, 1994 y 2002.'},
  {id:'H23',cat:'historia',diff:'hard',pts:20,
   q:'¿Qué país fue sede del primer Mundial disputado en dos continentes?',
   opts:['Japón/Corea','EUA/Canadá/México','España/Portugal','Alemania/Austria'],ans:0,
   explain:'Japón y Corea 2002 fue el primer Mundial coorganizado entre dos países y dos continentes.'},
  {id:'H24',cat:'historia',diff:'medium',pts:15,
   q:'¿En qué año Italia ganó su cuarto título mundial?',
   opts:['1990','1994','1998','2006'],ans:3,
   explain:'Italia ganó en Alemania 2006 venciendo a Francia en la final por penales. Zidane fue expulsado.'},
  {id:'H25',cat:'historia',diff:'easy',pts:10,
   q:'¿Qué selección ganó el primer Mundial disputado en Europa?',
   opts:['Italia','Alemania','Francia','Austria'],ans:0,
   explain:'Italia ganó el Mundial de 1934 en casa, su primera Copa del Mundo.'},
  {id:'H26',cat:'historia',diff:'hard',pts:20,
   q:'¿Qué equipo marcó el gol más rápido en la historia de los Mundiales (11 segundos)?',
   opts:['Turquía vs Corea 2002','Hakan Şükür','República Checa vs El Salvador','Portugal vs Corea'],ans:1,
   explain:'Hakan Şükür (Turquía) marcó a los 11 segundos vs Corea del Sur en el partido por el 3er puesto de 2002.'},

  // ── NUEVAS PREGUNTAS — JUGADORES ─────────────────────────
  {id:'J21',cat:'jugadores',diff:'easy',pts:10,
   q:'¿Con cuántos goles Miroslav Klose es el máximo goleador de Mundiales?',
   opts:['14','15','16','17'],ans:2,
   explain:'Klose anotó 16 goles en 4 Mundiales (2002-2014), superando a Ronaldo Nazário.'},
  {id:'J22',cat:'jugadores',diff:'medium',pts:15,
   q:'¿Cuántos Mundiales disputó Lionel Messi antes de ganar el de 2022?',
   opts:['3','4','5','6'],ans:1,
   explain:'Messi disputó 2006, 2010, 2014 y 2018 antes de conquistar Qatar 2022 con Argentina.'},
  {id:'J23',cat:'jugadores',diff:'hard',pts:20,
   q:'¿Quién es el jugador más joven en marcar en un Mundial?',
   opts:['Pelé','Cesc Fàbregas','Manuel Rosas','Salif Keïta'],ans:0,
   explain:'Pelé marcó con 17 años y 239 días en el Mundial de Suecia 1958, récord aún vigente.'},
  {id:'J24',cat:'jugadores',diff:'medium',pts:15,
   q:'¿Qué jugador ganó el Balón de Oro del Mundial 2018 en Rusia?',
   opts:['Modric','Mbappé','Griezmann','Hazard'],ans:0,
   explain:'Luka Modric ganó el premio al mejor jugador en Rusia 2018, liderando a Croacia a la final.'},
  {id:'J25',cat:'jugadores',diff:'easy',pts:10,
   q:'¿Con qué selección juega Kylian Mbappé en los Mundiales?',
   opts:['Bélgica','Suiza','Francia','Marruecos'],ans:2,
   explain:'Mbappé es francés y fue campeón mundial en 2018 con Les Bleus a los 19 años.'},
  {id:'J26',cat:'jugadores',diff:'hard',pts:20,
   q:'¿Quién es el único jugador en ganar 3 Mundiales?',
   opts:['Pelé','Ronaldo','Zico','Romário'],ans:0,
   explain:'Pelé ganó los Mundiales de 1958, 1962 y 1970, único jugador en lograr tres títulos mundiales.'},

  // ── NUEVAS PREGUNTAS — ESTADIOS ──────────────────────────
  {id:'E21',cat:'estadios',diff:'medium',pts:15,
   q:'¿Cuántos estadios albergarán el Mundial 2026?',
   opts:['12','14','16','18'],ans:2,
   explain:'El Mundial 2026 se jugará en 16 estadios: 11 en EUA, 3 en México y 2 en Canadá.'},
  {id:'E22',cat:'estadios',diff:'easy',pts:10,
   q:'¿En qué ciudad se jugará la final del Mundial 2026?',
   opts:['Los Ángeles','Nueva York/Nueva Jersey','Dallas','Miami'],ans:1,
   explain:'El MetLife Stadium en East Rutherford, Nueva Jersey (NY), albergará la final del 19 de julio de 2026.'},
  {id:'E23',cat:'estadios',diff:'hard',pts:20,
   q:'¿Qué estadio de México albergará partidos del Mundial 2026?',
   opts:['Estadio Azteca','Estadio BBVA','Estadio Akron','Solo Azteca y BBVA'],ans:3,
   explain:'México tendrá 3 sedes: Estadio Azteca (CDMX), BBVA (Monterrey) y Akron (Guadalajara).'},

  // ── NUEVAS PREGUNTAS — RECORDS ────────────────────────────
  {id:'R21',cat:'records',diff:'medium',pts:15,
   q:'¿Cuántas selecciones participan en el Mundial 2026 por primera vez?',
   opts:['32','36','48','56'],ans:2,
   explain:'El Mundial 2026 es el primero con 48 selecciones, expandido desde las 32 de Qatar 2022.'},
  {id:'R22',cat:'records',diff:'hard',pts:20,
   q:'¿Cuál es la mayor goleada en la historia de los Mundiales?',
   opts:['9-0','10-1','11-0','12-0'],ans:1,
   explain:'Hungría goleó 10-1 a El Salvador en el Mundial de España 1982, la mayor diferencia registrada.'},
  {id:'R23',cat:'records',diff:'easy',pts:10,
   q:'¿Cuántos goles se anotaron en el partido Alemania 7 - Brasil 1?',
   opts:['7','8','9','10'],ans:1,
   explain:'El partido del Mundial 2014 terminó 7-1, con 8 goles totales. Alemania anotó 5 en 18 minutos.'},
  {id:'R24',cat:'records',diff:'medium',pts:15,
   q:'¿Qué portero tiene más partidos sin goles encajados en Mundiales?',
   opts:['Buffon','Casillas','Sepp Maier','Peter Shilton'],ans:3,
   explain:'Peter Shilton de Inglaterra disputó 17 partidos mundialistas (1982-1990), con el record de participaciones.'},

  // ── NUEVAS PREGUNTAS — SELECCIONES ───────────────────────
  {id:'S21',cat:'selecciones',diff:'easy',pts:10,
   q:'¿En qué grupo del Mundial 2026 está Colombia?',
   opts:['Grupo H','Grupo J','Grupo K','Grupo L'],ans:2,
   explain:'Colombia fue sorteada en el Grupo K junto a Portugal, Congo DR y Uzbekistán.'},
  {id:'S22',cat:'selecciones',diff:'medium',pts:15,
   q:'¿Qué selección es la máxima goleadora de todos los Mundiales?',
   opts:['Alemania','Brasil','Argentina','Francia'],ans:0,
   explain:'Alemania/Alemania Occidental lidera con 232 goles en la historia de los Mundiales.'},
  {id:'S23',cat:'selecciones',diff:'hard',pts:20,
   q:'¿Cuántas selecciones de CONMEBOL clasificaron al Mundial 2026?',
   opts:['4','5','6','7'],ans:2,
   explain:'CONMEBOL tiene 6 cupos: Argentina, Brasil, Colombia, Uruguay, Ecuador y Paraguay clasificaron.'},
  {id:'S24',cat:'selecciones',diff:'easy',pts:10,
   q:'¿Qué selección es anfitriona del Mundial 2026 y tiene el mayor número de estadios sede?',
   opts:['Canadá','México','Estados Unidos','Ninguna'],ans:2,
   explain:'Estados Unidos alberga 11 de los 16 estadios sede del Mundial 2026.'},
  {id:'S25',cat:'selecciones',diff:'medium',pts:15,
   q:'¿Qué selección africana llegó más lejos en un Mundial?',
   opts:['Nigeria','Senegal','Marruecos','Camerún'],ans:2,
   explain:'Marruecos llegó a semifinales en Qatar 2022, el mejor resultado de África en la historia.'},
  {id:'S26',cat:'selecciones',diff:'hard',pts:20,
   q:'¿Qué confederación tiene más títulos mundiales?',
   opts:['UEFA','CONMEBOL','CAF','CONCACAF'],ans:1,
   explain:'CONMEBOL lidera con 10 títulos: Brasil (5), Argentina (3), Uruguay (2). UEFA tiene 12, superando a CONMEBOL.'},
  {id:'S27',cat:'selecciones',diff:'medium',pts:15,
   q:'¿Cuántos Mundiales ha ganado Francia?',
   opts:['1','2','3','4'],ans:1,
   explain:'Francia ganó en 1998 (local) y 2018 (Rusia), siendo la bicampeona actual hasta Qatar 2022.'},
  {id:'S28',cat:'selecciones',diff:'easy',pts:10,
   q:'¿Cuál es el apodo de la selección de Brasil?',
   opts:['La Furia Roja','La Canarinha','Los Guerreros','La Albiceleste'],ans:1,
   explain:'Brasil es llamada "A Canarinha" (La Canaria) por su famoso uniforme amarillo.'},
];

const TRIVIA_MODES = [
  {id:'rapido', name:'RÁPIDO', icon:'⚡', desc:'10 preguntas · 15 seg c/u · Sin fallar', badge:'ADRENALINA', badgeColor:'rgba(227,30,36,.15)', badgeText:'red'},
  {id:'clasico', name:'CLÁSICO', icon:'🏆', desc:'15 preguntas · 30 seg c/u · 3 vidas', badge:'RECOMENDADO', badgeColor:'rgba(0,166,80,.15)', badgeText:'green'},
  {id:'experto', name:'EXPERTO', icon:'🧠', desc:'20 preguntas · 20 seg c/u · Solo difíciles', badge:'PREMIUM', badgeColor:'rgba(239,159,39,.15)', badgeText:'gold'},
  {id:'infinito', name:'INFINITO', icon:'∞', desc:'Juega hasta que falles · Sin tiempo', badge:'SANDBOX', badgeColor:'rgba(91,164,245,.15)', badgeText:'rare-c'},
];

const TRIVIA_CATS = [
  {id:'mix',     label:'🌍 Todo'},
  {id:'historia',label:'📜 Historia'},
  {id:'jugadores',label:'⭐ Jugadores'},
  {id:'estadios',label:'🏟 Estadios'},
  {id:'records', label:'📊 Récords'},
  {id:'selecciones',label:'🚩 Selecciones'},
];

let triviaState = {
  mode: 'clasico',
  category: 'mix',
  phase: 'lobby',   // lobby | game | results
  questions: [],
  current: 0,
  answers: [],      // {qid, correct, chosen, pts}
  score: 0,
  lives: 3,
  timeLeft: 30,
  timerInterval: null,
  streak: 0,
  bestScore: 0,
};

// ── LOBBY ──────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════
// PREDICTOR IA — Powered by Claude API
// ═══════════════════════════════════════════════════════════
const PRED_MODES = [
  {id:'match',   icon:'⚔️',  name:'PARTIDO',    desc:'Predice el resultado de un partido entre dos selecciones'},
  {id:'group',   icon:'📊',  name:'GRUPO',       desc:'Simula el desempeño completo de un grupo del torneo'},
  {id:'champion',icon:'🏆',  name:'CAMPEÓN',     desc:'¿Quién ganará el Mundial 2026? La IA analiza todo'},
];

let predState = {
  mode: 'match',
  teamA: null,
  teamB: null,
  selecting: null,   // 'A' | 'B'
  pickerOpen: false,
  pickerSearch: '',
  loading: false,
  result: null,
};

// ── RENDER MAIN PAGE ───────────────────────────────────────

// ═══════════════════════════════════════════════════════════
// COMPARADOR DE JUGADORES CARA A CARA
// ═══════════════════════════════════════════════════════════

// Stat definitions: each player gets computed stats based on rarity + position
