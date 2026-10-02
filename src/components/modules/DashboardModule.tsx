import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  GraduationCap,
  Wallet,
  Sparkles,
  BookOpenCheck,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck2,
  Users,
  Send,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  Bell,
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    setActiveModule,
    mataKuliahList,
    krsList,
    tagihanList,
    dataSkripsi,
    pesanList,
    kirimPesan,
    isCbtActive,
    cbtSession,
  } = useSiakad();

  const [chatInput, setChatInput] = useState('');

  // SKS taken
  const totalSksTaken = krsList.reduce((acc, curr) => {
    const mk = mataKuliahList.find((m) => m.id === curr.mataKuliahId);
    return acc + (mk?.sks || 0);
  }, 0);

  // Unpaid balance
  const totalOutstanding = tagihanList.reduce((acc, curr) => acc + curr.sisa, 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    kirimPesan('usr-dsn-01', 'Dr. Eng. Hendra Kurniawan', chatInput);
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Semester Genap 2025/2026 Aktif
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            {currentUser.prodi} • {currentUser.fakultas}. Anda saat ini terhubung dengan hak akses{' '}
            <strong className="text-white uppercase underline decoration-sky-400">{currentRole}</strong>.
          </p>
        </div>

        {/* Action button inside banner */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveModule('akademik')}
            className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-sky-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Buka KRS & Jadwal Kuliah</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveModule('ai-assistant')}
            className="px-4 py-2 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center gap-2 border border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Konsultasi Siakad AI</span>
          </button>
        </div>
      </div>

      {/* CBT Warning Alert if Active */}
      {isCbtActive && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-800">
            <span className="font-bold">PERINGATAN UJIAN CBT AKTIF:</span> Anda sedang dalam sesi ujian CBT.
            Dilarang berpindah tab browser atau membuka aplikasi lain. Akses Siakad AI telah dinonaktifkan sementara.
            <div className="mt-1 font-semibold text-red-900">
              Pelanggaran perpindahan jendela tercatat: {cbtSession?.fokusPindahCount || 0} kali.
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: IPK / BKD */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {currentRole === 'dosen' ? 'Kinerja BKD Dosen' : 'Indeks Prestasi Kumulatif'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentRole === 'dosen' ? '14.0 SKS' : currentUser.ipk?.toFixed(2) || '3.82'}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span>● Status: {currentRole === 'dosen' ? 'Memenuhi Syarat' : 'Sangat Memuaskan'}</span>
          </div>
        </div>

        {/* Card 2: SKS / Beban Mengajar */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {currentRole === 'dosen' ? 'Total Kelas Diampu' : 'SKS Semester Ini'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentRole === 'dosen' ? '4 Mata Kuliah' : `${totalSksTaken} / ${currentUser.maxSks || 24} SKS`}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {currentRole === 'dosen' ? '128 Mahasiswa Aktif' : `Kumulatif: ${currentUser.sksTaken || 118} SKS Lulus`}
          </div>
        </div>

        {/* Card 3: Keuangan / Tagihan */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {currentRole === 'keuangan' ? 'Total Piutang Kampus' : 'Status Tagihan'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentRole === 'keuangan'
              ? 'Rp 14.750.000'
              : totalOutstanding === 0
              ? 'Lunas'
              : `Rp ${totalOutstanding.toLocaleString('id-ID')}`}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {totalOutstanding === 0 ? 'Tidak ada tunggakan SPP/UKT' : 'Jatuh tempo 15 Maret 2026'}
          </div>
        </div>

        {/* Card 4: Skripsi / Layanan */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Progress Tugas Akhir</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {dataSkripsi.totalBimbinganAcc} / {dataSkripsi.targetBimbinganMin} ACC
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold">
            <span>● Siap Cetak Kartu Bimbingan</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Schedule & Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Academic Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jadwal Kuliah Hari Ini */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Jadwal Perkuliahan & Praktikum Terdaftar</h3>
              </div>
              <button
                onClick={() => setActiveModule('akademik')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {mataKuliahList.slice(0, 3).map((mk) => (
                <div
                  key={mk.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {mk.kode}
                      </span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{mk.nama}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Dosen: {mk.dosenPengampu} • {mk.sks} SKS
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{mk.jadwal.hari}, {mk.jadwal.jamMulai} - {mk.jadwal.jamSelesai}</span>
                    </div>
                    <span className="text-slate-400">|</span>
                    <span className="text-[11px] text-slate-500">{mk.jadwal.ruangan}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts to Core Modules */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Layanan Cepat Mahasiswa & Dosen</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveModule('persuratan')}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Persuratan</div>
                <div className="text-[10px] text-slate-500">Ajukan Surat Aktif/PKL</div>
              </button>

              <button
                onClick={() => setActiveModule('e-lab')}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <BookOpenCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">e-Lab Pinjam</div>
                <div className="text-[10px] text-slate-500">Katalog Alat Praktikum</div>
              </button>

              <button
                onClick={() => setActiveModule('magang')}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Magang MBKM</div>
                <div className="text-[10px] text-slate-500">Logbook & Evaluasi DPL</div>
              </button>

              <button
                onClick={() => setActiveModule('skripsi')}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Kartu Bimbingan</div>
                <div className="text-[10px] text-slate-500">Cetak Ruang TTD Prodi</div>
              </button>

              <button
                onClick={() => setActiveModule('analytics')}
                className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:border-indigo-400 hover:bg-indigo-50 text-left transition-all group col-span-2 sm:col-span-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span>Laporan Eksekutif & Analitik Kampus</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold uppercase">
                          Executive Insights
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Visualisasi performa akademik (IPK & kelulusan), keuangan & piutang UKT, dan efisiensi operasional SLA
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Internal Messaging & Broadcast */}
        <div className="space-y-6">
          {/* Internal Communication Widget */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col h-[400px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Konsultasi Internal DPA</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                Online
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {pesanList.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs ${
                    msg.pengirimId === currentUser.identifier
                      ? 'bg-indigo-600 text-white ml-6 rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 mr-6 rounded-bl-xs'
                  }`}
                >
                  <div className="font-bold text-[10px] opacity-80 mb-0.5">{msg.pengirimNama}</div>
                  <div>{msg.pesan}</div>
                  <div className="text-[9px] opacity-70 text-right mt-1">{msg.waktu}</div>
                </div>
              ))}
            </div>

            {/* Send Input */}
            <form onSubmit={handleSendMessage} className="mt-3 pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tulis pesan ke DPA..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
                title="Kirim Pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Announcements Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2 text-amber-300">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Pengumuman Rektorat</span>
            </div>
            <h4 className="font-bold text-sm leading-snug">
              Batas Akhir Validasi KRS & Pembayaran UKT Semester Genap
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Mahasiswa wajib menyelesaikan administrasi KRS dan konfirmasi bukti pembayaran sebelum tanggal 15 Maret 2026 pukul 23:59 WIB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
