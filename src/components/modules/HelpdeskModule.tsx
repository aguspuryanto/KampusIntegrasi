import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  LifeBuoy,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  UserCheck,
  Filter,
  Send,
} from 'lucide-react';
import { TiketHelpdesk } from '../../types/siakad';

export const HelpdeskModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    tiketList,
    createTiket,
    updateTiketStatus,
    rateTiket,
  } = useSiakad();

  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ratingModalTiket, setRatingModalTiket] = useState<TiketHelpdesk | null>(null);

  // Form State
  const [subjekInput, setSubjekInput] = useState('');
  const [deskripsiInput, setDeskripsiInput] = useState('');
  const [kategoriInput, setKategoriInput] = useState<TiketHelpdesk['kategori']>('Akademik & KRS');
  const [prioritasInput, setPrioritasInput] = useState<TiketHelpdesk['prioritas']>('Sedang');

  // Rating State
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');

  const handleCreateTiket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjekInput.trim() || !deskripsiInput.trim()) return;
    createTiket(kategoriInput, subjekInput, deskripsiInput, prioritasInput);
    setSubjekInput('');
    setDeskripsiInput('');
    setShowCreateModal(false);
  };

  const handleSaveRating = () => {
    if (!ratingModalTiket) return;
    rateTiket(ratingModalTiket.id, ratingStars, ratingFeedback);
    setRatingModalTiket(null);
    setRatingFeedback('');
  };

  const filteredTikets = tiketList.filter((t) => {
    const matchKat = filterKategori === 'Semua' || t.kategori === filterKategori;
    const matchStat = filterStatus === 'Semua' || t.status === filterStatus;
    return matchKat && matchStat;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-indigo-600" />
            <span>Helpdesk & Pusat Layanan Terpadu</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pengajuan tiket keluhan, penugasan teknis, pemantauan target waktu SLA, dan survei kepuasan layanan
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tiket Layanan</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Tiket Masuk</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{tiketList.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Tiket Selesai Ditangani</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {tiketList.filter((t) => t.status === 'Selesai' || t.status === 'Ditutup').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Sedang Dalam Proses</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {tiketList.filter((t) => t.status === 'Dalam Penanganan' || t.status === 'Baru').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Rata-Rata CSAT Rating</div>
          <div className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <span>4.9</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Kategori:</span>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50 font-medium"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Akademik & KRS">Akademik & KRS</option>
              <option value="Sistem SIAKAD & IT">Sistem SIAKAD & IT</option>
              <option value="Keuangan & Pembayaran">Keuangan & Pembayaran</option>
              <option value="Fasilitas & Lab">Fasilitas & Lab</option>
              <option value="Perpustakaan">Perpustakaan</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50 font-medium"
            >
              <option value="Semua">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="Dalam Penanganan">Dalam Penanganan</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditutup">Ditutup</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium">{filteredTikets.length} Tiket Ditemukan</span>
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-4">
        {filteredTikets.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-700">{t.nomorTiket}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {t.kategori}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.prioritas === 'Darurat'
                      ? 'bg-rose-100 text-rose-800'
                      : t.prioritas === 'Tinggi'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  Prioritas: {t.prioritas}
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold self-start ${
                  t.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800'
                    : t.status === 'Dalam Penanganan'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                ● {t.status}
              </span>
            </div>

            {/* Subject & Description */}
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">{t.subjek}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.deskripsi}</p>
            </div>

            {/* Metadata Footer */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <span>Pengaju: <strong>{t.pengajuNama}</strong> ({t.pengajuRole})</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Target SLA: {t.targetSlaJam} Jam</span>
                </span>
                <span>Dibuat: {t.tanggalDibuat}</span>
                {t.petugasPenugasan && (
                  <span className="font-semibold text-slate-700">
                    Petugas: {t.petugasPenugasan}
                  </span>
                )}
              </div>

              {/* Action buttons based on status & role */}
              <div className="flex items-center gap-2 self-end">
                {t.status === 'Baru' && (
                  <button
                    onClick={() => updateTiketStatus(t.id, 'Dalam Penanganan', currentUser.name)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                  >
                    Tugaskan ke Saya
                  </button>
                )}

                {t.status === 'Dalam Penanganan' && (
                  <button
                    onClick={() => updateTiketStatus(t.id, 'Selesai')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Tandai Selesai
                  </button>
                )}

                {/* Rating button if completed */}
                {t.status === 'Selesai' && (
                  <>
                    {t.penilaianLayanan ? (
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>CSAT: {t.penilaianLayanan.rating}/5</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRatingModalTiket(t)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Beri Nilai Layanan</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Buat Tiket */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreateTiket}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4"
          >
            <h3 className="font-extrabold text-slate-900 text-base">Buat Tiket Bantuan / Layanan Baru</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Masalah</label>
              <select
                value={kategoriInput}
                onChange={(e) => setKategoriInput(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              >
                <option value="Akademik & KRS">Akademik & KRS</option>
                <option value="Sistem SIAKAD & IT">Sistem SIAKAD & IT</option>
                <option value="Keuangan & Pembayaran">Keuangan & Pembayaran</option>
                <option value="Fasilitas & Lab">Fasilitas & Lab</option>
                <option value="Perpustakaan">Perpustakaan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prioritas Urgensi</label>
              <select
                value={prioritasInput}
                onChange={(e) => setPrioritasInput(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              >
                <option value="Rendah">Rendah (Target SLA 72 Jam)</option>
                <option value="Sedang">Sedang (Target SLA 48 Jam)</option>
                <option value="Tinggi">Tinggi (Target SLA 24 Jam)</option>
                <option value="Darurat">Darurat (Target SLA 6 Jam)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subjek / Judul Tiket</label>
              <input
                type="text"
                required
                value={subjekInput}
                onChange={(e) => setSubjekInput(e.target.value)}
                placeholder="Contoh: Kesalahan nominal tagihan UKT atau jadwal bentrok"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lengkap Kendala</label>
              <textarea
                required
                rows={4}
                value={deskripsiInput}
                onChange={(e) => setDeskripsiInput(e.target.value)}
                placeholder="Jelaskan secara rinci kronologi masalah, kode mata kuliah, atau nomor referensi..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Kirim Tiket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Rating Layanan */}
      {ratingModalTiket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Penilaian Kepuasan Layanan (CSAT)</h3>
            <p className="text-xs text-slate-500">
              Bagaimana pengalaman Anda terhadap penanganan tiket #{ratingModalTiket.nomorTiket}?
            </p>

            {/* Star selector */}
            <div className="flex items-center justify-center gap-2 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="p-1 focus:outline-hidden hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ulasan Feedback</label>
              <textarea
                rows={3}
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                placeholder="Tuliskan ulasan mengenai kecepatan tanggap dan keramahan petugas..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRatingModalTiket(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveRating}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs"
              >
                Kirim Penilaian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
