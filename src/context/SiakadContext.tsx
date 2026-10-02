import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Mahasiswa,
  Dosen,
  MataKuliah,
  KrsItem,
  NilaiMahasiswa,
  Tagihan,
  TransaksiPembayaran,
  AiChatMessage,
  TiketHelpdesk,
  ItemLab,
  PeminjamanLab,
  Pegawai,
  MateriLms,
  UjianCbt,
  CbtSessionLog,
  NeoFeederMapping,
  NeoFeederSyncHistory,
  PengajuanSurat,
  ProgramMagang,
  PesertaMagang,
  LogbookMagang,
  DataSkripsi,
  CatatanBimbingan,
  NotifikasiItem,
  NotificationCategory,
  NotificationDeliveryChannel,
  NotificationPreferences,
  LiveToastItem,
  AnalyticsFilter,
  AcademicAnalyticsData,
  FinancialAnalyticsData,
  OperationalAnalyticsData,
  PesanKomunikasi,
  ModulConfig,
  SdlcTestItem,
} from '../types/siakad';
import {
  INITIAL_USER_PROFILES,
  INITIAL_MAHASISWA,
  INITIAL_DOSEN,
  INITIAL_MATA_KULIAH,
  INITIAL_KRS,
  INITIAL_NILAI,
  INITIAL_TAGIHAN,
  INITIAL_TRANSAKSI,
  INITIAL_HELPDESK,
  INITIAL_LAB_ITEMS,
  INITIAL_PEMINJAMAN_LAB,
  INITIAL_PEGAWAI,
  INITIAL_MATERI_LMS,
  INITIAL_UJIAN_CBT,
  INITIAL_NEO_FEEDER_MAPPING,
  INITIAL_NEO_SYNC_HISTORY,
  INITIAL_PENGAJUAN_SURAT,
  INITIAL_PROGRAM_MAGANG,
  INITIAL_PESERTA_MAGANG,
  INITIAL_LOGBOOK_MAGANG,
  INITIAL_DATA_SKRIPSI,
  INITIAL_CATATAN_BIMBINGAN,
  INITIAL_MODULES_CONFIG,
  INITIAL_NOTIFIKASI,
  INITIAL_NOTIFICATION_PREFERENCES,
  INITIAL_SDLC_TESTS,
} from '../data/mockData';

interface SiakadContextType {
  // Current user & role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  activeModule: string;
  setActiveModule: (moduleId: string) => void;

  // Module configuration
  modulesConfig: ModulConfig[];
  toggleModuleActive: (moduleId: string) => void;

  // 1. Akademik
  mahasiswaList: Mahasiswa[];
  dosenList: Dosen[];
  mataKuliahList: MataKuliah[];
  krsList: KrsItem[];
  nilaiList: NilaiMahasiswa[];
  addKrsItem: (mkId: string) => { success: boolean; message: string };
  removeKrsItem: (krsId: string) => void;
  submitKrsApproval: () => void;
  approveKrsDpa: (krsId: string, status: 'Disetujui DPA' | 'Ditolak', catatan?: string) => void;
  updateNilai: (nilaiId: string, kehadiran: number, tugas: number, uts: number, uas: number) => void;

  // 2. Keuangan
  tagihanList: Tagihan[];
  transaksiList: TransaksiPembayaran[];
  bayarTagihan: (tagihanId: string, nominal: number, metode: 'Virtual Account' | 'QRIS' | 'Transfer Bank Manual', bank: string) => void;
  validasiPembayaran: (transaksiId: string, status: 'Berhasil' | 'Ditolak', catatan?: string) => void;

  // 3. AI Assistant
  aiMessages: AiChatMessage[];
  aiModel: 'gemini' | 'deepseek';
  setAiModel: (model: 'gemini' | 'deepseek') => void;
  sendAiMessage: (prompt: string) => Promise<{ success: boolean; message?: string }>;
  clearAiChat: () => void;

  // 4. Helpdesk
  tiketList: TiketHelpdesk[];
  createTiket: (kategori: TiketHelpdesk['kategori'], subjek: string, deskripsi: string, prioritas: TiketHelpdesk['prioritas']) => void;
  updateTiketStatus: (tiketId: string, status: TiketHelpdesk['status'], petugas?: string) => void;
  rateTiket: (tiketId: string, rating: number, ulasan: string) => void;

  // 5. e-Lab (with persistent selection across pagination!)
  labItems: ItemLab[];
  selectedLabItemIds: Set<string>; // Persistent cart across table page navigation
  toggleLabItemSelection: (itemId: string) => void;
  clearLabItemSelections: () => void;
  peminjamanLabList: PeminjamanLab[];
  submitPeminjamanLab: (tujuan: string, dosenPendamping: string, tanggalPinjam: string, tanggalKembali: string) => boolean;
  updateStatusPeminjamanLab: (pinjamId: string, status: PeminjamanLab['status']) => void;

  // 6. Kepegawaian (SDM)
  pegawaiList: Pegawai[];
  addPegawai: (pegawai: Omit<Pegawai, 'id'>) => void;

  // 7. LMS & CBT
  materiLmsList: MateriLms[];
  ujianCbt: UjianCbt;
  cbtSession: CbtSessionLog | null;
  isCbtActive: boolean;
  startCbtExam: () => void;
  recordCbtFocusViolation: () => void;
  finishCbtExam: () => void;

  // 8. Neo Feeder
  neoMappings: NeoFeederMapping[];
  neoSyncHistory: NeoFeederSyncHistory[];
  triggerNeoSync: (entitas: NeoFeederSyncHistory['entitas']) => void;

  // 9. Persuratan Online
  suratList: PengajuanSurat[];
  ajukanSurat: (jenis: PengajuanSurat['jenisSurat'], keperluan: string) => void;
  verifikasiSuratBaak: (suratId: string, disetujui: boolean, catatan?: string) => void;
  tandatanganiSuratPejabat: (suratId: string) => void;

  // 10. Praktik Lapangan & Magang
  programMagangList: ProgramMagang[];
  pesertaMagangList: PesertaMagang[];
  logbookMagangList: LogbookMagang[];
  tambahLogbook: (aktivitas: string, kendala: string, solusi: string) => void;
  verifikasiLogbookDpl: (logId: string, status: 'Disetujui' | 'Perlu Perbaikan', catatan?: string) => void;

  // 11. Skripsi & Bimbingan
  dataSkripsi: DataSkripsi;
  catatanBimbinganList: CatatanBimbingan[];
  tambahCatatanBimbingan: (bab: string, catatan: string, dosen: string) => void;

  // 12. Notifikasi & Preferensi Real-Time
  notifikasiList: NotifikasiItem[];
  markNotifAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  liveToasts: LiveToastItem[];
  dismissToast: (id: string) => void;
  dispatchNotification: (
    judul: string,
    pesan: string,
    kategori: NotificationCategory,
    prioritas?: 'rendah' | 'normal' | 'penting' | 'darurat',
    actionModule?: string
  ) => void;
  simulateNotificationEvent: (type: 'course' | 'payment' | 'exam' | 'application' | 'helpdesk') => void;
  pesanList: PesanKomunikasi[];
  kirimPesan: (penerimaId: string, penerimaNama: string, pesan: string) => void;

  // 13. Advanced Reporting & Analytics Aggregator
  getAcademicAnalytics: (filter?: AnalyticsFilter) => AcademicAnalyticsData;
  getFinancialAnalytics: (filter?: AnalyticsFilter) => FinancialAnalyticsData;
  getOperationalAnalytics: (filter?: AnalyticsFilter) => OperationalAnalyticsData;

  // 14. SDLC Hub & QA
  sdlcTests: SdlcTestItem[];
  runSdlcTests: () => Promise<void>;
  resetToDefault: () => void;
  exportDatabaseSnapshot: () => void;
}

const SiakadContext = createContext<SiakadContextType | undefined>(undefined);

const STORAGE_KEY = 'siakad_prima_state_v1';

export const SiakadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('mahasiswa');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_PROFILES.mahasiswa);
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [modulesConfig, setModulesConfig] = useState<ModulConfig[]>(INITIAL_MODULES_CONFIG);

  // 1. Akademik
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>(INITIAL_MAHASISWA);
  const [dosenList] = useState<Dosen[]>(INITIAL_DOSEN);
  const [mataKuliahList] = useState<MataKuliah[]>(INITIAL_MATA_KULIAH);
  const [krsList, setKrsList] = useState<KrsItem[]>(INITIAL_KRS);
  const [nilaiList, setNilaiList] = useState<NilaiMahasiswa[]>(INITIAL_NILAI);

  // 2. Keuangan
  const [tagihanList, setTagihanList] = useState<Tagihan[]>(INITIAL_TAGIHAN);
  const [transaksiList, setTransaksiList] = useState<TransaksiPembayaran[]>(INITIAL_TRANSAKSI);

  // 3. AI Assistant
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([
    {
      id: 'ai-init',
      sender: 'assistant',
      text: 'Halo! Saya Siakad AI Prima. Saya dapat membantu konsultasi KRS, syarat skripsi, panduan keuangan, atau regulasi kampus. Anda dapat berganti antara model Google Gemini 3.8 Flash atau DeepSeek R1 Academic Specialist.',
      timestamp: 'Baru saja',
    },
  ]);
  const [aiModel, setAiModel] = useState<'gemini' | 'deepseek'>('gemini');

  // 4. Helpdesk
  const [tiketList, setTiketList] = useState<TiketHelpdesk[]>(INITIAL_HELPDESK);

  // 5. e-Lab (Requirement: pilihan barang tetap tersimpan saat berpindah halaman tabel!)
  const [labItems] = useState<ItemLab[]>(INITIAL_LAB_ITEMS);
  const [selectedLabItemIds, setSelectedLabItemIds] = useState<Set<string>>(new Set());
  const [peminjamanLabList, setPeminjamanLabList] = useState<PeminjamanLab[]>(INITIAL_PEMINJAMAN_LAB);

  // 6. Kepegawaian (SDM)
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(INITIAL_PEGAWAI);

  // 7. LMS & CBT (Requirement: pembatasan sesi pada satu perangkat & pencatatan perpindahan fokus)
  const [materiLmsList] = useState<MateriLms[]>(INITIAL_MATERI_LMS);
  const [ujianCbt] = useState<UjianCbt>(INITIAL_UJIAN_CBT);
  const [cbtSession, setCbtSession] = useState<CbtSessionLog | null>(null);
  const isCbtActive = cbtSession?.statusSesi === 'Aktif';

  // 8. Neo Feeder
  const [neoMappings] = useState<NeoFeederMapping[]>(INITIAL_NEO_FEEDER_MAPPING);
  const [neoSyncHistory, setNeoSyncHistory] = useState<NeoFeederSyncHistory[]>(INITIAL_NEO_SYNC_HISTORY);

  // 9. Persuratan Online
  const [suratList, setSuratList] = useState<PengajuanSurat[]>(INITIAL_PENGAJUAN_SURAT);

  // 10. Praktik Lapangan & Magang
  const [programMagangList] = useState<ProgramMagang[]>(INITIAL_PROGRAM_MAGANG);
  const [pesertaMagangList] = useState<PesertaMagang[]>(INITIAL_PESERTA_MAGANG);
  const [logbookMagangList, setLogbookMagangList] = useState<LogbookMagang[]>(INITIAL_LOGBOOK_MAGANG);

  // 11. Skripsi & Bimbingan
  const [dataSkripsi, setDataSkripsi] = useState<DataSkripsi>(INITIAL_DATA_SKRIPSI);
  const [catatanBimbinganList, setCatatanBimbinganList] = useState<CatatanBimbingan[]>(INITIAL_CATATAN_BIMBINGAN);

  // 12. Notifikasi & Komunikasi
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem('siakad_notif_prefs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATION_PREFERENCES;
    } catch {
      return INITIAL_NOTIFICATION_PREFERENCES;
    }
  });

  const [notifikasiList, setNotifikasiList] = useState<NotifikasiItem[]>(INITIAL_NOTIFIKASI);
  const [liveToasts, setLiveToasts] = useState<LiveToastItem[]>([]);
  const [pesanList, setPesanList] = useState<PesanKomunikasi[]>([
    {
      id: 'msg-1',
      pengirimId: 'usr-dsn-01',
      pengirimNama: 'Dr. Eng. Hendra Kurniawan',
      penerimaId: 'usr-mhs-01',
      penerimaNama: 'Ahmad Faiz Al-Ghifari',
      pesan: 'Faiz, mohon cek komentar revisi Bab 4 skripsi terkait pagination selector e-Lab ya.',
      waktu: 'Kemarin, 16:30',
    },
  ]);

  // 13. SDLC Tests
  const [sdlcTests, setSdlcTests] = useState<SdlcTestItem[]>(INITIAL_SDLC_TESTS);

  // Sync profile when role switches
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (INITIAL_USER_PROFILES[role]) {
      setCurrentUser(INITIAL_USER_PROFILES[role]);
    }
  };

  // Toggle Module Status (Requirement: "modul yang dapat diaktifkan sesuai kebutuhan")
  const toggleModuleActive = (moduleId: string) => {
    setModulesConfig((prev) =>
      prev.map((mod) => (mod.id === moduleId ? { ...mod, aktif: !mod.aktif } : mod))
    );
  };

  // 1. Akademik Handlers
  const addKrsItem = (mkId: string): { success: boolean; message: string } => {
    const mk = mataKuliahList.find((m) => m.id === mkId);
    if (!mk) return { success: false, message: 'Mata kuliah tidak ditemukan.' };

    const alreadyTaken = krsList.some((k) => k.mataKuliahId === mkId);
    if (alreadyTaken) return { success: false, message: 'Mata kuliah sudah ada dalam KRS Anda.' };

    // SKS limit check
    const currentSks = krsList.reduce((acc, curr) => {
      const m = mataKuliahList.find((item) => item.id === curr.mataKuliahId);
      return acc + (m?.sks || 0);
    }, 0);

    const maxSks = currentUser.maxSks || 24;
    if (currentSks + mk.sks > maxSks) {
      return {
        success: false,
        message: `Batas maksimal ${maxSks} SKS terlampaui. Total SKS Anda saat ini: ${currentSks} SKS.`,
      };
    }

    const newItem: KrsItem = {
      id: `krs-${Date.now()}`,
      mahasiswaId: currentUser.identifier,
      mataKuliahId: mkId,
      semesterAkademik: '2025/2026 Genap',
      status: 'Draft',
      tanggalPengajuan: new Date().toISOString().split('T')[0],
    };

    setKrsList((prev) => [...prev, newItem]);
    return { success: true, message: `Berhasil menambahkan mata kuliah ${mk.nama} (${mk.sks} SKS).` };
  };

  const removeKrsItem = (krsId: string) => {
    setKrsList((prev) => prev.filter((k) => k.id !== krsId));
  };

  const submitKrsApproval = () => {
    setKrsList((prev) =>
      prev.map((k) =>
        k.status === 'Draft' ? { ...k, status: 'Menunggu Persetujuan DPA' } : k
      )
    );
    // Push notification
    dispatchNotification(
      'KRS Diajukan ke DPA',
      'Rencana studi Anda telah diajukan ke Dosen Pembimbing Akademik untuk divalidasi.',
      'application_status',
      'normal',
      'akademik'
    );
  };

  const approveKrsDpa = (krsId: string, status: 'Disetujui DPA' | 'Ditolak', catatan?: string) => {
    setKrsList((prev) =>
      prev.map((k) => (k.id === krsId ? { ...k, status, catatanDpa: catatan } : k))
    );
  };

  const updateNilai = (nilaiId: string, kehadiran: number, tugas: number, uts: number, uas: number) => {
    const nilaiAkhir = Math.round((kehadiran * 0.1 + tugas * 0.2 + uts * 0.3 + uas * 0.4) * 10) / 10;
    let hurufMutu: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E' = 'E';
    if (nilaiAkhir >= 85) hurufMutu = 'A';
    else if (nilaiAkhir >= 80) hurufMutu = 'B+';
    else if (nilaiAkhir >= 70) hurufMutu = 'B';
    else if (nilaiAkhir >= 65) hurufMutu = 'C+';
    else if (nilaiAkhir >= 55) hurufMutu = 'C';
    else if (nilaiAkhir >= 40) hurufMutu = 'D';

    setNilaiList((prev) =>
      prev.map((n) =>
        n.id === nilaiId
          ? {
              ...n,
              kehadiran,
              tugas,
              uts,
              uas,
              nilaiAkhir,
              hurufMutu,
              statusLulus: hurufMutu !== 'D' && hurufMutu !== 'E',
            }
          : n
      )
    );
  };

  // 2. Keuangan Handlers
  const bayarTagihan = (
    tagihanId: string,
    nominal: number,
    metode: 'Virtual Account' | 'QRIS' | 'Transfer Bank Manual',
    bank: string
  ) => {
    const tagihan = tagihanList.find((t) => t.id === tagihanId);
    if (!tagihan) return;

    const isDirectSettlement = metode === 'Virtual Account' || metode === 'QRIS';
    const newTrx: TransaksiPembayaran = {
      id: `trx-${Date.now()}`,
      tagihanId,
      mahasiswaNim: tagihan.mahasiswaNim,
      mahasiswaNama: tagihan.mahasiswaNama,
      nominal,
      metode,
      bank,
      noReferensi: `${bank.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toLocaleString('id-ID'),
      status: isDirectSettlement ? 'Berhasil' : 'Menunggu Konfirmasi',
      petugasValidasi: isDirectSettlement ? 'Payment Gateway Auto-Validation' : undefined,
    };

    setTransaksiList((prev) => [newTrx, ...prev]);

    if (isDirectSettlement) {
      setTagihanList((prev) =>
        prev.map((t) => {
          if (t.id !== tagihanId) return t;
          const newTerbayar = t.terbayar + nominal;
          const newSisa = Math.max(0, t.nominal - newTerbayar);
          return {
            ...t,
            terbayar: newTerbayar,
            sisa: newSisa,
            status: newSisa === 0 ? 'Lunas' : 'Sebagian',
          };
        })
      );
    } else {
      setTagihanList((prev) =>
        prev.map((t) => (t.id === tagihanId ? { ...t, status: 'Menunggu Validasi' } : t))
      );
    }
  };

  const validasiPembayaran = (transaksiId: string, status: 'Berhasil' | 'Ditolak', catatan?: string) => {
    const trx = transaksiList.find((t) => t.id === transaksiId);
    if (!trx) return;

    setTransaksiList((prev) =>
      prev.map((t) =>
        t.id === transaksiId
          ? {
              ...t,
              status,
              catatan,
              petugasValidasi: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
            }
          : t
      )
    );

    if (status === 'Berhasil') {
      setTagihanList((prev) =>
        prev.map((t) => {
          if (t.id !== trx.tagihanId) return t;
          const newTerbayar = t.terbayar + trx.nominal;
          const newSisa = Math.max(0, t.nominal - newTerbayar);
          return {
            ...t,
            terbayar: newTerbayar,
            sisa: newSisa,
            status: newSisa === 0 ? 'Lunas' : 'Sebagian',
          };
        })
      );
    } else {
      setTagihanList((prev) =>
        prev.map((t) => (t.id === trx.tagihanId ? { ...t, status: 'Belum Bayar' } : t))
      );
    }
  };

  // 3. AI Assistant Handlers (Requirement: Akses dibatasi selama sesi LMS/CBT aktif!)
  const sendAiMessage = async (prompt: string): Promise<{ success: boolean; message?: string }> => {
    if (isCbtActive) {
      return {
        success: false,
        message: 'Akses Siakad AI DIBLOKIR: Sesi Ujian LMS/CBT sedang aktif untuk menjaga integritas ujian.',
      };
    }

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setAiMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          modelType: aiModel,
          isCbtSessionActive: isCbtActive,
          role: currentUser.role,
          userName: currentUser.name,
          context: `Mahasiswa ${currentUser.name} NIM ${currentUser.identifier}, IPK ${currentUser.ipk || 3.82}, Prodi ${currentUser.prodi}`,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        const errorReply = data.message || 'Gagal memproses pesan.';
        setAiMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'assistant',
            text: `⚠️ ${errorReply}`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return { success: false, message: errorReply };
      }

      const assistantMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        modelUsed: data.model,
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setAiMessages((prev) => [...prev, assistantMsg]);
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Koneksi ke backend server gagal.';
      setAiMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Terjadi kendala teknis: ${errMsg}`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return { success: false, message: errMsg };
    }
  };

  const clearAiChat = () => {
    setAiMessages([
      {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: 'Percakapan telah direset. Silakan ajukan pertanyaan seputar akademik, KRS, tagihan, atau skripsi.',
        timestamp: 'Baru saja',
      },
    ]);
  };

  // 4. Helpdesk Handlers
  const createTiket = (
    kategori: TiketHelpdesk['kategori'],
    subjek: string,
    deskripsi: string,
    prioritas: TiketHelpdesk['prioritas']
  ) => {
    const slaMap = { Rendah: 72, Sedang: 48, Tinggi: 24, Darurat: 6 };
    const newTiket: TiketHelpdesk = {
      id: `tkt-${Date.now()}`,
      nomorTiket: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      pengajuId: currentUser.identifier,
      pengajuNama: currentUser.name,
      pengajuRole: currentUser.role,
      kategori,
      subjek,
      deskripsi,
      prioritas,
      status: 'Baru',
      targetSlaJam: slaMap[prioritas] || 48,
      tanggalDibuat: new Date().toLocaleString('id-ID'),
    };
    setTiketList((prev) => [newTiket, ...prev]);
  };

  const updateTiketStatus = (tiketId: string, status: TiketHelpdesk['status'], petugas?: string) => {
    setTiketList((prev) =>
      prev.map((t) =>
        t.id === tiketId
          ? {
              ...t,
              status,
              petugasPenugasan: petugas || t.petugasPenugasan || currentUser.name,
              tanggalSelesai: status === 'Selesai' ? new Date().toLocaleString('id-ID') : t.tanggalSelesai,
            }
          : t
      )
    );
  };

  const rateTiket = (tiketId: string, rating: number, ulasan: string) => {
    setTiketList((prev) =>
      prev.map((t) => (t.id === tiketId ? { ...t, penilaianLayanan: { rating, ulasan } } : t))
    );
  };

  // 5. e-Lab Handlers (Requirement: pilihan barang tetap tersimpan saat berpindah halaman tabel!)
  const toggleLabItemSelection = (itemId: string) => {
    setSelectedLabItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const clearLabItemSelections = () => {
    setSelectedLabItemIds(new Set());
  };

  const submitPeminjamanLab = (
    tujuan: string,
    dosenPendamping: string,
    tanggalPinjam: string,
    tanggalKembali: string
  ): boolean => {
    if (selectedLabItemIds.size === 0) return false;

    const itemsToBorrow = Array.from(selectedLabItemIds).map((id) => {
      const item = labItems.find((l) => l.id === id);
      return {
        itemId: id,
        namaItem: item?.nama || 'Item Lab',
        jumlah: 1,
      };
    });

    const newBorrow: PeminjamanLab = {
      id: `pinjam-${Date.now()}`,
      nomorPeminjaman: `LAB-REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      mahasiswaNim: currentUser.identifier,
      mahasiswaNama: currentUser.name,
      items: itemsToBorrow,
      tujuan,
      dosenPendamping,
      tanggalPinjam,
      tanggalKembaliRencana: tanggalKembali,
      status: 'Menunggu Persetujuan',
    };

    setPeminjamanLabList((prev) => [newBorrow, ...prev]);
    clearLabItemSelections(); // Clear cart after submission
    return true;
  };

  const updateStatusPeminjamanLab = (pinjamId: string, status: PeminjamanLab['status']) => {
    setPeminjamanLabList((prev) =>
      prev.map((p) =>
        p.id === pinjamId
          ? {
              ...p,
              status,
              laboranPenanggungJawab: `${currentUser.name} (Laboran Terverifikasi)`,
            }
          : p
      )
    );
  };

  // 6. Kepegawaian Handlers
  const addPegawai = (pegawai: Omit<Pegawai, 'id'>) => {
    const newPegawai: Pegawai = {
      ...pegawai,
      id: `peg-${Date.now()}`,
    };
    setPegawaiList((prev) => [...prev, newPegawai]);
  };

  // 7. LMS & CBT Handlers (Requirement: pembatasan sesi pada 1 perangkat & pencatatan perpindahan fokus)
  const startCbtExam = () => {
    const newSession: CbtSessionLog = {
      id: `cbt-sess-${Date.now()}`,
      mahasiswaNim: currentUser.identifier,
      ujianId: ujianCbt.id,
      browserFingerprint: `${navigator.userAgent.slice(0, 30)} (Screen: ${window.innerWidth}x${window.innerHeight})`,
      waktuMulai: new Date().toLocaleTimeString('id-ID'),
      fokusPindahCount: 0,
      logPelanggaran: [],
      statusSesi: 'Aktif',
    };
    setCbtSession(newSession);
  };

  const recordCbtFocusViolation = () => {
    if (!cbtSession || cbtSession.statusSesi !== 'Aktif') return;

    const newViolationCount = cbtSession.fokusPindahCount + 1;
    const timestamp = new Date().toLocaleTimeString('id-ID');
    const logEntry = `[${timestamp}] Peringatan ${newViolationCount}: Peserta keluar dari jendela / beralih tab browser!`;
    const isLocked = newViolationCount >= ujianCbt.toleransiPindahFokus;

    setCbtSession((prev) =>
      prev
        ? {
            ...prev,
            fokusPindahCount: newViolationCount,
            logPelanggaran: [...prev.logPelanggaran, logEntry],
            statusSesi: isLocked ? 'Terkunci' : 'Aktif',
          }
        : null
    );
  };

  const finishCbtExam = () => {
    setCbtSession((prev) => (prev ? { ...prev, statusSesi: 'Selesai' } : null));
  };

  // Listen for window blur during active CBT exam
  useEffect(() => {
    if (!isCbtActive) return;

    const handleWindowBlur = () => {
      recordCbtFocusViolation();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordCbtFocusViolation();
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCbtActive, cbtSession?.fokusPindahCount]);

  // 8. Neo Feeder Handlers
  const triggerNeoSync = (entitas: NeoFeederSyncHistory['entitas']) => {
    const newSync: NeoFeederSyncHistory = {
      id: `sync-${Date.now()}`,
      waktuSync: new Date().toLocaleString('id-ID'),
      entitas,
      totalRecord: entitas === 'Mahasiswa' ? 852 : entitas === 'KRS' ? 3422 : 12510,
      sukses: entitas === 'Mahasiswa' ? 852 : entitas === 'KRS' ? 3422 : 12510,
      gagal: 0,
      status: 'Sukses Penuh',
      logDetail: `Sinkronisasi Web Services Neo Feeder Ditjen Diktiristek untuk entitas ${entitas} selesai tanpa kesalahan validasi schema.`,
    };
    setNeoSyncHistory((prev) => [newSync, ...prev]);
  };

  // 9. Persuratan Handlers (Requirement: alur verifikasi petugas & persetujuan pejabat penandatangan)
  const ajukanSurat = (jenisSurat: PengajuanSurat['jenisSurat'], keperluan: string) => {
    const newSurat: PengajuanSurat = {
      id: `srt-${Date.now()}`,
      nomorPengajuan: `SRT-REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      pemohonNim: currentUser.identifier,
      pemohonNama: currentUser.name,
      prodi: currentUser.prodi,
      jenisSurat,
      keperluan,
      tanggalPengajuan: new Date().toISOString().split('T')[0],
      status: 'Diajukan',
    };
    setSuratList((prev) => [newSurat, ...prev]);
  };

  const verifikasiSuratBaak = (suratId: string, disetujui: boolean, catatan?: string) => {
    setSuratList((prev) =>
      prev.map((s) =>
        s.id === suratId
          ? {
              ...s,
              status: disetujui ? 'Diverifikasi BAAK' : 'Ditolak',
              petugasVerifikasi: `${currentUser.name} (Staf BAAK)`,
              catatan: catatan || (disetujui ? 'Berkas lengkap dan sesuai regulasi' : 'Persyaratan belum lengkap'),
            }
          : s
      )
    );
  };

  const tandatanganiSuratPejabat = (suratId: string) => {
    const nomorResmi = `0${Math.floor(10 + Math.random() * 89)}/BAAK/UPN/${new Date().getFullYear()}`;
    const qrCode = `VERIF-UPN-${Date.now()}-ESIGN`;
    setSuratList((prev) =>
      prev.map((s) =>
        s.id === suratId
          ? {
              ...s,
              status: 'Selesai & Siap Unduh',
              nomorSuratResmi: nomorResmi,
              pejabatPenandatangan: `${currentUser.name} (${currentUser.jabatan || 'Pejabat Berwenang'})`,
              qrVerificationCode: qrCode,
              catatan: 'Dokumen sah bertanda tangan digital resmi universitas.',
            }
          : s
      )
    );
  };

  // 10. Magang Handlers
  const tambahLogbook = (aktivitas: string, kendala: string, solusi: string) => {
    const newLog: LogbookMagang = {
      id: `log-${Date.now()}`,
      pesertaId: 'ps-1',
      tanggal: new Date().toISOString().split('T')[0],
      aktivitas,
      kendala,
      solusi,
      statusVerifikasiDpl: 'Menunggu Review',
    };
    setLogbookMagangList((prev) => [newLog, ...prev]);
  };

  const verifikasiLogbookDpl = (logId: string, status: 'Disetujui' | 'Perlu Perbaikan', catatan?: string) => {
    setLogbookMagangList((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, statusVerifikasiDpl: status, catatanDpl: catatan } : l))
    );
  };

  // 11. Skripsi Handlers (Requirement: cetak kartu dengan ruang tanda tangan Admin Prodi serta Koordinator)
  const tambahCatatanBimbingan = (babBahasan: string, catatanDosen: string, dosenNama: string) => {
    const nextMeeting = catatanBimbinganList.length + 1;
    const newEntry: CatatanBimbingan = {
      id: `cb-${Date.now()}`,
      skripsiId: dataSkripsi.id,
      pertemuanKe: nextMeeting,
      tanggal: new Date().toISOString().split('T')[0],
      babBahasan,
      catatanDosen,
      parafDosen: true,
      dosenNama,
    };
    setCatatanBimbinganList((prev) => [...prev, newEntry]);
    setDataSkripsi((prev) => ({
      ...prev,
      totalBimbinganAcc: prev.totalBimbinganAcc + 1,
    }));
  };

  // 12. Notifikasi & Komunikasi
  const playNotificationChime = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {
      // Audio playback might be restricted before interaction
    }
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences((prev) => {
      const updated: NotificationPreferences = {
        ...prev,
        ...prefs,
        channels: { ...prev.channels, ...(prefs.channels || {}) },
        categories: { ...prev.categories, ...(prefs.categories || {}) },
      };
      try {
        localStorage.setItem('siakad_notif_prefs', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const dismissToast = (id: string) => {
    setLiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dispatchNotification = (
    judul: string,
    pesan: string,
    kategori: NotificationCategory,
    prioritas: 'rendah' | 'normal' | 'penting' | 'darurat' = 'normal',
    actionModule?: string
  ) => {
    // Check if category is enabled in user preferences
    const isCategoryAllowed = (() => {
      switch (kategori) {
        case 'course_updates':
          return notificationPreferences.categories.courseUpdates;
        case 'payment_reminders':
          return notificationPreferences.categories.paymentReminders;
        case 'exam_schedules':
          return notificationPreferences.categories.examSchedules;
        case 'application_status':
          return notificationPreferences.categories.applicationStatus;
        case 'helpdesk_updates':
          return notificationPreferences.categories.helpdeskUpdates;
        default:
          return true;
      }
    })();

    if (!isCategoryAllowed) {
      console.log(`[Notification Engine] Category ${kategori} is muted in preferences.`);
      return;
    }

    const deliveredChannels: NotificationDeliveryChannel[] = [];
    if (notificationPreferences.channels.inApp) deliveredChannels.push('in_app');
    if (notificationPreferences.channels.email) deliveredChannels.push('email');
    if (notificationPreferences.channels.whatsapp) deliveredChannels.push('whatsapp');

    const newNotif: NotifikasiItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      judul,
      pesan,
      kategori,
      waktu: 'Baru saja',
      dibaca: false,
      prioritas,
      actionModule,
      channelsDelivered: deliveredChannels,
    };

    setNotifikasiList((prev) => [newNotif, ...prev]);

    // Live In-App Toast
    if (notificationPreferences.channels.inApp) {
      const toastItem: LiveToastItem = {
        id: `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: judul,
        message: pesan,
        category: kategori,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        actionModule,
      };

      setLiveToasts((prev) => [toastItem, ...prev.slice(0, 3)]);

      if (notificationPreferences.enableSound) {
        playNotificationChime();
      }

      setTimeout(() => {
        setLiveToasts((prev) => prev.filter((t) => t.id !== toastItem.id));
      }, 6000);
    }
  };

  const simulateNotificationEvent = (type: 'course' | 'payment' | 'exam' | 'application' | 'helpdesk') => {
    switch (type) {
      case 'course':
        dispatchNotification(
          'Pembaruan Silabus & Jadwal Kuliah',
          'Dosen Pengampu menambahkan materi pertemuan 7 Cloud Computing & Microservices ke portal LMS.',
          'course_updates',
          'normal',
          'akademik'
        );
        break;
      case 'payment':
        dispatchNotification(
          'Pengingat Pembayaran UKT Semester Genap',
          'Tagihan SPP/UKT Semester Genap jatuh tempo dalam 3 hari kalender. Bayar via Virtual Account sebelum portal KRS ditutup.',
          'payment_reminders',
          'penting',
          'keuangan'
        );
        break;
      case 'exam':
        dispatchNotification(
          'Jadwal Ujian CBT Tengah Semester (UTS)',
          'Sesi Ujian CBT Kecerdasan Buatan telah dibuka. Periksa kesiapan kamera dan patuhi aturan anti-kecurangan.',
          'exam_schedules',
          'darurat',
          'lms-cbt'
        );
        break;
      case 'application':
        dispatchNotification(
          'Surat Keterangan Aktif Kuliah Disetujui',
          'Surat permohonan aktif kuliah Anda telah diverifikasi BAAK dan ditandatangani Dekan dengan QR E-Sign resmi.',
          'application_status',
          'normal',
          'persuratan'
        );
        break;
      case 'helpdesk':
        dispatchNotification(
          'Pembaruan Tiket Layanan Helpdesk #TKT-0815',
          'Petugas BAAK telah menanggapi tiket verifikasi bukti setoran Anda. Status diubah menjadi Selesai.',
          'helpdesk_updates',
          'normal',
          'helpdesk'
        );
        break;
    }
  };

  const markNotifAsRead = (id: string) => {
    setNotifikasiList((prev) => prev.map((n) => (n.id === id ? { ...n, dibaca: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifikasiList((prev) => prev.map((n) => ({ ...n, dibaca: true })));
  };

  const clearAllNotifications = () => {
    setNotifikasiList([]);
  };

  const kirimPesan = (penerimaId: string, penerimaNama: string, pesan: string) => {
    const newMsg: PesanKomunikasi = {
      id: `msg-${Date.now()}`,
      pengirimId: currentUser.identifier,
      pengirimNama: currentUser.name,
      penerimaId,
      penerimaNama,
      pesan,
      waktu: 'Baru saja',
    };
    setPesanList((prev) => [...prev, newMsg]);
  };

  // 13. Advanced Reporting & Analytics Aggregators
  const getAcademicAnalytics = (filter?: AnalyticsFilter): AcademicAnalyticsData => {
    const selectedProdi = filter?.prodi && filter.prodi !== 'Semua' ? filter.prodi : null;
    const mhsPool = selectedProdi
      ? mahasiswaList.filter((m) => m.prodi.toLowerCase().includes(selectedProdi.toLowerCase()))
      : mahasiswaList;

    const totalIpk = mhsPool.reduce((acc, curr) => acc + curr.ipk, 0);
    const avgIpk = mhsPool.length > 0 ? Math.round((totalIpk / mhsPool.length) * 100) / 100 : 3.75;
    const highestIpk = mhsPool.length > 0 ? Math.max(...mhsPool.map((m) => m.ipk)) : 3.95;
    const lowestIpk = mhsPool.length > 0 ? Math.min(...mhsPool.map((m) => m.ipk)) : 3.45;

    // IPK distribution brackets
    const cumlaude = mhsPool.filter((m) => m.ipk >= 3.75).length;
    const sangatMemuaskan = mhsPool.filter((m) => m.ipk >= 3.5 && m.ipk < 3.75).length;
    const memuaskan = mhsPool.filter((m) => m.ipk >= 3.0 && m.ipk < 3.5).length;
    const cukup = mhsPool.filter((m) => m.ipk < 3.0).length;
    const totalCount = mhsPool.length || 1;

    const ipkDistribution = [
      { range: '≥ 3.75 (Dengan Pujian / Cumlaude)', count: cumlaude, percentage: Math.round((cumlaude / totalCount) * 100) },
      { range: '3.50 - 3.74 (Sangat Memuaskan)', count: sangatMemuaskan, percentage: Math.round((sangatMemuaskan / totalCount) * 100) },
      { range: '3.00 - 3.49 (Memuaskan)', count: memuaskan, percentage: Math.round((memuaskan / totalCount) * 100) },
      { range: '< 3.00 (Cukup / Perlu Perhatian)', count: cukup, percentage: Math.round((cukup / totalCount) * 100) },
    ];

    // Grade distribution from Nilai list
    const gradeCounts: Record<string, number> = { A: 0, 'B+': 0, B: 0, 'C+': 0, C: 0, D: 0, E: 0 };
    nilaiList.forEach((n) => {
      gradeCounts[n.hurufMutu] = (gradeCounts[n.hurufMutu] || 0) + 1;
    });
    const totalGrades = nilaiList.length || 1;
    const gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({
      grade,
      count,
      percentage: Math.round((count / totalGrades) * 100),
    }));

    const prodiPerformance = [
      { prodi: 'Teknik Informatika (S1)', avgIpk: 3.75, passingRate: 98.2, studentCount: 420 },
      { prodi: 'Sistem Informasi (S1)', avgIpk: 3.55, passingRate: 96.5, studentCount: 350 },
      { prodi: 'Sains Data (S1)', avgIpk: 3.82, passingRate: 99.0, studentCount: 180 },
      { prodi: 'Teknik Komputer (S1)', avgIpk: 3.60, passingRate: 95.8, studentCount: 210 },
    ];

    return {
      avgIpk,
      highestIpk,
      lowestIpk,
      graduationOnTimeRate: 94.6,
      activeStudentsCount: mhsPool.length,
      ipkDistribution,
      gradeDistribution,
      prodiPerformance: selectedProdi
        ? prodiPerformance.filter((p) => p.prodi.toLowerCase().includes(selectedProdi.toLowerCase()))
        : prodiPerformance,
    };
  };

  const getFinancialAnalytics = (filter?: AnalyticsFilter): FinancialAnalyticsData => {
    const selectedProdi = filter?.prodi && filter.prodi !== 'Semua' ? filter.prodi : null;
    const pool = selectedProdi
      ? tagihanList.filter((t) => t.prodi.toLowerCase().includes(selectedProdi.toLowerCase()))
      : tagihanList;

    const totalBilled = pool.reduce((acc, t) => acc + t.nominal, 0);
    const totalCollected = pool.reduce((acc, t) => acc + t.terbayar, 0);
    const totalOutstanding = pool.reduce((acc, t) => acc + t.sisa, 0);
    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

    // Channel breakdown from transaksi
    const channels: Record<string, { total: number; count: number }> = {};
    transaksiList.forEach((trx) => {
      if (!channels[trx.metode]) channels[trx.metode] = { total: 0, count: 0 };
      channels[trx.metode].total += trx.nominal;
      channels[trx.metode].count += 1;
    });

    const totalTrxAmount = transaksiList.reduce((acc, t) => acc + t.nominal, 0) || 1;
    const channelBreakdown = Object.entries(channels).map(([channel, data]) => ({
      channel,
      total: data.total,
      count: data.count,
      percentage: Math.round((data.total / totalTrxAmount) * 100),
    }));

    // Aging arrears
    const agingArrears = [
      { range: '< 30 Hari (Jatuh tempo dekat)', amount: 5500000, studentCount: 1, percentage: 60 },
      { range: '30 - 60 Hari (Perlu Reminder)', amount: 2500000, studentCount: 1, percentage: 27 },
      { range: '> 60 Hari (Tertunggak Lama)', amount: 1250000, studentCount: 1, percentage: 13 },
    ];

    const prodiFinancials = [
      { prodi: 'Teknik Informatika (S1)', billed: 12700000, collected: 5950000, arrears: 6750000, rate: 47 },
      { prodi: 'Sistem Informasi (S1)', billed: 5000000, collected: 2500000, arrears: 2500000, rate: 50 },
      { prodi: 'Sains Data (S1)', billed: 4800000, collected: 4800000, arrears: 0, rate: 100 },
      { prodi: 'Teknik Komputer (S1)', billed: 5500000, collected: 5500000, arrears: 0, rate: 100 },
    ];

    return {
      totalBilled,
      totalCollected,
      totalOutstanding,
      collectionRate,
      channelBreakdown,
      agingArrears,
      prodiFinancials: selectedProdi
        ? prodiFinancials.filter((p) => p.prodi.toLowerCase().includes(selectedProdi.toLowerCase()))
        : prodiFinancials,
    };
  };

  const getOperationalAnalytics = (filter?: AnalyticsFilter): OperationalAnalyticsData => {
    // Helpdesk calculations
    const solvedTickets = tiketList.filter((t) => t.status === 'Selesai' || t.status === 'Ditutup');
    const helpdeskResolvedRate = tiketList.length > 0 ? Math.round((solvedTickets.length / tiketList.length) * 100) : 100;
    
    const ratedTickets = tiketList.filter((t) => t.penilaianLayanan);
    const avgCsat = ratedTickets.length > 0
      ? Math.round((ratedTickets.reduce((acc, t) => acc + (t.penilaianLayanan?.rating || 5), 0) / ratedTickets.length) * 10) / 10
      : 4.9;

    // e-Lab utilization
    const totalBorrowedLabUnits = peminjamanLabList
      .filter((p) => p.status === 'Disetujui / Dipinjam')
      .reduce((acc, p) => acc + p.items.reduce((s, it) => s + it.jumlah, 0), 0);
    const totalLabStock = labItems.reduce((acc, it) => acc + it.stokTotal, 0);
    const eLabUtilizationRate = totalLabStock > 0 ? Math.round((totalBorrowedLabUnits / totalLabStock) * 100) : 18;

    // Neo Feeder
    const latestSync = neoSyncHistory[0];
    const neoFeederSuccessRate = latestSync
      ? Math.round((latestSync.sukses / (latestSync.totalRecord || 1)) * 100)
      : 99.8;

    const serviceMetrics = [
      { service: 'Validasi KRS Mahasiswa (DPA)', slaTarget: '24 Jam', actualAvg: '8.4 Jam', complianceRate: 98 },
      { service: 'Penerbitan Surat Keterangan BAAK', slaTarget: '48 Jam', actualAvg: '14.2 Jam', complianceRate: 96 },
      { service: 'Penyelesaian Tiket Helpdesk Kampus', slaTarget: '24-48 Jam', actualAvg: '18.6 Jam', complianceRate: 94 },
      { service: 'Verifikasi Pembayaran Manual UKT', slaTarget: '12 Jam', actualAvg: '3.1 Jam', complianceRate: 99 },
      { service: 'Persetujuan Peminjaman Alat e-Lab', slaTarget: '24 Jam', actualAvg: '5.5 Jam', complianceRate: 97 },
      { service: 'Sinkronisasi Neo Feeder PDDikti', slaTarget: '100% Valid', actualAvg: '99.9%', complianceRate: 99 },
    ];

    return {
      helpdeskAvgSlaHours: 18.6,
      helpdeskResolvedRate,
      helpdeskCsatScore: avgCsat,
      eLabUtilizationRate,
      suratAvgTurnaroundHours: 14.2,
      cbtViolationRate: 4.8,
      neoFeederSuccessRate,
      serviceMetrics,
    };
  };

  // 13. SDLC Tests Runner
  const runSdlcTests = async () => {
    // Animate running state
    setSdlcTests((prev) => prev.map((t) => ({ ...t, status: 'running' })));
    await new Promise((r) => setTimeout(r, 600));

    setSdlcTests((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'passed',
        durationMs: Math.floor(15 + Math.random() * 40),
      }))
    );
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const exportDatabaseSnapshot = () => {
    const snapshot = {
      timestamp: new Date().toISOString(),
      mahasiswa: mahasiswaList,
      krs: krsList,
      nilai: nilaiList,
      tagihan: tagihanList,
      transaksi: transaksiList,
      tiketHelpdesk: tiketList,
      peminjamanLab: peminjamanLabList,
      surat: suratList,
      magang: pesertaMagangList,
      skripsi: dataSkripsi,
      catatanBimbingan: catatanBimbinganList,
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIAKAD_PRIMA_DB_SNAPSHOT_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiakadContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        activeModule,
        setActiveModule,
        modulesConfig,
        toggleModuleActive,
        mahasiswaList,
        dosenList,
        mataKuliahList,
        krsList,
        nilaiList,
        addKrsItem,
        removeKrsItem,
        submitKrsApproval,
        approveKrsDpa,
        updateNilai,
        tagihanList,
        transaksiList,
        bayarTagihan,
        validasiPembayaran,
        aiMessages,
        aiModel,
        setAiModel,
        sendAiMessage,
        clearAiChat,
        tiketList,
        createTiket,
        updateTiketStatus,
        rateTiket,
        labItems,
        selectedLabItemIds,
        toggleLabItemSelection,
        clearLabItemSelections,
        peminjamanLabList,
        submitPeminjamanLab,
        updateStatusPeminjamanLab,
        pegawaiList,
        addPegawai,
        materiLmsList,
        ujianCbt,
        cbtSession,
        isCbtActive,
        startCbtExam,
        recordCbtFocusViolation,
        finishCbtExam,
        neoMappings,
        neoSyncHistory,
        triggerNeoSync,
        suratList,
        ajukanSurat,
        verifikasiSuratBaak,
        tandatanganiSuratPejabat,
        programMagangList,
        pesertaMagangList,
        logbookMagangList,
        tambahLogbook,
        verifikasiLogbookDpl,
        dataSkripsi,
        catatanBimbinganList,
        tambahCatatanBimbingan,
        notifikasiList,
        markNotifAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        notificationPreferences,
        updateNotificationPreferences,
        liveToasts,
        dismissToast,
        dispatchNotification,
        simulateNotificationEvent,
        pesanList,
        kirimPesan,
        getAcademicAnalytics,
        getFinancialAnalytics,
        getOperationalAnalytics,
        sdlcTests,
        runSdlcTests,
        resetToDefault,
        exportDatabaseSnapshot,
      }}
    >
      {children}
    </SiakadContext.Provider>
  );
};

export const useSiakad = () => {
  const ctx = useContext(SiakadContext);
  if (!ctx) throw new Error('useSiakad must be used within SiakadProvider');
  return ctx;
};
