export const COVER_DIR = '/media/covers'
export const BANNER_DIR = '/media/banners'

export const coverFor = (id) => `${COVER_DIR}/${id}.svg`
export const bannerFor = (id) => `${BANNER_DIR}/${id}.svg`

const RECORDS = [
  {
    id: 'azure-blade-senki',
    title: 'Azure Blade Senki',
    alternativeTitles: ['蒼刃戦記', 'Azure Blade Chronicles', 'Sōshin Senki'],
    author: 'Ryo Kanzaki',
    artist: 'Rin Tsukishiro',
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'Ongoing',
    year: 2019,
    rating: 9.24,
    description:
      'In a kingdom where blades are grown rather than forged, a disgraced sword-bearer inherits a weapon that remembers every death it has caused. To stop the empire from unsheathing it, she must duel seven guardians who each carry a piece of her past.',
    views: 48200000,
    scoreCount: 214800,
  },
  {
    id: 'void-star-requiem',
    title: 'Void Star Requiem',
    alternativeTitles: ['虚空星レRequiem', 'Kyōkūsei Requiem', 'Voidstar Requiem'],
    author: 'Ayane Mochizuki',
    artist: 'Ayane Mochizuki',
    genres: ['Sci-Fi', 'Drama', 'Psychological'],
    status: 'Completed',
    year: 2016,
    rating: 9.51,
    description:
      'Deep-space colonists wake to find their home planet silent and their own memories missing eleven months. A shipboard archivist reconstructs the truth from corrupted logs, and every answer costs her a memory she cannot get back.',
    views: 76100000,
    scoreCount: 398100,
  },
  {
    id: 'kitchen-of-the-last-witch',
    title: 'Kitchen of the Last Witch',
    alternativeTitles: ['最後の魔女の厨房', 'Saigo no Majo no Chūbō', 'Last Witch Kitchen'],
    author: 'Nao Fujimoto',
    artist: 'Hikari Ozawa',
    genres: ['Slice of Life', 'Fantasy', 'Comedy'],
    status: 'Ongoing',
    year: 2021,
    rating: 8.97,
    description:
      'A witch who can only cook when someone is truly happy opens a midnight diner in a town that has forgotten how to celebrate. Her recipes are impossible and her customers are worse liars than she is a cook.',
    views: 29500000,
    scoreCount: 156200,
  },
  {
    id: 'iron-crane-observatory',
    title: 'Iron Crane Observatory',
    alternativeTitles: ['鉄鶴天文台', 'Tetsukaku Tenmondai', 'Crane of Metal'],
    author: 'Shu Hoshino',
    artist: 'Emi Kurosawa',
    genres: ['Sci-Fi', 'Mystery', 'Drama'],
    status: 'Finished',
    year: 2014,
    rating: 9.02,
    description:
      'The last mechanical observatory tracks a comet that has circled the sun for four hundred years without burning. When two astronomers disagree on what it means, the argument becomes a war fought in starlight and paperwork.',
    views: 22400000,
    scoreCount: 98700,
  },
  {
    id: 'bloodline-of-the-wolfs-dawn',
    title: "Bloodline of the Wolf's Dawn",
    alternativeTitles: ['狼の暁の血統', 'Ōkami no Akatsuki no Kettō', 'Wolfblood Dawn'],
    author: 'Genji Tōdō',
    artist: 'Genji Tōdō',
    genres: ['Action', 'Fantasy', 'Horror'],
    status: 'Ongoing',
    year: 2020,
    rating: 8.88,
    description:
      'Every generation, one child of the Tōdō clan wakes with the wolf inside them intact. The current heir would rather die than become the thing the village prays for, and the village has already picked the funeral date.',
    views: 33100000,
    scoreCount: 128400,
  },
  {
    id: 'paper-crane-letters',
    title: 'Paper Crane Letters',
    alternativeTitles: ['折鶴の手紙', 'Origami no Tegami', 'Letters Folded as Cranes'],
    author: 'Sora Nishiyama',
    artist: 'Sora Nishiyama',
    genres: ['Romance', 'Drama', 'Slice of Life'],
    status: 'Completed',
    year: 2018,
    rating: 8.76,
    description:
      'Two students exchange notes folded into paper cranes across a one-way river town. They never meet, never see each other, and slowly realize the river is not the only thing between them.',
    views: 18700000,
    scoreCount: 84300,
  },
  {
    id: 'thousand-crowns-requiem',
    title: 'Thousand Crowns Requiem',
    alternativeTitles: ['千頂のRequiem', 'Senjō no Requiem', 'Requiem of a Thousand Crowns'],
    author: 'Vittorio Salva',
    artist: 'Marco Ferri',
    genres: ['Fantasy', 'Political', 'Drama'],
    status: 'Ongoing',
    year: 2017,
    rating: 9.11,
    description:
      'The empire elects a monarch every thirteen years and buries the losers under the throne. A historian hired to catalogue the dead discovers the burial records are being rewritten in real time.',
    views: 41900000,
    scoreCount: 172600,
  },
  {
    id: 'neon-samurai-2077',
    title: 'Neon Samurai 2077',
    alternativeTitles: ['ネオン侍', 'Neon Samurai', 'Chrome Blade Runners'],
    author: 'Kenji Arakawa',
    artist: 'Kenji Arakawa',
    genres: ['Sci-Fi', 'Action', 'Cyberpunk'],
    status: 'Ongoing',
    year: 2022,
    rating: 8.94,
    description:
      'In a flooded megacity, debt-collecting samurai ride hoverboards along the tops of drowned towers. The last one still honouring the old code is hired to delete a target who owes him nothing but a favour.',
    views: 52700000,
    scoreCount: 203100,
  },
  {
    id: 'the-cartographers-daughter',
    title: "The Cartographer's Daughter",
    alternativeTitles: ['地図屋の娘', 'Chizuya no Musume', 'Daughter of Maps'],
    author: 'Mara Lindqvist',
    artist: 'Oskar Reyes',
    genres: ['Adventure', 'Drama', 'Fantasy'],
    status: 'Ongoing',
    year: 2015,
    rating: 8.69,
    description:
      'The empire maps everything, which means the empire controls what exists. A mapmaker\'s daughter redraws the borders of a war-torn province and accidentally redraws the war.',
    views: 14900000,
    scoreCount: 61200,
  },
  {
    id: 'gravemoon-liturgy',
    title: 'Gravemoon Liturgy',
    alternativeTitles: [' Graveside', 'Grave Moon no Eikyū', 'Liturgy of the Grave Moon'],
    author: 'Ilse Brandt',
    artist: 'Ilse Brandt',
    genres: ['Horror', 'Mystery', 'Supernatural'],
    status: 'Finished',
    year: 2013,
    rating: 8.55,
    description:
      'In a town where the dead are read aloud at the new moon, a boy notices that someone in the congregation is being named twice. The second reading always starts the following week.',
    views: 11200000,
    scoreCount: 48700,
  },
  {
    id: 'steel-bloom-academy',
    title: 'Steel Bloom Academy',
    alternativeTitles: ['鋼花学園', 'Kōka Gakuen', 'Academy of Steel Flowers'],
    author: 'Tomo Ishikawa',
    artist: 'Yui Sakaguchi',
    genres: ['Action', 'School', 'Fantasy'],
    status: 'Ongoing',
    year: 2019,
    rating: 8.83,
    description:
      'An academy for pilots who bond with machines at fourteen, and one student who bonded with a decommissioned warship that talks too much. The war ended six years ago. The ship did not get the message.',
    views: 37600000,
    scoreCount: 149500,
  },
  {
    id: 'midnight-librarian',
    title: 'Midnight Librarian',
    alternativeTitles: ['深夜の司書', 'Shinya no Shisho', 'The Midnight Librarian'],
    author: 'Priya Raman',
    artist: 'Priya Raman',
    genres: ['Mystery', 'Supernatural', 'Drama'],
    status: 'Ongoing',
    year: 2020,
    rating: 8.72,
    description:
      'A library that opens only between midnight and dawn lends books that have not been written yet. The librarian\'s job is to make sure nobody returns one after the author has been forgotten.',
    views: 16300000,
    scoreCount: 70400,
  },
  {
    id: 'ashfall-samurai-cook',
    title: 'Ashfall Samurai Cook',
    alternativeTitles: ['灰降る侍の料理人', 'Hai Furu Samurai no Ryōrinin', 'Chef of the Ashfall'],
    author: 'Ren Takahashi',
    artist: 'Mio Nakagawa',
    genres: ['Historical', 'Food', 'Drama'],
    status: 'Finished',
    year: 2012,
    rating: 9.07,
    description:
      'Two samurai who cannot agree on anything except food open a roadside inn on a road that runs through three armies\' territory. The first customer is the war itself.',
    views: 19800000,
    scoreCount: 91500,
  },
  {
    id: 'quantum-koi',
    title: 'Quantum Koi',
    alternativeTitles: ['量子鯉', 'Ryōshi Koi', 'Entangled Carp'],
    author: 'Hana Sugimoto',
    artist: 'Hana Sugimoto',
    genres: ['Sci-Fi', 'Romance', 'Slice of Life'],
    status: 'Ongoing',
    year: 2023,
    rating: 8.61,
    description:
      'A fish that exists in two tanks at once is the only proof two researchers have that their shared childhood was real. Investigating it costs them the certainty of everything else.',
    views: 9400000,
    scoreCount: 39200,
  },
  {
    id: 'the-longest-winter-king',
    title: 'The Longest Winter King',
    alternativeTitles: ['最長の冬王', 'Saisai no Fuyuō', 'Winter King'],
    author: 'Aldric Vane',
    artist: 'Nils Berg',
    genres: ['Fantasy', 'Action', 'Political'],
    status: 'Ongoing',
    year: 2018,
    rating: 9.19,
    description:
      'A king who cannot feel warmth declares an eternal winter to unify his people under one banner. His engineers build a machine that will fix the weather, the famine, and him.',
    views: 45300000,
    scoreCount: 187300,
  },
  {
    id: 'harajuku-ghost-scout',
    title: 'Harajuku Ghost Scout',
    alternativeTitles: ['原宿ゴーストスカウト', 'Harajuku Gōsuto Sukauto', 'Ghost Scout'],
    author: 'Aya Morishita',
    artist: 'Aya Morishita',
    genres: ['Supernatural', 'Comedy', 'Adventure'],
    status: 'Ongoing',
    year: 2021,
    rating: 8.35,
    description:
      'A nineteen-year-old can see ghosts and bills them hourly. The ghosts of Shibuya are extremely price-sensitive, extremely organised, and about to hold a strike.',
    views: 12700000,
    scoreCount: 55600,
  },
  {
    id: 'orchid-of-the-nine-thresholds',
    title: 'Orchid of the Nine Thresholds',
    alternativeTitles: ['九門の蘭', 'Kumon no Ran', 'Nine Doors Orchid'],
    author: 'Wei Lanting',
    artist: 'Wei Lanting',
    genres: ['Mystery', 'Historical', 'Fantasy'],
    status: 'Completed',
    year: 2011,
    rating: 8.90,
    description:
      'Nine sealed doors, nine sealed crimes, one flower that blooms only when the last one is confessed. A magistrate has one night to walk all nine before the gates reset.',
    views: 13400000,
    scoreCount: 57300,
  },
  {
    id: 'paragon-dungeon-delivery',
    title: 'Paragon Dungeon Delivery',
    alternativeTitles: ['パラゴン配送', 'Paragon Haisō', 'Paragon Courier'],
    author: 'Beatrix Lund',
    artist: 'Casper Holm',
    genres: ['Comedy', 'Fantasy', 'Adventure'],
    status: 'Ongoing',
    year: 2022,
    rating: 8.48,
    description:
      'The only courier licensed to enter a collapsing dungeon delivers exactly one parcel per run. She has delivered swords, apologies, and once, illegally, a goat.',
    views: 10900000,
    scoreCount: 44900,
  },
  {
    id: 'signal-from-the-deep',
    title: 'Signal From the Deep',
    alternativeTitles: ['深海からの信号', 'Shinkai Kara no Shinraku', 'Deep Signal'],
    author: 'Tomas Ek',
    artist: 'Lena Fischer',
    genres: ['Horror', 'Sci-Fi', 'Thriller'],
    status: 'Ongoing',
    year: 2023,
    rating: 8.79,
    description:
      'Eleven thousand metres down, a research station begins receiving maintenance requests from a platform that was never built. The requests are polite, specific, and describe the crew by name.',
    views: 21600000,
    scoreCount: 88700,
  },
  {
    id: 'sword-maiden-of-seven-seasons',
    title: 'Sword Maiden of Seven Seasons',
    alternativeTitles: ['七季の剣乙女', 'Shichiki no Ken Ototome', 'Seven Seasons Blade'],
    author: 'Chisato Ueda',
    artist: 'Chisato Ueda',
    genres: ['Action', 'Romance', 'Fantasy'],
    status: 'Ongoing',
    year: 2016,
    rating: 9.05,
    description:
      'A swordswoman ages one season per year spent without a lover. She is in her seventh season and has stopped explaining this to people who ask politely.',
    views: 35700000,
    scoreCount: 139400,
  },
  {
    id: 'rumours-of-the-tenth-circle',
    title: 'Rumours of the Tenth Circle',
    alternativeTitles: ['第十円の噂', 'Jūgaku no Uwasa', 'Tenth Circle Rumours'],
    author: 'Cassia Wren',
    artist: 'Cassia Wren',
    genres: ['Political', 'Mystery', 'Sci-Fi'],
    status: 'Completed',
    year: 2019,
    rating: 8.86,
    description:
      'A corporate city hides nine levels of poverty beneath glass. An archivist is hired to write the official history of the tenth level, which does not officially exist.',
    views: 24100000,
    scoreCount: 101200,
  },
  {
    id: 'kitchen-counter-at-midnight',
    title: 'Kitchen Counter at Midnight',
    alternativeTitles: ['真夜中の厨房', 'Mayonaka no Chūbō', 'Midnight Kitchen'],
    author: 'Nao Fujimoto',
    artist: 'Hikari Ozawa',
    genres: ['Drama', 'Food', 'Slice of Life'],
    status: 'Ongoing',
    year: 2023,
    rating: 8.42,
    description:
      'A short-order cook who cannot hear dialogue works at a counter where the regulars never stop talking. She learns their lives by what they order and by when they stop ordering.',
    views: 8100000,
    scoreCount: 33500,
  },
  {
    id: 'the-cartographers-apprentice',
    title: "The Cartographer's Apprentice",
    alternativeTitles: ['地図見習いの記録', 'Chizu Miwairi no Kiroku', 'Apprentice Maps'],
    author: 'Mara Lindqvist',
    artist: 'Oskar Reyes',
    genres: ['Adventure', 'Fantasy', 'Slice of Life'],
    status: 'Ongoing',
    year: 2020,
    rating: 8.58,
    description:
      'The apprentice is given one blank map and told to fill it honestly. Every place he draws becomes real, which is a problem when he is being paid to make somewhere look pleasant.',
    views: 9700000,
    scoreCount: 39800,
  },
  {
    id: 'ember-court',
    title: 'Ember Court',
    alternativeTitles: ['熾火の廷', 'Shibi no Tei', 'Court of Embers'],
    author: 'Yara Sultanova',
    artist: 'Yara Sultanova',
    genres: ['Fantasy', 'Political', 'Romance'],
    status: 'Ongoing',
    year: 2021,
    rating: 9.13,
    description:
      'Whoever sits the Ember Throne burns for a year. The court has learned to use that as a calendar, and the last monarch learned to use it as a weapon.',
    views: 38900000,
    scoreCount: 156700,
  },
  {
    id: 'driftwood-samurai',
    title: 'Driftwood Samurai',
    alternativeTitles: ['流木の侍', 'Nagareki no Samurai', 'Samurai of Driftwood'],
    author: 'Haru Ōkubo',
    artist: 'Sadao Mori',
    genres: ['Historical', 'Drama', 'Slice of Life'],
    status: 'Finished',
    year: 2010,
    rating: 8.39,
    description:
      'A masterless samurai washes ashore on an island with no war and no enemies, and has to invent a reason to stay alive. He becomes a fisherman, a teacher, and eventually a saint, against his own preferences.',
    views: 8900000,
    scoreCount: 36100,
  },
  {
    id: 'honey-and-cinders',
    title: 'Honey and Cinders',
    alternativeTitles: ['蜂蜜と灰', 'Honey to Hai', 'Honey and Ash'],
    author: 'Solveig Dare',
    artist: 'Solveig Dare',
    genres: ['Romance', 'Fantasy', 'Drama'],
    status: 'Ongoing',
    year: 2022,
    rating: 8.71,
    description:
      'A beekeeper and a smith forge something in the same fire by accident, and the something has opinions. Their families have been at war for a century and are about to find out why.',
    views: 19300000,
    scoreCount: 76200,
  },
  {
    id: 'void-star-requiem-zero',
    title: 'Void Star Requiem: Zero',
    alternativeTitles: ['虚空星Requiem ゼロ', 'Kyōkusei Requiem Zero', 'VSQ Zero'],
    author: 'Ayane Mochizuki',
    artist: 'Ayane Mochizuki',
    genres: ['Sci-Fi', 'Action', 'Mystery'],
    status: 'Completed',
    year: 2018,
    rating: 8.94,
    description:
      'The prequel arc of Void Star Requiem, following the salvage crew that recovered the colony logs eleven years before the colonists woke up.',
    views: 16700000,
    scoreCount: 68300,
  },
  {
    id: 'infinite-kitchen-knives',
    title: 'Infinite Kitchen Knives',
    alternativeTitles: ['無限の包丁', 'Mugen no Hōchō', 'Infinite Blades'],
    author: 'Genta Usuba',
    artist: 'Rika Miyagawa',
    genres: ['Action', 'Comedy', 'Supernatural'],
    status: 'Ongoing',
    year: 2023,
    rating: 8.29,
    description:
      'A failed chef finds a knife drawer that never runs out and a kitchen that will not let him leave until every dish is finished. The reviews are brutal and he deserves them.',
    views: 7300000,
    scoreCount: 29400,
  },
  {
    id: 'the-quiet-orchestra',
    title: 'The Quiet Orchestra',
    alternativeTitles: ['静かなオーケストラ', 'Shizuka na Ōkesutora', 'Hush Orchestra'],
    author: 'Iris Vandermeer',
    artist: 'Iris Vandermeer',
    genres: ['Drama', 'Music', 'Slice of Life'],
    status: 'Finished',
    year: 2017,
    rating: 8.81,
    description:
      'A deaf conductor rebuilds an orchestra from an apartment block of musicians who cannot hear each other. They learn to play by watching, which turns out to be harder and better.',
    views: 12400000,
    scoreCount: 52600,
  },
  {
    id: 'witch-of-the-lantern-market',
    title: 'Witch of the Lantern Market',
    alternativeTitles: ['灯籠市場の魔女', 'Chōrō Ichiba no Majo', 'Lantern Witch'],
    author: 'Nao Fujimoto',
    artist: 'Hikari Ozawa',
    genres: ['Fantasy', 'Slice of Life', 'Mystery'],
    status: 'Ongoing',
    year: 2022,
    rating: 8.66,
    description:
      'At the night market, one stall sells wishes at cost. The witch running it has been doing this for two hundred years and is starting to run out of change.',
    views: 14100000,
    scoreCount: 58900,
  },
  {
    id: 'storm-caller-of-kyushu',
    title: 'Storm Caller of Kyushu',
    alternativeTitles: ['九州の喚雷者', 'Kyūshū no Kanrai-sha', 'Thunder Caller'],
    author: 'Daichi Murayama',
    artist: 'Nao Tsukioka',
    genres: ['Action', 'Historical', 'Supernatural'],
    status: 'Ongoing',
    year: 2014,
    rating: 8.91,
    description:
      'Fishermen on the Kyushu coast call the storms in with a song that only works if someone stays out in them. Their families have been doing the arithmetic on who that is for two hundred years.',
    views: 26800000,
    scoreCount: 110800,
  },
  {
    id: 'iron-lullaby',
    title: 'Iron Lullaby',
    alternativeTitles: ['鉄の子守唄', 'Tegane no Komoriuta', 'Lullaby of Iron'],
    author: 'Lior Ben-Ami',
    artist: 'Lior Ben-Ami',
    genres: ['Horror', 'Sci-Fi', 'Psychological'],
    status: 'Ongoing',
    year: 2021,
    rating: 8.44,
    description:
      'In a facility where machines are built to never need sleep, an engineer starts hearing a lullaby nobody is singing. The melody contains the building\'s original schematics.',
    views: 15600000,
    scoreCount: 64100,
  },
  {
    id: 'sunset-courier-service',
    title: 'Sunset Courier Service',
    alternativeTitles: ['夕暮れ配達便', 'Yūgure Haikōbin', 'Last Light Delivery'],
    author: 'Kōta Mizuno',
    artist: 'Kōta Mizuno',
    genres: ['Slice of Life', 'Drama', 'Supernatural'],
    status: 'Ongoing',
    year: 2019,
    rating: 8.57,
    description:
      'Every evening the same bicycle takes one parcel to one address, and every evening the recipient is someone who died that morning. The courier never asks why, and the recipients never refuse.',
    views: 17100000,
    scoreCount: 70100,
  },
  {
    id: 'blade-of-the-quiet-hall',
    title: 'Blade of the Quiet Hall',
    alternativeTitles: ['静hallの刃', '静寂の広間の刃', 'Quiet Hall Blade'],
    author: 'Ryo Kanzaki',
    artist: 'Rin Tsukishiro',
    genres: ['Action', 'Fantasy', 'Mystery'],
    status: 'Ongoing',
    year: 2022,
    rating: 8.76,
    description:
      'A sword that cannot be drawn in anger, carried by a swordswoman with a great deal of anger. The hall where it lives is quiet because nothing in it is allowed to finish a fight.',
    views: 20400000,
    scoreCount: 82900,
  },
  {
    id: 'paper-lantern-festival',
    title: 'Paper Lantern Festival',
    alternativeTitles: ['紙灯籠祭り', 'Kami Chōrō Matsuri', 'Lantern Festival'],
    author: 'Emi Kitagawa',
    artist: 'Emi Kitagawa',
    genres: ['Romance', 'Drama', 'Slice of Life'],
    status: 'Completed',
    year: 2015,
    rating: 8.47,
    description:
      'Two rival festival committees are forced to share one banner, one budget, and one extremely small tent. The banner wins.',
    views: 13300000,
    scoreCount: 57400,
  },
  {
    id: 'orbital-salvage',
    title: 'Orbital Salvage',
    alternativeTitles: ['軌道サルベージ', 'Kidō Sarubeji', 'Orbit Wreckers'],
    author: 'Tomas Ek',
    artist: 'Lena Fischer',
    genres: ['Sci-Fi', 'Thriller', 'Adventure'],
    status: 'Ongoing',
    year: 2023,
    rating: 8.62,
    description:
      'Debris above the atmosphere is worth more than most planets. A salvage crew pulls up a hull that is still warm, still transmitting, and definitely not abandoned.',
    views: 11700000,
    scoreCount: 46800,
  },
  {
    id: 'the-hymn-of-broken-things',
    title: 'The Hymn of Broken Things',
    alternativeTitles: ['壊れたものの聖歌', 'Kowareta Mono no Seika', 'Hymn of Ruins'],
    author: 'Cassia Wren',
    artist: 'Cassia Wren',
    genres: ['Horror', 'Fantasy', 'Psychological'],
    status: 'Finished',
    year: 2016,
    rating: 8.52,
    description:
      'A cathedral collects broken objects and sings with them. The choir finds a broken bell that remembers every bell that ever broke.',
    views: 14600000,
    scoreCount: 61300,
  },
  {
    id: 'razorfield',
    title: 'Razorfield',
    alternativeTitles: ['レイザーフィールド', 'Razāfīrudo', 'Razorfield'],
    author: 'Kenji Arakawa',
    artist: 'Kaito Shimizu',
    genres: ['Action', 'Cyberpunk', 'Thriller'],
    status: 'Ongoing',
    year: 2023,
    rating: 8.38,
    description:
      'Outside the last walled city, the fields are cut every morning and regrow every night, taller each time. The harvesters are paid by what they bring in and by what comes back out.',
    views: 9800000,
    scoreCount: 39100,
  },
  {
    id: 'summer-of-the-tidal-city',
    title: 'Summer of the Tidal City',
    alternativeTitles: ['潮汐の街の夏', 'Chōseki no Machi no Natsu', 'Tide Summer'],
    author: 'Aya Morishita',
    artist: 'Aya Morishita',
    genres: ['Romance', 'Slice of Life', 'Comedy'],
    status: 'Ongoing',
    year: 2020,
    rating: 8.33,
    description:
      'When the tide goes out, two streets that should never have met are briefly connected. The whole summer is about how long that connection lasts.',
    views: 15200000,
    scoreCount: 63800,
  },
  {
    id: 'machinist-of-the-frozen-orbit',
    title: 'Machinist of the Frozen Orbit',
    alternativeTitles: ['凍った軌道の機械師', 'Kōri no Kido no Kikaishi', 'Frozen Orbit Machinist'],
    author: 'Beatrix Lund',
    artist: 'Casper Holm',
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    status: 'Completed',
    year: 2018,
    rating: 8.88,
    description:
      'A station frozen mid-repair has one engineer awake inside it and a thousand kilometres of unanswered questions. The answers are arranged in order of when they will kill her.',
    views: 22900000,
    scoreCount: 95400,
  },
  {
    id: 'blade-of-the-quiet-hall-zero',
    title: 'Blade of the Quiet Hall: Zero',
    alternativeTitles: ['静寂の広間の刃 ゼロ', 'Quiet Hall Blade Zero', 'QHB Zero'],
    author: 'Ryo Kanzaki',
    artist: 'Rin Tsukishiro',
    genres: ['Action', 'Fantasy', 'Adventure'],
    status: 'Completed',
    year: 2018,
    rating: 8.31,
    description:
      'Before the hall, there were two of them. The prequel chapter following the second sword and the workshop that made it.',
    views: 8700000,
    scoreCount: 32600,
  },
  {
    id: 'spice-and-sorrow',
    title: 'Spice and Sorrow',
    alternativeTitles: ['香辛料と悲しみ', 'Kōshinryō to Kanashimi', 'Spice & Sorrow'],
    author: 'Solveig Dare',
    artist: 'Solveig Dare',
    genres: ['Food', 'Drama', 'Historical'],
    status: 'Ongoing',
    year: 2019,
    rating: 8.55,
    description:
      'A widow runs a spice stall on a trade road that only appears twice a year, and the only man who ever comes back is the one who ruined her family.',
    views: 13700000,
    scoreCount: 54800,
  },
  {
    id: 'nine-foxes-and-a-bell',
    title: 'Nine Foxes and a Bell',
    alternativeTitles: ['九狐と鐘', 'Kyūkitsune to Kane', 'Nine Foxes'],
    author: 'Yara Sultanova',
    artist: 'Yara Sultanova',
    genres: ['Supernatural', 'Folklore', 'Mystery'],
    status: 'Ongoing',
    year: 2021,
    rating: 8.73,
    description:
      'Every hundred years, nine foxes ring a bell that erases one human promise from the world. This year somebody rings it twice and forgets to come back.',
    views: 18400000,
    scoreCount: 74100,
  },
  {
    id: 'the-last-cartographer',
    title: 'The Last Cartographer',
    alternativeTitles: ['最後の地図職人', 'Saigo no Chizu Shokunin', 'Final Cartographer'],
    author: 'Wei Lanting',
    artist: 'Wei Lanting',
    genres: ['Drama', 'Historical', 'Fantasy'],
    status: 'Finished',
    year: 2009,
    rating: 8.68,
    description:
      'The guild sends its oldest mapmaker to survey a country that appears on no map, including his own. He returns with a map of himself and two months missing.',
    views: 16100000,
    scoreCount: 67700,
  },
  {
    id: 'pulse-runner',
    title: 'Pulse Runner',
    alternativeTitles: ['パルスランナー', 'Parusu Ranā', 'Pulse Runner'],
    author: 'Kenji Arakawa',
    artist: 'Kaito Shimizu',
    genres: ['Sci-Fi', 'Action', 'Sports'],
    status: 'Ongoing',
    year: 2022,
    rating: 8.26,
    description:
      'The fastest people in the city are the ones with a synchronised implant, and they are dying at eighteen. A courier with a slow chip takes the contract nobody else will.',
    views: 10500000,
    scoreCount: 42100,
  },
  {
    id: 'garden-of-quiet-things',
    title: 'Garden of Quiet Things',
    alternativeTitles: ['静かなものの庭', 'Shizuka na Mono no Niwa', 'Quiet Garden'],
    author: 'Iris Vandermeer',
    artist: 'Iris Vandermeer',
    genres: ['Slice of Life', 'Fantasy', 'Drama'],
    status: 'Ongoing',
    year: 2020,
    rating: 8.49,
    description:
      'A botanical garden grows plants that make people stop talking. The gardener who maintains it has not spoken in eleven years and is very tired of it.',
    views: 12900000,
    scoreCount: 53700,
  },
  {
    id: 'crimson-ledger',
    title: 'Crimson Ledger',
    alternativeTitles: ['深紅の帳簿', 'Shinku no Chōbō', 'Red Book'],
    author: 'Vittorio Salva',
    artist: 'Marco Ferri',
    genres: ['Mystery', 'Political', 'Thriller'],
    status: 'Ongoing',
    year: 2020,
    rating: 8.84,
    description:
      'An auditor is sent to check a province\'s books and finds one column that only lists the dead. The column is balanced. Nothing else in the region is.',
    views: 19600000,
    scoreCount: 79800,
  },
  {
    id: 'sisters-of-the-salt-road',
    title: 'Sisters of the Salt Road',
    alternativeTitles: ['塩の道姉妹', 'Shio no Michi Shimai', 'Salt Road Sisters'],
    author: 'Iris Vandermeer',
    artist: 'Iris Vandermeer',
    genres: ['Historical', 'Drama', 'Adventure'],
    status: 'Finished',
    year: 2017,
    rating: 8.42,
    description:
      'Two sisters haul salt for a living across a road that belongs to three different warlords. The younger one decides to renegotiate, with a cart and no weapons.',
    views: 11800000,
    scoreCount: 48300,
  },
  {
    id: 'glass-orchestra',
    title: 'Glass Orchestra',
    alternativeTitles: ['ガラスのオーケストラ', 'Garasu no Ōkesutora', 'Glass Orchestra'],
    author: 'Lior Ben-Ami',
    artist: 'Lior Ben-Ami',
    genres: ['Fantasy', 'Music', 'Mystery'],
    status: 'Ongoing',
    year: 2022,
    rating: 8.58,
    description:
      'Each member of the orchestra plays an instrument that is slowly killing them. The contract is fair. The terms are printed on the instruments.',
    views: 14300000,
    scoreCount: 59600,
  },
  {
    id: 'tide-and-toll',
    title: 'Tide and Toll',
    alternativeTitles: ['潮と通行料', 'Shio to Tsūkōryō', 'Tollwater'],
    author: 'Aldric Vane',
    artist: 'Nils Berg',
    genres: ['Fantasy', 'Political', 'Adventure'],
    status: 'Ongoing',
    year: 2021,
    rating: 8.86,
    description:
      'The sea has risen and every road now ends in water. Whoever controls the bridges controls the map, and the bridge-keepers have started charging for sides.',
    views: 21200000,
    scoreCount: 85600,
  },
  {
    id: 'the-understudy',
    title: 'The Understudy',
    alternativeTitles: ['代役', 'Daiyaku', 'Stand-In'],
    author: 'Emi Kitagawa',
    artist: 'Emi Kitagawa',
    genres: ['Drama', 'School', 'Psychological'],
    status: 'Completed',
    year: 2018,
    rating: 8.4,
    description:
      'She has rehearsed the lead role for two years and never once been allowed on stage. Opening night arrives and the theatre asks her to go on anyway.',
    views: 15800000,
    scoreCount: 66200,
  },
  {
    id: 'raven-post',
    title: 'Raven Post',
    alternativeTitles: ['raven便', 'Reibenbin', 'Corvian Post'],
    author: 'Kōta Mizuno',
    artist: 'Nao Tsukioka',
    genres: ['Supernatural', 'Mystery', 'Adventure'],
    status: 'Ongoing',
    year: 2022,
    rating: 8.63,
    description:
      'A postal service run by ravens delivers to places that are not on any map and must not be opened by the recipient. One letter is addressed to the courier.',
    views: 16700000,
    scoreCount: 69800,
  },
  {
    id: 'alchemy-of-lost-things',
    title: 'Alchemy of Lost Things',
    alternativeTitles: ['失われたものの錬金術', 'Ushinawareta Mono no Renkinjutsu', 'Lost Alchemy'],
    author: 'Genta Usuba',
    artist: 'Rika Miyagawa',
    genres: ['Fantasy', 'Mystery', 'Adventure'],
    status: 'Ongoing',
    year: 2023,
    rating: 8.45,
    description:
      'You cannot make what is lost, but you can make what misses it. A practical alchemist starts producing replacements and runs out of grief in her clients.',
    views: 9400000,
    scoreCount: 37200,
  },
  {
    id: 'stormglass',
    title: 'Stormglass',
    alternativeTitles: ['嵐硝子', 'Arashōgarasu', 'Storm Glass'],
    author: 'Shu Hoshino',
    artist: 'Emi Kurosawa',
    genres: ['Fantasy', 'Romance', 'Drama'],
    status: 'Ongoing',
    year: 2020,
    rating: 8.68,
    description:
      'Glass that captures a storm, and the two rival workshops that have been ruining each other\'s storms for eighty years. Their heirs have to share a kiln.',
    views: 17400000,
    scoreCount: 71800,
  },
  {
    id: 'the-second-tide',
    title: 'The Second Tide',
    alternativeTitles: ['第二の潮', 'Daini no Shio', 'Second Tide'],
    author: 'Aya Morishita',
    artist: 'Aya Morishita',
    genres: ['Romance', 'Drama', 'Supernatural'],
    status: 'Ongoing',
    year: 2019,
    rating: 8.36,
    description:
      'The tide comes twice in the town of Suzume and the second one takes one person back. Everyone has lost somebody. This year the list is finished.',
    views: 14900000,
    scoreCount: 62500,
  },
  {
    id: 'copper-choir',
    title: 'Copper Choir',
    alternativeTitles: ['銅の聖歌隊', 'Dō no Seikatai', 'Brass Chorus'],
    author: 'Iris Vandermeer',
    artist: 'Iris Vandermeer',
    genres: ['Fantasy', 'Music', 'Horror'],
    status: 'Ongoing',
    year: 2023,
    rating: 8.51,
    description:
      'A choir of copper automata has been singing the same eight notes for two centuries. The engineer sent to fix them cannot make himself leave the room.',
    views: 11300000,
    scoreCount: 44900,
  },
]

const CHAPTER_TITLES = [
  'The Weight of Salt',
  'A Bell That Does Not Ring',
  'Winter Count',
  'The Cartographer Sleeps',
  'Three Ways Down',
  'Paper and Fire',
  'The Long Answer',
  'Harbour, After Closing',
  'A Name Borrowed',
  'The Second Cup',
  'Everything Ash',
  'The Quiet Part',
  'Small Machines',
  'What the Tide Left',
  'The Understudy Acts',
  'Lantern Law',
  'A Cold Morning Ritual',
  'Notes for a Hymn',
  'The Borrowed Hour',
  'Unmapped',
  'The Wrong Kind of Warmth',
  'Kite Season',
  'Ninety Feet of Rope',
  'The Wrong Kind of Silver',
  'Rain on the Flat Roof',
  'The Apprentice Draws',
  'Everything, Twice',
  'A Sound Under the Floor',
  'The Last Delivery',
  'Room 114',
  'Sleeve, Unfastened',
  'A Map of Standing Water',
  'The Price of the Bell',
  'Sunrise, Interrupted',
  'The Second Shift',
  'Inventory',
  'The Fire Next Door',
  'Ash Wednesday, Roughly',
  'A Very Ordinary Ghost',
  'The Turning Point, Missed',
  'Little Weather',
]

function hashString(value) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededRandom(seed) {
  let a = seed >>> 0
  return function random() {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pad = (n) => (n < 10 ? `0${n}` : String(n))

function buildChapters(record, random) {
  const isLong = record.chapterCount ?? (40 + Math.floor(random() * 260))
  const now = Date.UTC(2026, 8, 30)
  const gap = 3 + Math.floor(random() * 6)
  const firstDay = record.status === 'Ongoing' ? 6 + Math.floor(random() * 10) : 0
  const chapters = []

  for (let n = 1; n <= isLong; n += 1) {
    const isOngoing = record.status === 'Ongoing' && n > isLong - 1 - Math.floor(random() * 2)
    const daysAgo = firstDay + (isLong - n) * gap + Math.floor(random() * 2)
    const released = new Date(now - daysAgo * 86400000)
    chapters.push({
      number: n,
      title: CHAPTER_TITLES[(hashString(`${record.id}-${n}`) + n) % CHAPTER_TITLES.length],
      pages: 8 + Math.floor(random() * 34),
      date: `${released.getUTCFullYear()}-${pad(released.getUTCMonth() + 1)}-${pad(released.getUTCDate())}`,
      views: Math.round(record.views * (0.0004 + random() * 0.004) * (1 + (isLong - n) / 400)),
      isNew: isOngoing,
    })
  }

  return chapters
}

function decorate(record, index) {
  const random = seededRandom(hashString(record.id))
  const chapters = buildChapters(record, random)
  const latestChapter = chapters[chapters.length - 1]
  const randomTail = seededRandom(hashString(`${record.id}-readers`))

  return {
    ...record,
    cover: coverFor(record.id),
    banner: bannerFor(record.id),
    index,
    chapters,
    chapterCount: chapters.length,
    latestChapter,
    latestChapterNumber: latestChapter.number,
    latestUpdate: latestChapter.date,
    publisher: `${record.author.split(' ').slice(-1)[0]} Comics`,
    keywords: [...record.genres, record.status, String(record.year)],
    trending: Math.round(record.views * 0.00001 + randomTail() * 80000),
    scorePercent: Math.round(Math.min(99, record.rating * 9.4)),
    type: 'MANGA',
    licensed: record.status === 'Completed' || record.status === 'Finished',
  }
}

export const MANGA = RECORDS.map(decorate)

export const MANGA_BY_ID = Object.freeze(
  MANGA.reduce((acc, manga) => {
    acc[manga.id] = manga
    return acc
  }, {}),
)

export const ALL_GENRES = (() => {
  const counts = new Map()
  MANGA.forEach((manga) => {
    manga.genres.forEach((genre) => {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    })
  })
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})()

export const ALL_STATUSES = ['Ongoing', 'Completed', 'Finished', 'Hiatus']
export const ALL_YEARS = Array.from(new Set(MANGA.map((manga) => manga.year))).sort((a, b) => b - a)
export const ALL_AUTHORS = Array.from(new Set(MANGA.map((manga) => manga.author))).sort((a, b) =>
  a.localeCompare(b),
)
export const ALL_ARTISTS = Array.from(new Set(MANGA.map((manga) => manga.artist))).sort((a, b) =>
  a.localeCompare(b),
)

export function getManga(id) {
  return MANGA_BY_ID[id] ?? null
}