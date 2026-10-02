import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  FileText,
  Search,
  Printer,
  Edit3,
  Save,
  Users,
} from 'lucide-react';

export const AkademikModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    mataKuliahList,
    krsList,
    nilaiList,
    addKrsItem,
    removeKrsItem,
    submitKrsApproval,
    approveKrsDpa,
    updateNilai,
    mahasiswaList,
    dosenList,
  } = useSiakad();

  const [subTab, setSubTab] = useState<'krs' | 'nilai' | 'kurikulum' | 'mahasiswa' | 'dosen'>('krs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [krsAlert, setKrsAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Nilai edit state
  const [editingNilaiId, setEditingNilaiId] = useState<string | null>(null);
  const [kehadiranInput, setKehadiranInput] = useState<number>(90);
  const [tugasInput, setTugasInput] = useState<number>(85);
  const [utsInput, setUtsInput] = useState<number>(85);
  const [uasInput, setUasInput] = useState<number>(85);

  // Compute total SKS in KRS
  const currentSks = krsList.reduce((acc, curr) => {
    const mk = mataKuliahList.find((m) => m.id === curr.mataKuliahId);
    return acc + (mk?.sks || 0);
  }, 0);

  const maxSks = currentUser.maxSks || 24;

  const handleAddKrs = (mkId: string) => {
    const res = addKrsItem(mkId);
    setKrsAlert({
      type: res.success ? 'success' : 'error',
      message: res.message,
    });
    setTimeout(() => setKrsAlert(null), 4000);
  };

  const handleStartEditNilai = (n: any) => {
    setEditingNilaiId(n.id);
    setKehadiranInput(n.kehadiran);
    setTugasInput(n.tugas);
    setUtsInput(n.uts);
    setUasInput(n.uas);
  };

  const handleSaveNilai = (id: string) => {
    updateNilai(id, kehadiranInput, tugasInput, utsInput, uasInput);
    setEditingNilaiId(null);
  };

  const filteredMataKuliah = mataKuliahList.filter((mk) => {
    const matchSearch =
      mk.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mk.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mk.dosenPengampu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSem = selectedSemester === 0 || mk.semester === selectedSemester;
    return matchSearch && matchSem;
  });

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span>Akademik & Perkuliahan</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pengelolaan Kartu Rencana Studi (KRS), jadwal mata kuliah, kurikulum, serta penilaian mahasiswa
          </p>
        </div>

        {/* Sub-tabs pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setSubTab('krs')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'krs' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rencana Studi (KRS)
          </button>
          <button
            onClick={() => setSubTab('nilai')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'nilai' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pengelolaan Nilai
          </button>
          <button
            onClick={() => setSubTab('kurikulum')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'kurikulum' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kurikulum & Jadwal
          </button>
          <button
            onClick={() => setSubTab('mahasiswa')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'mahasiswa' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Mahasiswa
          </button>
          <button
            onClick={() => setSubTab('dosen')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'dosen' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Dosen
          </button>
        </div>
      </div>

      {/* Alert banner for KRS actions */}
      {krsAlert && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border animate-in fade-in duration-200 ${
            krsAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {krsAlert.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{krsAlert.message}</span>
        </div>
      )}

      {/* TAB 1: KRS (Kartu Rencana Studi) */}
      {subTab === 'krs' && (
        <div className="space-y-6">
          {/* Status Header */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Kartu Rencana Studi (KRS) Mahasiswa
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Semester Genap 2025/2026 • {currentUser.name} ({currentUser.identifier})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dosen Pembimbing Akademik (DPA): <strong className="text-slate-700">{currentUser.dpaName || 'Dr. Eng. Hendra Kurniawan'}</strong>
                </p>
              </div>

              {/* SKS Indicator Gauge */}
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 flex items-center gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Beban SKS Rencana</div>
                  <div className="text-xl font-black text-indigo-700">
                    {currentSks} <span className="text-xs font-semibold text-slate-500">/ {maxSks} SKS Maks</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <button
                  onClick={submitKrsApproval}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  Ajukan ke DPA
                </button>
              </div>
            </div>

            {/* List Mata Kuliah in KRS */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Mata Kuliah Terdaftar di KRS ({krsList.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Kode</th>
                      <th className="p-3">Mata Kuliah</th>
                      <th className="p-3">SKS</th>
                      <th className="p-3">Jadwal & Ruang</th>
                      <th className="p-3">Dosen Pengampu</th>
                      <th className="p-3">Status DPA</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {krsList.map((krs) => {
                      const mk = mataKuliahList.find((m) => m.id === krs.mataKuliahId);
                      if (!mk) return null;
                      return (
                        <tr key={krs.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-700">{mk.kode}</td>
                          <td className="p-3 font-bold text-slate-900">{mk.nama}</td>
                          <td className="p-3 font-semibold">{mk.sks} SKS</td>
                          <td className="p-3 text-slate-600">
                            <div>{mk.jadwal.hari}, {mk.jadwal.jamMulai}-{mk.jadwal.jamSelesai}</div>
                            <div className="text-[10px] text-slate-600">{mk.jadwal.ruangan}</div>
                          </td>
                          <td className="p-3 text-slate-700">{mk.dosenPengampu}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                krs.status === 'Disetujui DPA'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : krs.status === 'Menunggu Persetujuan DPA'
                                  ? 'bg-amber-100 text-amber-800'
                                  : krs.status === 'Ditolak'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {krs.status}
                            </span>
                            {krs.catatanDpa && (
                              <div className="text-[10px] text-slate-500 mt-0.5 italic">"{krs.catatanDpa}"</div>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {currentRole === 'dosen' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => approveKrsDpa(krs.id, 'Disetujui DPA', 'Disetujui oleh DPA')}
                                  className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                                >
                                  ACC
                                </button>
                                <button
                                  onClick={() => approveKrsDpa(krs.id, 'Ditolak', 'Perbaiki mata kuliah pilihan')}
                                  className="px-2 py-1 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700"
                                >
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => removeKrsItem(krs.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Batalkan Mata Kuliah"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Catalog of available courses to add to KRS */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Pilih Mata Kuliah Ditawarkan (Semester Genap)</h4>
            <p className="text-xs text-slate-500 mb-4">
              Klik tombol "+ Ambil" untuk menambahkan mata kuliah ke dalam draft KRS Anda.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mataKuliahList.map((mk) => {
                const isSelected = krsList.some((k) => k.mataKuliahId === mk.id);
                return (
                  <div
                    key={mk.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-indigo-50/40 border-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-600">{mk.kode}</span>
                        <span className="text-xs font-bold text-slate-900">{mk.nama}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {mk.sks} SKS • {mk.jadwal.hari}, {mk.jadwal.jamMulai}-{mk.jadwal.jamSelesai} • {mk.jadwal.ruangan}
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Dosen: {mk.dosenPengampu}</div>
                    </div>

                    <button
                      onClick={() => handleAddKrs(mk.id)}
                      disabled={isSelected}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terambil</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ambil</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENGELOLAAN NILAI (Input Nilai Dosen & KHS) */}
      {subTab === 'nilai' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {currentRole === 'dosen' ? 'Form Input & Verifikasi Nilai Mahasiswa' : 'Kartu Hasil Studi (KHS) Mahasiswa'}
                </h3>
                <p className="text-xs text-slate-500">
                  Formula Kelulusan: Kehadiran (10%) + Tugas/Praktikum (20%) + UTS (30%) + UAS (40%)
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Nilai / KHS</span>
              </button>
            </div>

            {/* Nilai Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Kode MK</th>
                    <th className="p-3">Mata Kuliah</th>
                    <th className="p-3 text-center">Kehadiran (10%)</th>
                    <th className="p-3 text-center">Tugas (20%)</th>
                    <th className="p-3 text-center">UTS (30%)</th>
                    <th className="p-3 text-center">UAS (40%)</th>
                    <th className="p-3 text-center">Nilai Akhir</th>
                    <th className="p-3 text-center">Huruf Mutu</th>
                    <th className="p-3 text-center">Kelulusan</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nilaiList.map((n) => {
                    const mk = mataKuliahList.find((m) => m.id === n.mataKuliahId);
                    const isEditing = editingNilaiId === n.id;

                    return (
                      <tr key={n.id} className="hover:bg-slate-50/70">
                        <td className="p-3 font-mono font-bold">{mk?.kode || 'MK-01'}</td>
                        <td className="p-3 font-bold text-slate-900">{mk?.nama}</td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={kehadiranInput}
                              onChange={(e) => setKehadiranInput(Number(e.target.value))}
                              className="w-16 px-1.5 py-0.5 border rounded text-center text-xs"
                            />
                          ) : (
                            n.kehadiran
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={tugasInput}
                              onChange={(e) => setTugasInput(Number(e.target.value))}
                              className="w-16 px-1.5 py-0.5 border rounded text-center text-xs"
                            />
                          ) : (
                            n.tugas
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={utsInput}
                              onChange={(e) => setUtsInput(Number(e.target.value))}
                              className="w-16 px-1.5 py-0.5 border rounded text-center text-xs"
                            />
                          ) : (
                            n.uts
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={uasInput}
                              onChange={(e) => setUasInput(Number(e.target.value))}
                              className="w-16 px-1.5 py-0.5 border rounded text-center text-xs"
                            />
                          ) : (
                            n.uas
                          )}
                        </td>
                        <td className="p-3 text-center font-bold text-indigo-700">{n.nilaiAkhir.toFixed(1)}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded font-black text-xs bg-indigo-100 text-indigo-800">
                            {n.hurufMutu}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              n.statusLulus ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {n.statusLulus ? 'LULUS' : 'MENGULANG'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveNilai(n.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 ml-auto"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Simpan</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEditNilai(n)}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 ml-auto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Input/Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KURIKULUM & JADWAL */}
      {subTab === 'kurikulum' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari mata kuliah atau dosen..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end">
              <span className="text-xs text-slate-500">Filter Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value={0}>Semua Semester</option>
                <option value={2}>Semester 2</option>
                <option value={4}>Semester 4</option>
                <option value={6}>Semester 6</option>
                <option value={8}>Semester 8</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMataKuliah.map((mk) => (
              <div key={mk.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                    {mk.kode}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{mk.sks} SKS • Sem {mk.semester}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{mk.nama}</h4>
                <div className="text-xs text-slate-600">
                  <strong>Pengampu:</strong> {mk.dosenPengampu}
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{mk.jadwal.hari}, {mk.jadwal.jamMulai} - {mk.jadwal.jamSelesai}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ruang: {mk.jadwal.ruangan} • Kuota: {mk.jadwal.terisi} / {mk.jadwal.kuota} mhs
                  </div>
                </div>
                {mk.prasyarat && (
                  <div className="text-[10px] text-slate-400">
                    Prasyarat: <span className="font-medium text-slate-600">{mk.prasyarat}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DATA MAHASISWA */}
      {subTab === 'mahasiswa' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Direktori Mahasiswa Program Studi</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {mahasiswaList.length} mahasiswa</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">NIM</th>
                  <th className="p-3">Nama Mahasiswa</th>
                  <th className="p-3">Program Studi</th>
                  <th className="p-3">Angkatan / Sem</th>
                  <th className="p-3">IPK</th>
                  <th className="p-3">SKS Lulus</th>
                  <th className="p-3">DPA</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mahasiswaList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">{m.nim}</td>
                    <td className="p-3 font-bold text-slate-900">{m.nama}</td>
                    <td className="p-3 text-slate-600">{m.prodi}</td>
                    <td className="p-3">{m.angkatan} (Sem {m.semester})</td>
                    <td className="p-3 font-bold text-indigo-700">{m.ipk.toFixed(2)}</td>
                    <td className="p-3">{m.sksLulus} SKS</td>
                    <td className="p-3 text-slate-600">{m.dpa}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DATA DOSEN */}
      {subTab === 'dosen' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Direktori Dosen & Pembimbing Akademik</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {dosenList.length} Dosen Tetap</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">NIDN / NIP</th>
                  <th className="p-3">Nama Lengkap & Gelar</th>
                  <th className="p-3">Program Studi</th>
                  <th className="p-3">Jabatan Fungsional</th>
                  <th className="p-3">Pendidikan</th>
                  <th className="p-3">BKD Semester</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dosenList.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-slate-800">{d.nidn}</div>
                      <div className="text-[10px] text-slate-400">{d.nip}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{d.nama}, {d.gelar}</td>
                    <td className="p-3 text-slate-600">{d.prodi}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {d.jabatanFungsional}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{d.pendidikanTertinggi}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold">{d.sksBkd} SKS</span> ({d.bkdStatus})
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
