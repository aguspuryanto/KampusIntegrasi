import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  BookMarked,
  Printer,
  Plus,
  CheckCircle2,
  Calendar,
  FileCheck2,
  Award,
  UserCheck,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const SkripsiModule: React.FC = () => {
  const {
    currentUser,
    dataSkripsi,
    catatanBimbinganList,
    tambahCatatanBimbingan,
  } = useSiakad();

  const [showAddBimbinganModal, setShowAddBimbinganModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Form input
  const [babInput, setBabInput] = useState('');
  const [catatanInput, setCatatanInput] = useState('');
  const [dosenNamaInput, setDosenNamaInput] = useState(dataSkripsi.dosenPembimbing1);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!babInput.trim() || !catatanInput.trim()) return;
    tambahCatatanBimbingan(babInput, catatanInput, dosenNamaInput);
    setBabInput('');
    setCatatanInput('');
    setShowAddBimbinganModal(false);
  };

  const isEligibleForDefense = dataSkripsi.totalBimbinganAcc >= dataSkripsi.targetBimbinganMin;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-indigo-600" />
            <span>Skripsi, Tugas Akhir & Bimbingan</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Logbook bimbingan berkala dan cetak kartu resmi dengan ruang tanda tangan Admin Prodi & Koordinator
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBimbinganModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sesi Bimbingan</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu Bimbingan Resmi</span>
          </button>
        </div>
      </div>

      {/* Thesis Info Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
              Tahap: {dataSkripsi.statusProposal}
            </span>
            <h3 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">
              {dataSkripsi.judulSkripsi}
            </h3>
            <div className="text-xs text-slate-500 mt-0.5">
              Bidang Kajian: <strong>{dataSkripsi.bidangKajian}</strong> • Mahasiswa: <strong>{dataSkripsi.mahasiswaNama} ({dataSkripsi.mahasiswaNim})</strong>
            </div>
          </div>

          {/* Bimbingan Target Badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center shrink-0">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Sesi Bimbingan Terpenuhi</div>
            <div className="text-2xl font-black text-indigo-700">
              {dataSkripsi.totalBimbinganAcc} / {dataSkripsi.targetBimbinganMin}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              {isEligibleForDefense ? '● Syarat Sidang Terpenuhi' : 'Belum Memenuhi Target'}
            </div>
          </div>
        </div>

        {/* Supervisor List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Pembimbing 1 (Utama)</div>
            <div className="font-bold text-slate-900">{dataSkripsi.dosenPembimbing1}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Pembimbing 2 (Pendamping)</div>
            <div className="font-bold text-slate-900">{dataSkripsi.dosenPembimbing2}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Koordinator Skripsi</div>
            <div className="font-bold text-slate-900">{dataSkripsi.koordinatorSkripsi}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Admin Program Studi</div>
            <div className="font-bold text-slate-900">{dataSkripsi.adminProdi}</div>
          </div>
        </div>
      </div>

      {/* Logbook Bimbingan Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Catatan Bimbingan Berkala (Logbook)</h3>
            <p className="text-xs text-slate-500">
              Setiap catatan bimbingan disahkan dengan paraf dosen pembimbing untuk kelayakan cetak kartu
            </p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{catatanBimbinganList.length} Sesi Pertemuan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-16 text-center">Ke-</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Bab & Pokok Bahasan</th>
                <th className="p-3">Catatan / Arahan Revisi Dosen</th>
                <th className="p-3">Dosen Pembimbing</th>
                <th className="p-3 text-center">Status Paraf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {catatanBimbinganList.map((cb) => (
                <tr key={cb.id} className="hover:bg-slate-50">
                  <td className="p-3 text-center font-bold font-mono text-indigo-700">{cb.pertemuanKe}</td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">{cb.tanggal}</td>
                  <td className="p-3 font-bold text-slate-900">{cb.babBahasan}</td>
                  <td className="p-3 text-slate-600 max-w-md">{cb.catatanDosen}</td>
                  <td className="p-3 text-slate-700 font-medium">{cb.dosenNama}</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ACC / Tervalidasi</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Catatan Bimbingan */}
      {showAddBimbinganModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4"
          >
            <h3 className="font-extrabold text-slate-900 text-base">Tambah Catatan Sesi Bimbingan</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bab & Topik yang Dibahas</label>
              <input
                type="text"
                required
                value={babInput}
                onChange={(e) => setBabInput(e.target.value)}
                placeholder="Contoh: Bab 4: Hasil Pengujian Akurasi Model & Pembahasan"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dosen Pembimbing yang Menemui</label>
              <select
                value={dosenNamaInput}
                onChange={(e) => setDosenNamaInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              >
                <option value={dataSkripsi.dosenPembimbing1}>{dataSkripsi.dosenPembimbing1} (Pembimbing 1)</option>
                <option value={dataSkripsi.dosenPembimbing2}>{dataSkripsi.dosenPembimbing2} (Pembimbing 2)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Arahan & Revisi Dosen</label>
              <textarea
                required
                rows={3}
                value={catatanInput}
                onChange={(e) => setCatatanInput(e.target.value)}
                placeholder="Tuliskan poin-poin revisi yang diarahkan oleh dosen pembimbing..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddBimbinganModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Simpan Bimbingan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OFFICIAL PRINT MODAL: KARTU KONTROL BIMBINGAN SKRIPSI */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header Universitas Resmi */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="font-serif font-black text-slate-900 text-lg uppercase tracking-wider">
                UNIVERSITAS PRIMA NUSANTARA
              </div>
              <div className="font-bold text-xs text-slate-800">
                FAKULTAS ILMU KOMPUTER & SAINS DATA • PROGRAM STUDI TEKNIK INFORMATIKA
              </div>
              <div className="text-[10px] text-slate-500">
                Kampus Terpadu: Jl. Cendekia No. 1 • Laman: https://prima.ac.id • Akreditasi: Unggul
              </div>
            </div>

            {/* Title Document */}
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base underline uppercase text-slate-900">
                KARTU KONTROL & BUKTI BIMBINGAN TUGAS AKHIR / SKRIPSI
              </h3>
              <div className="text-xs font-mono text-slate-500">Tahun Akademik 2025/2026 Genap</div>
            </div>

            {/* Identitas Mahasiswa */}
            <div className="grid grid-cols-2 gap-4 text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <div>Nama Mahasiswa : <strong>{dataSkripsi.mahasiswaNama}</strong></div>
                <div>NIM : <strong className="font-mono">{dataSkripsi.mahasiswaNim}</strong></div>
                <div>Program Studi : <strong>{dataSkripsi.prodi}</strong></div>
              </div>
              <div className="space-y-1">
                <div>Pembimbing 1 : <strong>{dataSkripsi.dosenPembimbing1}</strong></div>
                <div>Pembimbing 2 : <strong>{dataSkripsi.dosenPembimbing2}</strong></div>
                <div>Status Sesi : <strong className="text-emerald-700">Lengkap ({dataSkripsi.totalBimbinganAcc} Sesi ACC)</strong></div>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200">
                <div>Judul Skripsi : <em>"{dataSkripsi.judulSkripsi}"</em></div>
              </div>
            </div>

            {/* Table of Guidance Sessions */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300 text-slate-800">
                  <tr>
                    <th className="p-2 border-r border-slate-300 text-center w-10">No</th>
                    <th className="p-2 border-r border-slate-300 w-24">Tanggal</th>
                    <th className="p-2 border-r border-slate-300 w-44">Bab / Materi Bahasan</th>
                    <th className="p-2 border-r border-slate-300">Catatan Revisi & Arahan</th>
                    <th className="p-2 border-r border-slate-300 w-32">Dosen</th>
                    <th className="p-2 text-center w-20">Paraf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {catatanBimbinganList.map((cb) => (
                    <tr key={cb.id}>
                      <td className="p-2 text-center border-r border-slate-200 font-bold">{cb.pertemuanKe}</td>
                      <td className="p-2 border-r border-slate-200">{cb.tanggal}</td>
                      <td className="p-2 border-r border-slate-200 font-semibold">{cb.babBahasan}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{cb.catatanDosen}</td>
                      <td className="p-2 border-r border-slate-200 text-[11px]">{cb.dosenNama}</td>
                      <td className="p-2 text-center text-emerald-700 font-bold text-[10px]">
                        [PARAF VALID]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Signature Grid (Requirement: ruang tanda tangan Admin Prodi serta Koordinator) */}
            <div className="pt-6 border-t-2 border-slate-900 text-xs">
              <div className="text-center font-bold text-slate-800 mb-6">
                LEMBAR PENGESAHAN KELAYAKAN SIDANG MUNAQASYAH SKRIPSI
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {/* 1. Dosen Pembimbing */}
                <div className="space-y-12">
                  <div className="font-semibold text-slate-700">Dosen Pembimbing Utama,</div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold underline text-slate-900">{dataSkripsi.dosenPembimbing1}</div>
                    <div className="text-[10px] text-slate-500 font-mono">NIDN. 0012048201</div>
                  </div>
                </div>

                {/* 2. Koordinator Skripsi */}
                <div className="space-y-12">
                  <div className="font-semibold text-slate-700">Koordinator Skripsi / TA,</div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold underline text-slate-900">{dataSkripsi.koordinatorSkripsi}</div>
                    <div className="text-[10px] text-slate-500 font-mono">NIP. 197503111999031001</div>
                  </div>
                </div>

                {/* 3. Admin Program Studi / Ketua Jurusan */}
                <div className="space-y-12">
                  <div className="font-semibold text-slate-700">Admin Program Studi,</div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold underline text-slate-900">{dataSkripsi.adminProdi}</div>
                    <div className="text-[10px] text-slate-500 font-mono">NIP. 197901202005011003</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Resmi (PDF)</span>
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
