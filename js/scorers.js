// ═══ SCORERS HISTÓRICOS ═══
const SCORERS = {
  ARG:[
    {name:'Lionel Messi',      goals:13, apps:26, era:'2006–2022', e:'🐐'},
    {name:'Gabriel Batistuta', goals:10, apps:12, era:'1994–2002', e:'🦁'},
    {name:'Diego Maradona',    goals:8,  apps:21, era:'1982–1994', e:'✋'},
    {name:'Guillermo Stábile', goals:8,  apps:4,  era:'1930',      e:'⚽'},
    {name:'Gonzalo Higuaín',   goals:6,  apps:11, era:'2010–2018', e:'🎯'},
  ],
  BRA:[
    {name:'Ronaldo Nazário',   goals:15, apps:19, era:'1994–2006', e:'🌟'},
    {name:'Pelé',              goals:12, apps:14, era:'1958–1970', e:'👑'},
    {name:'Vavá',              goals:9,  apps:10, era:'1954–1962', e:'⭐'},
    {name:'Rivaldo',           goals:8,  apps:14, era:'1998–2002', e:'🎩'},
    {name:'Jairzinho',         goals:7,  apps:7,  era:'1966–1974', e:'🔥'},
  ],
  ALE:[
    {name:'Miroslav Klose',    goals:16, apps:24, era:'2002–2014', e:'🏆'},
    {name:'Gerd Müller',       goals:14, apps:13, era:'1970–1974', e:'🐆'},
    {name:'Karl-Heinz Rummenigge',goals:9,apps:10,era:'1978–1986', e:'⭐'},
    {name:'Helmut Rahn',       goals:8,  apps:6,  era:'1950–1958', e:'🎯'},
    {name:'Jürgen Klinsmann',  goals:8,  apps:17, era:'1990–1998', e:'✈️'},
  ],
  FRA:[
    {name:'Just Fontaine',     goals:13, apps:6,  era:'1958',      e:'🦅'},
    {name:'Thierry Henry',     goals:6,  apps:12, era:'1998–2010', e:'⚡'},
    {name:'Kylian Mbappé',     goals:12, apps:14, era:'2018–2022', e:'💨'},
    {name:'Michel Platini',    goals:5,  apps:14, era:'1978–1986', e:'🎨'},
    {name:'Antoine Griezmann', goals:7,  apps:14, era:'2014–2022', e:'🕺'},
  ],
  ING:[
    {name:'Gary Lineker',      goals:10, apps:12, era:'1982–1990', e:'🦁'},
    {name:'Harry Kane',        goals:8,  apps:12, era:'2018–2022', e:'👑'},
    {name:'Geoff Hurst',       goals:5,  apps:3,  era:'1966',      e:'🏆'},
    {name:'Martin Peters',     goals:4,  apps:5,  era:'1966–1970', e:'⭐'},
    {name:'Bryan Robson',      goals:4,  apps:10, era:'1982–1990', e:'💪'},
  ],
  COL:[
    {name:'James Rodríguez',   goals:6,  apps:8,  era:'2014–2018', e:'⭐'},
    {name:'Carlos Valderrama', goals:0,  apps:11, era:'1990–1998', e:'👨‍🦱'},
    {name:'Falcao García',     goals:0,  apps:0,  era:'2014',      e:'🐯'},
    {name:'Iván Valenciano',   goals:3,  apps:6,  era:'1990–1998', e:'🎯'},
    {name:'Luis Díaz',         goals:1,  apps:4,  era:'2018–',     e:'⚡'},
  ],
  ESP:[
    {name:'David Villa',       goals:9,  apps:12, era:'2006–2014', e:'🎯'},
    {name:'Raúl González',     goals:7,  apps:11, era:'1998–2006', e:'👑'},
    {name:'Emilio Butragueño', goals:6,  apps:7,  era:'1986–1990', e:'🦅'},
    {name:'Andrés Iniesta',    goals:2,  apps:12, era:'2006–2018', e:'🏆'},
    {name:'Fernando Torres',   goals:6,  apps:12, era:'2006–2014', e:'⚡'},
  ],
  POR:[
    {name:'Cristiano Ronaldo', goals:8,  apps:22, era:'2006–2022', e:'🐐'},
    {name:'Eusébio',           goals:9,  apps:6,  era:'1966',      e:'🦁'},
    {name:'Pauleta',           goals:5,  apps:9,  era:'2002–2006', e:'⭐'},
    {name:'Rui Costa',         goals:2,  apps:10, era:'1994–2002', e:'🎨'},
    {name:'Rafael Leão',       goals:1,  apps:4,  era:'2022–',     e:'⚡'},
  ],
  URU:[
    {name:'Oscar Míguez',      goals:8,  apps:9,  era:'1950–1954', e:'⭐'},
    {name:'Héctor Scarone',    goals:8,  apps:8,  era:'1930',      e:'🌟'},
    {name:'Luis Suárez',       goals:7,  apps:13, era:'2010–2022', e:'🦷'},
    {name:'Diego Forlán',      goals:6,  apps:13, era:'2002–2014', e:'💫'},
    {name:'Darwin Núñez',      goals:2,  apps:4,  era:'2022–',     e:'🔥'},
  ],
  MEX:[
    {name:'Javier Hernández',  goals:10, apps:16, era:'2010–2022', e:'🌮'},
    {name:'Luis Hernández',    goals:5,  apps:10, era:'1994–1998', e:'🐝'},
    {name:'Cuauhtémoc Blanco', goals:4,  apps:10, era:'1994–2010', e:'🎩'},
    {name:'Carlos Hermosillo', goals:3,  apps:3,  era:'1994',      e:'⭐'},
    {name:'Hirving Lozano',    goals:2,  apps:8,  era:'2018–2022', e:'⚡'},
  ],
  USA:[
    {name:'Clint Dempsey',     goals:4,  apps:12, era:'2006–2014', e:'🦅'},
    {name:'Landon Donovan',    goals:5,  apps:12, era:'2002–2010', e:'⭐'},
    {name:'Brian McBride',     goals:5,  apps:8,  era:'1994–2006', e:'💪'},
    {name:'Eric Wynalda',      goals:3,  apps:6,  era:'1990–1998', e:'🔥'},
    {name:'Christian Pulisic', goals:1,  apps:4,  era:'2018–2022', e:'⚡'},
  ],
  CAN:[
    {name:'Alphonso Davies',   goals:1,  apps:3,  era:'2022–',     e:'⭐'},
    {name:'Jonathan David',    goals:1,  apps:3,  era:'2022–',     e:'🍁'},
    {name:'John Herdman',      goals:0,  apps:0,  era:'—',         e:'🏒'},
    {name:'Cyle Larin',        goals:1,  apps:3,  era:'2022–',     e:'🔥'},
    {name:'Tajon Buchanan',    goals:0,  apps:3,  era:'2022–',     e:'⚡'},
  ],
  HOL:[
    {name:'Rob Rensenbrink',   goals:6,  apps:9,  era:'1974–1978', e:'🟠'},
    {name:'Johan Neeskens',    goals:5,  apps:8,  era:'1974–1978', e:'⭐'},
    {name:'Johnny Rep',        goals:7,  apps:9,  era:'1974–1978', e:'🌟'},
    {name:'Arjen Robben',      goals:6,  apps:13, era:'2006–2014', e:'🏃'},
    {name:'Cody Gakpo',        goals:3,  apps:5,  era:'2022–',     e:'⚡'},
  ],
  BEL:[
    {name:'Romelu Lukaku',     goals:4,  apps:9,  era:'2014–2022', e:'💪'},
    {name:'Marc Wilmots',      goals:3,  apps:10, era:'1990–2002', e:'⭐'},
    {name:'Kevin De Bruyne',   goals:2,  apps:10, era:'2014–2022', e:'🎨'},
    {name:'Jan Ceulemans',     goals:7,  apps:11, era:'1982–1990', e:'🏋️'},
    {name:'Dries Mertens',     goals:3,  apps:7,  era:'2014–2022', e:'🔥'},
  ],
  CRO:[
    {name:'Davor Šuker',       goals:6,  apps:8,  era:'1994–1998', e:'🎯'},
    {name:'Ivan Perišić',      goals:5,  apps:14, era:'2014–2022', e:'⚡'},
    {name:'Mario Mandžukić',   goals:5,  apps:12, era:'2014–2018', e:'💪'},
    {name:'Luka Modrić',       goals:2,  apps:17, era:'2006–2022', e:'👑'},
    {name:'Eduardo da Silva',  goals:3,  apps:7,  era:'2006–2014', e:'⭐'},
  ],
  MAR:[
    {name:'Salaheddine Bassir', goals:2, apps:3,  era:'1998',      e:'🌙'},
    {name:'Brahim Hemdani',    goals:1,  apps:3,  era:'1998–2006', e:'⭐'},
    {name:'Youssef En-Nesyri', goals:3,  apps:5,  era:'2018–2022', e:'🔥'},
    {name:'Hakim Ziyech',      goals:1,  apps:8,  era:'2018–2022', e:'🌟'},
    {name:'Achraf Hakimi',     goals:1,  apps:5,  era:'2018–2022', e:'⚡'},
  ],
  SEN:[
    {name:'Henri Camara',      goals:3,  apps:5,  era:'2002',      e:'🦁'},
    {name:'El Hadji Diouf',    goals:1,  apps:4,  era:'2002',      e:'⭐'},
    {name:'Sadio Mané',        goals:1,  apps:5,  era:'2018–2022', e:'🌟'},
    {name:'Ismaïla Sarr',      goals:1,  apps:3,  era:'2022–',     e:'⚡'},
    {name:'Famara Diédhiou',   goals:1,  apps:3,  era:'2022–',     e:'🔥'},
  ],
  ECU:[
    {name:'Enner Valencia',    goals:7,  apps:10, era:'2014–2022', e:'🔥'},
    {name:'Agustín Delgado',   goals:3,  apps:6,  era:'2002–2006', e:'⭐'},
    {name:'Carlos Tenorio',    goals:2,  apps:6,  era:'2002–2006', e:'🎯'},
    {name:'Felipe Caicedo',    goals:2,  apps:5,  era:'2014–',     e:'💪'},
    {name:'Moisés Caicedo',    goals:0,  apps:3,  era:'2022–',     e:'⚙️'},
  ],
  KOR:[
    {name:'Ahn Jung-hwan',     goals:2,  apps:7,  era:'2002–2006', e:'⭐'},
    {name:'Park Ji-sung',      goals:2,  apps:11, era:'2002–2010', e:'🌟'},
    {name:'Hwang Hee-chan',     goals:2,  apps:5,  era:'2018–2022', e:'🔥'},
    {name:'Son Heung-min',     goals:2,  apps:10, era:'2014–2022', e:'⭐'},
    {name:'Cha Bum-kun',       goals:2,  apps:5,  era:'1978–1986', e:'💪'},
  ],
  JAP:[
    {name:'Miroslav Klose',    goals:0,  apps:0,  era:'—',         e:''},
    {name:'Shunsuke Nakamura', goals:1,  apps:5,  era:'1998–2006', e:'⭐'},
    {name:'Shinji Okazaki',    goals:3,  apps:9,  era:'2010–2018', e:'🔥'},
    {name:'Keisuke Honda',     goals:4,  apps:12, era:'2010–2018', e:'🏍️'},
    {name:'Inamoto Junichi',   goals:2,  apps:7,  era:'2002–2006', e:'🌸'},
  ],
  AUT:[
    {name:'Hans Krankl',       goals:7,  apps:6,  era:'1978–1982', e:'⭐'},
    {name:'Gerhard Hanappi',   goals:5,  apps:8,  era:'1954–1958', e:'🌟'},
    {name:'Theodor Wagner',    goals:4,  apps:5,  era:'1934–1954', e:'💪'},
    {name:'Marc Janko',        goals:2,  apps:7,  era:'2010–2014', e:'🔥'},
    {name:'Marko Arnautovic',  goals:2,  apps:9,  era:'2014–2022', e:'⚡'},
  ],
  SUI:[
    {name:'Josef Hügi',        goals:6,  apps:5,  era:'1954',      e:'⭐'},
    {name:'Alexander Frei',    goals:4,  apps:7,  era:'2006–2010', e:'🌟'},
    {name:'Max Abegglen',      goals:6,  apps:5,  era:'1934–1938', e:'💫'},
    {name:'Haris Seferovic',   goals:3,  apps:7,  era:'2014–2022', e:'🔥'},
    {name:'Xherdan Shaqiri',   goals:5,  apps:13, era:'2014–2022', e:'⚡'},
  ],
  NOR:[
    {name:'Jørgen Juve',       goals:4,  apps:5,  era:'1934–1938', e:'⭐'},
    {name:'Tore André Flo',    goals:2,  apps:5,  era:'1994–1998', e:'🌟'},
    {name:'Erling Haaland',    goals:0,  apps:0,  era:'2026–',     e:'🔱'},
    {name:'Ole Gunnar Solskjær',goals:2, apps:5,  era:'1994–1998', e:'🦋'},
    {name:'Harald Martin Brattbakk',goals:1,apps:4,era:'1994–1998',e:'🔥'},
  ],
  CRO:[
    {name:'Davor Šuker',       goals:6,  apps:8,  era:'1994–1998', e:'🎯'},
    {name:'Ivan Perišić',      goals:5,  apps:14, era:'2014–2022', e:'⚡'},
    {name:'Mario Mandžukić',   goals:5,  apps:12, era:'2014–2018', e:'💪'},
    {name:'Luka Modrić',       goals:2,  apps:17, era:'2006–2022', e:'👑'},
    {name:'Eduardo da Silva',  goals:3,  apps:7,  era:'2006–2014', e:'⭐'},
  ],
  PAR:[
    {name:'José Cardozo',      goals:3,  apps:8,  era:'1998–2006', e:'⭐'},
    {name:'Roberto Cabañas',   goals:3,  apps:8,  era:'1986–1998', e:'🌟'},
    {name:'Miguel Almirón',    goals:0,  apps:0,  era:'2026–',     e:'💫'},
    {name:'Roque Santa Cruz',  goals:5,  apps:12, era:'2002–2010', e:'🔥'},
    {name:'Oscar Romero',      goals:1,  apps:4,  era:'2010–',     e:'⚡'},
  ],
  ALG:[
    {name:'Islam Slimani',     goals:2,  apps:7,  era:'2014–2022', e:'🦊'},
    {name:'Lakhdar Belloumi',  goals:2,  apps:3,  era:'1982–1986', e:'⭐'},
    {name:'Riyad Mahrez',      goals:2,  apps:10, era:'2014–2022', e:'🌟'},
    {name:'Yacine Brahimi',    goals:1,  apps:3,  era:'2014',      e:'🔥'},
    {name:'Djamel Zidane',     goals:2,  apps:3,  era:'1982–1986', e:'💫'},
  ],
  EGI:[
    {name:'Hossam Hassan',     goals:3,  apps:4,  era:'1990–2018', e:'🦅'},
    {name:'Mohamed Salah',     goals:1,  apps:4,  era:'2018–',     e:'⚡'},
    {name:'Mostafa Mohamed',   goals:0,  apps:2,  era:'2018–',     e:'🔥'},
    {name:'Amr Zaki',          goals:1,  apps:3,  era:'2006–',     e:'⭐'},
    {name:'Essam El-Hadary',   goals:0,  apps:4,  era:'1990–2018', e:'🧤'},
  ],
  GHA:[
    {name:'Asamoah Gyan',      goals:6,  apps:15, era:'2006–2014', e:'⭐'},
    {name:'Abedi Pelé',        goals:2,  apps:3,  era:'1994–2006', e:'🌟'},
    {name:'André Ayew',        goals:2,  apps:9,  era:'2010–2022', e:'🔥'},
    {name:'Jordan Ayew',       goals:1,  apps:6,  era:'2014–2022', e:'💪'},
    {name:'Sulley Muntari',    goals:1,  apps:9,  era:'2006–2014', e:'⚡'},
  ],
  CIV:[
    {name:'Didier Drogba',     goals:2,  apps:9,  era:'2006–2014', e:'🐘'},
    {name:'Salomon Kalou',     goals:2,  apps:9,  era:'2006–2014', e:'⭐'},
    {name:'Gervinho',          goals:2,  apps:9,  era:'2010–2014', e:'⚡'},
    {name:'Wilfried Bony',     goals:1,  apps:5,  era:'2010–2014', e:'🔥'},
    {name:'Sébastien Haller',  goals:0,  apps:0,  era:'2026–',     e:'🌟'},
  ],
  TUN:[
    {name:'Zoubeir Baya',      goals:2,  apps:4,  era:'1978',      e:'🦅'},
    {name:'Wahbi Khazri',      goals:1,  apps:6,  era:'2018–2022', e:'⭐'},
    {name:'Sami Trabelsi',     goals:2,  apps:4,  era:'1978–1998', e:'🌟'},
    {name:'Issam Jemaa',       goals:1,  apps:3,  era:'2006–2010', e:'🔥'},
    {name:'Youssef Msakni',    goals:1,  apps:6,  era:'2018–',     e:'⚡'},
  ],
  SAF:[
    {name:'Benni McCarthy',    goals:1,  apps:6,  era:'1998–2010', e:'⭐'},
    {name:'Quinton Fortune',   goals:0,  apps:5,  era:'1998–2002', e:'🌟'},
    {name:'Siyabonga Nomvete', goals:1,  apps:3,  era:'1998–2002', e:'🔥'},
    {name:'Steven Pienaar',    goals:0,  apps:6,  era:'2002–2010', e:'💪'},
    {name:'Percy Tau',         goals:0,  apps:0,  era:'2026–',     e:'🦁'},
  ],
  IRA:[
    {name:'Ali Daei',          goals:4,  apps:14, era:'1998–2006', e:'🦁'},
    {name:'Sardar Azmoun',     goals:2,  apps:7,  era:'2018–2022', e:'🔥'},
    {name:'Karim Bagheri',     goals:4,  apps:10, era:'1998–2006', e:'⭐'},
    {name:'Javad Nekounam',    goals:2,  apps:12, era:'2006–2014', e:'💪'},
    {name:'Reza Ghoochannejhad',goals:2, apps:4,  era:'2014–',     e:'🌟'},
  ],
  ARS:[
    {name:'Sami Al-Jaber',     goals:4,  apps:11, era:'1994–2006', e:'🌙'},
    {name:'Yasser Al-Qahtani', goals:1,  apps:4,  era:'2006–2010', e:'⭐'},
    {name:'Salem Al-Dawsari',  goals:1,  apps:5,  era:'2022–',     e:'⚡'},
    {name:'Mohammed Al-Deayea',goals:0,  apps:12, era:'1994–2006', e:'🧤'},
    {name:'Nayef Al-Qadi',     goals:1,  apps:3,  era:'1994–2002', e:'🔥'},
  ],
  AUS:[
    {name:'Tim Cahill',        goals:5,  apps:11, era:'2006–2014', e:'🦘'},
    {name:'Harry Kewell',      goals:4,  apps:10, era:'2006–2010', e:'⭐'},
    {name:'Mark Viduka',       goals:3,  apps:7,  era:'2002–2006', e:'🌟'},
    {name:'John Aloisi',       goals:3,  apps:9,  era:'2002–2006', e:'🔥'},
    {name:'Archie Thompson',   goals:1,  apps:2,  era:'2002–2010', e:'💪'},
  ],
  NZL:[
    {name:'Shane Smeltz',      goals:2,  apps:5,  era:'2010',      e:'🥝'},
    {name:'Chris Wood',        goals:0,  apps:0,  era:'2026–',     e:'⭐'},
    {name:'Wynton Rufer',      goals:2,  apps:4,  era:'1982',      e:'🌟'},
    {name:'Steve Sumner',      goals:1,  apps:5,  era:'1982',      e:'💪'},
    {name:'Brian Turner',      goals:1,  apps:3,  era:'1982',      e:'🔥'},
  ],
  TUR:[
    {name:'Hakan Şükür',       goals:7,  apps:7,  era:'1994–2002', e:'🦁'},
    {name:'Tuncay Şanlı',      goals:3,  apps:6,  era:'2002–2008', e:'⭐'},
    {name:'İlhan Mansız',      goals:3,  apps:4,  era:'2002',      e:'🌟'},
    {name:'Hakan Çalhanoğlu',  goals:0,  apps:0,  era:'2026–',     e:'⚙️'},
    {name:'Arda Turan',        goals:2,  apps:7,  era:'2010–2014', e:'🔥'},
  ],
  SWE:[
    {name:'Sven Rydell',       goals:8,  apps:5,  era:'1934',      e:'⭐'},
    {name:'Gunnar Nordahl',    goals:6,  apps:4,  era:'1950',      e:'🌟'},
    {name:'Zlatan Ibrahimović', goals:0, apps:6,  era:'2002–2018', e:'🦁'},
    {name:'Henrik Larsson',    goals:7,  apps:11, era:'2002–2006', e:'💫'},
    {name:'Viktor Gyökeres',   goals:0,  apps:0,  era:'2026–',     e:'🔥'},
  ],
  RCH:[
    {name:'Oldřich Nejedlý',   goals:7,  apps:4,  era:'1934',      e:'⭐'},
    {name:'Antonín Puč',       goals:5,  apps:4,  era:'1934',      e:'🌟'},
    {name:'Patrik Schick',     goals:2,  apps:5,  era:'2018–2022', e:'💫'},
    {name:'Milan Baroš',       goals:5,  apps:9,  era:'2006',      e:'🔥'},
    {name:'Jan Koller',        goals:4,  apps:9,  era:'2006',      e:'💪'},
  ],
  BOS:[
    {name:'Edin Džeko',        goals:3,  apps:3,  era:'2014',      e:'🐉'},
    {name:'Vedad Ibišević',    goals:1,  apps:3,  era:'2014',      e:'⭐'},
    {name:'Miralem Pjanić',    goals:0,  apps:3,  era:'2014',      e:'⚙️'},
    {name:'Avdija Vršajević',  goals:0,  apps:3,  era:'2014',      e:'💪'},
    {name:'Sejad Salihović',   goals:0,  apps:3,  era:'2014',      e:'🌟'},
  ],
  CPV:[
    {name:'Ryan Mendes',       goals:0,  apps:0,  era:'2026–',     e:'🦈'},
    {name:'Garry Rodrigues',   goals:0,  apps:0,  era:'2026–',     e:'⭐'},
    {name:'Bryan Teixeira',    goals:0,  apps:0,  era:'2026–',     e:'🌟'},
    {name:'Stopira',           goals:0,  apps:0,  era:'2026–',     e:'💪'},
    {name:'Lisandro',          goals:0,  apps:0,  era:'2026–',     e:'🔥'},
  ],
  CUW:[
    {name:'Leandro Bacuna',    goals:0,  apps:0,  era:'2026–',     e:'🏝️'},
    {name:'Cuco Martina',      goals:0,  apps:0,  era:'2026–',     e:'⭐'},
    {name:'Eloy Room',         goals:0,  apps:0,  era:'2026–',     e:'🧤'},
    {name:'Gevaro Nepomuceno', goals:0,  apps:0,  era:'2026–',     e:'⚡'},
    {name:'Rangelo Janga',     goals:0,  apps:0,  era:'2026–',     e:'🌟'},
  ],
  HAI:[
    {name:'Emmanuel Sanon',    goals:2,  apps:4,  era:'1974',      e:'⭐'},
    {name:'Ernst Jean-Joseph', goals:1,  apps:3,  era:'1974',      e:'🌟'},
    {name:'Frantzdy Pierrot',  goals:0,  apps:0,  era:'2026–',     e:'⚡'},
    {name:'Duckens Nazon',     goals:0,  apps:0,  era:'2026–',     e:'🔥'},
    {name:'Kervens Belfort',   goals:0,  apps:0,  era:'2026–',     e:'💪'},
  ],
  JOR:[
    {name:'Musa Al-Tamari',    goals:0,  apps:0,  era:'2026–',     e:'⚔️'},
    {name:'Baha Faisal',       goals:0,  apps:0,  era:'2026–',     e:'⭐'},
    {name:'Yazan Al-Naimat',   goals:0,  apps:0,  era:'2026–',     e:'🌟'},
    {name:'Ahmad Hayel',       goals:0,  apps:0,  era:'2026–',     e:'🔥'},
    {name:'Abdallah Nasib',    goals:0,  apps:0,  era:'2026–',     e:'💫'},
  ],
  UZB:[
    {name:'Jasur Yakhshiboev', goals:0,  apps:0,  era:'2026–',     e:'🐺'},
    {name:'Eldor Shomurodov',  goals:0,  apps:0,  era:'2026–',     e:'⭐'},
    {name:'Dostonbek Khamdamov',goals:0, apps:0,  era:'2026–',     e:'🌟'},
    {name:'Otabek Shukurov',   goals:0,  apps:0,  era:'2026–',     e:'🔥'},
    {name:'Laziz Azimov',      goals:0,  apps:0,  era:'2026–',     e:'💪'},
  ],
  CAT:[
    {name:'Akram Afif',        goals:1,  apps:3,  era:'2022–',     e:'🌙'},
    {name:'Almoez Ali',        goals:1,  apps:3,  era:'2022–',     e:'⭐'},
    {name:'Abdelkarim Hassan', goals:0,  apps:3,  era:'2022–',     e:'💪'},
    {name:'Hassan Al-Haydos',  goals:0,  apps:3,  era:'2022–',     e:'🌟'},
    {name:'Mohammed Muntari',  goals:1,  apps:3,  era:'2022–',     e:'🔥'},
  ],
  RDC:[
    {name:'Ndaye Mulamba',     goals:9,  apps:6,  era:'1974',      e:'🐆'},
    {name:'Mwamba Kazadi',     goals:0,  apps:3,  era:'1974',      e:'⭐'},
    {name:'Cédric Bakambu',    goals:0,  apps:0,  era:'2026–',     e:'🌟'},
    {name:'Chancel Mbemba',    goals:0,  apps:0,  era:'2026–',     e:'💪'},
    {name:'Yannick Bolasie',   goals:0,  apps:0,  era:'2026–',     e:'⚡'},
  ],
  IRA2:[
    {name:'Haidar Abdul-Razzaq',goals:1, apps:3,  era:'1986',      e:'🦁'},
    {name:'Amjad Attwan',      goals:0,  apps:0,  era:'2026–',     e:'⭐'},
    {name:'Alaa Abdul-Zahra',  goals:0,  apps:3,  era:'1986',      e:'🌟'},
    {name:'Basil Gorgis',      goals:0,  apps:3,  era:'1986',      e:'🔥'},
    {name:'Ahmad Radhi',       goals:1,  apps:3,  era:'1986',      e:'💪'},
  ],
  ESC:[
    {name:'Joe Jordan',        goals:4,  apps:8,  era:'1974–1982', e:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
    {name:'Denis Law',         goals:3,  apps:5,  era:'1974',      e:'⭐'},
    {name:'Kenny Dalglish',    goals:6,  apps:11, era:'1974–1982', e:'🌟'},
    {name:'Archie Gemmill',    goals:2,  apps:8,  era:'1974–1978', e:'💫'},
    {name:'Andrew Robertson',  goals:0,  apps:0,  era:'2026–',     e:'🛡️'},
  ],
  PAN:[
    {name:'Rommel Fernández',  goals:1,  apps:3,  era:'2018',      e:'⭐'},
    {name:'Blas Pérez',        goals:1,  apps:3,  era:'2018',      e:'🌟'},
    {name:'Gabriel Torres',    goals:1,  apps:3,  era:'2018',      e:'🔥'},
    {name:'Ismael Díaz',       goals:0,  apps:0,  era:'2026–',     e:'⚡'},
    {name:'Adolfo Machado',    goals:0,  apps:3,  era:'2018',      e:'💪'},
  ],
  VEN:[
    {name:'Salomón Rondón',    goals:0,  apps:0,  era:'2026–',     e:'🌟'},
    {name:'Josef Martínez',    goals:0,  apps:0,  era:'2026–',     e:'⭐'},
    {name:'Darwin Machís',     goals:0,  apps:0,  era:'2026–',     e:'⚡'},
    {name:'Yeferson Soteldo',  goals:0,  apps:0,  era:'2026–',     e:'🔥'},
    {name:'Tomás Rincón',      goals:0,  apps:0,  era:'2026–',     e:'💪'},
  ],
};

function renderCountry(page, code) {
  const c = COUNTRIES.find(x=>x.code===code);
  if(!c){ page.innerHTML='<p>País no encontrado</p>'; return; }

  const byPos = {POR:[],DEF:[],MED:[],DEL:[]};
  c.players.forEach(p => (byPos[p.pos]||byPos.DEL).push(p));
  const posLabels = {POR:'🧤 Porteros',DEF:'🛡️ Defensas',MED:'⚙️ Mediocampistas',DEL:'⚽ Delanteros'};

  const owned = c.players.filter(p=>state.collected.has(p.id)).length;
  const pct = Math.round((owned/c.players.length)*100);

  // Timeline
  let timelineHTML = '';
  if(c.timeline && c.timeline.length) {
    timelineHTML = `<div class="section-label">⏱ Historial mundialista</div>
    <div class="timeline-wrap"><div class="timeline-track">`;
    c.timeline.forEach(t => {
      timelineHTML += `<div class="timeline-item ${t.type}">
        <div class="ti-year">${t.year}</div>
        <div class="ti-result ${t.type}">${t.result}</div>
      </div>`;
    });
    timelineHTML += `</div></div>`;
  }

  // ── Scorers ──
  let scorersHTML = '';
  const scorerList = SCORERS[c.code];
  if(scorerList && scorerList.length) {
    const maxGoals = Math.max(...scorerList.map(s=>s.goals), 1);
    const rankClass = ['top1','top2','top3','',''];
    const rankSymbol = ['1','2','3','4','5'];
    const goalClass = ['g1','g2','g3','g4','g4'];
    scorersHTML = `<div class="section-label" style="margin-top:4px;">⚽ Goleadores históricos mundialistas</div>
    <div class="scorers-section">
      <div class="scorers-grid">
        ${scorerList.map((s,i) => {
          const barPct = maxGoals > 0 ? Math.round((s.goals/maxGoals)*100) : 0;
          return `<div class="scorer-card ${rankClass[i]||''}">
            <div class="scorer-rank r${i<3?i+1:4}">${rankSymbol[i]}</div>
            <div class="scorer-emoji">${s.e}</div>
            <div class="scorer-info">
              <div class="scorer-name">${s.name}</div>
              <div class="scorer-era">${s.era}</div>
              ${s.apps>0?`<span class="scorer-appearances">${s.apps} partidos mundialistas</span>`:'<span class="scorer-appearances">Debut en 2026</span>'}
            </div>
            <div class="scorer-goals-wrap">
              <div class="scorer-goals ${goalClass[i]||'g4'}">${s.goals}</div>
              <div class="scorer-goals-label">GOLES</div>
            </div>
            <div class="scorer-bar" style="width:${barPct}%"></div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  let playersHTML = '';
  ['POR','DEF','MED','DEL'].forEach(pos => {
    if(!byPos[pos].length) return;
    playersHTML += `<div class="section-label" style="margin-top:4px;">${posLabels[pos]}</div><div class="stickers-grid">`;
    byPos[pos].forEach(p => {
      const has = state.collected.has(p.id);
      const dupCount = state.duplicates[p.id]||0;
      playersHTML += `<div class="sticker-slot ${p.rarity}${has?' collected':''}" onclick="toggleSticker('${p.id}','${code}')">
        <div class="slot-number">#${p.id.split('-')[1]}</div>
        <div class="slot-rarity-dot"></div>
        ${dupCount>0?`<div class="slot-duplicate-badge">×${dupCount+1}</div>`:''}
        ${has
          ? `<div class="slot-silhouette">${p.e}</div>`
          : `<div class="slot-empty-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>`}
        <div class="slot-info">
          <div class="slot-name">${has?p.name:'???'}</div>
          <div class="slot-club">${has?p.club:'Falta conseguir'}</div>
          <div class="slot-pos-row"><span class="slot-pos pos-${p.pos}">${p.pos}</span>${p.rarity!=='common'?`<span style="font-size:7px;color:var(--${p.rarity==='icon'?'icon':'legendary'}-c);font-family:var(--fm)">${p.rarity.toUpperCase()}</span>`:''}</div>
        </div>
      </div>`;
    });
    playersHTML += '</div>';
  });

  page.innerHTML = `<div class="page-enter">
    <div class="country-header">
      <div class="country-flag-big">${flagImg(c.flag,'')}</div>
      <div class="country-title">
        <h1>${c.name.toUpperCase()}</h1>
        <div class="conf">${c.conf} · GRUPO ${c.group}</div>
        <div class="history">${c.history}</div>
      </div>
      <div class="country-stats">
        <div class="stat-item">Mundiales: <strong>${c.world_cups}</strong></div>
        <div class="stat-item">Fundación: <strong>${c.founded}</strong></div>
        <div class="stat-item">Mejor resultado: <strong>${c.best}</strong></div>
        <div class="stat-item" style="margin-top:6px;color:var(--green)">Láminas: <strong>${owned}/${c.players.length}</strong></div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-stat"><div class="label">MUNDIALES</div><div class="value">${c.world_cups}</div><div class="sub">Participaciones</div></div>
      <div class="info-stat"><div class="label">FUNDACIÓN</div><div class="value">${c.founded}</div><div class="sub">Año de creación</div></div>
      <div class="info-stat"><div class="label">PÁGINA</div><div class="value">${pct}<span style="font-size:14px;color:var(--muted)">%</span></div><div class="sub">Completada</div></div>
    </div>

    ${timelineHTML}
    ${playersHTML}
  </div>`;
}

window.toggleSticker = function(id, countryCode) {
  const alreadyHad = state.collected.has(id);
  if(alreadyHad) {
    if(state.duplicates[id] && state.duplicates[id]>0) {
      state.duplicates[id]--;
      if(state.duplicates[id]===0) delete state.duplicates[id];
      toast('Duplicado removido');
    } else {
      state.collected.delete(id);
      toast('Lámina removida');
    }
  } else {
    state.collected.add(id);
    toast('¡Lámina pegada! ✓', 'success');
  }
  saveState(); updateProgress();
  navigate('country', countryCode);
};

// ═══════════════════════════════════════════════════════════
// STANDINGS PAGE
// ═══════════════════════════════════════════════════════════
function getStandings(groupCode) {
  const countries = COUNTRIES.filter(c=>c.group===groupCode);
  const st = state.standings[groupCode] || {};
  return countries.map(c => {
    const d = st[c.code] || {pj:0,pg:0,pe:0,pp:0,gf:0,gc:0};
    return {
      ...c,
      pj: d.pj||0, pg: d.pg||0, pe: d.pe||0, pp: d.pp||0,
      gf: d.gf||0, gc: d.gc||0,
      pts: (d.pg||0)*3 + (d.pe||0),
      dif: (d.gf||0) - (d.gc||0),
    };
  }).sort((a,b) => b.pts-a.pts || b.dif-a.dif || b.gf-a.gf);
}

function renderStandings(page) {
  let html = `<div class="page-enter">
    <div style="font-family:var(--fd);font-size:38px;letter-spacing:3px;margin-bottom:4px;">POSICIONES</div>
    <div style="font-size:11px;color:var(--muted);font-family:var(--fm);margin-bottom:24px;">Haz clic en el marcador de un partido para ingresar el resultado</div>`;

  GROUPS_ORDER.forEach(g => {
    const gcs = COUNTRIES.filter(c=>c.group===g);
    if(!gcs.length) return;
    const table = getStandings(g);

    html += `<div class="standings-group-title">GRUPO ${g} <span>${gcs.map(c=>c.name).join(' · ')}</span></div>
    <table class="standings-table">
      <thead><tr>
        <th style="width:40px">#</th><th style="text-align:left">Equipo</th>
        <th>PJ</th><th>PG</th><th>PE</th><th>PP</th>
        <th>GF</th><th>GC</th><th>DIF</th><th>PTS</th>
      </tr></thead>
      <tbody>`;

    table.forEach((t,i) => {
      const qualify = i<2;
      const gd = t.dif;
      html += `<tr>
        <td><span class="std-pos${qualify?' qualify':''}">${i+1}</span></td>
        <td><div class="std-team">${flagImg(t.flag,'std-flag')} ${t.name}</div></td>
        <td><input class="std-input" type="number" value="${t.pj}" min="0" onchange="updateStat('${g}','${t.code}','pj',this.value)"></td>
        <td><input class="std-input" type="number" value="${t.pg}" min="0" onchange="updateStat('${g}','${t.code}','pg',this.value)"></td>
        <td><input class="std-input" type="number" value="${t.pe}" min="0" onchange="updateStat('${g}','${t.code}','pe',this.value)"></td>
        <td><input class="std-input" type="number" value="${t.pp}" min="0" onchange="updateStat('${g}','${t.code}','pp',this.value)"></td>
        <td><input class="std-input" type="number" value="${t.gf}" min="0" onchange="updateStat('${g}','${t.code}','gf',this.value)"></td>
        <td><input class="std-input" type="number" value="${t.gc}" min="0" onchange="updateStat('${g}','${t.code}','gc',this.value)"></td>
        <td class="std-gd ${gd>0?'pos':gd<0?'neg':''}">${gd>0?'+':''}${gd}</td>
        <td><span class="std-pts" style="color:${qualify?'var(--green)':'var(--text)'}">${t.pts}</span></td>
      </tr>`;
    });

    html += `</tbody></table>
    <div style="font-size:9px;font-family:var(--fm);color:var(--muted);margin-bottom:28px;">
      <span style="color:var(--green)">●</span> Clasifican a octavos de final
    </div>`;
  });

  html += `</div>`;
  page.innerHTML = html;
}

window.updateStat = function(group, code, field, val) {
  if(!state.standings[group]) state.standings[group] = {};
  if(!state.standings[group][code]) state.standings[group][code] = {pj:0,pg:0,pe:0,pp:0,gf:0,gc:0};
  state.standings[group][code][field] = parseInt(val)||0;
  saveState();
  // Re-render to update PTS/DIF
  setTimeout(() => renderStandings(document.getElementById('page')), 200);
};

// ═══════════════════════════════════════════════════════════
// MINIGAME: WHO AM I?
// ═══════════════════════════════════════════════════════════
let gameState = null;

function renderGame(page) {
  page.innerHTML = `<div class="game-scene page-enter">
    <div class="game-header">
      <h2>¿QUIÉN SOY?</h2>
      <p>Adivina el jugador y gana láminas para tu álbum</p>
    </div>
    <div class="game-score-bar">
      <span>Puntos: <strong id="g-score">${state.gameScore}</strong></span>
      <span>Racha: <strong class="streak" id="g-streak">${state.gameStreak}🔥</strong></span>
      <span>Récord: <strong id="g-best">${state.gameBest}</strong></span>
    </div>
    <div id="game-main"></div>
  </div>`;

  startGameRound();
}

function startGameRound() {
  const allPlayers = COUNTRIES.flatMap(c => c.players.map(p => ({...p, countryName:c.name, flag:c.flag})));
  const players = allPlayers.filter(p=>p.rarity!=='common');
  const target = players[Math.floor(Math.random()*players.length)];

  // 3 wrong options
  const others = players.filter(p=>p.id!==target.id);
  const wrongs = [];
  while(wrongs.length<3) {
    const pick = others[Math.floor(Math.random()*others.length)];
    if(!wrongs.find(w=>w.id===pick.id)) wrongs.push(pick);
  }
  const options = [target, ...wrongs].sort(()=>Math.random()-0.5);

  gameState = {target, options, answered:false};

  const clues = [
    `${target.pos === 'POR'?'Portero':target.pos==='DEF'?'Defensa':target.pos==='MED'?'Mediocampista':'Delantero'}`,
    target.club,
    target.countryName,
    target.rarity.toUpperCase(),
  ];

  const main = document.getElementById('game-main');
  main.innerHTML = `
    <div class="mystery-card">
      <div class="slot-silhouette" style="height:220px;font-size:90px;filter:brightness(0) invert(0.1);">${target.e}</div>
      <div class="mystery-bottom">
        <div class="mystery-pos">${target.pos}</div>
        <div class="mystery-country">???</div>
      </div>
    </div>

    <div class="game-clues">
      ${clues.map((cl,i)=>`<div class="clue-tag" id="clue-${i}">💡 Pista ${i+1}</div>`).join('')}
    </div>
    <div style="margin-bottom:16px;text-align:center;">
      <button class="tb-btn" onclick="revealClue()" style="font-size:11px;padding:5px 14px;">Revelar pista (-5 pts)</button>
    </div>

    <div class="game-options" id="game-opts">
      ${options.map(o=>`<button class="game-option" onclick="answerGame('${o.id}','${target.id}')">${o.name}</button>`).join('')}
    </div>
    <div class="game-result" id="game-result"></div>
    <div id="game-next" style="display:none;text-align:center;margin-top:8px;">
      <button class="tb-btn gold" onclick="startGameRound()" style="padding:8px 20px;">Siguiente jugador ›</button>
    </div>`;

  let clueIndex = 0;
  window.revealClue = function() {
    if(clueIndex >= clues.length) return;
    const el = document.getElementById(`clue-${clueIndex}`);
    if(el) { el.textContent = clues[clueIndex]; el.classList.add('revealed'); }
    clueIndex++;
    if(!gameState.answered) {
      state.gameScore = Math.max(0, state.gameScore - 5);
      document.getElementById('g-score').textContent = state.gameScore;
    }
  };
}

window.answerGame = function(picked, correct) {
  if(gameState.answered) return;
  gameState.answered = true;
  const isCorrect = picked === correct;
  const opts = document.querySelectorAll('.game-option');
  opts.forEach(o => {
    o.disabled = true;
    const pid = o.onclick.toString().match(/'([^']+)'/)?.[1];
  });

  // Mark correct/wrong
  document.querySelectorAll('.game-option').forEach(btn => {
    const txt = btn.textContent;
    const t = gameState.target;
    const o = gameState.options.find(x=>x.name===txt);
    if(!o) return;
    if(o.id === correct) btn.classList.add('correct');
    else if(o.id === picked && !isCorrect) btn.classList.add('wrong');
  });

  const pts = isCorrect ? (10 + state.gameStreak * 5) : 0;
  if(isCorrect) {
    state.gameScore += pts;
    state.gameStreak++;
    if(state.gameScore > state.gameBest) state.gameBest = state.gameScore;

    // Chance to earn sticker
    const target = gameState.target;
    if(!state.collected.has(target.id) && Math.random() < 0.4) {
      state.collected.add(target.id);
      toast(`🎉 ¡Ganaste la lámina de ${target.name}!`, 'success');
    }
  } else {
    state.gameStreak = 0;
  }

  document.getElementById('g-score').textContent = state.gameScore;
  document.getElementById('g-streak').textContent = state.gameStreak + '🔥';
  document.getElementById('g-best').textContent = state.gameBest;

  const res = document.getElementById('game-result');
  res.classList.add('show');
  const t = gameState.target;
  res.innerHTML = isCorrect
    ? `<div style="color:var(--green);font-family:var(--fd);font-size:22px;">✓ ¡CORRECTO!</div>
       <div class="earned">+${pts} puntos${state.gameStreak>1?` · Racha ×${state.gameStreak}`:''}</div>
       <div style="font-size:12px;color:var(--muted);margin-top:6px;font-family:var(--fs);">${t.name} · ${t.club}</div>`
    : `<div style="color:var(--red);font-family:var(--fd);font-size:22px;">✗ INCORRECTO</div>
       <div style="font-size:13px;margin-top:6px;">Era: <strong style="color:var(--text)">${t.name}</strong> (${t.club})</div>`;

  document.getElementById('game-next').style.display = 'block';
  saveState();
  updateProgress();
};

// ═══════════════════════════════════════════════════════════
// EXCHANGE
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// MI 11 IDEAL — MINIJUEGO
// ═══════════════════════════════════════════════════════════
