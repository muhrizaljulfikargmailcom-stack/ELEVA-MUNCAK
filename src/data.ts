import { Mountain, GearItem, RentalPackage } from "./types";

export const MOUNTAINS: Mountain[] = [
  // 1. Trek Ringan
  {
    id: "panderman",
    name: "Gunung Panderman",
    height: 2045,
    difficulty: "Trek Ringan",
    description: "Gunung ikonik di Kota Batu dekat Malang. Treknya pendek dan terpelihara dengan baik, sangat cocok untuk pemula atau pendakian santai akhir pekan bersama teman-teman kampus.",
    coordinates: "7.9011° S, 112.5033° E",
    location: "Kota Batu, Jawa Timur",
    status: "Buka - Cuaca bersahabat",
    image: "https://cdn.ngopibareng.id/imagecache/20190722191357sunrise-gunung-panderman.jpg",
    recommendedGearIds: ["tenda_dome", "sb_biasa", "matras_spons", "kompor_mini"],
  },
  {
    id: "budug_asu",
    name: "Budug Asu (Lereng Arjuno)",
    height: 1400,
    difficulty: "Trek Ringan",
    description: "Terletak di kaki Gunung Arjuno, Singosari. Memiliki hamparan kebun teh yang asri dan trek santai yang ramah bagi pemula yang ingin camping ceria.",
    coordinates: "7.7850° S, 112.6320° E",
    location: "Kec. Singosari, Malang",
    status: "Buka - Cocok untuk Camp Ceria",
    image: "https://www.wowkeren.com/display/images/photo/2020/03/04/00299950_6.jpg",
    recommendedGearIds: ["tenda_dome", "sb_biasa", "matras_spons", "kompor_mini"],
  },

  // 2. Trek Sedang
  {
    id: "butak",
    name: "Gunung Butak",
    height: 2868,
    difficulty: "Trek Sedang",
    description: "Terkenal dengan padang sabana edelweis yang sangat luas dan indah di puncaknya. Memiliki udara dingin di malam hari dan jalur tanah/akar yang menantang tapi seru.",
    coordinates: "7.9231° S, 112.4514° E",
    location: "Malang & Blitar, Jawa Timur",
    status: "Buka - Sabana Hijau",
    image: "https://cozzy.id/uploads/0000/630/2024/10/12/penginapan-murah-hotel-murah-penginapan-terdekat-cozzyid.jpg",
    recommendedGearIds: ["tenda_double", "sb_biasa", "matras_spons", "matras_tambahan", "nesting_set", "headlamp"],
  },
  {
    id: "penanggungan",
    name: "Gunung Penanggungan",
    height: 1653,
    difficulty: "Trek Sedang",
    description: "Sering disebut sebagai miniaturnya Gunung Semeru karena puncaknya yang gundul berpasir. Kaya akan situs arkeologi purbakala berupa candi Hindu di lerengnya.",
    coordinates: "7.6173° S, 112.6247° E",
    location: "Mojokerto & Pasuruan, Jawa Timur",
    status: "Buka - Jalur Tamiajeng",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdDlcKWqxuw_acLLTZ93JcMZJsSxtEK8wP_isBvUHe7Q&s=10",
    recommendedGearIds: ["tenda_double", "sb_biasa", "matras_spons", "nesting_set", "headlamp"],
  },

  // 3. Trek Tinggi / Ekstrem
  {
    id: "semeru",
    name: "Gunung Semeru (Mahameru)",
    height: 3676,
    difficulty: "Trek Dingin/Tinggi",
    description: "Atap Jawa Timur dan gunung tertinggi di Pulau Jawa. Terkenal dengan Danau Ranu Kumbolo dan puncak legendaris Mahameru. Memiliki suhu malam hari ekstrem yang bisa mencapai di bawah 0°C.",
    coordinates: "8.1080° S, 112.9220° E",
    location: "Lumajang & Malang, Jawa Timur",
    status: "Waspada Level III (Siaga)",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnjygGpLYbzHk0R8uBp97F0jARM1u31uty_V2c_FXuVw&s=10",
    recommendedGearIds: ["tenda_storm", "sb_tebal", "matras_spons", "kompor_windshield", "jaket_thermal", "sepatu_kuat", "carrier_60l"],
  },
  {
    id: "arjuno",
    name: "Gunung Arjuno",
    height: 3339,
    difficulty: "Trek Dingin/Tinggi",
    description: "Gunung tinggi dengan jalur pendakian yang panjang, terjal, dan berangin kencang. Menawarkan sabana luas dan situs bersejarah di sepanjang jalur Purwosari.",
    coordinates: "7.7739° S, 112.5961° E",
    location: "Malang & Pasuruan, Jawa Timur",
    status: "Buka - Waspada Angin Kencang",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgtkCBGCOuqOKjuvR4RVqlay4js8ozdkjG3Iry4oJwyw&s=10",
    recommendedGearIds: ["tenda_storm", "sb_tebal", "matras_spons", "kompor_windshield", "jaket_thermal", "sepatu_kuat", "carrier_60l"],
  },
  {
    id: "welirang",
    name: "Gunung Welirang",
    height: 3156,
    difficulty: "Trek Dingin/Tinggi",
    description: "Kembaran Gunung Arjuno yang aktif dengan kawah belerang yang eksotis. Jalur pendakian berbatuan tajam dan memiliki suhu udara yang sangat dingin dengan kepulan asap belerang.",
    coordinates: "7.7900° S, 112.5800° E",
    location: "Malang, Pasuruan & Mojokerto",
    status: "Buka - Jalur Tretes",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl5sRcZzh6Z4XN5LR6uTotaexVNLbZuCBo-pLHPQWfEg&s=10",
    recommendedGearIds: ["tenda_storm", "sb_tebal", "matras_spons", "kompor_windshield", "jaket_thermal", "sepatu_kuat", "carrier_60l"],
  }
];

export const GEAR_ITEMS: GearItem[] = [
  // Trek Ringan / Standar
  {
    id: "tenda_kap2_alloy",
    name: "Tenda Kap 2 Frame Alloy",
    pricePerDay: 30000,
    category: "tenda",
    description: "Tenda kapasitas 2 orang dengan rangka alloy yang ringan dan kokoh.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-me5ZRIPhqn3smJBTqKk-NPQ8-V2MdJ6pQv2JCDnpxg&s=10"
  },
  {
    id: "tenda_kap4_alloy",
    name: "Tenda Kap 4 Frame Alloy",
    pricePerDay: 40000,
    category: "tenda",
    description: "Tenda kapasitas 4 orang dengan rangka alloy kuat penahan angin.",
    imageUrl: "https://down-id.img.susercontent.com/file/sg-11134201-22110-r8ngg4orjejve5"
  },
  {
    id: "tenda_regu",
    name: "Tenda Regu Kap 8-10",
    pricePerDay: 65000,
    category: "tenda",
    description: "Tenda pleton/regu besar muat hingga 8 sampai 10 orang.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1AaYjIaQVWVieVny266HR4r0-l1Pcd_27EOIpe608bA&s=10"
  },
  {
    id: "cangkul",
    name: "Cangkul",
    pricePerDay: 8000,
    category: "tools",
    description: "Cangkul portable untuk keperluan parit tenda atau sanitasi.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9rCucT7ukyUfmaRIDOGvCc2tWvkGvRc6ml79JD7rcaQ&s=10"
  },
  {
    id: "carrier_kecil",
    name: "Carrier 25L-40L",
    pricePerDay: 15000,
    category: "tas",
    description: "Tas gunung kapasitas medium cocok untuk pendakian singkat/toktokan.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYhJ33YzSMKsLb37_MdfDMbvoMp-XObLJzZiJ4rimEOg&s=10"
  },
  {
    id: "carrier_besar",
    name: "Carrier 45L-80L",
    pricePerDay: 20000,
    category: "tas",
    description: "Tas gunung kapasitas besar untuk memuat logistik berhari-hari.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGTNe37lBGhSsJc9qkjRO41uu2Mc8sfew5Ebk8QGj4Yg&s=10g"
  },
  {
    id: "flysheet_2x2",
    name: "Flysheet 2X2",
    pricePerDay: 8000,
    category: "pelindung",
    description: "Celt/flysheet pelindung air hujan dan badai ukuran 2x2 meter.",
    imageUrl: "https://your-storage-link.com/images/flysheet_2x2.jpg"
  },
  {
    id: "flysheet_3x4",
    name: "Flysheet 3X4",
    pricePerDay: 15000,
    category: "pelindung",
    description: "Celt/flysheet pelindung atau barlindung teras tenda ukuran 3x4 meter.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQVkIJz44eBYvqCW_wmM7oCnnhvsvdQHrKD83nUdAWeA&s=10"
  },
  {
    id: "hammock",
    name: "Hammock",
    pricePerDay: 10000,
    category: "santai",
    description: "Tempat tidur gantung kain kuat untuk bersantai di antara pepohonan.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAepWixCQrSFbRSQwyRHxa2O4XVNW9-Kj42OwJ6BDeXQ&s"
  },
  {
    id: "handy_talky",
    name: "Handy Talky (HT)",
    pricePerDay: 15000,
    category: "komunikasi",
    description: "Alat komunikasi radio dua arah penunjang koordinasi tim di gunung.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpwYmazIpCVTkA0tKskwKouQDc-lKllXOpXfjBbMsQzQ&s=10"
  },
  {
    id: "headlamp",
    name: "Headlamp",
    pricePerDay: 7000,
    category: "penerangan",
    description: "Senter kepala praktis untuk pendakian malam hari (summit attack).",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnlsyUDGsfeNc0n_i45FFJdULQLL9jtAUhYS9nBihOIg&s=10"
  },
  {
    id: "kompor_kotak",
    name: "Kompor Kotak",
    pricePerDay: 8000,
    category: "memasak",
    description: "Kompor portable mini model kotak menggunakan gas kaleng.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5_9BX56RXE5AR-QCmwKQx0ev41zQdSVVLXUkTvbc9bg&s=10"
  },
  {
    id: "kursi_lipat",
    name: "Kursi Lipat",
    pricePerDay: 15000,
    category: "santai",
    description: "Kursi lipat outdoor praktis dan nyaman untuk bersantai di camp.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ5cB_kGrhGqKdOHCrAT6jR-PFHjnXTByTFl8NjjMuZA&s=10"
  },
  {
    id: "lampu_tenda",
    name: "Lampu Tenda",
    pricePerDay: 5000,
    category: "penerangan",
    description: "Lampu penerangan gantung khusus di dalam tenda.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWnTCFv0jKjgSfT8m-b6ukoujKkHFar-6ei920zEJzXA&s=10"
  },
  {
    id: "meja_lipat",
    name: "Meja Lipat",
    pricePerDay: 15000,
    category: "santai",
    description: "Meja lipat outdoor untuk meletakkan masakan dan kopi.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO0oZO5KgaWt46FyvK3eqvPgy9TrfQyWguUYY1K3Znyw&s=10"
  },
  {
    id: "nesting_kecil",
    name: "Nesting Kecil",
    pricePerDay: 6000,
    category: "memasak",
    description: "Panci masak camping susun ukuran kecil/standar.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHNfRUfPBTecNsjKkjfahgbatsWlrjCuHWy8mV-CuQIA&s=10"
  },
  {
    id: "nesting_besar",
    name: "Nesting Besar",
    pricePerDay: 10000,
    category: "memasak",
    description: "Panci masak camping susun kapasitas lebih besar untuk tim.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHNfRUfPBTecNsjKkjfahgbatsWlrjCuHWy8mV-CuQIA&s=10"
  },
  {
    id: "power_bank",
    name: "Power Bank 30000 mAh",
    pricePerDay: 15000,
    category: "elektronik",
    description: "Pengisi daya darurat kapasitas monster 30000 mAh penunjang gadget.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxanqy92MIvwPkLq_R9WUM3io4ijHLuI24CxNNQKqL_Q&s=10"
  },
  {
    id: "sleeping_bag",
    name: "Sleeping Bag",
    pricePerDay: 10000,
    category: "tidur",
    description: "Kantong tidur hangat pelindung dari udara dingin pegunungan.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQelZNIc6crQuQoJjbUh8r4BdpuHhvRfqY9vFIZCNtcA&s=10"
  },
  {
    id: "toa",
    name: "TOA / Megaphone",
    pricePerDay: 40000,
    category: "komunikasi",
    description: "Pengeras suara portabel untuk pengondisian rombongan besar.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd5T6ELe0dy9sX_239CnEv6v8--FevCrXF5566RDVXdw&s=10"
  },
  {
    id: "tracking_pole",
    name: "Tracking Pole",
    pricePerDay: 10000,
    category: "pendukung",
    description: "Tongkat daki penahan beban lutut saat naik dan turun trek.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3iUwh9ep4GqCsYaMTGNQS3lBOClYrcihDozh8E4buog&s=10g"
  },
  {
    id: "tripod",
    name: "Tripod",
    pricePerDay: 10000,
    category: "elektronik",
    description: "Penyangga kamera atau HP untuk dokumentasi estetik.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-XeZFZNJxWYMBdEpvFIZkhRxug3XMcJo2PPA3k2JevQ&s=10"
  },
  {
    id: "set_grill",
    name: "Alat Grill Satu Set",
    pricePerDay: 55000,
    category: "memasak",
    description: "Paket lengkap bakar-bakar: Kompor, Pan Grill, Gas Kaleng, dan Pencapit.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaBYYlCc8YJBN517u5bn9KY9Q-fTXhqzagnlmnONt-SA&s=10"
  },
  {
    id: "sepatu_tracking",
    name: "Sepatu Tracking",
    pricePerDay: 25000,
    category: "pakaian",
    description: "Sepatu tracking kokoh bersol tebal anti-slip pelindung kaki.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwM0_O-TpYSphPAijzHqvur--W4jiQahg4hR_TtTtN-g&s=10",
    availableColors: ["Hitam", "Abu-abu", "Coklat", "Army", "Ping"],
    availableSizes: [39, 40, 41, 42, 43, 44],
    availableModels: ["Low Cut", "Mid Cut"]
  },
  {
    id: "jaket_outdoor",
    name: "Jaket",
    pricePerDay: 15000,
    category: "pakaian",
    description: "Jaket gunung hangat tahan angin (windproof) dan penahan hawa dingin.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx2oMR-GBoZTjLbWhgZBxNj5H75nQ1r5eW9LKeAf6SZA&s=10",
    availableColors: ["Hitam", "Merah", "Navy", "Pink", "Coklat"],
    availableSizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "tenda_single_fiber",
    name: "Tenda Single Layer Frame Fiber Kap 4",
    pricePerDay: 30000,
    category: "tenda",
    description: "Tenda single layer praktis berkapasitas 4 orang dengan rangka fiber.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq4mCRroqa6ARrup_cpXGqOU_icO_sbJLitL3M8pPu9g&s=10g"
  }
];

export const PACKAGES: RentalPackage[] = [
  {
    id: "paket_panderman",
    name: "Paket Panderman (Trek Ringan)",
    description: "Paket hemat lengkap alat standar siap pakai untuk berpetualang santai di trek ramah pemula.",
    pricePerDay: 25000, // exact promo price requested: Rp25.000/hari
    gearIds: ["tenda_dome", "sb_biasa", "matras_spons", "kompor_mini"],
    type: "ringan",
    badge: "Trek Ringan - Best Seller maba"
  },
  {
    id: "paket_butak",
    name: "Paket Butak / Penanggungan (Trek Sedang)",
    description: "Paket muncak asik dengan tenda double layer tahan angin/kondensasi, nesting masak, dan senter kepala.",
    pricePerDay: 30000,
    gearIds: ["tenda_double", "sb_biasa", "matras_spons", "nesting_set", "headlamp"],
    type: "sedang",
    badge: "Trek Sedang - Terfavorit"
  },
  {
    id: "paket_semeru",
    name: "Paket Semeru Pro (Trek Tinggi/Ekstrem)",
    description: "Paket super safety & lengkap dengan proteksi thermal dan windproof penuh untuk menghadapi angin dan suhu dingin di puncak tinggi.",
    pricePerDay: 80000,
    gearIds: ["tenda_storm", "sb_tebal", "matras_spons", "kompor_windshield", "jaket_thermal", "sepatu_kuat", "carrier_60l"],
    type: "tinggi",
    badge: "Trek Tinggi - Safety Prioritas Utama"
  }
];
