export type UserRole = 
  | 'mahasiswa' 
  | 'dosen' 
  | 'keuangan' 
  | 'baak' 
  | 'sdm' 
  | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  identifier: string; // NIM or NIP
  role: UserRole;
  prodi: string;
  fakultas: string;
  email: string;
  avatarUrl: string;
  semester?: number;
  ipk?: number;
  sksTaken?: number;
  maxSks?: number;
  dpaName?: string;
  jabatan?: string;
}

// 1. Akademik
export interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: string;
  semester: number;
  status: 'Aktif' | 'Cuti' | 'Lulus' | 'Non-Aktif';
  ipk: number;
  ipsTerakhir: number;
  dpa: string;
  sksLulus: number;
  email: string;
  noHp: string;
}

export interface Dosen {
  id: string;
  nip: string;
  nidn: string;
  nama: string;
  gelar: string;
  prodi: string;
  jabatanFungsional: 'Asisten Ahli' | 'Lektor' | 'Lektor Kepala' | 'Guru Besar' | 'Tenaga Pengajar';
  pendidikanTertinggi: 'S2' | 'S3';
  status: 'Aktif' | 'Tugas Belajar' | 'Cuti';
  bkdStatus: 'Memenuhi' | 'Belum Memenuhi';
  sksBkd: number;
  email: string;
}

export interface MataKuliah {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  prodi: string;
  jenis: 'Wajib' | 'Pilihan';
  prasyarat?: string;
  dosenPengampu: string;
  jadwal: {
    hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
    jamMulai: string;
    jamSelesai: string;
    ruangan: string;
    kuota: number;
    terisi: number;
  };
}

export interface KrsItem {
  id: string;
  mahasiswaId: string;
  mataKuliahId: string;
  semesterAkademik: string;
  status: 'Draft' | 'Menunggu Persetujuan DPA' | 'Disetujui DPA' | 'Ditolak';
  tanggalPengajuan: string;
  catatanDpa?: string;
}

export interface NilaiMahasiswa {
  id: string;
  mahasiswaId: string;
  mataKuliahId: string;
  kehadiran: number; // 0-100
  tugas: number;     // 0-100
  uts: number;       // 0-100
  uas: number;       // 0-100
  nilaiAkhir: number;
  hurufMutu: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E';
  statusLulus: boolean;
}

// 2. Keuangan
export interface Tagihan {
  id: string;
  mahasiswaId: string;
  mahasiswaNim: string;
  mahasiswaNama: string;
  prodi: string;
  jenisTagihan: 'SPP / UKT Semester' | 'Biaya Praktikum' | 'Biaya Wisuda' | 'Biaya Skripsi' | 'Matrikulasi';
  periode: string;
  nominal: number;
  terbayar: number;
  sisa: number;
  jatuhTempo: string;
  status: 'Lunas' | 'Sebagian' | 'Belum Bayar' | 'Menunggu Validasi';
}

export interface TransaksiPembayaran {
  id: string;
  tagihanId: string;
  mahasiswaNim: string;
  mahasiswaNama: string;
  nominal: number;
  metode: 'Virtual Account' | 'QRIS' | 'Transfer Bank Manual';
  bank: string;
  noReferensi: string;
  tanggal: string;
  buktiUrl?: string;
  status: 'Berhasil' | 'Menunggu Konfirmasi' | 'Ditolak';
  catatan?: string;
  petugasValidasi?: string;
}

// 3. AI Assistant
export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  modelUsed?: 'gemini-3.8-flash' | 'deepseek-r1-academic' | 'gemini-fallback';
  text: string;
  timestamp: string;
}

// 4. Helpdesk
export interface TiketHelpdesk {
  id: string;
  nomorTiket: string;
  pengajuId: string;
  pengajuNama: string;
  pengajuRole: UserRole;
  kategori: 'Akademik & KRS' | 'Sistem SIAKAD & IT' | 'Keuangan & Pembayaran' | 'Fasilitas & Lab' | 'Perpustakaan';
  subjek: string;
  deskripsi: string;
  prioritas: 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';
  status: 'Baru' | 'Dalam Penanganan' | 'Selesai' | 'Ditutup';
  petugasPenugasan?: string;
  targetSlaJam: number;
  tanggalDibuat: string;
  tanggalSelesai?: string;
  penilaianLayanan?: {
    rating: number; // 1-5
    ulasan: string;
  };
}

// 5. e-Lab
export interface ItemLab {
  id: string;
  kode: string;
  nama: string;
  kategori: 'Peralatan Elektronik' | 'Laboratorium Kimia' | 'Mikroskop & Optik' | 'Komputer & Jaringan' | 'Bahan Praktikum';
  stokTersedia: number;
  stokTotal: number;
  kondisi: 'Baik' | 'Perlu Kalibrasi' | 'Dalam Perbaikan';
  lokasiRuang: string;
  fotoUrl: string;
}

export interface PeminjamanLab {
  id: string;
  nomorPeminjaman: string;
  mahasiswaNim: string;
  mahasiswaNama: string;
  items: {
    itemId: string;
    namaItem: string;
    jumlah: number;
  }[];
  tujuan: string;
  dosenPendamping: string;
  tanggalPinjam: string;
  tanggalKembaliRencana: string;
  status: 'Menunggu Persetujuan' | 'Disetujui / Dipinjam' | 'Selesai Dikembalikan' | 'Ditolak';
  laboranPenanggungJawab?: string;
}

// 6. Kepegawaian (SDM)
export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  jenisPegawai: 'Dosen' | 'Tenaga Kependidikan';
  jabatan: string;
  bagian: string; // Fakultas / Biro
  pendidikanTerakhir: 'D3' | 'S1' | 'S2' | 'S3';
  statusKepegawaian: 'PNS' | 'Tetap Yayasan' | 'Kontrak';
  tanggalMasuk: string;
  email: string;
  noHp: string;
}

// 7. LMS & CBT
export interface MateriLms {
  id: string;
  mataKuliahId: string;
  mataKuliahNama: string;
  pertemuan: number;
  judul: string;
  deskripsi: string;
  fileLampiran?: string;
  tugas?: {
    judulTugas: string;
    deadline: string;
    statusPengumpulan: 'Belum Mengumpulkan' | 'Terkumpul' | 'Dinilai';
    nilai?: number;
  };
}

export interface UjianCbt {
  id: string;
  kodeUjian: string;
  judul: string;
  mataKuliah: string;
  dosen: string;
  durasiMenit: number;
  totalSoal: number;
  status: 'Belum Mulai' | 'Sedang Berlangsung' | 'Selesai';
  toleransiPindahFokus: number;
  soalList: {
    id: number;
    pertanyaan: string;
    pilihan: string[];
    kunciJawaban: number;
  }[];
}

export interface CbtSessionLog {
  id: string;
  mahasiswaNim: string;
  ujianId: string;
  browserFingerprint: string;
  waktuMulai: string;
  fokusPindahCount: number;
  logPelanggaran: string[];
  statusSesi: 'Aktif' | 'Terkunci' | 'Selesai';
}

// 8. Neo Feeder PDDikti
export interface NeoFeederMapping {
  id: string;
  tabelLokal: string;
  tabelPddikti: string;
  fieldLokal: string;
  fieldPddikti: string;
  statusValidasi: 'Valid' | 'Perlu Penyesuaian' | 'Belum Terpetakan';
}

export interface NeoFeederSyncHistory {
  id: string;
  waktuSync: string;
  entitas: 'Mahasiswa' | 'Dosen' | 'KRS' | 'Nilai' | 'Kurikulum';
  totalRecord: number;
  sukses: number;
  gagal: number;
  status: 'Sukses Penuh' | 'Sukses Sebagian' | 'Gagal';
  logDetail: string;
}

// 9. Persuratan Online
export interface PengajuanSurat {
  id: string;
  nomorPengajuan: string;
  nomorSuratResmi?: string;
  pemohonNim: string;
  pemohonNama: string;
  prodi: string;
  jenisSurat: 
    | 'Surat Keterangan Aktif Kuliah' 
    | 'Surat Pengantar Izin Riset & PKL' 
    | 'Surat Permohonan Cuti Akademik' 
    | 'Surat Bebas Tanggungan Perpustakaan'
    | 'Surat Rekomendasi Beasiswa';
  keperluan: string;
  tanggalPengajuan: string;
  status: 
    | 'Diajukan' 
    | 'Diverifikasi BAAK' 
    | 'Disetujui Penandatangan' 
    | 'Ditolak' 
    | 'Selesai & Siap Unduh';
  petugasVerifikasi?: string;
  pejabatPenandatangan?: string;
  catatan?: string;
  qrVerificationCode?: string;
}

// 10. Praktik Lapangan & Magang
export interface ProgramMagang {
  id: string;
  namaProgram: string;
  kategori: 'MBKM Mandiri' | 'Magang Kampus Merdeka' | 'Kerja Praktik (KP)' | 'KKN Tematik';
  mitraPerusahaan: string;
  lokasi: string;
  posisi: string;
  periode: string;
  kuota: number;
}

export interface PesertaMagang {
  id: string;
  mahasiswaNim: string;
  mahasiswaNama: string;
  prodi: string;
  programId: string;
  namaProgram: string;
  mitra: string;
  dplNama: string; // Dosen Pembimbing Lapangan
  mentorIndustri: string;
  status: 'Diterima' | 'Sedang Berjalan' | 'Menunggu Evaluasi' | 'Selesai';
  logbookCount: number;
  nilaiMitra?: number;
  nilaiDpl?: number;
  laporanAkhirUrl?: string;
}

export interface LogbookMagang {
  id: string;
  pesertaId: string;
  tanggal: string;
  aktivitas: string;
  kendala: string;
  solusi: string;
  statusVerifikasiDpl: 'Menunggu Review' | 'Disetujui' | 'Perlu Perbaikan';
  catatanDpl?: string;
}

// 11. Skripsi & Bimbingan
export interface DataSkripsi {
  id: string;
  mahasiswaNim: string;
  mahasiswaNama: string;
  prodi: string;
  judulSkripsi: string;
  bidangKajian: string;
  dosenPembimbing1: string;
  dosenPembimbing2: string;
  koordinatorSkripsi: string;
  adminProdi: string;
  statusProposal: 'Draft' | 'Seminar Proposal' | 'Penelitian' | 'Siap Sidang' | 'Lulus Munaqasyah';
  totalBimbinganAcc: number;
  targetBimbinganMin: number;
}

export interface CatatanBimbingan {
  id: string;
  skripsiId: string;
  pertemuanKe: number;
  tanggal: string;
  babBahasan: string;
  catatanDosen: string;
  parafDosen: boolean;
  dosenNama: string;
}

// 12. Notifikasi & Modul Settings
export type NotificationCategory = 
  | 'course_updates' 
  | 'payment_reminders' 
  | 'exam_schedules' 
  | 'application_status' 
  | 'helpdesk_updates' 
  | 'general';

export type NotificationDeliveryChannel = 'in_app' | 'email' | 'whatsapp';
export type NotificationDigestFrequency = 'instant' | 'daily' | 'weekly';

export interface NotificationPreferences {
  enableSound: boolean;
  frequency: NotificationDigestFrequency;
  channels: {
    inApp: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  categories: {
    courseUpdates: boolean;
    paymentReminders: boolean;
    examSchedules: boolean;
    applicationStatus: boolean;
    helpdeskUpdates: boolean;
  };
  emailDestination: string;
  phoneDestination: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface NotifikasiItem {
  id: string;
  judul: string;
  pesan: string;
  kategori: NotificationCategory;
  waktu: string;
  dibaca: boolean;
  prioritas?: 'rendah' | 'normal' | 'penting' | 'darurat';
  actionModule?: string;
  channelsDelivered?: NotificationDeliveryChannel[];
}

export interface LiveToastItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  actionModule?: string;
}

export interface PesanKomunikasi {
  id: string;
  pengirimId: string;
  pengirimNama: string;
  penerimaId: string;
  penerimaNama: string;
  pesan: string;
  waktu: string;
}

export interface ModulConfig {
  id: string;
  nama: string;
  deskripsi: string;
  aktif: boolean;
  icon: string;
  rolesAllowed: UserRole[];
}

// 13. SDLC Governance
export interface SdlcTestItem {
  id: string;
  name: string;
  category: 'Security & Auth' | 'Academic Integrity' | 'Financial Transactions' | 'Data Feeder Sync' | 'e-Lab Pagination' | 'Real-time Notifications' | 'Analytics & Reporting';
  status: 'passed' | 'running' | 'failed' | 'idle';
  durationMs: number;
  description: string;
}

// 14. Advanced Reporting & Analytics
export interface AnalyticsFilter {
  prodi: string; // 'Semua' or prodi name
  semester: string; // '2025/2026 Genap'
  period: 'all' | 'semester' | 'quarter' | 'year';
}

export interface AcademicAnalyticsData {
  avgIpk: number;
  highestIpk: number;
  lowestIpk: number;
  graduationOnTimeRate: number;
  activeStudentsCount: number;
  ipkDistribution: { range: string; count: number; percentage: number }[];
  gradeDistribution: { grade: string; count: number; percentage: number }[];
  prodiPerformance: { prodi: string; avgIpk: number; passingRate: number; studentCount: number }[];
}

export interface FinancialAnalyticsData {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  channelBreakdown: { channel: string; total: number; count: number; percentage: number }[];
  agingArrears: { range: string; amount: number; studentCount: number; percentage: number }[];
  prodiFinancials: { prodi: string; billed: number; collected: number; arrears: number; rate: number }[];
}

export interface OperationalAnalyticsData {
  helpdeskAvgSlaHours: number;
  helpdeskResolvedRate: number;
  helpdeskCsatScore: number;
  eLabUtilizationRate: number;
  suratAvgTurnaroundHours: number;
  cbtViolationRate: number;
  neoFeederSuccessRate: number;
  serviceMetrics: { service: string; slaTarget: string; actualAvg: string; complianceRate: number }[];
}

export interface CustomReportConfig {
  reportTitle: string;
  includeAcademic: boolean;
  includeFinancial: boolean;
  includeOperational: boolean;
  includeDetailTables: boolean;
  notes: string;
}

