import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck2,
  XCircle,
  QrCode,
  Building,
  UserCheck,
} from 'lucide-react';
import { PengajuanSurat } from '../../types/siakad';

export const PersuratanModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    suratList,
    ajukanSurat,
    verifikasiSuratBaak,
    tandatanganiSuratPejabat,
  } = useSiakad();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedSuratPrint, setSelectedSuratPrint] = useState<PengajuanSurat | null>(null);

  // Form input
  const [jenisSuratInput, setJenisSuratInput] = useState<PengajuanSurat['jenisSurat']>(
    'Surat Keterangan Aktif Kuliah'
  );
  const [keperluanInput, setKeperluanInput] = useState('');

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keperluanInput.trim()) return;
    ajukanSurat(jenisSuratInput, keperluanInput);
    setKeperluanInput('');
    setShowApplyModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span>Persuratan Online & E-Signature</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Alur verifikasi berjenjang: Pengajuan Mahasiswa → Verifikasi Staf BAAK → Tanda Tangan Digital Pejabat
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Surat Daring</span>
        </button>
      </div>

      {/* Multi-Tier Flow Indicator */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
          <span>Pengajuan Daring Mahasiswa</span>
        </div>
        <span className="text-slate-300 hidden md:block">→</span>
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
          <span>Verifikasi Berkas BAAK</span>
        </div>
        <span className="text-slate-300 hidden md:block">→</span>
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">3</span>
          <span>Persetujuan Pejabat & QR E-Sign</span>
        </div>
        <span className="text-slate-300 hidden md:block">→</span>
        <div className="flex items-center gap-2 font-bold text-emerald-700">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
          <span>Terbit & Siap Unduh</span>
        </div>
      </div>

      {/* Surat List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Daftar Pengajuan Surat Resmi</h3>
          <span className="text-xs text-slate-500 font-semibold">{suratList.length} Pengajuan Tercatat</span>
        </div>

        <div className="space-y-4">
          {suratList.map((surat) => (
            <div
              key={surat.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700">{surat.nomorPengajuan}</span>
                  {surat.nomorSuratResmi && (
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-100 text-indigo-900">
                      No: {surat.nomorSuratResmi}
                    </span>
                  )}
                  <span className="font-extrabold text-xs text-slate-900">{surat.jenisSurat}</span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold self-start ${
                    surat.status === 'Selesai & Siap Unduh'
                      ? 'bg-emerald-100 text-emerald-800'
                      : surat.status === 'Diverifikasi BAAK'
                      ? 'bg-blue-100 text-blue-800'
                      : surat.status === 'Ditolak'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  ● {surat.status}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800">
                  Pemohon: {surat.pemohonNama} ({surat.pemohonNim}) • {surat.prodi}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  <strong>Keperluan:</strong> {surat.keperluan}
                </div>
                {surat.catatan && (
                  <div className="text-[11px] text-slate-500 italic mt-1 bg-white p-2 rounded-lg border border-slate-200">
                    Catatan: {surat.catatan}
                  </div>
                )}
              </div>

              {/* Progress & Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span>Diajukan: {surat.tanggalPengajuan}</span>
                  {surat.petugasVerifikasi && (
                    <span>• Verifikator: <strong>{surat.petugasVerifikasi}</strong></span>
                  )}
                  {surat.pejabatPenandatangan && (
                    <span>• Penandatangan: <strong>{surat.pejabatPenandatangan}</strong></span>
                  )}
                </div>

                {/* Multi-tier Approval Actions */}
                <div className="flex items-center gap-2 self-end">
                  {/* Step 1: BAAK Verification */}
                  {surat.status === 'Diajukan' && (
                    <>
                      <button
                        onClick={() => verifikasiSuratBaak(surat.id, true)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                      >
                        Verifikasi Berkas BAAK
                      </button>
                      <button
                        onClick={() => verifikasiSuratBaak(surat.id, false, 'Berkas belum lengkap')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                      >
                        Tolak
                      </button>
                    </>
                  )}

                  {/* Step 2: Pejabat Sign (Dekan / Kaprodi) */}
                  {surat.status === 'Diverifikasi BAAK' && (
                    <button
                      onClick={() => tandatanganiSuratPejabat(surat.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Bubuhkan E-Signature Pejabat</span>
                    </button>
                  )}

                  {/* Step 3: Print / View Official Letter */}
                  {surat.status === 'Selesai & Siap Unduh' && (
                    <button
                      onClick={() => setSelectedSuratPrint(surat)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Surat Resmi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleApplySubmit}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4"
          >
            <h3 className="font-extrabold text-slate-900 text-base">Permohonan Penerbitan Surat Akademik</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Surat yang Dimohon</label>
              <select
                value={jenisSuratInput}
                onChange={(e) => setJenisSuratInput(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Surat Keterangan Aktif Kuliah">Surat Keterangan Aktif Kuliah</option>
                <option value="Surat Pengantar Izin Riset & PKL">Surat Pengantar Izin Riset & PKL</option>
                <option value="Surat Rekomendasi Beasiswa">Surat Rekomendasi Beasiswa</option>
                <option value="Surat Permohonan Cuti Akademik">Surat Permohonan Cuti Akademik</option>
                <option value="Surat Bebas Tanggungan Perpustakaan">Surat Bebas Tanggungan Perpustakaan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan / Keperluan Surat</label>
              <textarea
                required
                rows={3}
                value={keperluanInput}
                onChange={(e) => setKeperluanInput(e.target.value)}
                placeholder="Contoh: Pengurusan tunjangan gaji orang tua (PNS) atau persyaratan beasiswa Bank Indonesia..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Kirim Permohonan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Official Printable Certificate Modal */}
      {selectedSuratPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* University Letterhead */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="font-serif font-black text-slate-900 text-lg uppercase tracking-wider">
                UNIVERSITAS PRIMA NUSANTARA
              </div>
              <div className="text-xs font-bold text-slate-700">
                BIRO ADMINISTRASI AKADEMIK & KEMAHASISWAAN (BAAK)
              </div>
              <div className="text-[10px] text-slate-500">
                Jl. Cendekia Kampus Terpadu No. 1 • Telp (021) 7891234 • Email: baak@prima.ac.id
              </div>
            </div>

            {/* Letter Title */}
            <div className="text-center space-y-1">
              <div className="font-extrabold text-sm underline decoration-slate-900 uppercase">
                {selectedSuratPrint.jenisSurat}
              </div>
              <div className="font-mono text-xs text-slate-600">
                Nomor: {selectedSuratPrint.nomorSuratResmi || '042/BAAK/UPN/II/2026'}
              </div>
            </div>

            {/* Body */}
            <div className="text-xs text-slate-800 space-y-3 leading-relaxed">
              <p>Pimpinan Biro Administrasi Akademik & Kemahasiswaan menerangkan bahwa mahasiswa tersebut di bawah ini:</p>
              <div className="pl-6 space-y-1 font-semibold">
                <div>Nama Lengkap : <span className="font-bold">{selectedSuratPrint.pemohonNama}</span></div>
                <div>NIM : <span className="font-mono">{selectedSuratPrint.pemohonNim}</span></div>
                <div>Program Studi : {selectedSuratPrint.prodi}</div>
                <div>Status : <span className="text-emerald-700">Aktif Terdaftar (Semester Genap 2025/2026)</span></div>
              </div>
              <p>
                Adalah benar-benar mahasiswa aktif pada Universitas Prima Nusantara. Surat keterangan ini diterbitkan
                untuk keperluan: <em>"{selectedSuratPrint.keperluan}"</em>.
              </p>
            </div>

            {/* Signatures & QR Code */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="p-2 border border-slate-200 rounded-lg inline-block bg-slate-50">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
                <div className="text-[9px] font-mono text-slate-500">
                  {selectedSuratPrint.qrVerificationCode || 'VERIF-UPN-2026-BSRE'}
                </div>
              </div>

              <div className="text-center space-y-1">
                <div>Ditetapkan di: Nusantara</div>
                <div>Pada tanggal: {selectedSuratPrint.tanggalPengajuan}</div>
                <div className="font-bold text-slate-900 pt-10">
                  {selectedSuratPrint.pejabatPenandatangan || 'Prof. Dr. Ir. Wahyu Triyono, M.Sc.'}
                </div>
                <div className="text-[10px] text-slate-500">Dekan Fakultas / Pejabat Berwenang</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Surat</span>
              </button>
              <button
                onClick={() => setSelectedSuratPrint(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
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
