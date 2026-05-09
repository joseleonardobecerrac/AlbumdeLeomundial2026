// ═══ COUNTRIES + GROUPS + STADIUMS ═══
// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════
const COUNTRIES = [
  // ── GRUPO A ── USA · CAN · MEX + 1
  {code:"USA",name:"Estados Unidos",flag:"us",group:"D",conf:"CONCACAF",ranking:13,world_cups:12,best:"Semifinal (1930)",
   history:"Anfitriones 2026. Leyenda de 1994. USMNT en su mejor momento.",
   timeline:[{year:1930,result:"Semifinal",type:"finalist"},{year:1990,result:"Fase grupos",type:"other"},{year:1994,result:"Cuartos",type:"third"},{year:2002,result:"Cuartos",type:"third"},{year:2022,result:"2da ronda",type:"other"},{year:2026,result:"🏠 Anfitrión",type:"other"}],
   players:[{id:"USA-FLAG",name:"Bandera Estados Unidos",type:"flag",rarity:"common",e:"🏳️"},{id:"USA-TEAM",name:"Plantel Estados Unidos",type:"team",rarity:"rare",e:"👥"},{id:"USA-10",name:"Christian Pulisic",pos:"DEL",club:"AC Milan",rarity:"legendary",e:"⭐"},{id:"USA-22",name:"Tyler Adams",pos:"MED",club:"Bournemouth",rarity:"rare",e:"💪"},{id:"USA-01",name:"Matt Turner",pos:"POR",club:"Crystal Palace",rarity:"rare",e:"🧤"},{id:"USA-09",name:"Ricardo Pepi",pos:"DEL",club:"PSV",rarity:"rare",e:"🔥"},{id:"USA-04",name:"Weston McKennie",pos:"MED",club:"Juventus",rarity:"rare",e:"⚙️"}]},

  {code:"CAN",name:"Canadá",flag:"ca",group:"B",conf:"CONCACAF",ranking:56,world_cups:3,best:"Fase de grupos (1986,2022)",
   history:"Alphonso Davies. Anfitriones 2026. Clasificaron por primera vez en 36 años a Qatar 2022.",
   timeline:[{year:1986,result:"Fase grupos",type:"other"},{year:2022,result:"Fase grupos",type:"other"},{year:2026,result:"🏠 Anfitrión",type:"other"}],
   players:[{id:"CAN-FLAG",name:"Bandera Canadá",type:"flag",rarity:"common",e:"🏳️"},{id:"CAN-TEAM",name:"Plantel Canadá",type:"team",rarity:"rare",e:"👥"},{id:"CAN-19",name:"Alphonso Davies",pos:"DEF",club:"Bayern",rarity:"legendary",e:"⭐"},{id:"CAN-09",name:"Jonathan David",pos:"DEL",club:"Lille",rarity:"rare",e:"🍁"},{id:"CAN-07",name:"Tajon Buchanan",pos:"DEL",club:"Inter",rarity:"rare",e:"⚡"}]},

  {code:"MEX",name:"México",flag:"mx",group:"A",conf:"CONCACAF",ranking:15,world_cups:18,best:"Cuartos (1970,1986)",
   history:"Anfitriones 2026. El Quinto Partido es historia. 18 participaciones mundialistas.",
   timeline:[{year:1970,result:"Cuartos",type:"third"},{year:1986,result:"Cuartos",type:"third"},{year:2002,result:"2da ronda",type:"other"},{year:2018,result:"2da ronda",type:"other"},{year:2022,result:"Fase grupos",type:"other"},{year:2026,result:"🏠 Anfitrión",type:"other"}],
   players:[{id:"MEX-FLAG",name:"Bandera México",type:"flag",rarity:"common",e:"🏳️"},{id:"MEX-TEAM",name:"Plantel México",type:"team",rarity:"rare",e:"👥"},{id:"MEX-10",name:"Hirving Lozano",pos:"DEL",club:"PSV",rarity:"legendary",e:"⚡"},{id:"MEX-22",name:"Edson Álvarez",pos:"MED",club:"West Ham",rarity:"rare",e:"💪"},{id:"MEX-09",name:"Raúl Jiménez",pos:"DEL",club:"Fulham",rarity:"rare",e:"🔥"},{id:"MEX-01",name:"Guillermo Ochoa",pos:"POR",club:"América",rarity:"legendary",e:"🧤"}]},

  {code:"PAN",name:"Panamá",flag:"pa",group:"L",conf:"CONCACAF",ranking:31,world_cups:2,best:"Fase de grupos (2018)",
   history:"Los Canaleros. Segunda clasificación mundialista. Creciendo en CONCACAF.",
   timeline:[{year:2018,result:"Fase grupos",type:"other"}],
   players:[{id:"PAN-FLAG",name:"Bandera Panamá",type:"flag",rarity:"common",e:"🏳️"},{id:"PAN-TEAM",name:"Plantel Panamá",type:"team",rarity:"rare",e:"👥"},{id:"PAN-10",name:"Ismael Díaz",pos:"DEL",club:"Sporting CP",rarity:"rare",e:"🔥"},{id:"PAN-01",name:"Luis Mejía",pos:"POR",club:"Necaxa",rarity:"common",e:"🧤"}]},

  // ── GRUPO B ── ARG · MAR + 2
  {code:"ARG",name:"Argentina",flag:"ar",group:"J",conf:"CONMEBOL",ranking:1,world_cups:19,best:"Campeón (1978,1986,2022)",
   history:"Tricampeones del Mundo. Messi lidera la defensa del título de Qatar 2022.",
   timeline:[{year:1930,result:"Finalista",type:"finalist"},{year:1978,result:"🏆 Campeón",type:"champion"},{year:1986,result:"🏆 Campeón",type:"champion"},{year:1990,result:"Finalista",type:"finalist"},{year:2014,result:"Finalista",type:"finalist"},{year:2022,result:"🏆 Campeón",type:"champion"}],
   players:[{id:"ARG-FLAG",name:"Bandera Argentina",type:"flag",rarity:"common",e:"🏳️"},{id:"ARG-TEAM",name:"Plantel Argentina",type:"team",rarity:"rare",e:"👥"},{id:"ARG-10",name:"Lionel Messi",pos:"DEL",club:"Inter Miami",rarity:"icon",e:"🐐"},{id:"ARG-11",name:"Ángel Di María",pos:"DEL",club:"Benfica",rarity:"legendary",e:"⭐"},{id:"ARG-01",name:"Emiliano Martínez",pos:"POR",club:"Aston Villa",rarity:"legendary",e:"🧤"},{id:"ARG-14",name:"Enzo Fernández",pos:"MED",club:"Chelsea",rarity:"rare",e:"⚙️"},{id:"ARG-09",name:"Julián Álvarez",pos:"DEL",club:"Atlético",rarity:"legendary",e:"🐺"},{id:"ARG-04",name:"Lisandro Martínez",pos:"DEF",club:"Man. United",rarity:"rare",e:"🛡️"}]},

  {code:"MAR",name:"Marruecos",flag:"ma",group:"C",conf:"CAF",ranking:12,world_cups:7,best:"4to lugar (2022)",
   history:"La sorpresa de Qatar 2022. Primeros africanos en una semifinal mundialista.",
   timeline:[{year:1986,result:"2da ronda",type:"other"},{year:1998,result:"Fase grupos",type:"other"},{year:2018,result:"Fase grupos",type:"other"},{year:2022,result:"4to lugar",type:"third"}],
   players:[{id:"MAR-FLAG",name:"Bandera Marruecos",type:"flag",rarity:"common",e:"🏳️"},{id:"MAR-TEAM",name:"Plantel Marruecos",type:"team",rarity:"rare",e:"👥"},{id:"MAR-07",name:"Hakim Ziyech",pos:"MED",club:"Galatasaray",rarity:"rare",e:"🌙"},{id:"MAR-01",name:"Yassine Bounou",pos:"POR",club:"Al-Hilal",rarity:"rare",e:"🧤"},{id:"MAR-19",name:"Achraf Hakimi",pos:"DEF",club:"PSG",rarity:"legendary",e:"🛡️"}]},

  {code:"GHA",name:"Ghana",flag:"gh",group:"L",conf:"CAF",ranking:75,world_cups:5,best:"Cuartos (2010)",
   history:"Las Estrellas Negras. Hicieron historia en 2010 llegando a cuartos. Jordan Ayew.",
   timeline:[{year:2006,result:"2da ronda",type:"other"},{year:2010,result:"Cuartos",type:"third"},{year:2014,result:"Fase grupos",type:"other"},{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"GHA-FLAG",name:"Bandera Ghana",type:"flag",rarity:"common",e:"🏳️"},{id:"GHA-TEAM",name:"Plantel Ghana",type:"team",rarity:"rare",e:"👥"},{id:"GHA-10",name:"Jordan Ayew",pos:"DEL",club:"Leicester",rarity:"rare",e:"⭐"},{id:"GHA-09",name:"Inaki Williams",pos:"DEL",club:"Athletic",rarity:"rare",e:"🔥"},{id:"GHA-01",name:"Lawrence Ati-Zigi",pos:"POR",club:"St. Gallen",rarity:"common",e:"🧤"}]},

  {code:"CPV",name:"Cabo Verde",flag:"cv",group:"H",conf:"CAF",ranking:70,world_cups:1,best:"Debut 2026",
   history:"¡Debut histórico! Los Tubarões Azuis clasifican por primera vez al Mundial.",
   timeline:[{year:2026,result:"🎉 Debut",type:"other"}],
   players:[{id:"CPV-FLAG",name:"Bandera Cabo Verde",type:"flag",rarity:"common",e:"🏳️"},{id:"CPV-TEAM",name:"Plantel Cabo Verde",type:"team",rarity:"rare",e:"👥"},{id:"CPV-09",name:"Ryan Mendes",pos:"DEL",club:"Vitesse",rarity:"rare",e:"🦈"},{id:"CPV-01",name:"Vozinha",pos:"POR",club:"Belenenses",rarity:"common",e:"🧤"}]},

  // ── GRUPO C ── SEN · TUN + 2
  {code:"SEN",name:"Senegal",flag:"sn",group:"I",conf:"CAF",ranking:18,world_cups:4,best:"Cuartos (2002)",
   history:"Los Leones de Teranga. Sadio Mané. Campeones de África 2021 y 2022.",
   timeline:[{year:2002,result:"Cuartos",type:"third"},{year:2018,result:"Fase grupos",type:"other"},{year:2022,result:"2da ronda",type:"other"}],
   players:[{id:"SEN-FLAG",name:"Bandera Senegal",type:"flag",rarity:"common",e:"🏳️"},{id:"SEN-TEAM",name:"Plantel Senegal",type:"team",rarity:"rare",e:"👥"},{id:"SEN-10",name:"Sadio Mané",pos:"DEL",club:"Al-Nassr",rarity:"legendary",e:"🦁"},{id:"SEN-01",name:"Édouard Mendy",pos:"POR",club:"Al-Ahly",rarity:"rare",e:"🧤"},{id:"SEN-19",name:"Ismaïla Sarr",pos:"DEL",club:"Crystal Palace",rarity:"rare",e:"⚡"}]},

  {code:"TUN",name:"Túnez",flag:"tn",group:"F",conf:"CAF",ranking:49,world_cups:7,best:"Fase de grupos",
   history:"Los Águilas de Cartago. 7 mundiales. Primera selección africana en ganar un partido mundialista.",
   timeline:[{year:1978,result:"Fase grupos",type:"other"},{year:1998,result:"Fase grupos",type:"other"},{year:2006,result:"Fase grupos",type:"other"},{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"TUN-FLAG",name:"Bandera Túnez",type:"flag",rarity:"common",e:"🏳️"},{id:"TUN-TEAM",name:"Plantel Túnez",type:"team",rarity:"rare",e:"👥"},{id:"TUN-10",name:"Wahbi Khazri",pos:"MED",club:"Al-Qadsiah",rarity:"rare",e:"🦅"},{id:"TUN-01",name:"Aymen Dahmen",pos:"POR",club:"Montpellier",rarity:"common",e:"🧤"}]},

  {code:"CIV",name:"Costa de Marfil",flag:"ci",group:"E",conf:"CAF",ranking:44,world_cups:4,best:"Fase de grupos",
   history:"Los Elefantes. Drogba fue su leyenda. Sébastien Haller lidera la nueva generación.",
   timeline:[{year:2006,result:"Fase grupos",type:"other"},{year:2010,result:"Fase grupos",type:"other"},{year:2014,result:"Fase grupos",type:"other"}],
   players:[{id:"CIV-FLAG",name:"Bandera Costa de Marfil",type:"flag",rarity:"common",e:"🏳️"},{id:"CIV-TEAM",name:"Plantel Costa de Marfil",type:"team",rarity:"rare",e:"👥"},{id:"CIV-09",name:"Sébastien Haller",pos:"DEL",club:"Dortmund",rarity:"rare",e:"🐘"},{id:"CIV-10",name:"Franck Kessié",pos:"MED",club:"Atalanta",rarity:"rare",e:"💪"},{id:"CIV-01",name:"Yahia Fofana",pos:"POR",club:"Chelsea",rarity:"common",e:"🧤"}]},

  {code:"SAF",name:"Sudáfrica",flag:"za",group:"A",conf:"CAF",ranking:55,world_cups:4,best:"Fase de grupos",
   history:"Únicos anfitriones africanos 2010. Bafana Bafana regresan al Mundial.",
   timeline:[{year:1998,result:"Fase grupos",type:"other"},{year:2002,result:"Fase grupos",type:"other"},{year:2010,result:"Fase grupos",type:"other"}],
   players:[{id:"SAF-FLAG",name:"Bandera Sudáfrica",type:"flag",rarity:"common",e:"🏳️"},{id:"SAF-TEAM",name:"Plantel Sudáfrica",type:"team",rarity:"rare",e:"👥"},{id:"SAF-10",name:"Percy Tau",pos:"DEL",club:"Al-Ahly",rarity:"rare",e:"🦁"},{id:"SAF-01",name:"Ronwen Williams",pos:"POR",club:"Sundowns",rarity:"common",e:"🧤"}]},

  // ── GRUPO D ── COL · PAR + 2
  {code:"COL",name:"Colombia",flag:"co",group:"K",conf:"CONMEBOL",ranking:14,world_cups:7,best:"Cuartos (2014)",
   history:"Finalista Copa América 2024. Luis Díaz y James Rodríguez. Retornan al Mundial.",
   timeline:[{year:1990,result:"2da ronda",type:"other"},{year:1994,result:"2da ronda",type:"other"},{year:2014,result:"Cuartos",type:"third"},{year:2018,result:"2da ronda",type:"other"}],
   players:[{id:"COL-FLAG",name:"Bandera Colombia",type:"flag",rarity:"common",e:"🏳️"},{id:"COL-TEAM",name:"Plantel Colombia",type:"team",rarity:"rare",e:"👥"},{id:"COL-10",name:"James Rodríguez",pos:"MED",club:"Rayo Vallecano",rarity:"legendary",e:"⭐"},{id:"COL-11",name:"Luis Díaz",pos:"DEL",club:"Liverpool",rarity:"legendary",e:"⚡"},{id:"COL-02",name:"Daniel Muñoz",pos:"DEF",club:"Crystal Palace",rarity:"rare",e:"🛡️"},{id:"COL-01",name:"Camilo Vargas",pos:"POR",club:"Atlas FC",rarity:"rare",e:"🧤"},{id:"COL-16",name:"Jefferson Lerma",pos:"MED",club:"Crystal Palace",rarity:"rare",e:"⚙️"},{id:"COL-19",name:"Rafael Santos Borré",pos:"DEL",club:"Internacional",rarity:"common",e:"🔥"},{id:"COL-13",name:"Jhon Córdoba",pos:"DEL",club:"Krasnodar",rarity:"common",e:"🎯"},{id:"COL-03",name:"Dávinson Sánchez",pos:"DEF",club:"Galatasaray",rarity:"rare",e:"💪"}]},

  {code:"PAR",name:"Paraguay",flag:"py",group:"D",conf:"CONMEBOL",ranking:43,world_cups:9,best:"Cuartos (2010)",
   history:"La Albirroja. Cuartos en 2010. Miguel Almirón lidera la vuelta al Mundial.",
   timeline:[{year:1998,result:"2da ronda",type:"other"},{year:2002,result:"2da ronda",type:"other"},{year:2006,result:"2da ronda",type:"other"},{year:2010,result:"Cuartos",type:"third"}],
   players:[{id:"PAR-FLAG",name:"Bandera Paraguay",type:"flag",rarity:"common",e:"🏳️"},{id:"PAR-TEAM",name:"Plantel Paraguay",type:"team",rarity:"rare",e:"👥"},{id:"PAR-10",name:"Miguel Almirón",pos:"MED",club:"Newcastle",rarity:"legendary",e:"⭐"},{id:"PAR-09",name:"Antonio Sanabria",pos:"DEL",club:"Torino",rarity:"rare",e:"🔥"},{id:"PAR-01",name:"Antony Silva",pos:"POR",club:"Krasnodar",rarity:"common",e:"🧤"}]},

  {code:"ALG",name:"Argelia",flag:"dz",group:"J",conf:"CAF",ranking:38,world_cups:5,best:"2da ronda (2014)",
   history:"Campeón de África 2019. Los Zorros del Desierto regresan al Mundial.",
   timeline:[{year:1982,result:"2da ronda",type:"other"},{year:1986,result:"Fase grupos",type:"other"},{year:2010,result:"Fase grupos",type:"other"},{year:2014,result:"2da ronda",type:"other"}],
   players:[{id:"ALG-FLAG",name:"Bandera Argelia",type:"flag",rarity:"common",e:"🏳️"},{id:"ALG-TEAM",name:"Plantel Argelia",type:"team",rarity:"rare",e:"👥"},{id:"ALG-10",name:"Riyad Mahrez",pos:"DEL",club:"Al-Ahli",rarity:"legendary",e:"🌟"},{id:"ALG-07",name:"Youcef Atal",pos:"DEF",club:"Niza",rarity:"rare",e:"🛡️"},{id:"ALG-09",name:"Islam Slimani",pos:"DEL",club:"Partizan",rarity:"common",e:"🔥"}]},

  {code:"EGI",name:"Egipto",flag:"eg",group:"G",conf:"CAF",ranking:35,world_cups:4,best:"Octavos (1934)",
   history:"Mohamed Salah lleva a los Faraones a su primer Mundial desde 2018.",
   timeline:[{year:1934,result:"Fase grupos",type:"other"},{year:1990,result:"Fase grupos",type:"other"},{year:2018,result:"Fase grupos",type:"other"}],
   players:[{id:"EGI-FLAG",name:"Bandera Egipto",type:"flag",rarity:"common",e:"🏳️"},{id:"EGI-TEAM",name:"Plantel Egipto",type:"team",rarity:"rare",e:"👥"},{id:"EGI-10",name:"Mohamed Salah",pos:"DEL",club:"Liverpool",rarity:"icon",e:"⚡"},{id:"EGI-01",name:"Mohamed El-Shenawy",pos:"POR",club:"Al-Ahly",rarity:"common",e:"🧤"},{id:"EGI-07",name:"Mostafa Mohamed",pos:"DEL",club:"Nantes",rarity:"rare",e:"🔥"}]},

  // ── GRUPO E ── BRA · ECU · CRO · NOR
  {code:"BRA",name:"Brasil",flag:"br",group:"C",conf:"CONMEBOL",ranking:5,world_cups:23,best:"Campeón (1958,1962,1970,1994,2002)",
   history:"5 veces Campeón del Mundo. Vinicius Jr. busca llevar la Canarinha a la gloria.",
   timeline:[{year:1958,result:"🏆 Campeón",type:"champion"},{year:1962,result:"🏆 Campeón",type:"champion"},{year:1970,result:"🏆 Campeón",type:"champion"},{year:1994,result:"🏆 Campeón",type:"champion"},{year:1998,result:"Finalista",type:"finalist"},{year:2002,result:"🏆 Campeón",type:"champion"},{year:2014,result:"4to lugar",type:"other"},{year:2022,result:"Cuartos",type:"other"}],
   players:[{id:"BRA-FLAG",name:"Bandera Brasil",type:"flag",rarity:"common",e:"🏳️"},{id:"BRA-TEAM",name:"Plantel Brasil",type:"team",rarity:"rare",e:"👥"},{id:"BRA-07",name:"Vinicius Jr.",pos:"DEL",club:"Real Madrid",rarity:"icon",e:"🌟"},{id:"BRA-10",name:"Rodrygo",pos:"DEL",club:"Real Madrid",rarity:"rare",e:"⚡"},{id:"BRA-05",name:"Casemiro",pos:"MED",club:"Man. United",rarity:"rare",e:"💪"},{id:"BRA-01",name:"Alisson",pos:"POR",club:"Liverpool",rarity:"legendary",e:"🧤"},{id:"BRA-09",name:"Endrick",pos:"DEL",club:"Real Madrid",rarity:"legendary",e:"🔥"}]},

  {code:"ECU",name:"Ecuador",flag:"ec",group:"E",conf:"CONMEBOL",ranking:24,world_cups:5,best:"Octavos (2006)",
   history:"La Tri. Abrieron Qatar 2022 con una victoria. Byron Castillo y Ángelo Preciado.",
   timeline:[{year:2002,result:"Fase grupos",type:"other"},{year:2006,result:"2da ronda",type:"other"},{year:2014,result:"Fase grupos",type:"other"},{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"ECU-FLAG",name:"Bandera Ecuador",type:"flag",rarity:"common",e:"🏳️"},{id:"ECU-TEAM",name:"Plantel Ecuador",type:"team",rarity:"rare",e:"👥"},{id:"ECU-13",name:"Enner Valencia",pos:"DEL",club:"Fenerbahçe",rarity:"rare",e:"🔥"},{id:"ECU-10",name:"Gonzalo Plata",pos:"DEL",club:"Sporting CP",rarity:"common",e:"⚡"},{id:"ECU-22",name:"Moisés Caicedo",pos:"MED",club:"Chelsea",rarity:"legendary",e:"⚙️"}]},

  {code:"CRO",name:"Croacia",flag:"hr",group:"L",conf:"UEFA",ranking:11,world_cups:7,best:"Subcampeón (2018)",
   history:"Finalistas 2018, Terceros 2022. Modric y la generación dorada del fútbol croata.",
   timeline:[{year:1998,result:"3er lugar",type:"third"},{year:2014,result:"Fase grupos",type:"other"},{year:2018,result:"Finalista",type:"finalist"},{year:2022,result:"3er lugar",type:"third"}],
   players:[{id:"CRO-FLAG",name:"Bandera Croacia",type:"flag",rarity:"common",e:"🏳️"},{id:"CRO-TEAM",name:"Plantel Croacia",type:"team",rarity:"rare",e:"👥"},{id:"CRO-10",name:"Luka Modrić",pos:"MED",club:"Real Madrid",rarity:"legendary",e:"👑"},{id:"CRO-11",name:"Ivan Perišić",pos:"DEL",club:"Hajduk",rarity:"rare",e:"⚡"},{id:"CRO-01",name:"Dominik Livaković",pos:"POR",club:"Fenerbahçe",rarity:"rare",e:"🧤"}]},

  {code:"NOR",name:"Noruega",flag:"no",group:"I",conf:"UEFA",ranking:29,world_cups:4,best:"Octavos (1938,1998)",
   history:"Haaland regresa a Noruega al mapa mundialista. Ausentes desde 1998.",
   timeline:[{year:1938,result:"2da ronda",type:"other"},{year:1994,result:"Fase grupos",type:"other"},{year:1998,result:"2da ronda",type:"other"}],
   players:[{id:"NOR-FLAG",name:"Bandera Noruega",type:"flag",rarity:"common",e:"🏳️"},{id:"NOR-TEAM",name:"Plantel Noruega",type:"team",rarity:"rare",e:"👥"},{id:"NOR-09",name:"Erling Haaland",pos:"DEL",club:"Man. City",rarity:"icon",e:"🔱"},{id:"NOR-10",name:"Martin Ødegaard",pos:"MED",club:"Arsenal",rarity:"legendary",e:"⭐"}]},

  // ── GRUPO F ── POR · URU · EGI (D) ya esta · +1
  {code:"POR",name:"Portugal",flag:"pt",group:"K",conf:"UEFA",ranking:5,world_cups:9,best:"3er lugar (1966)",
   history:"Cristiano Ronaldo. Campeones Euro 2016. Rafael Leão y Bruno Fernandes la nueva era.",
   timeline:[{year:1966,result:"3er lugar",type:"third"},{year:2006,result:"4to lugar",type:"other"},{year:2016,result:"Euro ✓",type:"champion"},{year:2022,result:"Cuartos",type:"other"}],
   players:[{id:"POR-FLAG",name:"Bandera Portugal",type:"flag",rarity:"common",e:"🏳️"},{id:"POR-TEAM",name:"Plantel Portugal",type:"team",rarity:"rare",e:"👥"},{id:"POR-07",name:"Cristiano Ronaldo",pos:"DEL",club:"Al-Nassr",rarity:"icon",e:"🐐"},{id:"POR-18",name:"Rúben Neves",pos:"MED",club:"Al-Hilal",rarity:"rare",e:"⚙️"},{id:"POR-17",name:"Rafael Leão",pos:"DEL",club:"AC Milan",rarity:"legendary",e:"⚡"},{id:"POR-08",name:"Bruno Fernandes",pos:"MED",club:"Man. United",rarity:"legendary",e:"⭐"}]},

  {code:"URU",name:"Uruguay",flag:"uy",group:"H",conf:"CONMEBOL",ranking:16,world_cups:15,best:"Campeón (1930,1950)",
   history:"La Garra Charrúa. Bicampeones del Mundo. Valverde y Darwin Núñez la nueva era.",
   timeline:[{year:1930,result:"🏆 Campeón",type:"champion"},{year:1950,result:"🏆 Campeón",type:"champion"},{year:1970,result:"4to lugar",type:"other"},{year:2010,result:"4to lugar",type:"other"},{year:2018,result:"Cuartos",type:"other"},{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"URU-FLAG",name:"Bandera Uruguay",type:"flag",rarity:"common",e:"🏳️"},{id:"URU-TEAM",name:"Plantel Uruguay",type:"team",rarity:"rare",e:"👥"},{id:"URU-10",name:"Federico Valverde",pos:"MED",club:"Real Madrid",rarity:"legendary",e:"⭐"},{id:"URU-09",name:"Darwin Núñez",pos:"DEL",club:"Liverpool",rarity:"rare",e:"🔥"},{id:"URU-01",name:"Sergio Rochet",pos:"POR",club:"Nacional",rarity:"common",e:"🧤"},{id:"URU-22",name:"Ronald Araújo",pos:"DEF",club:"Barcelona",rarity:"rare",e:"🛡️"}]},

  {code:"ARS",name:"Arabia Saudita",flag:"sa",group:"H",conf:"AFC",ranking:59,world_cups:7,best:"Octavos (1994)",
   history:"La sensación de Qatar: vencieron a Argentina. Salem Al-Dawsari el héroe.",
   timeline:[{year:1994,result:"2da ronda",type:"other"},{year:1998,result:"Fase grupos",type:"other"},{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"ARS-FLAG",name:"Bandera Arabia Saudita",type:"flag",rarity:"common",e:"🏳️"},{id:"ARS-TEAM",name:"Plantel Arabia Saudita",type:"team",rarity:"rare",e:"👥"},{id:"ARS-10",name:"Salem Al-Dawsari",pos:"DEL",club:"Al-Hilal",rarity:"rare",e:"⚡"},{id:"ARS-01",name:"Mohammed Al-Owais",pos:"POR",club:"Al-Hilal",rarity:"common",e:"🧤"}]},

  {code:"AUS",name:"Australia",flag:"au",group:"D",conf:"AFC",ranking:26,world_cups:7,best:"Octavos (2006,2022)",
   history:"Los Socceroos. Sami Muscat en 2006. Mathew Leckie marcó en 2022. Nuevamente presentes.",
   timeline:[{year:2006,result:"2da ronda",type:"other"},{year:2010,result:"Fase grupos",type:"other"},{year:2014,result:"Fase grupos",type:"other"},{year:2022,result:"2da ronda",type:"other"}],
   players:[{id:"AUS-FLAG",name:"Bandera Australia",type:"flag",rarity:"common",e:"🏳️"},{id:"AUS-TEAM",name:"Plantel Australia",type:"team",rarity:"rare",e:"👥"},{id:"AUS-10",name:"Martin Boyle",pos:"DEL",club:"Al-Faisaly",rarity:"rare",e:"🦘"},{id:"AUS-22",name:"Mathew Ryan",pos:"POR",club:"Real Sociedad",rarity:"rare",e:"🧤"},{id:"AUS-09",name:"Mitchell Duke",pos:"DEL",club:"Fagiano Okayama",rarity:"common",e:"🔥"}]},

  // ── GRUPO G ── FRA · NZL + 2
  {code:"FRA",name:"Francia",flag:"fr",group:"I",conf:"UEFA",ranking:3,world_cups:17,best:"Campeón (1998,2018)",
   history:"Bicampeones del Mundo. Mbappé busca el tercero. Los Blues son favoritos.",
   timeline:[{year:1958,result:"3er lugar",type:"third"},{year:1986,result:"3er lugar",type:"third"},{year:1998,result:"🏆 Campeón",type:"champion"},{year:2006,result:"Finalista",type:"finalist"},{year:2018,result:"🏆 Campeón",type:"champion"},{year:2022,result:"Finalista",type:"finalist"}],
   players:[{id:"FRA-FLAG",name:"Bandera Francia",type:"flag",rarity:"common",e:"🏳️"},{id:"FRA-TEAM",name:"Plantel Francia",type:"team",rarity:"rare",e:"👥"},{id:"FRA-10",name:"Kylian Mbappé",pos:"DEL",club:"Real Madrid",rarity:"icon",e:"⚡"},{id:"FRA-07",name:"Antoine Griezmann",pos:"MED",club:"Atlético",rarity:"legendary",e:"⭐"},{id:"FRA-01",name:"Mike Maignan",pos:"POR",club:"AC Milan",rarity:"rare",e:"🧤"},{id:"FRA-09",name:"Ousmane Dembélé",pos:"DEL",club:"PSG",rarity:"rare",e:"🔥"}]},

  {code:"NZL",name:"Nueva Zelanda",flag:"nz",group:"G",conf:"OFC",ranking:89,world_cups:3,best:"Fase de grupos",
   history:"Los All Whites. Primera clasificación desde 2010. Chris Wood lidera el ataque.",
   timeline:[{year:1982,result:"Fase grupos",type:"other"},{year:2010,result:"Fase grupos",type:"other"}],
   players:[{id:"NZL-FLAG",name:"Bandera Nueva Zelanda",type:"flag",rarity:"common",e:"🏳️"},{id:"NZL-TEAM",name:"Plantel Nueva Zelanda",type:"team",rarity:"rare",e:"👥"},{id:"NZL-09",name:"Chris Wood",pos:"DEL",club:"Newcastle",rarity:"rare",e:"🥝"},{id:"NZL-01",name:"Oliver Sail",pos:"POR",club:"Nottingham Forest",rarity:"common",e:"🧤"}]},

  {code:"CUW",name:"Curazao",flag:"cw",group:"E",conf:"CONCACAF",ranking:82,world_cups:1,best:"Debut 2026",
   history:"Debut histórico. La isla de Leandro Bacuna y Cuco Martina en el mayor escenario.",
   timeline:[{year:2026,result:"🎉 Debut",type:"other"}],
   players:[{id:"CUW-FLAG",name:"Bandera Curazao",type:"flag",rarity:"common",e:"🏳️"},{id:"CUW-TEAM",name:"Plantel Curazao",type:"team",rarity:"rare",e:"👥"},{id:"CUW-09",name:"Leandro Bacuna",pos:"MED",club:"Cardiff",rarity:"rare",e:"🏝️"},{id:"CUW-01",name:"Eloy Room",pos:"POR",club:"Columbus Crew",rarity:"common",e:"🧤"}]},

  {code:"HAI",name:"Haití",flag:"ht",group:"C",conf:"CONCACAF",ranking:88,world_cups:2,best:"Fase de grupos (1974)",
   history:"Los Grenadiers. Retornan al Mundial 52 años después. Hervé Bazile lidera.",
   timeline:[{year:1974,result:"Fase grupos",type:"other"}],
   players:[{id:"HAI-FLAG",name:"Bandera Haití",type:"flag",rarity:"common",e:"🏳️"},{id:"HAI-TEAM",name:"Plantel Haití",type:"team",rarity:"rare",e:"👥"},{id:"HAI-09",name:"Frantzdy Pierrot",pos:"DEL",club:"Bröndby",rarity:"rare",e:"⚡"},{id:"HAI-01",name:"Josué Duverger",pos:"POR",club:"Racing Club",rarity:"common",e:"🧤"}]},

  // ── GRUPO H ── ING · KOR + 2
  {code:"ING",name:"Inglaterra",flag:"gb-eng",group:"L",conf:"UEFA",ranking:4,world_cups:17,best:"Campeón (1966)",
   history:"Campeones 1966 en casa. Kane y Bellingham buscan el segundo título.",
   timeline:[{year:1966,result:"🏆 Campeón",type:"champion"},{year:1990,result:"4to lugar",type:"other"},{year:2018,result:"4to lugar",type:"other"},{year:2022,result:"Cuartos",type:"other"}],
   players:[{id:"ING-FLAG",name:"Bandera Inglaterra",type:"flag",rarity:"common",e:"🏳️"},{id:"ING-TEAM",name:"Plantel Inglaterra",type:"team",rarity:"rare",e:"👥"},{id:"ING-09",name:"Harry Kane",pos:"DEL",club:"Bayern",rarity:"legendary",e:"👑"},{id:"ING-22",name:"Jude Bellingham",pos:"MED",club:"Real Madrid",rarity:"icon",e:"⭐"},{id:"ING-11",name:"Bukayo Saka",pos:"DEL",club:"Arsenal",rarity:"rare",e:"🔥"},{id:"ING-01",name:"Jordan Pickford",pos:"POR",club:"Everton",rarity:"rare",e:"🧤"}]},

  {code:"KOR",name:"Corea del Sur",flag:"kr",group:"A",conf:"AFC",ranking:23,world_cups:12,best:"4to lugar (2002)",
   history:"Semifinalistas en casa en 2002. Son Heung-min capitán de la nueva generación.",
   timeline:[{year:2002,result:"Semifinal",type:"third"},{year:2010,result:"2da ronda",type:"other"},{year:2022,result:"2da ronda",type:"other"}],
   players:[{id:"KOR-FLAG",name:"Bandera Corea del Sur",type:"flag",rarity:"common",e:"🏳️"},{id:"KOR-TEAM",name:"Plantel Corea del Sur",type:"team",rarity:"rare",e:"👥"},{id:"KOR-07",name:"Son Heung-min",pos:"DEL",club:"Tottenham",rarity:"legendary",e:"⭐"},{id:"KOR-08",name:"Lee Kang-in",pos:"MED",club:"PSG",rarity:"rare",e:"🌟"},{id:"KOR-01",name:"Kim Seung-gyu",pos:"POR",club:"Al-Shabab",rarity:"common",e:"🧤"}]},

  {code:"JAP",name:"Japón",flag:"jp",group:"F",conf:"AFC",ranking:15,world_cups:8,best:"Octavos (2002,2010,2018,2022)",
   history:"Los Samuráis Azules. Consistentes en octavos. Mitoma y Doan la nueva ola.",
   timeline:[{year:2002,result:"2da ronda",type:"other"},{year:2010,result:"2da ronda",type:"other"},{year:2018,result:"2da ronda",type:"other"},{year:2022,result:"2da ronda",type:"other"}],
   players:[{id:"JAP-FLAG",name:"Bandera Japón",type:"flag",rarity:"common",e:"🏳️"},{id:"JAP-TEAM",name:"Plantel Japón",type:"team",rarity:"rare",e:"👥"},{id:"JAP-10",name:"Takumi Minamino",pos:"MED",club:"Monaco",rarity:"rare",e:"⚡"},{id:"JAP-22",name:"Kaoru Mitoma",pos:"DEL",club:"Brighton",rarity:"rare",e:"🌸"},{id:"JAP-01",name:"Shuichi Gonda",pos:"POR",club:"Shimizu",rarity:"common",e:"🧤"}]},

  {code:"JOR",name:"Jordania",flag:"jo",group:"J",conf:"AFC",ranking:62,world_cups:1,best:"Debut 2026",
   history:"Debut histórico de los Nashama. Yazeed Abo Layla el héroe de la clasificación.",
   timeline:[{year:2026,result:"🎉 Debut",type:"other"}],
   players:[{id:"JOR-FLAG",name:"Bandera Jordania",type:"flag",rarity:"common",e:"🏳️"},{id:"JOR-TEAM",name:"Plantel Jordania",type:"team",rarity:"rare",e:"👥"},{id:"JOR-10",name:"Musa Al-Tamari",pos:"DEL",club:"Montpellier",rarity:"rare",e:"⚔️"},{id:"JOR-01",name:"Amer Shafi",pos:"POR",club:"Al-Wehdat",rarity:"common",e:"🧤"}]},

  // ── GRUPO I ── ALE · IRA + 2
  {code:"ALE",name:"Alemania",flag:"de",group:"E",conf:"UEFA",ranking:10,world_cups:21,best:"Campeón (1954,1974,1990,2014)",
   history:"4 veces Campeón. La Mannschaft. Musiala y Wirtz lideran la renovación.",
   timeline:[{year:1954,result:"🏆 Campeón",type:"champion"},{year:1966,result:"Finalista",type:"finalist"},{year:1974,result:"🏆 Campeón",type:"champion"},{year:1982,result:"Finalista",type:"finalist"},{year:1990,result:"🏆 Campeón",type:"champion"},{year:2002,result:"Finalista",type:"finalist"},{year:2014,result:"🏆 Campeón",type:"champion"},{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"ALE-FLAG",name:"Bandera Alemania",type:"flag",rarity:"common",e:"🏳️"},{id:"ALE-TEAM",name:"Plantel Alemania",type:"team",rarity:"rare",e:"👥"},{id:"ALE-14",name:"Jamal Musiala",pos:"MED",club:"Bayern",rarity:"legendary",e:"⭐"},{id:"ALE-42",name:"Florian Wirtz",pos:"MED",club:"Leverkusen",rarity:"legendary",e:"💫"},{id:"ALE-09",name:"Kai Havertz",pos:"DEL",club:"Arsenal",rarity:"rare",e:"🔥"},{id:"ALE-01",name:"Manuel Neuer",pos:"POR",club:"Bayern",rarity:"rare",e:"🧤"}]},

  {code:"IRA",name:"Irán",flag:"ir",group:"G",conf:"AFC",ranking:18,world_cups:7,best:"Primera ronda",
   history:"Los Guerreros Persas. 7 mundiales. Sardar Azmoun y Ali Gholizadeh.",
   timeline:[{year:1978,result:"Fase grupos",type:"other"},{year:1998,result:"Fase grupos",type:"other"},{year:2014,result:"Fase grupos",type:"other"},{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"IRA-FLAG",name:"Bandera Irán",type:"flag",rarity:"common",e:"🏳️"},{id:"IRA-TEAM",name:"Plantel Irán",type:"team",rarity:"rare",e:"👥"},{id:"IRA-09",name:"Sardar Azmoun",pos:"DEL",club:"Bayer Leverkusen",rarity:"rare",e:"🦁"},{id:"IRA-10",name:"Ali Gholizadeh",pos:"MED",club:"Charlton",rarity:"common",e:"⚡"},{id:"IRA-01",name:"Alireza Beiranvand",pos:"POR",club:"Persepolis",rarity:"common",e:"🧤"}]},

  {code:"BEL",name:"Bélgica",flag:"be",group:"G",conf:"UEFA",ranking:8,world_cups:15,best:"3er lugar (2018)",
   history:"Los Diablos Rojos. La generación dorada llega al final. De Bruyne y Lukaku.",
   timeline:[{year:1986,result:"4to lugar",type:"other"},{year:2014,result:"Cuartos",type:"other"},{year:2018,result:"3er lugar",type:"third"},{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"BEL-FLAG",name:"Bandera Bélgica",type:"flag",rarity:"common",e:"🏳️"},{id:"BEL-TEAM",name:"Plantel Bélgica",type:"team",rarity:"rare",e:"👥"},{id:"BEL-07",name:"Kevin De Bruyne",pos:"MED",club:"Man. City",rarity:"icon",e:"⭐"},{id:"BEL-09",name:"Romelu Lukaku",pos:"DEL",club:"Roma",rarity:"legendary",e:"🔥"},{id:"BEL-01",name:"Koen Casteels",pos:"POR",club:"Wolfsburg",rarity:"rare",e:"🧤"},{id:"BEL-22",name:"Axel Witsel",pos:"MED",club:"Atlético",rarity:"common",e:"💪"}]},

  {code:"UZB",name:"Uzbekistán",flag:"uz",group:"K",conf:"AFC",ranking:57,world_cups:1,best:"Debut 2026",
   history:"¡Debut histórico! Los Lobos Blancos llegan al Mundial por primera vez.",
   timeline:[{year:2026,result:"🎉 Debut",type:"other"}],
   players:[{id:"UZB-FLAG",name:"Bandera Uzbekistán",type:"flag",rarity:"common",e:"🏳️"},{id:"UZB-TEAM",name:"Plantel Uzbekistán",type:"team",rarity:"rare",e:"👥"},{id:"UZB-10",name:"Jasur Yakhshiboev",pos:"DEL",club:"Lokomotiv",rarity:"rare",e:"🐺"},{id:"UZB-01",name:"Eldorbek Sobirov",pos:"POR",club:"Pakhtakor",rarity:"common",e:"🧤"}]},

  // ── GRUPO J ── HOL · SUI + 2
  {code:"HOL",name:"Países Bajos",flag:"nl",group:"F",conf:"UEFA",ranking:6,world_cups:12,best:"Subcampeón (1974,1978,2010)",
   history:"La Naranja Mecánica. Van Dijk y De Jong. Tres finales y ningún título.",
   timeline:[{year:1974,result:"Finalista",type:"finalist"},{year:1978,result:"Finalista",type:"finalist"},{year:2010,result:"Finalista",type:"finalist"},{year:2014,result:"3er lugar",type:"third"},{year:2022,result:"Cuartos",type:"other"}],
   players:[{id:"HOL-FLAG",name:"Bandera Países Bajos",type:"flag",rarity:"common",e:"🏳️"},{id:"HOL-TEAM",name:"Plantel Países Bajos",type:"team",rarity:"rare",e:"👥"},{id:"HOL-08",name:"Frenkie de Jong",pos:"MED",club:"Barcelona",rarity:"rare",e:"⚙️"},{id:"HOL-04",name:"Virgil van Dijk",pos:"DEF",club:"Liverpool",rarity:"legendary",e:"🛡️"},{id:"HOL-21",name:"Cody Gakpo",pos:"DEL",club:"Liverpool",rarity:"rare",e:"⚡"},{id:"HOL-01",name:"Bart Verbruggen",pos:"POR",club:"Brighton",rarity:"common",e:"🧤"}]},

  {code:"SUI",name:"Suiza",flag:"ch",group:"B",conf:"UEFA",ranking:17,world_cups:13,best:"Cuartos (1934,1938,1954)",
   history:"La Nati. Regulares en mundiales. Granit Xhaka capitán y referente.",
   timeline:[{year:1954,result:"Cuartos",type:"other"},{year:2006,result:"2da ronda",type:"other"},{year:2014,result:"2da ronda",type:"other"},{year:2022,result:"Cuartos",type:"other"}],
   players:[{id:"SUI-FLAG",name:"Bandera Suiza",type:"flag",rarity:"common",e:"🏳️"},{id:"SUI-TEAM",name:"Plantel Suiza",type:"team",rarity:"rare",e:"👥"},{id:"SUI-10",name:"Granit Xhaka",pos:"MED",club:"Leverkusen",rarity:"rare",e:"⚙️"},{id:"SUI-23",name:"Xherdan Shaqiri",pos:"MED",club:"Chicago",rarity:"rare",e:"⚡"},{id:"SUI-01",name:"Yann Sommer",pos:"POR",club:"Inter",rarity:"rare",e:"🧤"}]},

  {code:"ESP",name:"España",flag:"es",group:"H",conf:"UEFA",ranking:1,world_cups:17,best:"Campeón (2010)",
   history:"Campeón 2010 y Euro 2024. Pedri, Gavi y Yamal la nueva generación dorada.",
   timeline:[{year:1950,result:"4to lugar",type:"other"},{year:2010,result:"🏆 Campeón",type:"champion"},{year:2022,result:"2da ronda",type:"other"}],
   players:[{id:"ESP-FLAG",name:"Bandera España",type:"flag",rarity:"common",e:"🏳️"},{id:"ESP-TEAM",name:"Plantel España",type:"team",rarity:"rare",e:"👥"},{id:"ESP-08",name:"Pedri",pos:"MED",club:"Barcelona",rarity:"legendary",e:"⭐"},{id:"ESP-25",name:"Gavi",pos:"MED",club:"Barcelona",rarity:"legendary",e:"💫"},{id:"ESP-19",name:"Lamine Yamal",pos:"DEL",club:"Barcelona",rarity:"icon",e:"🌟"},{id:"ESP-09",name:"Álvaro Morata",pos:"DEL",club:"AC Milan",rarity:"rare",e:"🎯"},{id:"ESP-01",name:"Unai Simón",pos:"POR",club:"Athletic",rarity:"rare",e:"🧤"}]},

  {code:"ESC",name:"Escocia",flag:"gb-sct",group:"C",conf:"UEFA",ranking:38,world_cups:9,best:"Fase de grupos",
   history:"Los Braveheart. Regresan al Mundial 28 años después. Andrew Robertson capitán.",
   timeline:[{year:1974,result:"Fase grupos",type:"other"},{year:1978,result:"Fase grupos",type:"other"},{year:1982,result:"Fase grupos",type:"other"},{year:1990,result:"Fase grupos",type:"other"},{year:1998,result:"Fase grupos",type:"other"}],
   players:[{id:"ESC-FLAG",name:"Bandera Escocia",type:"flag",rarity:"common",e:"🏳️"},{id:"ESC-TEAM",name:"Plantel Escocia",type:"team",rarity:"rare",e:"👥"},{id:"ESC-11",name:"Andrew Robertson",pos:"DEF",club:"Liverpool",rarity:"rare",e:"🏴󠁧󠁢󠁳󠁣󠁴󠁿"},{id:"ESC-09",name:"Lyndon Dykes",pos:"DEL",club:"Millwall",rarity:"common",e:"🔥"},{id:"ESC-01",name:"Angus Gunn",pos:"POR",club:"Norwich",rarity:"common",e:"🧤"}]},

  // ── GRUPO K ── ENG(ya H) · AUT · CAT · RDC
  {code:"AUT",name:"Austria",flag:"at",group:"J",conf:"UEFA",ranking:24,world_cups:8,best:"3er lugar (1954)",
   history:"Das Wunderteam histórico. Haaland fue austríaco... No, eso es Noruega. Marcel Sabitzer lidera.",
   timeline:[{year:1954,result:"3er lugar",type:"third"},{year:1982,result:"2da ronda",type:"other"},{year:1998,result:"Fase grupos",type:"other"}],
   players:[{id:"AUT-FLAG",name:"Bandera Austria",type:"flag",rarity:"common",e:"🏳️"},{id:"AUT-TEAM",name:"Plantel Austria",type:"team",rarity:"rare",e:"👥"},{id:"AUT-08",name:"Marcel Sabitzer",pos:"MED",club:"Dortmund",rarity:"rare",e:"⚙️"},{id:"AUT-10",name:"Christoph Baumgartner",pos:"MED",club:"RB Leipzig",rarity:"rare",e:"⭐"},{id:"AUT-01",name:"Patrick Pentz",pos:"POR",club:"Bayer Leverkusen",rarity:"common",e:"🧤"}]},

  {code:"CAT",name:"Catar",flag:"qa",group:"B",conf:"AFC",ranking:53,world_cups:2,best:"Fase de grupos",
   history:"Anfitriones 2022. Los Maroons vuelven al Mundial como invitados de honor.",
   timeline:[{year:2022,result:"Fase grupos",type:"other"}],
   players:[{id:"CAT-FLAG",name:"Bandera Catar",type:"flag",rarity:"common",e:"🏳️"},{id:"CAT-TEAM",name:"Plantel Catar",type:"team",rarity:"rare",e:"👥"},{id:"CAT-10",name:"Akram Afif",pos:"DEL",club:"Al-Sadd",rarity:"rare",e:"🌙"},{id:"CAT-01",name:"Meshaal Barsham",pos:"POR",club:"Al-Sadd",rarity:"common",e:"🧤"}]},

  {code:"RDC",name:"Rep. D. del Congo",flag:"cd",group:"K",conf:"CAF",ranking:48,world_cups:2,best:"Primera ronda (1974)",
   history:"Los Leopardos. Clasificaron vía repechaje intercontinental. Primera vez desde 1974.",
   timeline:[{year:1974,result:"Fase grupos",type:"other"}],
   players:[{id:"RDC-FLAG",name:"Bandera Rep. D. del Congo",type:"flag",rarity:"common",e:"🏳️"},{id:"RDC-TEAM",name:"Plantel Rep. D. del Congo",type:"team",rarity:"rare",e:"👥"},{id:"RDC-09",name:"Cédric Bakambu",pos:"DEL",club:"Besiktas",rarity:"rare",e:"🐆"},{id:"RDC-10",name:"Chancel Mbemba",pos:"DEF",club:"Marseille",rarity:"rare",e:"💪"},{id:"RDC-01",name:"Joël Kiassumbua",pos:"POR",club:"Ferencváros",rarity:"common",e:"🧤"}]},

  {code:"IRA2",name:"Irak",flag:"iq",group:"I",conf:"AFC",ranking:58,world_cups:2,best:"Fase de grupos (1986)",
   history:"Los Leones de Mesopotamia. Clasificaron vía repechaje. Primera vez desde 1986.",
   timeline:[{year:1986,result:"Fase grupos",type:"other"}],
   players:[{id:"IRA2-FLAG",name:"Bandera Irak",type:"flag",rarity:"common",e:"🏳️"},{id:"IRA2-TEAM",name:"Plantel Irak",type:"team",rarity:"rare",e:"👥"},{id:"IRA2-10",name:"Amjad Attwan",pos:"MED",club:"Al-Quwa",rarity:"rare",e:"🦁"},{id:"IRA2-01",name:"Jalal Hassan",pos:"POR",club:"Al-Zawraa",rarity:"common",e:"🧤"}]},

  // ── GRUPO L ── CAN(ya A) · OSC + 3
  {code:"TUR",name:"Turquía",flag:"tr",group:"D",conf:"UEFA",ranking:25,world_cups:3,best:"3er lugar (2002)",
   history:"La generación de Hakan Şükür logró el 3er lugar en 2002. Calhanoglu lidera la nueva era.",
   timeline:[{year:1954,result:"Fase grupos",type:"other"},{year:2002,result:"3er lugar",type:"third"}],
   players:[{id:"TUR-FLAG",name:"Bandera Turquía",type:"flag",rarity:"common",e:"🏳️"},{id:"TUR-TEAM",name:"Plantel Turquía",type:"team",rarity:"rare",e:"👥"},{id:"TUR-10",name:"Hakan Çalhanoğlu",pos:"MED",club:"Inter",rarity:"legendary",e:"⭐"},{id:"TUR-09",name:"Burak Yılmaz",pos:"DEL",club:"Adana Demirspor",rarity:"common",e:"🔥"},{id:"TUR-01",name:"Altay Bayındır",pos:"POR",club:"Man. United",rarity:"rare",e:"🧤"}]},

  {code:"SWE",name:"Suecia",flag:"se",group:"F",conf:"UEFA",ranking:42,world_cups:13,best:"Subcampeón (1958)",
   history:"El país de Zlatan. Subcampeones 1958. Retornan al Mundial vía repechaje.",
   timeline:[{year:1958,result:"Finalista",type:"finalist"},{year:1994,result:"3er lugar",type:"third"},{year:2002,result:"2da ronda",type:"other"},{year:2018,result:"Cuartos",type:"other"}],
   players:[{id:"SWE-FLAG",name:"Bandera Suecia",type:"flag",rarity:"common",e:"🏳️"},{id:"SWE-TEAM",name:"Plantel Suecia",type:"team",rarity:"rare",e:"👥"},{id:"SWE-11",name:"Victor Nilsson-Lindelöf",pos:"DEF",club:"Man. United",rarity:"rare",e:"🛡️"},{id:"SWE-09",name:"Viktor Gyökeres",pos:"DEL",club:"Sporting CP",rarity:"legendary",e:"🔥"},{id:"SWE-01",name:"Robin Olsen",pos:"POR",club:"Aston Villa",rarity:"common",e:"🧤"}]},

  {code:"RCH",name:"Rep. Checa",flag:"cz",group:"A",conf:"UEFA",ranking:43,world_cups:10,best:"Subcampeón (1934,1962)",
   history:"La Chequía. Dos finales como Checoslovaquia. Schick y Souček la nueva generación.",
   timeline:[{year:1934,result:"Finalista",type:"finalist"},{year:1962,result:"Finalista",type:"finalist"},{year:2006,result:"Fase grupos",type:"other"}],
   players:[{id:"RCH-FLAG",name:"Bandera Rep. Checa",type:"flag",rarity:"common",e:"🏳️"},{id:"RCH-TEAM",name:"Plantel Rep. Checa",type:"team",rarity:"rare",e:"👥"},{id:"RCH-10",name:"Patrik Schick",pos:"DEL",club:"Leverkusen",rarity:"rare",e:"⭐"},{id:"RCH-08",name:"Tomáš Souček",pos:"MED",club:"West Ham",rarity:"rare",e:"💪"},{id:"RCH-01",name:"Jiří Staněk",pos:"POR",club:"Sevilla",rarity:"common",e:"🧤"}]},

  {code:"BOS",name:"Bosnia y Herzegovina",flag:"ba",group:"B",conf:"UEFA",ranking:71,world_cups:2,best:"Fase de grupos (2014)",
   history:"Los Zmajevi. Debut en 2014 con Džeko. Retornan al Mundial en 2026.",
   timeline:[{year:2014,result:"Fase grupos",type:"other"}],
   players:[{id:"BOS-FLAG",name:"Bandera Bosnia y Herzegovina",type:"flag",rarity:"common",e:"🏳️"},{id:"BOS-TEAM",name:"Plantel Bosnia y Herzegovina",type:"team",rarity:"rare",e:"👥"},{id:"BOS-10",name:"Edin Džeko",pos:"DEL",club:"Fenerbahçe",rarity:"rare",e:"🐉"},{id:"BOS-08",name:"Miralem Pjanić",pos:"MED",club:"Sharjah",rarity:"rare",e:"⚙️"},{id:"BOS-01",name:"Ibrahim Šehić",pos:"POR",club:"Al-Ain",rarity:"common",e:"🧤"}]},
];

const GROUPS_ORDER = ["A","B","C","D","E","F","G","H","I","J","K","L"];

const STADIUMS = [
  {id:"STA-01",name:"MetLife Stadium",city:"Nueva York",country:"USA",flag:"us",cap:82500,role:"Final"},
  {id:"STA-02",name:"SoFi Stadium",city:"Los Ángeles",country:"USA",flag:"us",cap:70240,role:"Cuartos"},
  {id:"STA-03",name:"AT&T Stadium",city:"Dallas",country:"USA",flag:"us",cap:80000,role:"Octavos"},
  {id:"STA-04",name:"Levi's Stadium",city:"San Francisco",country:"USA",flag:"us",cap:68500,role:"Grupos"},
  {id:"STA-05",name:"Hard Rock Stadium",city:"Miami",country:"USA",flag:"us",cap:65326,role:"Semifinal"},
  {id:"STA-06",name:"Arrowhead Stadium",city:"Kansas City",country:"USA",flag:"us",cap:76416,role:"Grupos"},
  {id:"STA-07",name:"Geodis Park",city:"Nashville",country:"USA",flag:"us",cap:30000,role:"Grupos"},
  {id:"STA-08",name:"Lincoln Financial",city:"Filadelfia",country:"USA",flag:"us",cap:69176,role:"Grupos"},
  {id:"STA-09",name:"Lumen Field",city:"Seattle",country:"USA",flag:"us",cap:68740,role:"Grupos"},
  {id:"STA-10",name:"Estadio Azteca",city:"Ciudad de México",country:"MEX",flag:"mx",cap:87523,role:"Inauguración"},
  {id:"STA-11",name:"Estadio BBVA",city:"Monterrey",country:"MEX",flag:"mx",cap:53500,role:"Grupos"},
  {id:"STA-12",name:"Estadio Akron",city:"Guadalajara",country:"MEX",flag:"mx",cap:49850,role:"Grupos"},
  {id:"STA-13",name:"BC Place",city:"Vancouver",country:"CAN",flag:"ca",cap:54500,role:"Octavos"},
  {id:"STA-14",name:"BMO Field",city:"Toronto",country:"CAN",flag:"ca",cap:45000,role:"Grupos"},
  {id:"STA-15",name:"Stade Olympique",city:"Montréal",country:"CAN",flag:"ca",cap:61004,role:"Grupos"},
  {id:"STA-16",name:"NRG Stadium",city:"Houston",country:"USA",flag:"us",cap:72220,role:"Octavos"},
];

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
