/**
 * Curated pools for the CinemaVerse catalogue generator.
 *
 * Everything is stored as pipe-delimited strings and split at runtime — the
 * generator reads a few thousand words out of this file, and keeping it dense
 * makes the pools easy to audit and extend.
 */

/* ------------------------------------------------------------------ */
/* genres                                                              */
/* ------------------------------------------------------------------ */

export const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
]

const split = (value) => value.split('|').map((entry) => entry.trim()).filter(Boolean)

export const splitPool = split

/* ------------------------------------------------------------------ */
/* countries  ·  language  ·  region  ·  cast + native title banks     */
/* ------------------------------------------------------------------ */

export const COUNTRIES = [
  {
    name: 'United States',
    language: 'English',
    region: 'North America',
    first: 'Caleb|Dana|Rowan|Hollis|Wren|Jude|Maren|Dallas|Reese|Otis|Sloane|Frankie|Bode|Emerson|Casey|Remy',
    last: 'Whitlock|Halloway|Vance|Pryor|Kessler|Aldrich|Nix|Beauchamp|Downing|Sutter|Harkness|Ridley|Quill|Cabell',
  },
  {
    name: 'United Kingdom',
    language: 'English',
    region: 'Europe',
    first: 'Imogen|Arthur|Nell|Clive|Marguerite|Owen|Priya|Giles|Ruth|Bram|Freya|Desmond|Ada|Hugo|Vera|Ivor',
    last: 'Hartley|Ellery|Ransome|Thorne|Kingsley|Mabry|Fenwick|Aubrey|Pemberton|Naismith|Ashby|Crane|Castell|Dunmore',
  },
  {
    name: 'France',
    language: 'French',
    region: 'Europe',
    first: 'Camille|Théo|Brigitte|Lucien|Océane|Bastien|Élise|Marius|Nadège|Rémi|Colette|Gaspard|Solène|Antoine|Véronique|Perrine',
    last: 'Beaumont|Lachapelle|Dorval|Moreau|Sauvage|Roussel|Villeneuve|Aubert|Charpentier|Bonnaire|Lécuyer|Noirmont|Fontenay|Ducasse',
  },
  {
    name: 'Italy',
    language: 'Italian',
    region: 'Europe',
    first: 'Giulia|Francesco|Elena|Marco|Livia|Andrea|Caterina|Roberto|Sofia|Pier|Marta|Stefano|Giulio|Francesca|Alessia|Lucia',
    last: 'Bellini|Falccone|Roversi|Serraglio|Mancuso|Zanetti|Palumbo|Bruschi|Fiorentino|Radicati|Sartori|Galloni|Orsini|Ventura',
  },
  {
    name: 'Spain',
    language: 'Spanish',
    region: 'Europe',
    first: 'Lucía|Javier|Carmen|Iker|Nuria|Pablo|Rocío|Sergio|Elena|Andrés|Inés|Mateo|Vega|Álvaro|Marta|Begoña',
    last: 'Carvajal|Iglesias|Montiel|Aguirre|Delgado|Berrocal|Sanz|Peralta|Vidal|Navarro|Quesada|Espinosa|Solano|Mendiola',
  },
  {
    name: 'Germany',
    language: 'German',
    region: 'Europe',
    first: 'Johanna|Florian|Katharina|Leonhard|Brigitta|Matthias|Annelie|Sebastian|Gudrun|Jonas|Frieda|Ulrich|Käthe|Rüdiger|Dorothea|Lukas',
    last: 'Reinhardt|Hollstein|Vogt|Kellermann|Braunwald|Steinbach|Ambros|Diefenbach|Grossmann|Übele|Neumark|Rosenau|Lindhorst|Quast',
  },
  {
    name: 'Japan',
    language: 'Japanese',
    region: 'Asia',
    first: 'Haruki|Aiko|Ren|Tomoe|Yuki|Sora|Kaito|Rin|Naomi|Takeshi|Miyu|Kenji|Shiori|Haruka|Daichi|Emi',
    last: 'Takeda|Kurosawa|Mizutani|Sakuragi|Ogawa|Hoshino|Sakurai|Ishikawa|Mizuno|Tachibana|Kurosu|Hayase|Onodera|Fujimoto',
  },
  {
    name: 'South Korea',
    language: 'Korean',
    region: 'Asia',
    first: 'Ji-woo|Min-seok|Seo-yeon|Hyun|Da-eun|Joon-ho|Eun-ji|Sang-woo|Hae-won|Yong-jun|Soo-ah|Kyu-won|Young-shin|Jae-min|Cha-eyoung',
    last: 'Park|Ryu|Jeong|Bae|Yoon|Choi|Kwon|Hwang|Seong|Nam|Yoo|Lim|Moon|Yang',
  },
  {
    name: 'China',
    language: 'Mandarin',
    region: 'Asia',
    first: 'Wei-Lin|Ming-zhe|Han|Xiulan|Bo|Yue-nin|Cheng|Lian|Jian|Qinghe|Ruoxi|Haoran|Mei|Song|Dazhi',
    last: 'Zhang|Li|Zhao|Chen|Wu|Liu|Huang|Yang|Zhou|Zheng|Xu|Sun|Ma|Tan',
  },
  {
    name: 'India',
    language: 'Hindi',
    region: 'Asia',
    first: 'Aarav|Isha|Devika|Arjun|Meera|Vikram|Anjali|Rohan|Kavya|Siddharth|Neha|Aditya|Tara|Rishi|Poornima',
    last: 'Chandran|Iyer|Venkatesh|Banerjee|Nair|Kulkarni|Deshmukh|Rathore|Mehta|Bhattacharya|Chauhan|Reddy|Malhotra|Ghosh',
  },
  {
    name: 'Russia',
    language: 'Russian',
    region: 'Europe',
    first: 'Anya|Dmitri|Zoya|Ilya|Nadia|Viktor|Ksenia|Pavel|Ludmila|Arkady|Vera|Sergei|Irina|Oleg|Tamara',
    last: 'Volkov|Sokolova|Novikov|Zaytsev|Belova|Kuznetsov|Morozova|Fedorov|Orlova|Sokolov|Dragun|Karpova|Yermakov|Smirnova',
  },
  {
    name: 'Brazil',
    language: 'Portuguese',
    region: 'South America',
    first: 'Beatriz|Rafael|Luana|Thiago|Marina|Cauã|Bianca|Heitor|Ingrid|Gabriel|Yasmin|Douglas|Camila|Eduardo|Letícia',
    last: 'Albuquerque|Bastos|Coelho|Duarte|Fonseca|Guedes|Ipiranga|Machado|Nogueira|Quintana|Rezende|Sampaio|Teixeira|Vasconcelos',
  },
  {
    name: 'Mexico',
    language: 'Spanish',
    region: 'North America',
    first: 'Ximena|José Luis|Regina|Emiliano|Fátima|Iker|Carmen|Guillermo|María Fernanda|Rodrigo|Natalia|Jesús|Sofía|Héctor|Elena',
    last: 'Vazquez|Maldonado|Rivera|Cárdenas|Zamudio|Solano|Guzmán|Fuentes|Bravo|Pineda|Zepeda|Valle|Ojeda|Nolasco',
  },
  {
    name: 'Canada',
    language: 'English',
    region: 'North America',
    first: 'Aurora|Cole|Genevieve|Beau|Aiyana|Sloane|Marcus|Noor|Crystal|Étienne|Kirsten|Theo|Amara|Luc|Faye',
    last: 'Beauchemin|Tremblay|Marchetti|Kowalski|Lachance|Sinclair|Harper|Novak|Fortier|Lavoie|Brisson|Dubois|Armstrong',
  },
  {
    name: 'Sweden',
    language: 'Swedish',
    region: 'Europe',
    first: 'Elsa|Olof|Agneta|Hjalmar|Linnéa|Gustav|Maja|Björn|Signe|Rasmus|Ingrid|Torbjörn|Freja|Nils|Astrid',
    last: 'Lindqvist|Sandberg|Hedlund|Nordström|Bergqvist|Åkerlund|Lindgren|Sjöberg|Hammarström|Dahl|Vikner|Ekström|Lindholm|Rosén',
  },
  {
    name: 'Denmark',
    language: 'Danish',
    region: 'Europe',
    first: 'Ida|Niels|Signe|Magnus|Freja|Kasper|Mette|Johan|Ditte|Rasmus|Liv|Troels|Hanne|Ulrik|Maja',
    last: 'Kjeldsen|Sørensen|Holm|Dahl|Lindberg|Iversen|Nygaard|Madsen|Ravn|Bech|Kristensen|Dahlgaard|Holmberg|Nørgaard',
  },
  {
    name: 'Poland',
    language: 'Polish',
    region: 'Europe',
    first: 'Zofia|Jacek|Agnieszka|Krzysztof|Iga|Tomasz|Małgorzata|Andrzej|Weronika|Bartosz|Katarzyna|Michał|Halina|Piotr|Julia',
    last: 'Kowalczyk|Nowak|Zieliński|Szymański|Woźniak|Dąbrowska|Kaczmarek|Krawczyk|Piotrowska|Michalski|Sadowski|Gajewski|Zawadzki|Wróbel',
  },
  {
    name: 'Netherlands',
    language: 'Dutch',
    region: 'Europe',
    first: 'Sanne|Joost|Willem|Fenna|Gerrit|Nienke|Bram|Annelies|Maarten|Saskia|Ruben|Katrien|Wout|Lotte|Hendrik',
    last: 'van Doorn|de Vries|Janssen|Visser|Smeets|Van Dijk|Bakker|Vermeulen|Hendriks|Bos|Kramer|Meijer|van der Meer|Scharre',
  },
  {
    name: 'Turkey',
    language: 'Turkish',
    region: 'Europe',
    first: 'Elif|Emre|Zeynep|Kerem|Nilüfer|Burak|Tülay|Onur|Selin|Cem|Derya|Ahmet|Merve|Yusuf|Esra',
    last: 'Yılmaz|Öztürk|Doğan|Aydın|Kılıç|Aslan|Çelik|Arslan|Demir|Özdemir|Kara|Yalçın|Polat|Aksoy',
  },
  {
    name: 'Iran',
    language: 'Persian',
    region: 'Asia',
    first: 'Leila|Hamid|Roya|Omid|Shirin|Kamran|Niloofar|Ehsan|Donya|Majid|Mahsa|Behrouz|Golnar|Siyavash|Farah',
    last: 'Hosseini|Rahimi|Karimi|Nazari|Ahmadi|Sharifi|Mohammadi|Jafari|Farahani|Dehghan|Tavakoli|Rezaei|Gholami|Khodadadi',
  },
  {
    name: 'Nigeria',
    language: 'English',
    region: 'Africa',
    first: 'Adaeze|Chidi|Amara|Tunde|Ngozi|Emeka|Zainab|Femi|Bola|Kelechi|Ivy|Uche|Ife|Yemi|Sade',
    last: 'Adeyemi|Okonkwo|Balogun|Eze|Chukwu|Adebayo|Obi|Nwachukwu|Ajinmade|Danjuma|Mbah|Ogunsola|Okafor|Salami',
  },
  {
    name: 'Australia',
    language: 'English',
    region: 'Oceania',
    first: 'Callum|Tilly|Jarrah|Piper|Angus|Isla|Ned|Saoirse|Rowan|Bronte|Hamish|Zoë|Finn|Poppy|Damien',
    last: 'Hargreaves|Wentworth|Cloake|McAllister|Brackley|Pullman|Dunstan|Yallop|Kingsley|Marchetti|Redfern|Byrne|Stroud|Cartwright',
  },
  {
    name: 'Argentina',
    language: 'Spanish',
    region: 'South America',
    first: 'Mateo|Valentina|Nicolás|Rocío|Santiago|Julieta|Fermín|Agustina|Ramiro|Malena|Santiago|Luz|Tobias|Florencia|Nico',
    last: 'Villalba|Sarmiento|Ibarra|Bianchi|Cardozo|Ojeda|Molina|Peralta|Aguirre|Núñez|Ferreyra|Salas|Ríos|Brusasco',
  },
]

/**
 * Native-script word banks per language. Used to give non-English films an
 * `originalTitle` that actually looks like a title in that language instead of
 * a transliterated copy of the English one.
 */
export const NATIVE = {
  French: {
    nouns: 'Méridienne|Silence|Hiver|Letters|Arbre|Derrière|Sable|Sœur|Frontière|Gare|Ombre|Îles|Nuit|Mur|Fontaine|Étoile',
    adjs: 'Dernier|Secret|Tranquille|Rouge|Profond|Étouffant|Pale|Clair|Lent|Froid|Lourd|Inutile',
  },
  Italian: {
    nouns: 'Meridiana|Silenzio|Inverno|Lettere|Albero|Retro|Sabbia|Sorella|Frontiera|Stazione|Ombra|Isole|Notte|Muro|Fonte|Stella',
    adjs: 'Ultimo|Segreto|Tranquillo|Rosso|Profondo|Soffocante|Pallido|Chiaro|Lento|Freddo|Pesante|Inutile',
  },
  Spanish: {
    nouns: 'Meridiano|Silencio|Invierno|Cartas|Árbol|Detrás|Arena|Hermana|Frontera|Estación|Sombra|Islas|Noche|Muro|Fuente|Estrella',
    adjs: 'Último|Secreto|Tranquilo|Rojo|Profundo|Suffocante|Pálido|Claro|Lento|Frío|Pesado|Inútil',
  },
  German: {
    nouns: 'Mittagslinie|Stille|Winter|Briefe|Baum|Hinter|Sand|Schwester|Grenze|Bahnhof|Schatten|Inselen|Nacht|Mauer|Brunne|Stern',
    adjs: 'Letzte|Geheim|Ruhig|Rot|Tief|Erstickend|Blasse|Klar|Langsam|Kalt|Schwer|Nutzlos',
  },
  Japanese: {
    nouns: '子午線|静寂|冬|手紙|木|裏側|砂|姉妹|国境|駅|影|島|夜|壁|泉|星',
    adjs: '最後の|秘密の|静かな|赤い|深い|息づく|淡い|澄んだ|ゆっくりした|冷たい|重い',
  },
  Korean: {
    nouns: '자오선|정적|겨울|편지|나무|이쪽|모래|자매|경계|역|그림자|섬|밤|벽|샘|별',
    adjs: '마지막|비밀의|고요한|붉은|깊은|답답한|창백한|맑은|느린|차가운|무거운',
  },
  Mandarin: {
    nouns: '子午线|寂静|冬天|来信|树|背面|沙|姐妹|边界|车站|影子|群岛|夜晚|墙|泉|星',
    adjs: '最后的|秘密的|安静的|赤色|深的|窒息的|苍白的|清澈的|缓慢的|冰冷的|沉重的',
  },
  Hindi: {
    nouns: 'रेखा|सन्नाटा|सर्दी|पत्र|वृक्ष|पीछे|रेत|बहन|सीमा|स्टेशन|छाया|द्वीप|रात|दीवार|कुँआ|तारा',
    adjs: 'अंतिम|गुप्त|शांत|लाल|गहरा|घनी|पीला|साफ|धीमा|ठंडा|भारी',
  },
  Russian: {
    nouns: 'меридиан|тишина|зима|письма|дерево|спина|песок|сестра|граница|вокзал|тень|острова|ночь|стена|родник|звезда',
    adjs: 'последний|тайный|тихий|красный|глубокий|удушливый|бледный|ясный|медленный|холодный|тяжёлый',
  },
  Portuguese: {
    nouns: 'Meridiano|Silêncio|Inverno|Cartas|Árvore|Trás|Areia|Irmã|Fronteira|Estação|Sombra|Ilhas|Noite|Muro|Fonte|Estrela',
    adjs: 'Último|Secreto|Tranquilo|Vermelho|Profundo|Sufocante|Pálido|Claro|Lento|Frio|Pesado|Desnecessário',
  },
  Swedish: {
    nouns: 'Meridian|Stille|Vinter|Brev|Träd|Baksidan|Sand|Syster|Gräns|Station|Skugga|Öar|Natt|Mur|Brunn|Stjärna',
    adjs: 'Sista|Hemlig|Lugn|Röd|Djup|Kvävande|Bleka|Klar|Långsam|Kall|Tung|Värdelös',
  },
  Danish: {
    nouns: 'Meridian|Stilhed|Vinter|Brev|Træ|Bagside|Sand|Søster|Grænse|Station|Skygge|Øer|Nat|Mur|Kilde|Stjerne',
    adjs: 'Sidste|Hemlig|Rød|Dyb|Kvælende|Bleg|Klar|Langsom|Kold|Tung|Useløs',
  },
  Polish: {
    nouns: 'Południk|Cisza|Zima|Listy|Drzewo|Tył|Piasek|Sister|Granica|Stacja|Cień|Wyspy|Noc|Mur|Zdrój|Gwiazda',
    adjs: 'Ostatni|Tajemniczy|Cichy|Czerwony|Głęboki|Duszący|Bledy|Jasny|Powolny|Zimny|Ciężki|Niepotrzebny',
  },
  Dutch: {
    nouns: 'Meridiaan|Stilte|Winter|Brieven|Boom|Achterzijde|Zand|Zuster|Grens|Station|Schaduw|Eilanden|Nacht|Muur|Bron|Ster',
    adjs: 'Laatste|Geheim|Stil|Rood|Diep|Suffocaal|Bleek|Glad|Slow|Koud|Zwaar|Waardeloos',
  },
  Turkish: {
    nouns: 'Meridyen|Sessizlik|Kış|Mektuplar|Ağaç|Arka|Kum|Kız Kardeş|Sınır|İstasyon|Gölge|Adalar|Gece|Duvar|Kaynak|Yıldız',
    adjs: 'Son|Gizli|Sakin|Kırmızı|Derin|Boğucu|Soluk|Açık|Yavaş|Soğuk|Ağır|Gereksiz',
  },
  Persian: {
    nouns: 'چهل‌درجه|سکوت|زمستان|نامه‌ها|درخت|پشت|ماسه|خواهر|مرز|ایستگاه|سایه|جزایر|شب|دیوار|چشمه|ستاره',
    adjs: 'آخرین|راز|آرام|قرمز|عمیق|خفه|رنگ‌پریده|صاف|کند|سرد|سنگین|بیهوده',
  },
}

/* ------------------------------------------------------------------ */
/* english title vocabulary                                            */
/* ------------------------------------------------------------------ */

export const TITLE_WORDS = {
  adjectives: [
    'Silent', 'Crimson', 'Golden', 'Hollow', 'Restless', 'Broken', 'Distant', 'Frozen',
    'Burning', 'Endless', 'Quiet', 'Hidden', 'Sacred', 'Violent', 'Tender', 'Wild',
    'Last', 'First', 'Final', 'Northern', 'Electric', 'Paper', 'Glass', 'Iron',
    'Salt', 'Dust', 'Neon', 'Marble', 'Midnight', 'Winter', 'Summer', 'Velvet',
    'Bitter', 'Gentle', 'Crooked', 'Radiant', 'Humble', 'Sudden', 'Ancient',
    'Modern', 'Distant', 'Invisible', 'Weightless', 'Copper', 'Silver', 'Emerald',
    'Cobalt', 'Scarlet', 'Ivory', 'Ashen', 'Gilded', 'Wandering', 'Restive',
    'Patient', 'Hungry', 'Lucid', 'Weighty', 'Borrowed', 'Forgotten', 'Second',
  ],
  nouns: [
    'Meridian', 'Lantern', 'Harbour', 'Requiem', 'Threshold', 'Cathedral', 'Compass',
    'Orchard', 'Tundra', 'Vantage', 'Ember', 'Quarry', 'Ledger', 'Sparrow', 'Monsoon',
    'Observatory', 'Foundry', 'Almanac', 'Estuary', 'Carousel', 'Lighthouse', 'Alibi',
    'Cascade', 'Chorus', 'Dynasty', 'Frequency', 'Garden', 'Horizon', 'Interval',
    'Junction', 'Kingdom', 'Lattice', 'Migration', 'Nocturne', 'Orbit', 'Parliament',
    'Quarter', 'Reckoning', 'Sanctuary', 'Signal', 'Tributary', 'Undertow', 'Vessel',
    'Wavelength', 'Archive', 'Bastion', 'Citadel', 'Delta', 'Expedition', 'Fathom',
    'Granite', 'Halo', 'Inlet', 'Kernel', 'Latitude', 'Mantle', 'Nexus', 'Overture',
    'Prism', 'Quarry', 'Relay', 'Summit', 'Threshold', 'Vertex', 'Wander', 'Zenith',
    'Aviary', 'Bramble', 'Cinder', 'Dovecote', 'Eddy', 'Furrow', 'Gantry', 'Hollow',
    'Inkwell', 'Jasper', 'Kiln', 'Lattice', 'Marrow', 'Nettle', 'Orchard', 'Plinth',
    'Quiver', 'Rookery', 'Sable', 'Trellis', 'Umber', 'Verge', 'Wicker', 'Yield',
  ],
  ing: [
    'Burning', 'Chasing', 'Counting', 'Drowning', 'Falling', 'Following', 'Hunting',
    'Leaving', 'Listening', 'Missing', 'Naming', 'Opening', 'Pursuing', 'Remembering',
    'Returning', 'Seeking', 'Splintering', 'Turning', 'Unfolding', 'Walking', 'Weighing',
    'Answering', 'Carrying', 'Crossing', 'Cutting', 'Drifting', 'Gathering', 'Holding',
    'Keeping', 'Learning', 'Marking', 'Noticing', 'Painting', 'Raising', 'Singing',
    'Tending', 'Trading', 'Turning', 'Waiting', 'Wearing', 'Bearing',
  ],
  prepositions: ['of', 'in', 'at', 'for', 'against', 'after', 'before', 'with', 'beneath'],
  subtitles: [
    'Last Light', 'First Snow', 'Open Road', 'Long Winter', 'Quiet Hour', 'Second Dawn',
    'Broken Season', 'Low Tide', 'Late Arrival', 'Cold Start', 'True North', 'Small Hours',
    'Dead Air', 'Lost Signal', 'Broken Compass', 'Far Country', 'Quiet Crowd',
    'Falling Light', 'New Year', 'Old Debt', 'Halfway House', 'Last Table', 'First Draft',
    'Other Side', 'Long Way Round', 'Burning Down', 'Under Study', 'After the Rain',
  ],
}

export const ROMAN = [
  'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
]