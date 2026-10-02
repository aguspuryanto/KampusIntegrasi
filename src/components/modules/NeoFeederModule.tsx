import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  FileSpreadsheet,
  Check,
  Search,
} from 'lucide-react';
import { NeoFeederSyncHistory } from '../../types/siakad';

export const NeoFeederModule: React.FC = () => {
  const { neoMappings, neoSyncHistory, triggerNeoSync } = useSiakad();

  const [activeTab, setActiveTab] = useState<'mapping' | 'diff' | 'history'>('mapping');
  const [syncingEntity, setSyncingEntity] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const handleSync = async (entitas: NeoFeederSyncHistory['entitas']) => {
    setSyncingEntity(entitas);
    await new Promise((r) => setTimeout(r, 1200));
    triggerNeoSync(entitas);
    setSyncingEntity(null);
    setSyncSuccessMsg(`Sinkronisasi Web Services Neo Feeder untuk entitas ${entitas} berhasil diproses.`);
    setTimeout(() => setSyncSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600" />
            <span>Neo Feeder PDDikti & Validasi Data Nasional</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pemetaan skema data lokal SIAKAD ke Pangkalan Data Pendidikan Tinggi (PDDikti), diff preview, dan sinkronisasi
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('mapping')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'mapping' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Pemetaan Skema (Mapping)
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'diff' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Pratinjau Perubahan (Diff)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Riwayat Sinkronisasi
          </button>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Sync Control Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            Koneksi Web Services Ditjen Diktiristek
          </div>
          <div className="text-sm font-extrabold mt-0.5">
            Endpoint: <span className="font-mono text-emerald-400">https://feeder.kemdikbud.go.id/ws/live2.php</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1">Status Token WS: Aktif (Kadaluarsa dalam 48 jam)</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['Mahasiswa', 'KRS', 'Nilai'] as const).map((entitas) => (
            <button
              key={entitas}
              onClick={() => handleSync(entitas)}
              disabled={syncingEntity !== null}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingEntity === entitas ? 'animate-spin' : ''}`} />
              <span>Sync {entitas}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PEMETAAN DATA (DATA MAPPING) */}
      {activeTab === 'mapping' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Tabel Pemetaan Skema Lokal vs PDDikti</h3>
            <span className="text-xs text-slate-500 font-semibold">{neoMappings.length} Entri Terpetakan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Tabel SIAKAD Lokal</th>
                  <th className="p-3.5">Field Lokal</th>
                  <th className="p-3.5">Hubungan</th>
                  <th className="p-3.5">Tabel PDDikti Feeder</th>
                  <th className="p-3.5">Field Sasaran PDDikti</th>
                  <th className="p-3.5 text-right">Status Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {neoMappings.map((map) => (
                  <tr key={map.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-slate-800">{map.tabelLokal}</td>
                    <td className="p-3.5 font-mono text-indigo-700 font-semibold">{map.fieldLokal}</td>
                    <td className="p-3.5 text-slate-400">
                      <ArrowRight className="w-4 h-4" />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-800">{map.tabelPddikti}</td>
                    <td className="p-3.5 font-mono text-emerald-700 font-semibold">{map.fieldPddikti}</td>
                    <td className="p-3.5 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {map.statusValidasi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRATINJAU PERUBAHAN (DIFF PREVIEW) */}
      {activeTab === 'diff' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Pratinjau Perbedaan Data (Diff Synchronization Preview)
              </h3>
              <p className="text-xs text-slate-500">
                Evaluasi perbedaan record antara database SIAKAD Prima dan Pangkalan Data Nasional sebelum push
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Record Baru (+ Insert)</div>
              <div className="text-2xl font-black text-emerald-700">12 Mahasiswa</div>
              <p className="text-[11px] text-emerald-800">
                Mahasiswa baru hasil mutasi transfer dan pendaftaran semester genap yang belum terdaftar di Neo Feeder.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">Record Diperbarui (Update)</div>
              <div className="text-2xl font-black text-blue-700">3.418 KRS & Nilai</div>
              <p className="text-[11px] text-blue-800">
                Perubahan huruf mutu akhir dan persetujuan KRS oleh Dosen Pembimbing Akademik.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Potensi Konflik Data</div>
              <div className="text-2xl font-black text-amber-700">2 Record</div>
              <p className="text-[11px] text-amber-800">
                NIK KTP belum 16 digit atau data ibu kandung kosong pada profil mahasiswa cuti.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RIWAYAT SINKRONISASI */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Riwayat Transaksi Sinkronisasi Neo Feeder</h3>
            <span className="text-xs text-slate-500 font-semibold">{neoSyncHistory.length} Riwayat</span>
          </div>

          <div className="space-y-3">
            {neoSyncHistory.map((hist) => (
              <div
                key={hist.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Entitas: {hist.entitas}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        hist.status === 'Sukses Penuh'
                          ? 'bg-emerald-100 text-emerald-800'
                          : hist.status === 'Sukses Sebagian'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {hist.status}
                    </span>
                  </div>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hist.waktuSync}</span>
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  Total Diproses: <strong>{hist.totalRecord.toLocaleString('id-ID')}</strong> | Berhasil:{' '}
                  <strong className="text-emerald-700">{hist.sukses.toLocaleString('id-ID')}</strong> | Gagal:{' '}
                  <strong className="text-rose-700">{hist.gagal}</strong>
                </div>

                <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                  {hist.logDetail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
