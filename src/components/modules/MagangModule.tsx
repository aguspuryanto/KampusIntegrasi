import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Calendar,
  Building,
  UserCheck,
  FileCheck,
  Award,
  AlertTriangle,
  Upload,
} from 'lucide-react';

export const MagangModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    programMagangList,
    pesertaMagangList,
    logbookMagangList,
    tambahLogbook,
    verifikasiLogbookDpl,
  } = useSiakad();

  const [activeTab, setActiveTab] = useState<'logbook' | 'penempatan' | 'penilaian'>('logbook');
  const [showLogModal, setShowLogModal] = useState(false);

  // Form input
  const [aktivitasInput, setAktivitasInput] = useState('');
  const [kendalaInput, setKendalaInput] = useState('');
  const [solusiInput, setSolusiInput] = useState('');

  const currentPeserta = pesertaMagangList[0];

  const handleAddLogbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aktivitasInput.trim()) return;
    tambahLogbook(aktivitasInput, kendalaInput, solusiInput);
    setAktivitasInput('');
    setKendalaInput('');
    setSolusiInput('');
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Praktik Kerja Lapangan & Magang MBKM</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Penempatan mitra industri, bimbingan DPL, logbook harian, serta evaluasi konversi SKS
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('logbook')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'logbook' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Logbook Harian ({logbookMagangList.length})
          </button>
          <button
            onClick={() => setActiveTab('penempatan')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'penempatan' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Penempatan & DPL
          </button>
          <button
            onClick={() => setActiveTab('penilaian')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'penilaian' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Penilaian & Laporan Akhir
          </button>
        </div>
      </div>

      {/* Program Summary Card */}
      {currentPeserta && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
              Program Aktif • 20 SKS Konversi
            </span>
            <h3 className="font-extrabold text-base text-slate-900">{currentPeserta.namaProgram}</h3>
            <div className="text-xs text-slate-600">
              Mitra: <strong>{currentPeserta.mitra}</strong> • DPL: <strong>{currentPeserta.dplNama}</strong>
            </div>
            <div className="text-[11px] text-slate-500">Mentor Industri: {currentPeserta.mentorIndustri}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500">Status Magang</div>
              <div className="text-sm font-extrabold text-emerald-600">{currentPeserta.status}</div>
            </div>
            <button
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Isi Logbook Hari Ini</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: LOGBOOK HARIAN */}
      {activeTab === 'logbook' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Riwayat Aktivitas Logbook Harian</h3>
            <span className="text-xs text-slate-500 font-semibold">{logbookMagangList.length} Entri Tercatat</span>
          </div>

          <div className="space-y-3">
            {logbookMagangList.map((log) => (
              <div
                key={log.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Tanggal: {log.tanggal}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.statusVerifikasiDpl === 'Disetujui'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.statusVerifikasiDpl === 'Perlu Perbaikan'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    ● Verifikasi DPL: {log.statusVerifikasiDpl}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1.5">
                  <div>
                    <span className="font-bold text-slate-900">Uraian Aktivitas:</span> {log.aktivitas}
                  </div>
                  {log.kendala && (
                    <div className="text-slate-500">
                      <strong>Kendala:</strong> {log.kendala}
                    </div>
                  )}
                  {log.solusi && (
                    <div className="text-slate-500">
                      <strong>Solusi:</strong> {log.solusi}
                    </div>
                  )}
                </div>

                {log.catatanDpl && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <strong className="text-indigo-700">Catatan Review DPL:</strong> "{log.catatanDpl}"
                  </div>
                )}

                {/* DPL Review Action if role is dosen */}
                {currentRole === 'dosen' && log.statusVerifikasiDpl === 'Menunggu Review' && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      onClick={() =>
                        verifikasiLogbookDpl(log.id, 'Disetujui', 'Aktivitas tervalidasi sesuai capaian kompetensi.')
                      }
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      ACC Logbook
                    </button>
                    <button
                      onClick={() =>
                        verifikasiLogbookDpl(log.id, 'Perlu Perbaikan', 'Lengkapi dokumentasi foto hasil implementasi.')
                      }
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Minta Perbaikan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PENEMPATAN & MITRA */}
      {activeTab === 'penempatan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programMagangList.map((prog) => (
            <div key={prog.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {prog.kategori}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900">{prog.namaProgram}</h4>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Mitra: <strong>{prog.mitraPerusahaan}</strong></div>
                <div>Lokasi: {prog.lokasi}</div>
                <div>Posisi: {prog.posisi}</div>
                <div>Periode: {prog.periode}</div>
                <div>Kuota Tersedia: <strong className="text-indigo-600">{prog.kuota} Mahasiswa</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PENILAIAN & LAPORAN */}
      {activeTab === 'penilaian' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-extrabold text-slate-900 text-sm">Rekapitulasi Penilaian Akhir Magang & Laporan</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="text-xs text-slate-500 font-semibold">Nilai Evaluasi Mitra Industri</div>
              <div className="text-3xl font-black text-emerald-600">{currentPeserta?.nilaiMitra || 94}</div>
              <div className="text-[10px] text-slate-400">Softskills, Disiplin, Kerjasama Tim</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="text-xs text-slate-500 font-semibold">Nilai Dosen Pembimbing (DPL)</div>
              <div className="text-3xl font-black text-indigo-600">{currentPeserta?.nilaiDpl || 92}</div>
              <div className="text-[10px] text-slate-400">Laporan Akademik & Logbook Harian</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="text-xs text-slate-500 font-semibold">Konversi Nilai Akhir SKS</div>
              <div className="text-3xl font-black text-purple-600">A (4.00)</div>
              <div className="text-[10px] text-emerald-600 font-bold">20 SKS Terkonversi di KHS</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-800">Unggah Laporan Akhir Magang (Format PDF)</div>
            <p className="text-[11px] text-slate-500">Maksimal 25MB, telah ditandatangani oleh Mentor Industri & DPL</p>
            <button
              onClick={() => alert('Simulasi: Berkas Laporan Akhir Magang berhasil diunggah.')}
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Pilih Berkas Laporan
            </button>
          </div>
        </div>
      )}

      {/* Modal Tambah Logbook */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleAddLogbook}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4"
          >
            <h3 className="font-extrabold text-slate-900 text-base">Isi Logbook Aktivitas Harian Magang</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rincian Kegiatan Hari Ini</label>
              <textarea
                required
                rows={3}
                value={aktivitasInput}
                onChange={(e) => setAktivitasInput(e.target.value)}
                placeholder="Deskripsikan pekerjaan teknis atau riset yang Anda selesaikan hari ini..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kendala yang Dihadapi (Opsional)</label>
              <input
                type="text"
                value={kendalaInput}
                onChange={(e) => setKendalaInput(e.target.value)}
                placeholder="Contoh: Kesulitan konfigurasi SSL internal..."
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Solusi / Langkah Pemecahan</label>
              <input
                type="text"
                value={solusiInput}
                onChange={(e) => setSolusiInput(e.target.value)}
                placeholder="Contoh: Diskusi dengan mentor industri dan instalasi root CA..."
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Simpan Logbook
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
