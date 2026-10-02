import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  Wallet,
  CreditCard,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FileCheck,
  TrendingDown,
  Building2,
  Receipt,
  Search,
} from 'lucide-react';
import { TransaksiPembayaran } from '../../types/siakad';

export const KeuanganModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    tagihanList,
    transaksiList,
    bayarTagihan,
    validasiPembayaran,
  } = useSiakad();

  const [subTab, setSubTab] = useState<'tagihan' | 'validasi' | 'piutang'>('tagihan');
  const [selectedTagihanId, setSelectedTagihanId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Virtual Account' | 'QRIS' | 'Transfer Bank Manual'>('Virtual Account');
  const [selectedBank, setSelectedBank] = useState('Bank Mandiri (VA)');
  const [kwitansiTrx, setKwitansiTrx] = useState<TransaksiPembayaran | null>(null);

  // Compute metrics
  const totalBilled = tagihanList.reduce((acc, t) => acc + t.nominal, 0);
  const totalPaid = tagihanList.reduce((acc, t) => acc + t.terbayar, 0);
  const totalOutstanding = tagihanList.reduce((acc, t) => acc + t.sisa, 0);

  const pendingValidations = transaksiList.filter((t) => t.status === 'Menunggu Konfirmasi');

  const handlePay = (tagihanId: string) => {
    const tagihan = tagihanList.find((t) => t.id === tagihanId);
    if (!tagihan) return;
    bayarTagihan(tagihanId, tagihan.sisa, paymentMethod, selectedBank);
    setSelectedTagihanId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" />
            <span>Keuangan & Administrasi Tagihan</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola tagihan UKT/SPP, verifikasi pembayaran manual, pantau piutang, dan penerbitan kwitansi resmi
          </p>
        </div>

        {/* Sub-tabs pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSubTab('tagihan')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'tagihan' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tagihan & Transaksi
          </button>
          <button
            onClick={() => setSubTab('validasi')}
            className={`px-3 py-1.5 rounded-lg transition-all relative ${
              subTab === 'validasi' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Validasi Pembayaran
            {pendingValidations.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-bold">
                {pendingValidations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setSubTab('piutang')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'piutang' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pantau Piutang Kampus
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tagihan Diterbitkan</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            Rp {totalBilled.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Periode Semester Genap 2025/2026</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pembayaran Diterima</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            Rp {totalPaid.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            ● Realisasi: {Math.round((totalPaid / (totalBilled || 1)) * 100)}% Lunas
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sisa Piutang Tertunggak</div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            Rp {totalOutstanding.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Jatuh tempo bertahap s.d. April 2026</span>
          </div>
        </div>
      </div>

      {/* TAB 1: TAGIHAN & TRANSAKSI */}
      {subTab === 'tagihan' && (
        <div className="space-y-6">
          {/* Tagihan List */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Daftar Tagihan Biaya Perkuliahan</h3>
                <p className="text-xs text-slate-500">Pilih tagihan untuk melakukan pelunasan via Virtual Account atau QRIS</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">NIM & Mahasiswa</th>
                    <th className="p-3">Jenis Tagihan</th>
                    <th className="p-3">Periode</th>
                    <th className="p-3">Total Nominal</th>
                    <th className="p-3">Terbayar</th>
                    <th className="p-3">Sisa Tagihan</th>
                    <th className="p-3">Jatuh Tempo</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tagihanList.map((tag) => (
                    <tr key={tag.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{tag.mahasiswaNama}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{tag.mahasiswaNim} • {tag.prodi}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{tag.jenisTagihan}</td>
                      <td className="p-3 text-slate-600">{tag.periode}</td>
                      <td className="p-3 font-bold">Rp {tag.nominal.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-emerald-600 font-semibold">Rp {tag.terbayar.toLocaleString('id-ID')}</td>
                      <td className="p-3 font-bold text-rose-600">Rp {tag.sisa.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-slate-600">{tag.jatuhTempo}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tag.status === 'Lunas'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tag.status === 'Menunggu Validasi'
                              ? 'bg-amber-100 text-amber-800'
                              : tag.status === 'Sebagian'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tag.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {tag.sisa > 0 ? (
                          <button
                            onClick={() => setSelectedTagihanId(tag.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                          >
                            Bayar Sekarang
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Lunas
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Modal if tagihan selected */}
          {selectedTagihanId && (
            <div className="p-6 rounded-2xl bg-indigo-50/50 border-2 border-indigo-200 shadow-md animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100 mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Proses Pembayaran Tagihan Kampus</span>
                </h4>
                <button
                  onClick={() => setSelectedTagihanId(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Method selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Metode Pembayaran</label>
                  <div className="space-y-2">
                    {(['Virtual Account', 'QRIS', 'Transfer Bank Manual'] as const).map((method) => (
                      <label
                        key={method}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          paymentMethod === method
                            ? 'bg-white border-indigo-600 text-indigo-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payMethod"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="text-indigo-600"
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bank / Gateway Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kanal Bank / Gateway</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  >
                    <option value="Bank Mandiri (VA)">Bank Mandiri (VA Auto-Settlement)</option>
                    <option value="Bank BRI (BRIVA)">Bank BRI (BRIVA Online)</option>
                    <option value="Bank BNI (VA)">Bank BNI (Virtual Account)</option>
                    <option value="Bank BCA (BCA Virtual Account)">BCA Virtual Account</option>
                    <option value="QRIS Nasional Prima">QRIS Nasional (Semua E-Wallet/Mobile Banking)</option>
                  </select>

                  <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800">Nomor Rekening / Kode Bayar:</div>
                    <div className="font-mono text-sm font-extrabold text-indigo-700">88012210511048</div>
                    <div className="text-[10px] text-slate-500">
                      Otomatis diverifikasi dalam 1 menit tanpa perlu konfirmasi manual jika memilih VA/QRIS.
                    </div>
                  </div>
                </div>

                {/* Confirm Action */}
                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => handlePay(selectedTagihanId)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pembayaran Selesai</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Riwayat Transaksi */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Riwayat Transaksi Pembayaran Mahasiswa</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">No. Referensi</th>
                    <th className="p-3">Mahasiswa</th>
                    <th className="p-3">Nominal</th>
                    <th className="p-3">Metode & Kanal</th>
                    <th className="p-3">Waktu Transaksi</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Kwitansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transaksiList.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">{trx.noReferensi}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{trx.mahasiswaNama}</div>
                        <div className="text-[10px] text-slate-500">{trx.mahasiswaNim}</div>
                      </td>
                      <td className="p-3 font-bold text-slate-900">Rp {trx.nominal.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-slate-600">{trx.metode} ({trx.bank})</td>
                      <td className="p-3 text-slate-500">{trx.tanggal}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            trx.status === 'Berhasil'
                              ? 'bg-emerald-100 text-emerald-800'
                              : trx.status === 'Menunggu Konfirmasi'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {trx.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {trx.status === 'Berhasil' && (
                          <button
                            onClick={() => setKwitansiTrx(trx)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3 text-indigo-600" />
                            <span>Kwitansi</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VALIDASI PEMBAYARAN (Review Manual Pembayaran) */}
      {subTab === 'validasi' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Antrean Pembayaran Perlu Divalidasi Bagian Keuangan
              </h3>
              <p className="text-xs text-slate-500">
                Verifikasi setoran tunai bank / transfer manual mahasiswa berdasarkan bukti slip
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {pendingValidations.length} Transaksi Menunggu
            </span>
          </div>

          {pendingValidations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="font-bold text-slate-800">Semua Pembayaran Telah Divalidasi</div>
              <p className="text-slate-500">Tidak ada bukti transfer manual yang sedang menunggu review saat ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingValidations.map((trx) => (
                <div
                  key={trx.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {trx.metode}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{trx.mahasiswaNama} ({trx.mahasiswaNim})</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Nominal: <strong className="text-emerald-700">Rp {trx.nominal.toLocaleString('id-ID')}</strong> • {trx.bank} • Ref: {trx.noReferensi}
                    </div>
                    {trx.catatan && (
                      <div className="text-xs text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                        Catatan Pengaju: "{trx.catatan}"
                      </div>
                    )}
                    {trx.buktiUrl && (
                      <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Lampiran Bukti Transfer Valid (Tersedia)</span>
                      </div>
                    )}
                  </div>

                  {/* Approve / Reject buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => validasiPembayaran(trx.id, 'Berhasil')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Pembayaran</span>
                    </button>
                    <button
                      onClick={() => validasiPembayaran(trx.id, 'Ditolak', 'Bukti transfer buram/tidak terbaca')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PANTAU PIUTANG */}
      {subTab === 'piutang' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Pemantauan Piutang Berdasarkan Program Studi</h3>
              <p className="text-xs text-slate-500">Distribusi realisasi pelunasan biaya kuliah mahasiswa</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { prodi: 'Teknik Informatika (S1)', totalMhs: 420, lunas: 385, tertunggakNominal: 5500000 },
              { prodi: 'Sistem Informasi (S1)', totalMhs: 350, lunas: 310, tertunggakNominal: 2500000 },
              { prodi: 'Sains Data (S1)', totalMhs: 180, lunas: 175, tertunggakNominal: 0 },
              { prodi: 'Teknik Komputer (S1)', totalMhs: 210, lunas: 190, tertunggakNominal: 6750000 },
            ].map((p, idx) => {
              const pct = Math.round((p.lunas / p.totalMhs) * 100);
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{p.prodi}</span>
                    <span className="text-slate-500 font-semibold">{pct}% Terbayar ({p.lunas} / {p.totalMhs} Mahasiswa)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Sisa Piutang Prodi:</span>
                    <span className="font-bold text-rose-600">Rp {p.tertunggakNominal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kwitansi Modal (Official Printable Receipt) */}
      {kwitansiTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-5">
            <div className="text-center pb-4 border-b border-slate-200 space-y-1">
              <div className="font-extrabold text-slate-900 text-base">UNIVERSITAS PRIMA NUSANTARA</div>
              <div className="text-[11px] text-slate-500">BIRO KEUANGAN & ANGGARAN REKTORAT</div>
              <div className="font-mono text-xs font-bold text-indigo-700 mt-2">
                KWITANSI PEMBAYARAN RESMI • #{kwitansiTrx.noReferensi}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Mahasiswa:</span>
                <span className="font-bold text-slate-900">{kwitansiTrx.mahasiswaNama}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">NIM:</span>
                <span className="font-mono font-bold text-slate-900">{kwitansiTrx.mahasiswaNim}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jumlah Pembayaran:</span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  Rp {kwitansiTrx.nominal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Metode & Bank:</span>
                <span className="font-medium text-slate-800">{kwitansiTrx.metode} ({kwitansiTrx.bank})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tanggal Transaksi:</span>
                <span className="text-slate-700">{kwitansiTrx.tanggal}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Petugas / Validasi:</span>
                <span className="text-slate-700 font-semibold">{kwitansiTrx.petugasValidasi || 'Kasir Pusat'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-[10px] text-slate-500 font-mono">
              [BARCODE E-SETTLEMENT: UPN-PAY-{kwitansiTrx.id.toUpperCase()}-VERIFIED]
              <div>Dokumen sah tanpa tanda tangan basah sesuai UU ITE No. 11/2008.</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Kwitansi</span>
              </button>
              <button
                onClick={() => setKwitansiTrx(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
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
