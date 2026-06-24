const RARITY = {
  common: "var(--r-common)",
  rare: "var(--r-rare)",
  epic: "var(--r-epic)",
  legend: "var(--r-legend)",
  unique: "var(--r-unique)",
};
const RARITY_LABEL = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legend: "Legendary",
  unique: "★ Unique Series",
};
const quests = [
  {
    id: "q1",
    tag: "Intro Arc",
    title: "🌱 Introductory Arc",
    summary:
      "Kaede memilih Great Shield, all-in VIT, dan menemukan Black Rose Armor di dasar Labyrinth of the Poison Dragon.",
    desc: "Kaede diajak Risa bermain NewWorld Online. Memilih Great Shield dan menuangkan semua poin ke VIT. Melawan Horned Rabbit selama satu jam tanpa damage, lalu tanpa sengaja membunuhnya. Melawan Giant Bee dan memperoleh Poison Resistance. Bertemu Chrome dan Iz, lalu menaklukkan Labyrinth of the Poison Dragon seorang diri dengan memakan sang boss hidup-hidup. Memperoleh Hydra Eater, Hydra, dan Black Rose Armor. Mengikuti 1st Event dan meraih peringkat 3. Risa login sebagai Sally.",
    meta: "Hasil: Peringkat 3, 1st Event",
  },
  {
    id: "q2",
    tag: "2nd Event",
    title: "🥈 Second Event Arc",
    summary:
      "Bersama Sally menaklukkan goblin dungeon & Silverwing, lalu menetaskan Syrup dan Oboro.",
    desc: "Maple dan Sally mengikuti 2nd Event. Menjelajahi goblin dungeon, hutan gelap, dan bertarung melawan Silverwing. Mendapatkan telur yang menetas menjadi Syrup (kura-kura hijau) dan Oboro (rubah putih). Berteman dengan Kasumi dan Kanade. Mengalahkan Sea King di ruangan bawah laut selama 4 jam. Menukar medal untuk skill Fortress dan Psychokinesis, menciptakan Flying Fortress.",
    meta: "Hasil: Syrup & Oboro didapat",
  },
  {
    id: "q3",
    tag: "Guild",
    title: "🏰 Guild Founding Arc",
    summary:
      "Mendirikan guild Maple Tree dan menjadi Third Machine God di Dream Graveyard.",
    desc: "Membentuk guild Maple Tree bersama Sally, Kanade, Kasumi, Chrome, dan Iz. Menyelesaikan quest Benevolent Knight dan memperoleh Loving Sacrifice. Memakan domba utuh dan belajar Sheep Eater. Merekrut Mai dan Yui (si kembar). Menemukan Dream Graveyard dan menjadi The Third Machine God.",
    meta: 'Hasil: Guild "Maple Tree" berdiri',
  },
  {
    id: "q4",
    tag: "4th Event",
    title: "⚔️ Guild Competition Arc",
    summary:
      "Menyerang Kingdom of the Flame Emperor dan mengeluarkan Atrocity untuk pertama kali.",
    desc: "4th Event. Maple menyelamatkan Sally menggunakan Machine God. Menyerang Kingdom of the Flame Emperor dan mengalahkan Mii. Menghadapi Congregation of the Holy Swords. Terpojok, Maple mengeluarkan Atrocity. Setelah event, semua rival diundang ke after-party Maple Tree.",
    meta: "Hasil: Atrocity pertama kali muncul",
  },
  {
    id: "q5",
    tag: "Rulership",
    title: "☁️ Rulership Arc",
    summary:
      "Mengalahkan King of Light dan mempelajari Throne of the Heavenly King.",
    desc: "Maple dan Mii menjadi teman fluffing. Menemukan Dewdrop of Heaven. Mengalahkan White Oni (belajar Pandemonium I). Bekerja sama dengan Payne di jungle event. Mengalahkan King of Light dan belajar Throne of the Heavenly King.",
    meta: "Hasil: Throne of the Heavenly King",
  },
  {
    id: "q6",
    tag: "Ghost Layer",
    title: "👻 Ghost Layer Arc",
    summary:
      "Maple Tree menjelajahi 6th Layer dan membantu Sally meraih Connection to the Underworld.",
    desc: "Maple Tree di 6th Layer. Maple membantu Sally mendapatkan Connection to the Underworld. Memperoleh Helping Hands accessory.",
    meta: "Hasil: Helping Hand accessory",
  },
  {
    id: "q7",
    tag: "7th Event",
    title: "🗼 Tower Arc",
    summary:
      "Menaklukkan menara 10 lantai berisi Earth Dragon, golem kristal, hingga Silver Knight.",
    desc: "Maple dan Sally menjelajahi menara 10 lantai. Menghadapi Earth Dragon, lava elemental, golem kristal (peroleh Crystallize), dan Silver Knight yang hampir mengalahkan Maple.",
    meta: "Hasil: Skill Crystallize",
  },
  {
    id: "q8",
    tag: "Companions",
    title: "🐾 Companions Arc",
    summary:
      "Fitur companion resmi rilis; Maple dan Sally mengevolusi Syrup dan Oboro.",
    desc: "Fitur companion resmi. Maple diserang monster tentakel — memperoleh Invitation to the Ocean Floor. Bersama Mii dan Iz mencari fairy companion. Maple dan Sally mengevolusi Syrup dan Oboro.",
    meta: "Hasil: Evolusi companion",
  },
  {
    id: "q9",
    tag: "8th Event",
    title: "🏁 Eighth Event Arc",
    summary:
      "Tiga guild besar bersatu mengalahkan Cthulhu — Maple memberikan pukulan terakhir.",
    desc: "Maple masuk mulut buaya dan mengendalikannya. Tiga guild besar bersatu. Maple, Sally, Mii, dan Frederica mengalahkan Demon Queen. Hari ketiga, ketiga guild mengalahkan Cthulhu dengan Maple memberikan pukulan terakhir.",
    meta: "Hasil: Cthulhu dikalahkan",
  },
];
const equipment = [
  {
    id: "e1",
    name: "Armor of the Black Rose",
    type: "Body Armor",
    rarity: "unique",
    icon: "🛡️",
    tags: ["VIT +100", "Seeping Chaos", "Destruction Growth"],
    desc: 'Armor inti dari Unique Series milik Maple. Memiliki sub-skill Seeping Chaos yang memunculkan dua iblis bayangan, serta Destruction Growth — kekuatannya berevolusi tiap kali armor ini "hancur" dalam pertempuran berat.',
    meta: "Didapat dari: Labyrinth of the Poison Dragon",
  },
  {
    id: "e2",
    name: "Mirror of the Dark Night",
    type: "Shield",
    rarity: "unique",
    icon: "💠",
    tags: ["VIT +65", "Devour", "Ocean Floor"],
    desc: "Perisai unik yang membawa skill Devour, menyerap serangan sihir musuh menjadi MP, serta Invitation to the Ocean Floor yang memunculkan tentakel-tentakel untuk melumpuhkan musuh.",
    meta: "Skill: Devour, 10x/hari",
  },
  {
    id: "e3",
    name: "Crescent Moon (新月)",
    type: "Short Sword",
    rarity: "epic",
    icon: "🗡️",
    tags: ["VIT +30", "Hydra", "Paralyze Shout"],
    desc: "Pedang pendek yang menjadi wadah skill Hydra — rangkaian sihir racun mematikan seperti Deadly Breath, Venom Capsule, Acid Rain, dan Poison Lance.",
    meta: "Skill: Hydra (Poison Magic)",
  },
  {
    id: "e4",
    name: "Snow White",
    type: "Shield",
    rarity: "rare",
    icon: "🛡️",
    tags: ["VIT +40", "Crafted"],
    desc: "Perisai hasil tempaan Iz, dirancang khusus untuk menambah lapisan pertahanan Maple yang sudah luar biasa tinggi.",
    meta: "Crafter: Iz",
  },
  {
    id: "e5",
    name: "Mass of Violet Crystal",
    type: "Shield",
    rarity: "rare",
    icon: "💎",
    tags: ["VIT +30", "Crystal Wall"],
    desc: "Perisai kristal ungu yang membawa skill Crystal Wall — membentuk dinding pelindung dengan HP setara HP pengguna dalam radius 5 meter.",
    meta: "Skill: Crystal Wall",
  },
  {
    id: "e6",
    name: "Forest Queen Bee's Ring",
    type: "Accessory",
    rarity: "rare",
    icon: "💍",
    tags: ["VIT +6", "HP Regen 10%"],
    desc: "Cincin trofi dari Giant Bee, memberi regenerasi HP 10% setiap 10 menit — pelengkap kecil namun berguna bagi fortress hidup ini.",
    meta: "Didapat dari: Giant Bee",
  },
  {
    id: "e7",
    name: "Bridge of Bonds",
    type: "Ring",
    rarity: "common",
    icon: "💍",
    tags: ["Taming Synergy"],
    desc: "Cincin yang memperkuat sinergi antara Maple dan monster peliharaannya saat bertarung bersama.",
    meta: "Fungsi: Monster taming",
  },
  {
    id: "e8",
    name: "Toughness Ring",
    type: "Ring",
    rarity: "common",
    icon: "💍",
    tags: ["HP +30"],
    desc: "Cincin sederhana penambah HP dasar, salah satu dari banyak aksesori kecil yang menumpuk di inventory Maple.",
    meta: "HP +30",
  },
  {
    id: "e9",
    name: "Life Ring",
    type: "Ring",
    rarity: "common",
    icon: "💍",
    tags: ["HP +100"],
    desc: "Cincin dengan bonus HP lebih besar, dipakai untuk semakin mengukuhkan posisi Maple sebagai benteng berjalan.",
    meta: "HP +100",
  },
  {
    id: "e10",
    name: "Helping Hand",
    type: "Necklace",
    rarity: "rare",
    icon: "📿",
    tags: ["+2 Hand Slot"],
    desc: "Kalung yang membuka dua slot tambahan untuk equipment di tangan — memungkinkan Maple membawa lebih banyak senjata sekaligus.",
    meta: "Didapat: Ghost Layer Arc",
  },
  {
    id: "e11",
    name: "Archangel Holy Set",
    type: "Full Set",
    rarity: "legend",
    icon: "👼",
    tags: ["Tiara", "Armor", "Sword", "Shield"],
    desc: "Satu set lengkap karya Iz bertema malaikat, memberi rangkaian bonus HP yang signifikan di seluruh slot.",
    meta: "Crafter: Iz · Full Set",
  },
  {
    id: "e12",
    name: "Ghost Girl's Clothes",
    type: "Armor",
    rarity: "epic",
    icon: "👗",
    tags: ["MP +30", "Poltergeist"],
    desc: "Armor bertema hantu yang membawa skill Poltergeist, cocok dipadukan dengan kombinasi serangan jarak jauh Maple.",
    meta: "Skill: Poltergeist",
  },
];
const skills = [
  {
    id: "s1",
    cat: "active",
    name: "Machine God",
    icon: "🤖",
    tags: ["Korbankan Equipment"],
    desc: "Mengorbankan equipment untuk berubah menjadi senjata raksasa. Terdiri dari Deploy Armaments, Commence Attack, dan Break Core.",
    meta: "Didapat: Quest Junk King",
  },
  {
    id: "s2",
    cat: "active",
    name: "Loving Sacrifice",
    icon: "💞",
    tags: ["Cover Party 10m"],
    desc: "Melindungi seluruh anggota party dalam radius 10 meter. Memiliki sub-skill Aegis (kubah pelindung 10 detik) dan Self-Offering Love.",
    meta: "Didapat: Benevolent Knight quest",
  },
  {
    id: "s3",
    cat: "active",
    name: "Pandemonium I",
    icon: "😈",
    tags: ["1 Menit"],
    desc: "Mentransformasi Maple menjadi Oni Merah & Biru selama satu menit. Skill ini kemudian tersegel akibat dampaknya yang terlalu besar.",
    meta: "Didapat: Mengalahkan White Oni",
  },
  {
    id: "s4",
    cat: "active",
    name: "Atrocity / Savagery",
    icon: "👹",
    tags: ["HP +1000", "STR/AGI +50", "1x/hari"],
    desc: "Transformasi bentuk iblis. Menambah HP sebesar 1000 serta STR dan AGI masing-masing 50, dapat digunakan sekali sehari.",
    meta: "Sub-skill: Seeping Chaos",
  },
  {
    id: "s5",
    cat: "active",
    name: "Wooly",
    icon: "🐑",
    tags: ["1x/hari"],
    desc: "Memunculkan bola wol raksasa seukuran tubuh Maple, dapat dikombinasikan dengan skill racun atau kristal.",
    meta: "Didapat: Sheep Eater",
  },
  {
    id: "s6",
    cat: "active",
    name: "Throne of Heavenly King",
    icon: "👑",
    tags: ["-20% Dmg", "+2% HP/s"],
    desc: "Memunculkan kursi singgasana yang mengurangi damage 20% dan memulihkan 2% HP per detik, sekaligus memblokir skill jahat.",
    meta: "Didapat: Mengalahkan King of Light",
  },
  {
    id: "s7",
    cat: "active",
    name: "Great Eruption",
    icon: "🌋",
    tags: ["MP 50", "CD 3min"],
    desc: "Semburan lava dengan delay 3 detik, menghabiskan 50 MP dengan cooldown 3 menit.",
    meta: "Didapat: 7th Event tower boss",
  },
  {
    id: "s8",
    cat: "active",
    name: "Reverse Rebirth",
    icon: "🔄",
    tags: ["Cost 500 HP"],
    desc: "Mengubah efek skill berikutnya yang digunakan, dengan biaya 500 HP.",
    meta: "Didapat: Lake bottom chest",
  },
  {
    id: "s9",
    cat: "active",
    name: "Cover Move I",
    icon: "⚡",
    tags: ["Instant"],
    desc: "Berpindah posisi secara instan menuju anggota party.",
    meta: "Didapat: Skill Shop",
  },
  {
    id: "s10",
    cat: "active",
    name: "Meditation",
    icon: "🧘",
    tags: ["10 menit"],
    desc: "Memulihkan 1% HP setiap 10 detik selama 10 menit penuh.",
    meta: "Skill pemulihan dasar",
  },
  {
    id: "s11",
    cat: "active",
    name: "Psychokinesis",
    icon: "🌀",
    tags: ["+ Syrup = Flying"],
    desc: "Mengangkat monster dengan kekuatan pikiran. Dikombinasikan dengan Syrup menciptakan Flying Fortress.",
    meta: "Kombinasi: Psychokinesis + Syrup",
  },
  {
    id: "s12",
    cat: "active",
    name: "Crystallize",
    icon: "💎",
    tags: ["Immune Status", "AGI -50%"],
    desc: "Memberikan imun terhadap status buruk selama satu menit, namun mengurangi AGI sebesar 50%.",
    meta: "Didapat: Golem kristal",
  },
  {
    id: "s13",
    cat: "active",
    name: "Unbreakable Shield",
    icon: "🛡️",
    tags: ["-50% Dmg", "30 detik"],
    desc: "Mengurangi damage yang diterima sebesar 50% selama 30 detik.",
    meta: "Skill defensif",
  },
  {
    id: "s14",
    cat: "active",
    name: "Frozen Earth",
    icon: "❄️",
    tags: ["5m radius", "3 detik"],
    desc: "Membekukan area dalam radius 5 meter selama 3 detik.",
    meta: "Skill kontrol area",
  },
  {
    id: "s15",
    cat: "active",
    name: "Heavy Body",
    icon: "⚓",
    tags: ["Immune Knockback"],
    desc: "Memberikan imun terhadap knockback, namun pengguna tidak bisa bergerak selama skill aktif.",
    meta: "Skill pertahanan posisi",
  },
  {
    id: "s16",
    cat: "active",
    name: "Shield Attack",
    icon: "🛡️",
    tags: ["Knockback Kecil"],
    desc: "Serangan dengan perisai yang memberikan efek knockback ringan pada musuh.",
    meta: "Skill serangan dasar",
  },
  {
    id: "s17",
    cat: "active",
    name: "Counter",
    icon: "↩️",
    tags: ["Reflect Dmg"],
    desc: "Damage yang diterima ditambahkan ke serangan balasan berikutnya.",
    meta: "Skill counter-attack",
  },
  {
    id: "s18",
    cat: "active",
    name: "Inspire",
    icon: "📯",
    tags: ["STR/AGI +20%", "1 menit"],
    desc: "Meningkatkan STR dan AGI seluruh party sebesar 20% selama satu menit.",
    meta: "Skill buff party",
  },
  {
    id: "s19",
    cat: "active",
    name: "Quick Change",
    icon: "🔁",
    tags: ["Preset Gear"],
    desc: "Mengganti preset equipment secara instan di tengah pertarungan.",
    meta: "Skill utilitas",
  },
  {
    id: "s20",
    cat: "active",
    name: "Earth Manipulation",
    icon: "🪨",
    tags: ["Earth's Cradle"],
    desc: "Memanipulasi tanah, termasuk sub-skill Earth's Cradle untuk bersembunyi di bawah tanah.",
    meta: "Skill mobilitas",
  },
  {
    id: "s21",
    cat: "passive",
    name: "Total Defense",
    icon: "🛡️",
    tags: ["VIT ×2"],
    desc: "Menggandakan nilai VIT, namun biaya poin untuk STR/AGI/INT menjadi tiga kali lipat.",
    meta: "Skill inti Maple",
  },
  {
    id: "s22",
    cat: "passive",
    name: "Fortress",
    icon: "🏰",
    tags: ["VIT ×1.5"],
    desc: "Mengalikan VIT sebesar 1.5, ditukar dengan medal hasil 2nd Event.",
    meta: "Didapat: Medal 2nd Event",
  },
  {
    id: "s23",
    cat: "passive",
    name: "Giant Killing",
    icon: "⚔️",
    tags: ["Stat ×2"],
    desc: "Saat 4 dari 5 stat utama lebih rendah dari lawan, seluruh stat Maple digandakan secara otomatis.",
    meta: "Skill anomali khas Maple",
  },
  {
    id: "s24",
    cat: "passive",
    name: "Savage / Inhumane",
    icon: "🩸",
    tags: ["VIT +1/hit", "max +25/hari"],
    desc: "Menambah VIT permanen setiap kali menerima serangan, maksimal 25 poin per hari.",
    meta: "Sub-skill Atrocity",
  },
  {
    id: "s25",
    cat: "passive",
    name: "Hydra Eater",
    icon: "🐍",
    tags: ["Poison & Paralysis Immune"],
    desc: "Memberikan imunitas penuh terhadap racun dan paralisis.",
    meta: "Didapat: Memakan Hydra",
  },
  {
    id: "s26",
    cat: "passive",
    name: "Bomb Eater",
    icon: "💣",
    tags: ["-50% Explosion Dmg"],
    desc: "Mengurangi damage ledakan sebesar 50%.",
    meta: "Skill resistensi",
  },
  {
    id: "s27",
    cat: "passive",
    name: "Stout Guardian",
    icon: "❤️",
    tags: ["1x/hari survive 1 HP"],
    desc: "Sekali sehari, Maple akan bertahan dengan 1 HP meski seharusnya tewas.",
    meta: "Skill penyelamat nyawa",
  },
  {
    id: "s28",
    cat: "passive",
    name: "Venom Incantation",
    icon: "☠️",
    tags: ["20% Instant Death"],
    desc: "Racun yang diberikan memiliki peluang 20% menyebabkan kematian instan.",
    meta: "Skill ofensif racun",
  },
  {
    id: "s29",
    cat: "passive",
    name: "Connection to Underworld",
    icon: "👻",
    tags: ["Item Effect ×2"],
    desc: "Menggandakan efek dari seluruh item yang digunakan.",
    meta: "Didapat: Ghost Layer Arc",
  },
  {
    id: "s30",
    cat: "passive",
    name: "Great Shield Mastery IV",
    icon: "🛡️",
    tags: ["-4% Dmg w/ Shield"],
    desc: "Mengurangi damage sebesar 4% selama menggunakan great shield.",
    meta: "Mastery tier 4",
  },
  {
    id: "s31",
    cat: "passive",
    name: "HP Strengthening (Small)",
    icon: "➕",
    tags: ["HP +30"],
    desc: "Penambahan kecil pada HP dasar Maple.",
    meta: "Skill dasar",
  },
  {
    id: "s32",
    cat: "passive",
    name: "MP Strengthening (Small)",
    icon: "➕",
    tags: ["MP +10"],
    desc: "Penambahan kecil pada MP dasar Maple.",
    meta: "Skill dasar",
  },
  {
    id: "s33",
    cat: "passive",
    name: "Blessing of Dark Green",
    icon: "🍃",
    tags: ["LN Vol. 8"],
    desc: "Skill yang diperkenalkan pada Light Novel Volume 8, detail efeknya berkembang seiring cerita.",
    meta: "Sumber: LN Vol. 8",
  },
  {
    id: "s34",
    cat: "passive",
    name: "Parry",
    icon: "🤺",
    tags: ["-1% Dmg"],
    desc: "Mengurangi damage yang diterima sebesar 1% melalui teknik menangkis.",
    meta: "Skill defensif kecil",
  },
  {
    id: "s35",
    cat: "passive",
    name: "Evasion",
    icon: "💨",
    tags: ["-1% Dmg"],
    desc: "Mengurangi damage yang diterima sebesar 1% melalui teknik menghindar.",
    meta: "Skill defensif kecil",
  },
  {
    id: "s36",
    cat: "equip",
    name: "Seeping Chaos",
    icon: "🌑",
    tags: ["Armor Skill"],
    desc: "Skill bawaan Armor of the Black Rose. Memunculkan Predator (dua iblis bayangan, efek Hex) dan cahaya gelap Seeping Chaos.",
    meta: "Sumber: Armor of the Black Rose",
  },
  {
    id: "s37",
    cat: "equip",
    name: "Hydra",
    icon: "🐉",
    tags: ["Crescent Moon Skill"],
    desc: "Rangkaian sihir racun dari pedang Crescent Moon: Paralyze Shout, Deadly Breath, Venom Capsule, Acid Rain, dan Poison Lance.",
    meta: "Sumber: Crescent Moon",
  },
  {
    id: "s38",
    cat: "equip",
    name: "Devour",
    icon: "🌀",
    tags: ["10x/hari"],
    desc: "Menyerap sihir musuh menjadi MP dan menyimpannya dalam bentuk crystal, dapat digunakan hingga 10 kali sehari.",
    meta: "Sumber: Mirror of the Dark Night",
  },
  {
    id: "s39",
    cat: "equip",
    name: "Invitation to Ocean Floor",
    icon: "🐙",
    tags: ["Paralyze"],
    desc: "Memunculkan lengan tentakel bermata emas yang dapat melumpuhkan musuh.",
    meta: "Sumber: Mirror of the Dark Night",
  },
  {
    id: "s40",
    cat: "equip",
    name: "Crystal Wall",
    icon: "🧊",
    tags: ["Radius 5m"],
    desc: "Membentuk dinding kristal dengan HP setara HP pengguna dalam radius 5 meter.",
    meta: "Sumber: Mass of Violet Crystal",
  },
  {
    id: "s41",
    cat: "combo",
    name: "Wooly + Poison Magic",
    icon: "🐑☠️",
    tags: ["Kombinasi"],
    desc: "Bola wol Wooly menyebarkan racun ke area luas, menciptakan ladang racun berjalan.",
    meta: "Kombo signature",
  },
  {
    id: "s42",
    cat: "combo",
    name: "Wooly + Crystallize",
    icon: "🐑💎",
    tags: ["Kombinasi"],
    desc: "Wol berubah menjadi kristal dan menjebak semua musuh di sekitarnya.",
    meta: "Kombo signature",
  },
  {
    id: "s43",
    cat: "combo",
    name: "Psychokinesis + Syrup",
    icon: "🌀🐢",
    tags: ["Flying Fortress"],
    desc: "Mengangkat Syrup ke udara, mengubahnya menjadi tunggangan terbang — Flying Fortress.",
    meta: "Kombo ikonik",
  },
  {
    id: "s44",
    cat: "combo",
    name: "Deploy Barrels + Rampart",
    icon: "🛢️🏰",
    tags: ["Kombinasi"],
    desc: "Peluncuran proyektil secara vertikal menggunakan kombinasi barrel dan rampart.",
    meta: "Kombo Machine God",
  },
  {
    id: "s45",
    cat: "combo",
    name: "Venom Capsule Transport",
    icon: "☣️🎡",
    tags: ["No Fall Damage"],
    desc: "Menggunakan kapsul racun sebagai roda hamster raksasa untuk bergerak tanpa fall damage.",
    meta: "Kombo kreatif Maple",
  },
  {
    id: "s46",
    cat: "combo",
    name: "Deploy Barrels + Poltergeist",
    icon: "🛢️👻",
    tags: ["Kombinasi"],
    desc: "Mengarahkan laser terkendali dengan memadukan barrel dan skill Poltergeist.",
    meta: "Kombo serangan jarak jauh",
  },
  {
    id: "s47",
    cat: "combo",
    name: "Tentacles + Devour",
    icon: "🐙🌀",
    tags: ["Kombinasi"],
    desc: "Tentakel dari Invitation to Ocean Floor memperoleh properti menyerap dari skill Devour.",
    meta: "Kombo defensif-ofensif",
  },
  {
    id: "s48",
    cat: "combo",
    name: "Atrocity Mount",
    icon: "👹🐎",
    tags: ["Guild Transport"],
    desc: "Seluruh anggota guild dapat menunggangi bentuk iblis Maple saat Atrocity aktif.",
    meta: "Kombo transportasi guild",
  },
];
const gallerySections = [
  {
    title: "📖 Light Novel",
    items: [
      {
        src: "../public/image/Maple_LN_Vol1_EN.webp",
        caption: "Light Novel Volume 1 (English)",
        label: "Volume 1",
        sub: "English Cover",
        emoji: "📖",
        grad: "135deg,#2a1a3a,#1a0a2a",
      },
      {
        src: "../public/image/Maple_LN_Vol1.webp",
        caption: "Light Novel Volume 1 (Japanese)",
        label: "Volume 1",
        sub: "Japanese Cover",
        emoji: "📖",
        grad: "135deg,#3a1a2a,#1a0a1a",
      },
      {
        src: "../public/image/Maple_LN_Vol3.webp",
        caption: "Light Novel Volume 3",
        label: "Volume 3",
        sub: "Cover",
        emoji: "📖",
        grad: "135deg,#2a2a3a,#1a1a2a",
      },
      {
        src: "../public/image/Maple_LN_Vol8.webp",
        caption: "Light Novel Volume 8",
        label: "Volume 8",
        sub: "Cover",
        emoji: "📖",
        grad: "135deg,#3a2a1a,#2a1a0a",
      },
    ],
  },
  {
    title: "📚 Manga",
    items: [
      {
        src: "../public/image/Maple_Manga_Vol1.webp",
        caption: "Manga Volume 1",
        label: "Volume 1",
        sub: "Manga Cover",
        emoji: "📚",
        grad: "135deg,#1a2a3a,#0a1a2a",
      },
    ],
  },
  {
    title: "🎬 Anime",
    items: [
      {
        src: "../public/image/Maple_Anime_FirstKill.webp",
        caption: "First Kill — Horned Rabbit",
        label: "First Kill",
        sub: "Horned Rabbit",
        emoji: "🐰",
        grad: "135deg,#2a1a1a,#1a0a0a",
      },
      {
        src: "../public/image/Maple_Anime_AngelArmor.webp",
        caption: "Angel Armor — Loving Sacrifice",
        label: "Angel Armor",
        sub: "Loving Sacrifice",
        emoji: "👼",
        grad: "135deg,#1a1a2a,#0a0a1a",
      },
      {
        src: "../public/image/Maple_Anime_Wooly.webp",
        caption: "Sheep Mode (Wooly)",
        label: "Wooly Mode",
        sub: "Sheep Form",
        emoji: "🐑",
        grad: "135deg,#2a2a1a,#1a1a0a",
      },
    ],
  },
  {
    title: "💿 Digital Covers",
    items: [
      {
        src: "../public/image/Maple_Cover_KyukyokuUnbalance.webp",
        caption: "Kyūkyoku Unbalance",
        label: "Kyūkyoku Unbalance",
        sub: "Digital Cover",
        emoji: "💿",
        grad: "135deg,#1a2a2a,#0a1a1a",
      },
      {
        src: "../public/image/Maple_Cover_PlayTheWorld.webp",
        caption: "Play the World.",
        label: "Play the World.",
        sub: "Digital Cover",
        emoji: "💿",
        grad: "135deg,#2a1a2a,#1a0a1a",
      },
    ],
  },
  {
    title: "🖼️ Others",
    items: [
      {
        src: "../public/image/Maple_Other.webp",
        caption: "Additional Artwork",
        label: "Others",
        sub: "Additional Art",
        emoji: "🖼️",
        grad: "135deg,#2a2a2a,#1a1a1a",
      },
    ],
  },
];

const questLogEl = document.getElementById("mvQuestLog");
quests.forEach((q) => {
  const row = document.createElement("div");
  row.className = "mv-quest";
  row.innerHTML = `<div class="mv-quest-top"><span class="mv-quest-title">${q.title}</span><span class="mv-quest-tag">${q.tag}</span></div><p class="mv-quest-summary">${q.summary}</p><div class="mv-quest-cta">📖 Buka Log Lengkap →</div>`;
  row.addEventListener("click", () =>
    openInspect({
      rarity: "legend",
      icon: q.title.split(" ")[0],
      title: q.title.replace(/^\S+\s/, ""),
      type: "Quest Log Entry",
      tags: [q.tag, "Completed"],
      desc: q.desc,
      meta: q.meta,
    }),
  );
  questLogEl.appendChild(row);
});

const LOADOUT_MAP = {
  weapon: "e3",
  shield: "e2",
  armor: "e1",
  ring: "e6",
  necklace: "e10",
  fullset: "e11",
};
const eqById = (id) => equipment.find((e) => e.id === id);
function renderDollSlot(slotKey, tagLabel) {
  const el = document.getElementById(
    "mvSlot" + slotKey.charAt(0).toUpperCase() + slotKey.slice(1),
  );
  const item = eqById(LOADOUT_MAP[slotKey]);
  el.style.setProperty("--mv-rarity", RARITY[item.rarity]);
  el.innerHTML = `<span class="mv-slot-tag">${tagLabel}</span><div class="mv-slot-icon">${item.icon}</div><div class="mv-slot-name">${item.name}</div><div class="mv-slot-rarity">${RARITY_LABEL[item.rarity]}</div><div class="mv-doll-tooltip"><strong>${item.name}</strong>${RARITY_LABEL[item.rarity]}<br>${item.tags.slice(0, 2).join(" · ")}</div>`;
  el.addEventListener("click", () =>
    openInspect({
      rarity: item.rarity,
      icon: item.icon,
      title: item.name,
      type: item.type,
      tags: item.tags,
      desc: item.desc,
      meta: item.meta,
    }),
  );
}
["weapon", "shield", "armor", "ring", "necklace", "fullset"].forEach((k) =>
  renderDollSlot(k, k.toUpperCase()),
);

const equipGridEl = document.getElementById("mvEquipGrid");
function typeGroup(type) {
  if (type === "Body Armor" || type === "Armor") return "Body Armor";
  if (type === "Shield") return "Shield";
  if (type === "Ring" || type === "Accessory") return "Ring";
  return "Other";
}
function renderEquip(filter) {
  equipGridEl.innerHTML = "";
  equipment
    .filter((it) => filter === "all" || typeGroup(it.type) === filter)
    .forEach((it) => {
      const card = document.createElement("div");
      card.className = "mv-slot-card";
      card.style.setProperty("--mv-rarity", RARITY[it.rarity]);
      card.innerHTML = `<span class="mv-slot-corner">${RARITY_LABEL[it.rarity].replace("★ ", "")}</span><div class="mv-slot-big-icon">${it.icon}</div><div class="mv-slot-card-name">${it.name}</div>`;
      card.addEventListener("click", () =>
        openInspect({
          rarity: it.rarity,
          icon: it.icon,
          title: it.name,
          type: it.type,
          tags: it.tags,
          desc: it.desc,
          meta: it.meta,
        }),
      );
      equipGridEl.appendChild(card);
    });
}
renderEquip("all");
document.getElementById("mvEquipFilters").addEventListener("click", (e) => {
  const btn = e.target.closest(".mv-filter-btn");
  if (!btn) return;
  document
    .querySelectorAll("#mvEquipFilters .mv-filter-btn")
    .forEach((b) => b.classList.remove("mv-active"));
  btn.classList.add("mv-active");
  renderEquip(btn.dataset.type);
});

const skillTreeEl = document.getElementById("mvSkillTree");
const SKILL_RARITY = {
  active: "unique",
  passive: "rare",
  equip: "epic",
  combo: "legend",
};
const CAT_LABEL = {
  active: "🔥 Active Skills",
  passive: "🛡️ Passive Skills",
  equip: "💠 Equipment Skills",
  combo: "✨ Unique Combinations",
};
function renderSkillTree(cat) {
  const list = skills.filter((s) => s.cat === cat);
  const branch = document.createElement("div");
  branch.className = "mv-branch";
  branch.style.setProperty("--mv-rarity", RARITY[SKILL_RARITY[cat]]);
  branch.innerHTML = `<div class="mv-branch-trunk"></div><div class="mv-branch-head"><div class="mv-branch-label">${CAT_LABEL[cat]}</div><div class="mv-branch-count">${list.length} skill dipelajari</div></div><div class="mv-node-grid"></div>`;
  const grid = branch.querySelector(".mv-node-grid");
  list.forEach((s) => {
    const node = document.createElement("div");
    node.className = "mv-node";
    node.innerHTML = `<span class="mv-node-check">✓</span><div class="mv-node-icon">${s.icon}</div><div class="mv-node-name">${s.name}</div><div class="mv-node-tag">${s.tags[0] || ""}</div>`;
    node.addEventListener("click", () =>
      openInspect({
        rarity: SKILL_RARITY[cat],
        icon: s.icon,
        title: s.name,
        type: cat.charAt(0).toUpperCase() + cat.slice(1) + " Skill",
        tags: s.tags,
        desc: s.desc,
        meta: s.meta,
      }),
    );
    grid.appendChild(node);
  });
  skillTreeEl.innerHTML = "";
  skillTreeEl.appendChild(branch);
}
renderSkillTree("active");
document.getElementById("mvSkillFilters").addEventListener("click", (e) => {
  const btn = e.target.closest(".mv-filter-btn");
  if (!btn) return;
  document
    .querySelectorAll("#mvSkillFilters .mv-filter-btn")
    .forEach((b) => b.classList.remove("mv-active"));
  btn.classList.add("mv-active");
  renderSkillTree(btn.dataset.cat);
});

const galleryWrap = document.getElementById("mvGalleryWrap");
gallerySections.forEach((section, sIdx) => {
  const sub = document.createElement("div");
  sub.className = "mv-gallery-sub";
  const carouselId = `mvCarousel${sIdx}`;
  sub.innerHTML = `<div class="mv-gallery-sub-head"><h3 class="mv-h3" style="margin-bottom:0;">${section.title}</h3></div><div class="mv-carousel" id="${carouselId}"></div>`;
  galleryWrap.appendChild(sub);
  const carousel = sub.querySelector(`#${carouselId}`);
  section.items.forEach((item, i) => {
    const g = document.createElement("div");
    g.className = "mv-gallery-item";
    g.style.transitionDelay = i * 80 + "ms";
    g.innerHTML = `<img src="${item.src}" alt="${item.caption}" onerror="this.outerHTML='&lt;div class=&quot;mv-gallery-fallback&quot; style=&quot;background:linear-gradient(${item.grad})&quot;&gt;${item.emoji}&lt;/div&gt;'" /><div class="mv-gallery-label">${item.label}<span>${item.sub}</span></div>`;
    g.addEventListener("click", () =>
      openLightbox(item.src, item.caption, item.emoji, item.grad),
    );
    carousel.appendChild(g);
  });
});
const rollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target
          .querySelectorAll(".mv-gallery-item")
          .forEach((el) => el.classList.add("mv-rolled"));
        rollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
document
  .querySelectorAll(".mv-carousel")
  .forEach((c) => rollObserver.observe(c));

const mvLightbox = document.getElementById("mvLightbox"),
  mvLightboxImg = document.getElementById("mvLightboxImg"),
  mvLightboxCaption = document.getElementById("mvLightboxCaption");
function openLightbox(src, caption, emoji, grad) {
  mvLightboxImg.src = src;
  mvLightboxImg.onerror = () => {
    mvLightboxImg.outerHTML = `<div style="width:60vw;max-width:420px;aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;font-size:96px;border-radius:10px;background:linear-gradient(${grad})" id="mvLightboxImg">${emoji}</div>`;
  };
  mvLightboxCaption.textContent = caption || "";
  mvLightbox.classList.add("mv-active");
}
function closeLightbox() {
  mvLightbox.classList.remove("mv-active");
}
document
  .getElementById("mvLightboxClose")
  .addEventListener("click", closeLightbox);
mvLightbox.addEventListener("click", (e) => {
  if (e.target === mvLightbox) closeLightbox();
});

const overlay = document.getElementById("mvInspectOverlay"),
  panel = document.getElementById("mvInspectPanel");
function openInspect(data) {
  panel.style.setProperty("--mv-rarity", RARITY[data.rarity] || "var(--gold)");
  document.getElementById("mvInspectRarity").textContent =
    RARITY_LABEL[data.rarity] || "";
  document.getElementById("mvInspectIcon").textContent = data.icon || "✨";
  document.getElementById("mvInspectTitle").textContent = data.title;
  document.getElementById("mvInspectType").textContent = data.type;
  document.getElementById("mvInspectTags").innerHTML = (data.tags || [])
    .map((t) => `<span class="mv-inspect-tag">${t}</span>`)
    .join("");
  document.getElementById("mvInspectDesc").textContent = data.desc;
  document.getElementById("mvInspectMeta").innerHTML = data.meta
    ? `<b>${data.meta}</b>`
    : "";
  overlay.classList.add("mv-open");
  panel.classList.add("mv-open");
}
function closeInspect() {
  overlay.classList.remove("mv-open");
  panel.classList.remove("mv-open");
}
document
  .getElementById("mvInspectClose")
  .addEventListener("click", closeInspect);
overlay.addEventListener("click", closeInspect);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeInspect();
    closeLightbox();
  }
});

const tabs = document.querySelectorAll(".mv-tab");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    document
      .getElementById(tab.dataset.target)
      .scrollIntoView({ behavior: "smooth" });
  }),
);
const sections = ["overview", "history", "equipment", "skills", "gallery"].map(
  (id) => document.getElementById(id),
);
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting)
        tabs.forEach((t) =>
          t.classList.toggle("mv-active", t.dataset.target === entry.target.id),
        );
    });
  },
  { rootMargin: "-40% 0px -50% 0px" },
);
sections.forEach((s) => navObserver.observe(s));

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target
          .querySelectorAll(".mv-sb-fill")
          .forEach((f) => (f.style.width = f.dataset.width + "%"));
        entry.target.querySelectorAll(".mv-sb-val").forEach((v) => {
          const target = parseInt(v.dataset.count, 10);
          const dur = 1400,
            start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
            v.textContent = Math.floor(eased * target).toLocaleString("en-US");
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);
statObserver.observe(document.getElementById("mvStatBars"));

window.addEventListener("load", () => {
  setTimeout(
    () => document.getElementById("mv-loader").classList.add("mv-hidden"),
    1000,
  );
});
setTimeout(
  () => document.getElementById("mv-loader").classList.add("mv-hidden"),
  2400,
);
