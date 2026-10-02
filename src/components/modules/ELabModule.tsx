import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  FlaskConical,
  ShoppingCart,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Search,
  Layers,
} from 'lucide-react';

export const ELabModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    labItems,
    selectedLabItemIds,
    toggleLabItemSelection,
    clearLabItemSelections,
    peminjamanLabList,
    submitPeminjamanLab,
    updateStatusPeminjamanLab,
  } = useSiakad();

  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat'>('katalog');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3; // To demonstrate robust multi-page pagination
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Borrow Modal Form
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [tujuanInput, setTujuanInput] = useState('');
  const [dosenInput, setDosenInput] = useState('Dr. Eng. Hendra Kurniawan, M.T.');
  const [tanggalPinjamInput, setTanggalPinjamInput] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalKembaliInput, setTanggalKembaliInput] = useState('2026-03-20');
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  // Filter items
  const filteredItems = labItems.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchFilter.toLowerCase());
    const matchCat = categoryFilter === 'Semua' || item.kategori === categoryFilter;
    return matchSearch && matchCat;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleBorrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tujuanInput.trim()) return;
    const ok = submitPeminjamanLab(tujuanInput, dosenInput, tanggalPinjamInput, tanggalKembaliInput);
    if (ok) {
      setShowBorrowModal(false);
      setTujuanInput('');
      setSuccessAlert('Pengajuan peminjaman laboratorium berhasil dibuat dan diteruskan ke Laboran!');
      setTimeout(() => setSuccessAlert(null), 5000);
      setActiveTab('riwayat');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-indigo-600" />
            <span>e-Lab & Peminjaman Alat Praktikum</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Katalog inventaris laboratorium dengan keranjang peminjaman persisten lintas halaman tabel
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'katalog' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katalog Alat & Bahan
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'riwayat' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat & Persetujuan ({peminjamanLabList.length})
          </button>
        </div>
      </div>

      {successAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successAlert}</span>
        </div>
      )}

      {activeTab === 'katalog' && (
        <div className="space-y-6">
          {/* Persistent Selection Notice Banner */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Keranjang Peminjaman: <span className="text-indigo-600">{selectedLabItemIds.size} item terpilih</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Pilihan Anda tetap tersimpan utuh saat berpindah halaman 1, 2, atau 3.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedLabItemIds.size > 0 && (
                <>
                  <button
                    onClick={clearLabItemSelections}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600"
                  >
                    Reset Pilihan
                  </button>
                  <button
                    onClick={() => setShowBorrowModal(true)}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Ajukan Peminjaman ({selectedLabItemIds.size})</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari alat atau kode..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Kategori:</span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Peralatan Elektronik">Peralatan Elektronik</option>
                <option value="Komputer & Jaringan">Komputer & Jaringan</option>
                <option value="Mikroskop & Optik">Mikroskop & Optik</option>
                <option value="Laboratorium Kimia">Laboratorium Kimia</option>
                <option value="Bahan Praktikum">Bahan Praktikum</option>
              </select>
            </div>
          </div>

          {/* Paginated Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 w-12 text-center">Pilih</th>
                    <th className="p-3.5">Kode & Foto</th>
                    <th className="p-3.5">Nama Alat / Bahan</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Stok Tersedia</th>
                    <th className="p-3.5">Kondisi</th>
                    <th className="p-3.5">Lokasi Ruang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentItems.map((item) => {
                    const isChecked = selectedLabItemIds.has(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors cursor-pointer ${
                          isChecked ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => toggleLabItemSelection(item.id)}
                      >
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            className="text-indigo-600 focus:outline-hidden"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLabItemSelection(item.id);
                            }}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 fill-indigo-600 text-white" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                        </td>
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={item.fotoUrl}
                            alt={item.nama}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <span className="font-mono font-bold text-slate-700">{item.kode}</span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">{item.nama}</td>
                        <td className="p-3.5 text-slate-600">{item.kategori}</td>
                        <td className="p-3.5 font-bold">
                          <span className="text-emerald-700">{item.stokTersedia}</span>
                          <span className="text-slate-400 font-normal"> / {item.stokTotal} unit</span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.kondisi === 'Baik'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.kondisi}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">{item.lokasiRuang}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Menampilkan halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> ({filteredItems.length} total barang)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      currentPage === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RIWAYAT PEMINJAMAN & PERSETUJUAN */}
      {activeTab === 'riwayat' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Daftar Peminjaman Alat Laboratorium</h3>
            <span className="text-xs text-slate-500 font-semibold">{peminjamanLabList.length} Pengajuan</span>
          </div>

          <div className="space-y-4">
            {peminjamanLabList.map((pinjam) => (
              <div
                key={pinjam.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700">{pinjam.nomorPeminjaman}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pinjam.status === 'Disetujui / Dipinjam'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pinjam.status === 'Selesai Dikembalikan'
                          ? 'bg-blue-100 text-blue-800'
                          : pinjam.status === 'Ditolak'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pinjam.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900">
                    Peminjam: {pinjam.mahasiswaNama} ({pinjam.mahasiswaNim}) • Dosen: {pinjam.dosenPendamping}
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong>Tujuan:</strong> {pinjam.tujuan}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>Mulai: {pinjam.tanggalPinjam}</span>
                    <span>•</span>
                    <span>Rencana Kembali: {pinjam.tanggalKembaliRencana}</span>
                    {pinjam.laboranPenanggungJawab && (
                      <>
                        <span>•</span>
                        <span className="text-slate-700 font-semibold">Laboran: {pinjam.laboranPenanggungJawab}</span>
                      </>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {pinjam.items.map((it, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700"
                      >
                        {it.namaItem} ({it.jumlah} unit)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions for Laboran / Admin */}
                <div className="flex items-center gap-2 self-end">
                  {pinjam.status === 'Menunggu Persetujuan' && (
                    <>
                      <button
                        onClick={() => updateStatusPeminjamanLab(pinjam.id, 'Disetujui / Dipinjam')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                      >
                        Setujui Pinjam
                      </button>
                      <button
                        onClick={() => updateStatusPeminjamanLab(pinjam.id, 'Ditolak')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                      >
                        Tolak
                      </button>
                    </>
                  )}

                  {pinjam.status === 'Disetujui / Dipinjam' && (
                    <button
                      onClick={() => updateStatusPeminjamanLab(pinjam.id, 'Selesai Dikembalikan')}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Konfirmasi Pengembalian</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Submit Peminjaman */}
      {showBorrowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleBorrowSubmit}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4"
          >
            <h3 className="font-extrabold text-slate-900 text-base">Konfirmasi Permohonan Peminjaman Alat</h3>
            <p className="text-xs text-slate-500">
              Anda akan meminjam sebanyak <strong>{selectedLabItemIds.size} jenis alat laboratorium</strong>.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto space-y-1">
              {Array.from(selectedLabItemIds).map((id) => {
                const item = labItems.find((l) => l.id === id);
                return (
                  <div key={id} className="text-xs text-slate-700 font-semibold flex items-center justify-between">
                    <span>{item?.nama}</span>
                    <span className="font-mono text-[10px] text-slate-400">{item?.kode}</span>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan Penggunaan Praktikum / Riset</label>
              <textarea
                required
                rows={2}
                value={tujuanInput}
                onChange={(e) => setTujuanInput(e.target.value)}
                placeholder="Contoh: Eksperimen mikrokontroler sensor IoT untuk skripsi..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dosen Pendamping Praktikum / Riset</label>
              <input
                type="text"
                required
                value={dosenInput}
                onChange={(e) => setDosenInput(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Mulai Pinjam</label>
                <input
                  type="date"
                  required
                  value={tanggalPinjamInput}
                  onChange={(e) => setTanggalPinjamInput(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Rencana Kembali</label>
                <input
                  type="date"
                  required
                  value={tanggalKembaliInput}
                  onChange={(e) => setTanggalKembaliInput(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBorrowModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Kirim Pengajuan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
