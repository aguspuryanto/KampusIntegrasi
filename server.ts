import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini Client with proper header
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SIAKAD Prima Campus Engine',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// API: Siakad AI Chat
app.post('/api/ai/chat', async (req, res) => {
  const { prompt, modelType = 'gemini', isCbtSessionActive, context, role, userName } = req.body;

  // Requirement: Akses dibatasi selama sesi LMS/CBT aktif
  if (isCbtSessionActive) {
    return res.status(403).json({
      success: false,
      restricted: true,
      message: 'AKSES DIBLOKIR: Sesi Ujian LMS / CBT sedang berlangsung. Fitur Siakad AI dinonaktifkan demi integritas & kejujuran akademik.',
    });
  }

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'Pertanyaan atau prompt tidak boleh kosong.' });
  }

  const systemInstruction = `Anda adalah Siakad AI Prima, asisten kecerdasan buatan resmi untuk Sivitas Akademika Universitas.
Karakter Anda:
- Sangat memahami birokrasi, kurikulum perguruan tinggi di Indonesia (Kemendikbudristek / PDDikti, KRS, KHS, SKS, IPK, BKD Dosen, Skripsi, MBKM, Neo Feeder).
- Nada bicara santun, profesional, solutif, dan akademis.
- Profil Pengguna saat ini: ${userName || 'Pengguna'} (${role || 'Mahasiswa'}).
- Konteks data kampus saat ini: ${context || 'Portal Akademik Terpadu Semester Genap 2025/2026'}.
Format jawaban Anda:
- Terstruktur rapi dengan poin-poin jelas dan rekomendasi langkah konkret jika terkait administrasi kampus.
- Hindari memberikan bocoran kunci jawaban ujian.`;

  // 1. If Gemini model chosen
  if (modelType === 'gemini' && aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Maaf, tidak dapat menghasilkan jawaban saat ini.';
      return res.json({
        success: true,
        model: 'gemini-3.8-flash',
        modelDisplay: 'Google Gemini 3.8 Flash',
        reply: replyText,
      });
    } catch (err: any) {
      console.error('Gemini API call failed:', err?.message || err);
      // Fallback gracefully with intelligent simulated academic agent
      const fallbackReply = generateDeepSeekAcademicResponse(prompt, role, context, 'gemini-fallback');
      return res.json({
        success: true,
        model: 'gemini-fallback',
        modelDisplay: 'Gemini (Academic Fallback Mode)',
        reply: fallbackReply,
      });
    }
  }

  // 2. DeepSeek Mode (or Gemini key absent)
  // DeepSeek reasoning engine simulation tailored for higher education academic consultation
  const deepseekReply = generateDeepSeekAcademicResponse(prompt, role, context, 'deepseek');
  return res.json({
    success: true,
    model: 'deepseek-r1-academic',
    modelDisplay: 'DeepSeek R1 Academic Specialist',
    reply: deepseekReply,
  });
});

function generateDeepSeekAcademicResponse(prompt: string, role?: string, context?: string, mode?: string): string {
  const p = prompt.toLowerCase();
  
  if (p.includes('krs') || p.includes('kartu rencana studi') || p.includes('sks')) {
    return `### Analisis Konsultasi KRS (Kartu Rencana Studi)
Berdasarkan data akademik universitas semester ini:

1. **Jatah Maksimum SKS**:
   - IPK Semester Lalu ≥ 3.00: Maksimal **24 SKS**
   - IPK 2.50 - 2.99: Maksimal **21 SKS**
   - IPK 2.00 - 2.49: Maksimal **18 SKS**
2. **Prosedur Pengambilan**:
   - Pastikan tagihan SPP / UKT registrasi semester telah berstatus **Lunas** di modul Keuangan.
   - Pilih mata kuliah wajib semester dan mata kuliah peminatan yang tidak bentrok jadwalnya.
   - Klik **"Ajukan Validasi KRS"** ke Dosen Pembimbing Akademik (DPA).
3. **Tips**: Perhatikan mata kuliah prasyarat (prerequisite) sebelum mengambil mata kuliah tingkat atas.`;
  }

  if (p.includes('skripsi') || p.includes('bimbingan') || p.includes('judul') || p.includes('tugas akhir')) {
    return `### Panduan & Regulasi Bimbingan Skripsi
Untuk memperlancar kelulusan Tugas Akhir Anda:

1. **Syarat Pengajuan**:
   - Telah menempuh minimal **120 SKS** tanpa nilai D/E pada mata kuliah metodologi penelitian.
   - IPK kumulatif minimal **2.75**.
2. **Alur Bimbingan di SIAKAD Prima**:
   - Input judul dan proposal skripsi pada tab **Skripsi & Bimbingan**.
   - Setiap selesai diskusi dengan Dosen Pembimbing 1 & 2, catat agenda revisi di **Logbook Bimbingan**.
   - Wajib minimal **8 kali bimbingan** sebelum kartu bimbingan ditandatangani oleh Koordinator Skripsi dan Admin Prodi untuk pendaftaran sidang munaqasyah/pendadaran.`;
  }

  if (p.includes('keuangan') || p.includes('spp') || p.includes('ukt') || p.includes('tagihan') || p.includes('bayar')) {
    return `### Informasi Tagihan & Keuangan Kampus
Status Administrasi Pembayaran:

1. **Metode Pembayaran**:
   - Melalui Virtual Account (Bank Mandiri, BRI, BNI, BCA) dan QRIS terintegrasi.
   - Pembayaran manual via Teller/Transfer wajib mengunggah bukti transfer di menu **Keuangan > Konfirmasi Pembayaran**.
2. **Dispensasi & Cicilan**:
   - Pengajuan perpanjangan jatuh tempo atau cicilan 2 tahap dapat diajukan ke Bagian Keuangan paling lambat 7 hari kalender sebelum penutupan portal KRS.`;
  }

  if (p.includes('magang') || p.includes('mbkm') || p.includes('pkl') || p.includes('kkn')) {
    return `### Program Praktik Kerja Lapangan & Magang Kampus
Panduan Pelaksanaan:

1. **Status Penempatan**: Periksa surat tugas pengantar di modul **Persuratan Online**.
2. **Kewajiban Mahasiswa**:
   - Mengisi **Logbook Harian** aktivitas magang beserta dokumentasi foto.
   - Dosen Pembimbing Lapangan (DPL) akan memverifikasi logbook setiap akhir pekan.
   - Unggah Laporan Akhir Magang sebelum batas waktu evaluasi nilai konversi SKS.`;
  }

  return `### Tanggapan Siakad AI (${mode === 'deepseek' ? 'DeepSeek R1 Academic' : 'Gemini AI Assistant'})

Terima kasih atas pertanyaan Anda mengenai: *"**${prompt}**"*.

Berdasarkan regulasi akademik universitas terkini:
1. **Langkah Verifikasi**: Silakan periksa modul terkait pada navigasi sebelah kiri (Akademik, Keuangan, Persuratan, atau Helpdesk).
2. **Konsultasi Tatap Muka**: Jika membutuhkan persetujuan resmi atau disposisi, silakan ajukan tiket layanan melalui menu **Helpdesk & Layanan Kampus** atau buat surat pengantar di menu **Persuratan Online**.
3. **Pemberitahuan**: Seluruh riwayat transaksi akademik Anda tercatat otomatis dan tersinkronisasi dengan pangkalan data nasional Neo Feeder PDDikti.`;
}

// Start dev or production server
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SIAKAD Prima] Server listening on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
