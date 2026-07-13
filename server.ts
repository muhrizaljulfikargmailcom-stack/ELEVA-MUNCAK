import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy-initialized Gemini client helper
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

const SYSTEM_INSTRUCTION = `
SYSTEM INSTRUCTIONS UNTUK CAMPABOT (APLIKASI ELEVA MUNCAK NGALAM)

[PERAN & IDENTITAS]
Nama: CampaBot
Peran: Asisten AI Pendakian & Layanan Pelanggan resmi dari aplikasi "Eleva".
Konsep Aplikasi: Eleva adalah platform persewaan alat gunung khusus mahasiswa di Malang Raya dengan sistem jaminan KTM (Kartu Tanda Mahasiswa), tanpa uang jaminan tunai.

[ATURAN UTAMA BAHASA (WAJIB)]
- BAHASA WAJIB: CampaBot WAJIB menjawab menggunakan Bahasa Indonesia yang baik, ramah, santai, sopan, dan MUDAH DIPAHAMI oleh semua orang.
- HINDARI BOSO WALIKAN / DIALEK MEMBINGUNGKAN: SANGAT DILARANG menggunakan kata-kata terbalik (boso walikan khas Malang yang rumit seperti "kajnan", "nawak") atau dialek daerah yang berlebihan agar semua orang dari luar daerah pun bisa paham dengan mudah. Tetap ramah dan santai tanpa membingungkan.
- ANTI-BAHASA ASING: SAMA SEKALI TIDAK BOLEH menjawab dalam bahasa Inggris atau bahasa asing lainnya. Jika pengguna bertanya dalam bahasa Inggris, pahami maksudnya namun WAJIB membalasnya dengan Bahasa Indonesia yang mudah dipahami. Jangan pernah menggunakan kata-kata bahasa Inggris kecuali istilah teknis alat gunung (seperti "sleeping bag", "carrier", "headlamp", "double layer").

[GAYA BAHASA & KEPRIBADIAN (TONE of VOICE)]
- Santai, kasual, bersahabat, menggunakan gaya bahasa yang sopan, ramah, dan komunikatif.
- Tunjukkan sikap responsif, informatif, dan mengutamakan keselamatan pendakian (safety first).

[PENGETAHUAN PRODUK & REKOMENDASI GUNUNG]
1. Trek Ringan (Contoh: Gunung Panderman, Budug Asu):
   - Karakter: Jalur pendek, relatif aman untuk pemula, tidak terlalu dingin.
   - Rekomendasi Alat: Tenda dome standar, kantong tidur (sleeping bag) biasa, matras, dan kompor portable mini.
   - Solusi Aplikasi: Arahkan pelanggan untuk menyewa "Paket Panderman" seharga Rp25.000/hari di menu "Katalog Paket".

2. Trek Sedang (Contoh: Gunung Butak, Penanggungan):
   - Karakter: Dingin di malam hari, jalur tanah dan akar pohon, durasi sedang.
   - Rekomendasi Alat: Tenda double layer (tahan angin/hujan), nesting (panci masak), senter kepala (headlamp), dan matras tambahan.
   - Solusi Aplikasi: Arahkan pelanggan ke paket Trek Sedang di menu "Katalog Paket".

3. Trek Tinggi / Ekstrem (Contoh: Gunung Semeru, Arjuno, Welirang):
   - Karakter: Suhu dingin ekstrem, angin kencang, jalur berbatu pasir panjang, berbahaya jika tidak siap.
   - Rekomendasi Alat: Tenda kualitas badai (stormproof), tas carrier kapasitas 60L+, jaket windproof/thermal hangat, kompor windshield, dan sepatu tracking yang kuat.
   - Solusi Aplikasi: Arahkan pelanggan ke "Paket Semeru Pro" atau paket Trek Tinggi di menu "Katalog Paket".

[KEBIJAKAN RENTAL & SOLUSI NAVIGASI APLIKASI (UI/UX)]
- Jaminan Sewa Tanpa Deposit:
  Jika ditanya syarat sewa, jelaskan dengan ramah bahwa mahasiswa Malang cukup mendaftar dan mengunggah foto KTM aktif di menu "Verifikasi KTM" atau "Profil & Jaminan KTM". Tidak perlu meninggalkan KTP asli atau membayar deposit tunai.
- Kendala Login / Masuk Aplikasi:
  Jika pengguna mengeluh gagal masuk lewat Google di halaman awal karena pop-up terblokir, beritahu mereka untuk menekan tombol "Akses Instan Mode Pembeli (Demo)" untuk mencoba, atau klik "BUKA DI TAB BARU".
- Proses Menambah Barang:
  Beritahu pengguna bahwa mereka bisa mengeklik tombol "Sewa" di katalog untuk menambah barang ke keranjang belanja.
  Jelaskan bahwa di halaman Keranjang Belanja/Kalkulator, mereka bisa mengetik jumlah barang secara langsung pada kolom jumlah (quantity field) tanpa harus menekan tombol (+) berulang-ulang.
- Info Rute Gunung Live:
  Beritahu pengguna untuk melihat "Ticker Bar" di bagian atas halaman aplikasi untuk melihat status keamanan jalur pendakian terkini di Jawa Timur (misal: Semeru waspada level III, Butak/Panderman dibuka).

[BATASAN KEAMANAN (ANTI-HALUSINASI)]
- JANGAN menjawab pertanyaan di luar konteks pendakian gunung, keselamatan luar ruangan, atau bantuan navigasi aplikasi Eleva.
- Tolak pertanyaan di luar lingkup di atas dengan gaya bahasa bersahabat, lalu kembalikan fokus ke pendakian.
- Contoh penolakan: "Waduh, kalau soal [topik di luar konteks] CampaBot kurang paham. Tapi kalau mau tanya jalur pendakian ke Gunung Butak atau sewa tenda, aku siap bantu!"

[CONTOH MASUKAN & KELUARAN (FEW-SHOT EXAMPLES FOR TRAINING)]
Input  : "Saya maba di Malang, mau naik ke Semeru tapi tidak punya alat sama sekali. Butuh apa saja?"
Output : "Halo! Selamat datang di Malang! Pilihan yang luar biasa untuk mendaki ke Semeru. Namun perlu diingat ya, Semeru memiliki jalur pendakian yang tinggi dan suhu dingin yang ekstrem, jadi aspek keselamatan harus menjadi nomor satu! ⛺️
CampaBot menyarankan kamu wajib menyewa peralatan yang memadai: Tenda anti badai (stormproof), jaket thermal hangat, tas carrier minimal 60L, dan sepatu tracking yang kuat. Di katalog Eleva, kamu bisa langsung mencari 'Paket Semeru Pro' agar mendapatkan harga bundling yang lebih hemat!
Untuk penyewaan sangat mudah, cukup unggah foto KTM aktif kamu di halaman profil aplikasi agar tidak perlu membayar uang jaminan/deposit tambahan. Ada lagi yang ingin kamu tanyakan seputar Semeru?"

Input  : "Can you speak in English? Recommend some mountains."
Output : "Mohon maaf sekali, CampaBot saat ini hanya dapat berbicara menggunakan Bahasa Indonesia agar lebih mudah dipahami oleh semua pengguna! Namun akan saya bantu jelaskan ya. Jika kamu ingin mendaki gunung yang indah di sekitar Malang, ada Gunung Panderman yang santai untuk pemula, Gunung Butak untuk pemandangan sabana edelweis yang indah, atau Gunung Semeru yang ekstrem dan megah! Penasaran dengan gunung yang mana?"

Input  : "Bagaimana cara membuat skripsi yang cepat selesai?"
Output : "Waduh, kalau resep membuat skripsi cepat selesai itu di luar jangkauan kemampuan CampaBot, hehe. 
Namun, jika kamu membutuhkan tips menyusun barang bawaan di dalam tas carrier agar punggung tidak sakit saat mendaki Gunung Butak akhir pekan nanti, CampaBot siap menjelaskan! Bagaimana, mau saya bantu rekomendasikan peralatan pendakian yang tepat?"

[CRITICAL REMINDER]
- YOU MUST NEVER REPLY IN ENGLISH.
- ALL REPLIES MUST BE WRITTEN IN CLEAR, EASY-TO-UNDERSTAND INDONESIAN ONLY.
- DO NOT USE CONFUSING REVERSED WORDS OR HEAVY LOCAL SLANG.
- NEVER INCLUDE ENGLISH EXPLANATIONS EVEN IF THE USER ASKS FOR IT.
`;

// Chat API Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format. Must be an array." });
    }

    const client = getGeminiClient();

    // Filter and normalize messages to ensure strict compliance with Gemini API:
    // 1. Must alternate strictly: user, model, user, model...
    // 2. Must start with a 'user' message
    const formattedContents: any[] = [];
    let expectedRole = "user";

    for (const m of messages) {
      const normalizedRole = m.role === "assistant" ? "model" : m.role;
      if (normalizedRole === expectedRole) {
        formattedContents.push({
          role: normalizedRole,
          parts: [{ text: m.content }],
        });
        // Alternate expected role
        expectedRole = expectedRole === "user" ? "model" : "user";
      } else if (formattedContents.length > 0 && normalizedRole === formattedContents[formattedContents.length - 1].role) {
        // Append text to the last message of the same role
        formattedContents[formattedContents.length - 1].parts[0].text += "\n" + m.content;
      }
    }

    // Ensure the array is not empty and ends with a user turn
    if (formattedContents.length === 0) {
      return res.status(400).json({ error: "No valid user messages found." });
    }

    if (formattedContents[formattedContents.length - 1].role === "model") {
      formattedContents.pop();
    }

    if (formattedContents.length === 0) {
      return res.status(400).json({ error: "No valid user messages found after cleanup." });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Maaf Ker, ada gangguan teknis. Bisa diulangi lagi?";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Gagal memproses pesan. Pastikan API Key sudah terpasang dengan benar di Settings.",
      details: error.message,
    });
  }
});

// Document Validation (Multimodal Vision) API Endpoint
app.post("/api/verify-document", async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image || !mimeType) {
      return res.status(400).json({ error: "Missing image or mimeType parameter." });
    }

    const client = getGeminiClient();

    const imagePart = {
      inlineData: {
        mimeType,
        data: image,
      },
    };

    const promptPart = {
      text: `You are an automated document validation system for Eleva, a mountain gear rental service in Malang, Indonesia.
Your task is to thoroughly analyze the uploaded image and verify if it is a valid Indonesian official identity document: either Kartu Tanda Penduduk (KTP), Kartu Tanda Mahasiswa (KTM), or Surat Izin Mengemudi (SIM).

Strict Criteria:
1. It MUST be an actual, legible official ID card of Indonesia (KTP, KTM, or SIM).
2. It CANNOT be a photo of scenery, an ordinary selfie, food, pets, a black or blank image, random objects, or clear forged documents.
3. If it is a valid KTP, KTM, or SIM, you must extract:
   - Document Type (MUST be exactly "KTP", "KTM", or "SIM").
   - The Name of the person (Nama Pengguna).
   - The Identity/Student ID Number (NIK/NIM/No. SIM).
   - The Date of Birth (Tanggal Lahir) if available on the card, formatted EXACTLY as "DD-MM-YYYY" (e.g. "17-08-1995" or "02-12-2001").

You must output a JSON object adhering strictly to this schema:
{
  "valid": boolean,
  "type": "KTP" | "KTM" | "SIM" | null,
  "name": string | null,
  "idNumber": string | null,
  "birthDate": string | null,
  "message": string
}

Required Format for "message":
- If "valid" is true:
  The "message" field MUST be EXACTLY:
  "VALIDASI BERHASIL: Dokumen [KTP/KTM/SIM] atas nama [Nama Pengguna] berhasil diverifikasi. Kamu bisa melanjutkan ke proses checkout, Sam/Mbak!"
  Replace [KTP/KTM/SIM] with the detected type, and [Nama Pengguna] with the extracted name (use Title Case).
  
- If "valid" is false:
  The "message" field MUST be EXACTLY:
  "VALIDASI GAGAL: Waduh Sam/Mbak, foto yang diunggah sepertinya bukan dokumen KTP, KTM, atau SIM yang jelas. Tolong pastikan kartu berada di posisi tegak, tidak blur, dan gambarnya terlihat jelas ya. Silakan coba unggah ulang!"
`
    };

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, promptPart],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: { type: Type.BOOLEAN },
            type: { type: Type.STRING },
            name: { type: Type.STRING },
            idNumber: { type: Type.STRING },
            birthDate: { type: Type.STRING },
            message: { type: Type.STRING },
          },
          required: ["valid", "type", "name", "idNumber", "birthDate", "message"],
        },
        temperature: 0.2,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text received from Gemini API.");
    }

    const verificationResult = JSON.parse(resultText.trim());

    // --- Strict Logical Validation ---
    if (verificationResult.valid && verificationResult.type === "KTP") {
      const rawNik = verificationResult.idNumber ? verificationResult.idNumber : "";
      // Clean up NIK (remove spaces, dots, dashes)
      const cleanNik = rawNik.replace(/[\s\-\.\:\_]/g, "");

      // 1. Check if NIK is exactly 16 digits
      const is16Digits = /^\d{16}$/.test(cleanNik);
      if (!is16Digits) {
        verificationResult.valid = false;
        verificationResult.message = `VALIDASI GAGAL: Waduh Sam/Mbak, nomor NIK pada KTP yang terdeteksi tidak valid (terdeteksi "${rawNik}", harus berupa 16 digit angka). Tolong pastikan foto KTP terlihat jelas, tidak blur, dan coba unggah ulang!`;
      } else {
        // Update to clean NIK
        verificationResult.idNumber = cleanNik;

        // 2. Cross-validate NIK with Birth Date (Tanggal Lahir)
        const birthDateStr = verificationResult.birthDate; // Format: DD-MM-YYYY
        if (birthDateStr && /^\d{2}-\d{2}-\d{4}$/.test(birthDateStr)) {
          const [dayStr, monthStr, yearStr] = birthDateStr.split("-");
          const day = parseInt(dayStr, 10);
          const month = parseInt(monthStr, 10);
          const yearTwoDigits = yearStr.slice(-2); // e.g. "95" or "02"
          
          // NIK date of birth is at index 6 to 11 (digits 7 to 12)
          const nikBirthPart = cleanNik.substring(6, 12);
          
          // Male NIK format: DDMMYY (e.g. 170895)
          const maleDayStr = dayStr.padStart(2, "0");
          const maleBirthPart = `${maleDayStr}${monthStr}${yearTwoDigits}`;
          
          // Female NIK format: (DD+40)MMYY (e.g. 570895)
          const femaleDay = day + 40;
          const femaleDayStr = femaleDay.toString().padStart(2, "0");
          const femaleBirthPart = `${femaleDayStr}${monthStr}${yearTwoDigits}`;
          
          const isSynced = (nikBirthPart === maleBirthPart || nikBirthPart === femaleBirthPart);
          
          if (!isSynced) {
            verificationResult.valid = false;
            verificationResult.message = `VALIDASI GAGAL: Waduh Sam/Mbak, KTP atas nama ${verificationResult.name} berpotensi palsu! Data NIK (${cleanNik}) dan Tanggal Lahir (${birthDateStr}) tidak sinkron secara logika kependudukan resmi. Silakan coba unggah ulang dokumen asli yang sah!`;
          } else {
            verificationResult.message = `VALIDASI BERHASIL: Dokumen KTP atas nama ${verificationResult.name} berhasil diverifikasi secara logika. NIK: ${cleanNik} terbukti sinkron dengan Tanggal Lahir ${birthDateStr}. Kamu bisa melanjutkan ke proses checkout, Sam/Mbak!`;
          }
        } else {
          // If birthDate format is off or missing but NIK is 16 digits, we still pass but with standard success
          verificationResult.message = `VALIDASI BERHASIL: Dokumen KTP atas nama ${verificationResult.name} berhasil diverifikasi. NIK: ${cleanNik} terverifikasi 16 digit. Kamu bisa melanjutkan ke proses checkout, Sam/Mbak!`;
        }
      }
    }

    res.json(verificationResult);
  } catch (error: any) {
    console.error("Document Verification Error:", error);
    res.status(500).json({
      error: "Gagal memproses validasi dokumen.",
      details: error.message,
    });
  }
});


// AI Backend Processor (Multi-role KYC, Struk, and Owner dashboard/query processor)
app.post("/api/ai-processor", async (req, res) => {
  try {
    const { image, mimeType, text } = req.body;
    
    if (!image && !text) {
      return res.status(400).json({
        is_valid_logic: false,
        status_message: "Waduh Sam/Mbak, tidak ada input gambar maupun teks yang dikirimkan."
      });
    }

    const client = getGeminiClient();
    const contents: any[] = [];

    // If image is provided, add the image part
    if (image && mimeType) {
      contents.push({
        inlineData: {
          mimeType,
          data: image,
        },
      });
    }

    // Add prompt instructions combined with any user text input
    const systemPrompt = `
Anda adalah AI Backend Processor untuk aplikasi penyewaan alat pendakian profesional secara REAL-TIME. Tugas Anda adalah memproses input gambar atau teks berdasarkan peran pengguna (Penyewa atau Pemilik) dan mengembalikan respons dalam format JSON terstruktur bersih tanpa teks penjelasan tambahan di luar JSON.

KONDISI AWAL STOK (REAL-TIME STATE):
Semua alat dalam kondisi awal "Belum Ada yang Menyewa". Nilai "sedang_disewa" diatur ke 0, dan "tersedia" sama dengan "total_stok" (STOK FULL).

Berikut adalah acuan DATA INVENTARIS RESMI + DATA GAMBAR UTAMA untuk UI Aplikasi:
1. Tenda Dome Double Layer (Merek: Consina, Eiger, Naturehike, Rei | Warna: Hijau Army/Abu)
   - Ukuran 2P (Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/tenda-2p.jpg"
   - Ukuran 4P (Stok: 5)  -> Gambar: "https://domain-apk-anda.com/images/tenda-4p.jpg"
   - Ukuran 6P (Stok: 5)  -> Gambar: "https://domain-apk-anda.com/images/tenda-6p.jpg"
2. Flysheet Ripstop Waterproof (Warna: Hijau Army | Ukuran: 3×4 m & 4×6 m | Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/flysheet.jpg"
3. Carrier Hiking Backpack (Merek: Consina, Eiger, Avtech, Rei | Warna: Hitam)
   - Ukuran 45L (Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/carrier-45l.jpg"
   - Ukuran 60L (Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/carrier-60l.jpg"
   - Ukuran 75L (Stok: 5)  -> Gambar: "https://domain-apk-anda.com/images/carrier-75l.jpg"
4. Daypack Backpack Hiking (Warna: Hitam | Ukuran: 20L–30L | Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/daypack.jpg"
5. Sleeping Bag Mummy (Merek: Consina, Rei, Naturehike | Warna: Hitam/Biru | Stok: 30) -> Gambar: "https://domain-apk-anda.com/images/sb-mummy.jpg"
6. Matras Aluminium Foil EVA (Warna: Silver | Ukuran: 180×50 cm | Stok: 30) -> Gambar: "https://domain-apk-anda.com/images/matras-foil.jpg"
7. Kompor Portable Butane (Merek: Fire Maple, Widesea, SPEEDS | Warna: Hitam | Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/kompor-portable.jpg"
8. Nesting Aluminium Hard Anodized (Warna: Abu | Ukuran: 2-3P & 4-5P | Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/nesting.jpg"
9. Gas Kaleng Butane 230 g (Stok: 20) -> Gambar: "https://domain-apk-anda.com/images/gas-kaleng.jpg"
10. Headlamp LED Rechargeable (Merek: Naturehike, Nitecore, Eiger | Warna: Hitam | Specs: 300-500 lm | Stok: 20) -> Gambar: "https://domain-apk-anda.com/images/headlamp.jpg"
11. Senter LED (Warna: Hitam | Specs: Sedang | Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/senter.jpg"
12. Trekking Pole Lipat Aluminium (Warna: Hitam | Specs: 65-135 cm | Stok: 20) -> Gambar: "https://domain-apk-anda.com/images/trekking-pole.jpg"
13. Hammock Parasut (Warna: Hijau Army | Ukuran: Single | Stok: 15) -> Gambar: "https://domain-apk-anda.com/images/hammock.jpg"
14. Kursi Lipat Folding Chair (Warna: Hitam | Ukuran: Dewasa | Stok: 15) -> Gambar: "https://domain-apk-anda.com/images/kursi-lipat.jpg"
15. Meja Lipat Aluminium Foldable (Warna: Silver | Ukuran: 60×40 cm | Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/meja-lipat.jpg"
16. Jas Hujan Poncho (Warna: Hijau Army | Ukuran: All Size | Stok: 20) -> Gambar: "https://domain-apk-anda.com/images/jas-hujan.jpg"
17. Gaiter Waterproof (Warna: Hitam | Ukuran: M/L | Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/gaiter.jpg"
18. Sarung Tangan Outdoor (Warna: Hitam | Ukuran: M/L | Stok: 15) -> Gambar: "https://domain-apk-anda.com/images/sarung-tangan.jpg"
19. Dry Bag Waterproof (Warna: Orange/Hitam | Ukuran: 10L & 20L | Stok: 15) -> Gambar: "https://domain-apk-anda.com/images/drybag.jpg"
20. Tali Paracord 550 (Warna: Hitam | Ukuran: 15–30 m | Stok: 10) -> Gambar: "https://domain-apk-anda.com/images/tali-paracord.jpg"
21. Pasak Cadangan Aluminium Y Peg (Warna: Silver | Ukuran: 18–20 cm | Stok: 30) -> Gambar: "https://domain-apk-anda.com/images/pasak.jpg"
22. P3K First Aid Kit (Warna: Merah | Ukuran: Sedang | Stok: 5) -> Gambar: "https://domain-apk-anda.com/images/p3k.jpg"

*KATEGORI TAMBAHAN (APPAREL & CLOTHING):*
23. Jaket Outdoor Waterproof (Merek: Eiger, Consina | Warna: Hitam/Hijau | Ukuran: M, L, XL | Stok: 15) -> Gambar: "https://domain-apk-anda.com/images/jaket-outdoor.jpg"
24. Celana Cargo Quickdry (Merek: Arei, Eiger | Warna: Hitam/Abu | Ukuran: 28, 30, 32, 34 | Stok: 15) -> Gambar: "https://domain-apk-anda.com/images/celana-cargo.jpg"
25. Sepatu Gunung Hiking (Merek: SNTA, Eiger | Warna: Hitam/Cokelat | Ukuran: 40, 41, 42, 43 | Stok: 15) -> Gambar: "https://domain-apk-anda.com/images/sepatu-gunung.jpg"
26. Base Layer Thermal (Merek: Core, Outdoor | Warna: Hitam | Ukuran: M, L, XL | Stok: 15) -> Gambar: "https://domain-apk-anda.com/images/base-layer.jpg"

IKUTI ATURAN BERIKUT BERDASARKAN HAK AKSES PENGGUNA:

========================================
1. AKSES UNTUK PENYEWA (TENANT ACCESS)
========================================
Fokus: Menyajikan katalog berwujud Grid View/List View untuk antarmuka UI aplikasi, wajib menampilkan properti gambar_url.

A. Jika Penyewa Membuka/Mencari Daftar Alat Pendakian:
- Keluarkan data list produk terstruktur lengkap dengan URL gambar masing-masing produk agar sistem frontend bisa merender komponen foto.
- Output JSON format untuk Daftar Produk Penyewa:
{
  "role": "penyewa",
  "action": "view_daftar_katalog",
  "daftar_produk": [
    {
      "id_alat": "tenda-2p",
      "kategori": "Tenda",
      "nama_produk": "Tenda Dome Double Layer (2P)",
      "gambar_url": "https://domain-apk-anda.com/images/tenda-2p.jpg",
      "merek": "Consina, Eiger, Naturehike, Rei",
      "specs": "Dome Double Layer (2P)",
      "warna": "Hijau Army/Abu",
      "harga_display": "Rp30.000/hr",
      "harga_per_hari": 30000,
      "stok_awal": 10,
      "sedang_disewa": 0,
      "ready_stok": 10
    },
    ...
  ]
}

B. Jika Penyewa Mengunggah Dokumen Identitas (KTP/SIM):
- Validasi keaslian dokumen secara logika dan kembalikan status validitasnya dalam format JSON.
- Jika KTP: NIK (wajib 16 digit), Nama Lengkap, Tanggal Lahir. Validasi apakah digit NIK sinkron dengan Tanggal Lahir.
- Jika SIM: Nomor SIM, Nama, Jenis SIM, Masa Berlaku.
- Output JSON format:
{
  "role": "penyewa",
  "document_type": "KTP" | "SIM",
  "is_valid_logic": boolean,
  "extracted_data": { ... },
  "confidence_score": number, // Untuk KTP/SIM
  "status_message": string
}

C. Jika Penyewa Membuka Detail Satu Alat (Contoh: Tenda atau Carrier):
- Tampilkan detail produk dengan struktur gambar_url, pilihan model/merek, warna, dan ukuran/kapasitas sesuai data di atas agar bisa dirender menjadi tampilan UI Shopee.
- Output JSON format untuk Katalog Alat:
{
  "role": "penyewa",
  "action": "view_katalog",
  "produk_detail": {
    "id_alat": "tenda-2p",
    "nama_alat": string,
    "deskripsi": string,
    "gambar_url": "https://domain-apk-anda.com/images/tenda-2p.jpg",
    "pilihan_variasi": {
      "merek": string[],
      "warna": string[],
      "ukuran_kapasitas": string[]
    },
    "status_stok": "Tersedia" | "Habis"
  }
}

========================================
2. AKSES UNTUK PEMILIK (OWNER ACCESS)
========================================
Fokus: Ringkasan Real-time Dashboard Manajemen Inventaris Lengkap Termasuk Pakaian.

Output JSON format untuk Pemilik (Kondisi Awal/Stok Masih Full):
{
  "role": "pemilik",
  "action": "view_dashboard" | "query_response",
  "dashboard_data": {
    "daftar_penyewa_aktif": [],
    "riwayat_transaksi_terbaru": [],
    "inventaris_alat_realtime": [
      {
        "kategori": "Tenda",
        "rincian_variasi": [
          { "id": "tenda-2p", "merek": "Consina, Eiger, Naturehike, Rei", "warna": "Hijau Army/Abu", "ukuran": "2P", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/tenda-2p.jpg" },
          { "id": "tenda-4p", "merek": "Consina, Eiger, Naturehike, Rei", "warna": "Hijau Army/Abu", "ukuran": "4P", "total_stok": 5, "sedang_disewa": 0, "tersedia": 5, "gambar_url": "https://domain-apk-anda.com/images/tenda-4p.jpg" },
          { "id": "tenda-6p", "merek": "Consina, Eiger, Naturehike, Rei", "warna": "Hijau Army/Abu", "ukuran": "6P", "total_stok": 5, "sedang_disewa": 0, "tersedia": 5, "gambar_url": "https://domain-apk-anda.com/images/tenda-6p.jpg" }
        ]
      },
      {
        "kategori": "Flysheet",
        "rincian_variasi": [
          { "id": "flysheet", "merek": "Standard", "warna": "Hijau Army", "ukuran": "3x4 m & 4x6 m", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/flysheet.jpg" }
        ]
      },
      {
        "kategori": "Carrier",
        "rincian_variasi": [
          { "id": "carrier-45l", "merek": "Consina, Eiger, Avtech, Rei", "warna": "Hitam", "ukuran": "45L", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/carrier-45l.jpg" },
          { "id": "carrier-60l", "merek": "Consina, Eiger, Avtech, Rei", "warna": "Hitam", "ukuran": "60L", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/carrier-60l.jpg" },
          { "id": "carrier-75l", "merek": "Consina, Eiger, Avtech, Rei", "warna": "Hitam", "ukuran": "75L", "total_stok": 5, "sedang_disewa": 0, "tersedia": 5, "gambar_url": "https://domain-apk-anda.com/images/carrier-75l.jpg" }
        ]
      },
      {
        "kategori": "Daypack",
        "rincian_variasi": [
          { "id": "daypack", "merek": "Standard", "warna": "Hitam", "ukuran": "20L-30L", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/daypack.jpg" }
        ]
      },
      {
        "kategori": "Sleeping Bag",
        "rincian_variasi": [
          { "id": "sleeping-bag", "merek": "Consina, Rei, Naturehike", "warna": "Hitam/Biru", "ukuran": "Dewasa", "total_stok": 30, "sedang_disewa": 0, "tersedia": 30, "gambar_url": "https://domain-apk-anda.com/images/sb-mummy.jpg" }
        ]
      },
      {
        "kategori": "Matras",
        "rincian_variasi": [
          { "id": "matras", "merek": "Standard", "warna": "Silver", "ukuran": "180x50 cm", "total_stok": 30, "sedang_disewa": 0, "tersedia": 30, "gambar_url": "https://domain-apk-anda.com/images/matras-foil.jpg" }
        ]
      },
      {
        "kategori": "Kompor",
        "rincian_variasi": [
          { "id": "kompor", "merek": "Fire Maple, Widesea, SPEEDS", "warna": "Hitam", "ukuran": "Standar", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/kompor-portable.jpg" }
        ]
      },
      {
        "kategori": "Nesting",
        "rincian_variasi": [
          { "id": "nesting", "merek": "Standard", "warna": "Abu", "ukuran": "2-3P & 4-5P", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/nesting.jpg" }
        ]
      },
      {
        "kategori": "Gas Kaleng",
        "rincian_variasi": [
          { "id": "gas-kaleng", "merek": "Standard", "warna": "Standar", "ukuran": "230 g", "total_stok": 20, "sedang_disewa": 0, "tersedia": 20, "gambar_url": "https://domain-apk-anda.com/images/gas-kaleng.jpg" }
        ]
      },
      {
        "kategori": "Headlamp",
        "rincian_variasi": [
          { "id": "headlamp", "merek": "Naturehike, Nitecore, Eiger", "warna": "Hitam", "ukuran": "300-500 lm", "total_stok": 20, "sedang_disewa": 0, "tersedia": 20, "gambar_url": "https://domain-apk-anda.com/images/headlamp.jpg" }
        ]
      },
      {
        "kategori": "Senter",
        "rincian_variasi": [
          { "id": "senter", "merek": "Standard", "warna": "Hitam", "ukuran": "Sedang", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/senter.jpg" }
        ]
      },
      {
        "kategori": "Trekking Pole",
        "rincian_variasi": [
          { "id": "trekking-pole", "merek": "Standard", "warna": "Hitam", "ukuran": "65-135 cm", "total_stok": 20, "sedang_disewa": 0, "tersedia": 20, "gambar_url": "https://domain-apk-anda.com/images/trekking-pole.jpg" }
        ]
      },
      {
        "kategori": "Hammock",
        "rincian_variasi": [
          { "id": "hammock", "merek": "Standard", "warna": "Hijau Army", "ukuran": "Single", "total_stok": 15, "sedang_disewa": 0, "tersedia": 15, "gambar_url": "https://domain-apk-anda.com/images/hammock.jpg" }
        ]
      },
      {
        "kategori": "Kursi Lipat",
        "rincian_variasi": [
          { "id": "kursi-lipat", "merek": "Standard", "warna": "Hitam", "ukuran": "Dewasa", "total_stok": 15, "sedang_disewa": 0, "tersedia": 15, "gambar_url": "https://domain-apk-anda.com/images/kursi-lipat.jpg" }
        ]
      },
      {
        "kategori": "Meja Lipat",
        "rincian_variasi": [
          { "id": "meja-lipat", "merek": "Standard", "warna": "Silver", "ukuran": "60x40 cm", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/meja-lipat.jpg" }
        ]
      },
      {
        "kategori": "Jas Hujan",
        "rincian_variasi": [
          { "id": "jas-hujan", "merek": "Standard", "warna": "Hijau Army", "ukuran": "All Size", "total_stok": 20, "sedang_disewa": 0, "tersedia": 20, "gambar_url": "https://domain-apk-anda.com/images/jas-hujan.jpg" }
        ]
      },
      {
        "kategori": "Gaiter",
        "rincian_variasi": [
          { "id": "gaiter", "merek": "Standard", "warna": "Hitam", "ukuran": "M/L", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/gaiter.jpg" }
        ]
      },
      {
        "kategori": "Sarung Tangan",
        "rincian_variasi": [
          { "id": "sarung-tangan", "merek": "Standard", "warna": "Hitam", "ukuran": "M/L", "total_stok": 15, "sedang_disewa": 0, "tersedia": 15, "gambar_url": "https://domain-apk-anda.com/images/sarung-tangan.jpg" }
        ]
      },
      {
        "kategori": "Dry Bag",
        "rincian_variasi": [
          { "id": "dry-bag", "merek": "Standard", "warna": "Orange/Hitam", "ukuran": "10L & 20L", "total_stok": 15, "sedang_disewa": 0, "tersedia": 15, "gambar_url": "https://domain-apk-anda.com/images/drybag.jpg" }
        ]
      },
      {
        "kategori": "Tali Paracord",
        "rincian_variasi": [
          { "id": "tali-paracord", "merek": "Standard", "warna": "Hitam", "ukuran": "15-30 m", "total_stok": 10, "sedang_disewa": 0, "tersedia": 10, "gambar_url": "https://domain-apk-anda.com/images/tali-paracord.jpg" }
        ]
      },
      {
        "kategori": "Pasak Cadangan",
        "rincian_variasi": [
          { "id": "pasak-cadangan", "merek": "Standard", "warna": "Silver", "ukuran": "18-20 cm", "total_stok": 30, "sedang_disewa": 0, "tersedia": 30, "gambar_url": "https://domain-apk-anda.com/images/pasak.jpg" }
        ]
      },
      {
        "kategori": "P3K",
        "rincian_variasi": [
          { "id": "p3k", "merek": "Standard", "warna": "Merah", "ukuran": "Sedang", "total_stok": 5, "sedang_disewa": 0, "tersedia": 5, "gambar_url": "https://domain-apk-anda.com/images/p3k.jpg" }
        ]
      },
      {
        "kategori": "Pakaian & Proteksi",
        "rincian_variasi": [
          { "id": "jaket-outdoor", "merek": "Eiger, Consina", "warna": "Hitam/Hijau", "ukuran": "M, L, XL", "total_stok": 15, "sedang_disewa": 0, "tersedia": 15, "gambar_url": "https://domain-apk-anda.com/images/jaket-outdoor.jpg" },
          { "id": "celana-cargo", "merek": "Arei, Eiger", "warna": "Hitam/Abu", "ukuran": "28, 30, 32, 34", "total_stok": 15, "sedang_disewa: 0", "tersedia": 15, "gambar_url": "https://domain-apk-anda.com/images/celana-cargo.jpg" },
          { "id": "sepatu-gunung", "merek": "SNTA, Eiger", "warna": "Hitam/Cokelat", "ukuran": "40, 41, 42, 43", "total_stok": 15, "sedang_disewa: 0", "tersedia": 15, "gambar_url": "https://domain-apk-anda.com/images/sepatu-gunung.jpg" },
          { "id": "base-layer", "merek": "Core, Outdoor", "warna": "Hitam", "ukuran": "M, L, XL", "total_stok": 15, "sedang_disewa: 0", "tersedia": 15, "gambar_url": "https://domain-apk-anda.com/images/base-layer.jpg" }
        ]
      }
    ]
  },
  "ai_analysis_message": string
}

========================================
ATURAN OUTPUT MUTLAK:
========================================
- JANGAN BERIKAN TEKS PENJELASAN DI LUAR JSON.
- Output harus selalu diawali dengan "{" dan diakhiri dengan "}".
- Jika gambar blur atau input tidak dikenali, kembalikan JSON dengan "is_valid_logic": false dan berikan alasan jelas pada "status_message".
`;

    let userPromptText = systemPrompt;
    if (text) {
      userPromptText += `\n\nInput Teks Pengguna (Pemilik / Penyewa Query): "${text}"`;
    } else {
      userPromptText += `\n\nHarap analisis gambar yang disertakan sesuai dengan aturan peran di atas.`;
    }

    contents.push({ text: userPromptText });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text received from Gemini API.");
    }

    const resultJson = JSON.parse(resultText.trim());
    res.json(resultJson);
  } catch (error: any) {
    console.error("AI Processor Error:", error);
    res.status(500).json({
      is_valid_logic: false,
      status_message: "Waduh Sam/Mbak, gagal memproses input dengan AI. " + error.message
    });
  }
});


// Setup static and dev integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
