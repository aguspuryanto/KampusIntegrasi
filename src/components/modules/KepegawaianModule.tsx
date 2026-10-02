import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  Users,
  Award,
  BookOpen,
  Plus,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { Pegawai } from '../../types/siakad';

export const KepegawaianModule: React.FC = () => {
  const { pegawaiList, addPegawai, dosenList, mahasiswaList } = useSiakad();

  const [activeTab, setActiveTab] = useState<'direktori' | 'statistik'>('direktori');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBagian, setFilterBagian] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Pegawai Form
  const [namaInput, setNamaInput] = useState('');
  const [nipInput, setNipInput] = useState('');
  const [jenisInput, setJenisInput] = useState<'Dosen' | 'Tenaga Kependidikan'>('Dosen');
  const [jabatanInput, setJabatanInput] = useState('Lektor / Dosen Pengajar');
  const [bagianInput, setBagianInput] = useState('Fakultas Ilmu Komputer & Sains Data');
  const [pendidikanInput, setPendidikanInput] = useState<'D3' | 'S1' | 'S2' | 'S3'>('S3');
  const [statusInput, setStatusInput] = useState<'PNS' | 'Tetap Yayasan' | 'Kontrak'>('Tetap Yayasan');
  const [emailInput, setEmailInput] = useState('');

  const filteredPegawai = pegawaiList.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip.includes(searchTerm) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBag = filterBagian === 'Semua' || p.bagian === filterBagian;
    return matchSearch && matchBag;
  });

  const totalDosen = pegawaiList.filter((p) => p.jenisPegawai === 'Dosen').length;
  const totalTendik = pegawaiList.filter((p) => p.jenisPegawai === 'Tenaga Kependidikan').length;
  const totalDoktor = pegawaiList.filter((p) => p.pendidikanTerakhir === 'S3').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaInput.trim() || !nipInput.trim()) return;

    addPegawai({
      nama: namaInput,
      nip: nipInput,
      jenisPegawai: jenisInput,
      jabatan: jabatanInput,
      bagian: bagianInput,
      pendidikanTerakhir: pendidikanInput,
      statusKepegawaian: statusInput,
      tanggalMasuk: new Date().toISOString().split('T')[0],
      email: emailInput || `${nipInput}@prima.ac.id`,
      noHp: '08123456789',
    });

    setShowAddModal(false);
    setNamaInput('');
    setNipInput('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Kepegawaian & Manajemen SDM Kampus</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Administrasi data dosen & tenaga kependidikan, jabatan fungsional, dan pemenuhan rasio BKD
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('direktori')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'direktori' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Direktori Pegawai
            </button>
            <button
              onClick={() => setActiveTab('statistik')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'statistik' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Statistik & Rasio SDM
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pegawai</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Sivitas SDM</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{pegawaiList.length} Orang</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{totalDosen} Dosen • {totalTendik} Tendik</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Kualifikasi Doktor (S3)</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{totalDoktor} Orang</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">● {Math.round((totalDoktor / pegawaiList.length) * 100)}% Rasio Pengajar</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Kepatuhan BKD Dosen</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">100% Memenuhi</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Minimal 12 SKS Tri Dharma</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Rasio Dosen : Mahasiswa</div>
          <div className="text-2xl font-black text-slate-900 mt-1">1 : 22</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">● Standar Akreditasi Unggul</div>
        </div>
      </div>

      {/* TAB 1: DIREKTORI PEGAWAI */}
      {activeTab === 'direktori' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, NIP, atau jabatan..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Filter Bagian/Fakultas:</span>
              <select
                value={filterBagian}
                onChange={(e) => setFilterBagian(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
              >
                <option value="Semua">Semua Bagian</option>
                <option value="Fakultas Ilmu Komputer & Sains Data">Fakultas Ilmu Komputer</option>
                <option value="Biro Keuangan & Anggaran">Biro Keuangan</option>
                <option value="Biro Administrasi Akademik">BAAK</option>
                <option value="Biro Kepegawaian & Tata Laksana">Bagian SDM</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">NIP</th>
                    <th className="p-3.5">Nama Lengkap</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Jabatan / Fungsional</th>
                    <th className="p-3.5">Unit / Bagian</th>
                    <th className="p-3.5">Pendidikan</th>
                    <th className="p-3.5">Status Ikatan</th>
                    <th className="p-3.5">Kontak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPegawai.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-700">{p.nip}</td>
                      <td className="p-3.5 font-bold text-slate-900">{p.nama}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.jenisPegawai === 'Dosen'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {p.jenisPegawai}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-800 font-medium">{p.jabatan}</td>
                      <td className="p-3.5 text-slate-600">{p.bagian}</td>
                      <td className="p-3.5 font-bold text-slate-800">{p.pendidikanTerakhir}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {p.statusKepegawaian}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">{p.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATISTIK & RASIO SDM */}
      {activeTab === 'statistik' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Distribusi Jabatan Fungsional Dosen</h3>
            <div className="space-y-3">
              {[
                { rank: 'Guru Besar (Profesor)', count: 1, color: 'bg-purple-600', pct: 25 },
                { rank: 'Lektor Kepala', count: 1, color: 'bg-indigo-600', pct: 25 },
                { rank: 'Lektor', count: 1, color: 'bg-blue-600', pct: 25 },
                { rank: 'Asisten Ahli', count: 1, color: 'bg-sky-500', pct: 25 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>{item.rank}</span>
                    <span>{item.count} Orang ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Status Kepegawaian & Ikatan Kerja</h3>
            <div className="space-y-3">
              {[
                { status: 'Pegawai Negeri Sipil (PNS Dpk / LLDIKTI)', count: 4, color: 'bg-emerald-500', pct: 80 },
                { status: 'Dosen Tetap Yayasan', count: 1, color: 'bg-blue-500', pct: 20 },
                { status: 'Dosen Kontrak / Praktisi', count: 0, color: 'bg-slate-300', pct: 0 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>{item.status}</span>
                    <span>{item.count} Orang ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pegawai */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4"
          >
            <h3 className="font-extrabold text-slate-900 text-base">Tambah Data Pegawai Baru</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIP / NIDN</label>
                <input
                  type="text"
                  required
                  value={nipInput}
                  onChange={(e) => setNipInput(e.target.value)}
                  placeholder="Contoh: 198501012010121001"
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Pegawai</label>
                <select
                  value={jenisInput}
                  onChange={(e) => setJenisInput(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  <option value="Dosen">Dosen</option>
                  <option value="Tenaga Kependidikan">Tenaga Kependidikan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                required
                value={namaInput}
                onChange={(e) => setNamaInput(e.target.value)}
                placeholder="Contoh: Dr. Ir. Budi Santoso, M.Kom."
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan Fungsional</label>
                <input
                  type="text"
                  required
                  value={jabatanInput}
                  onChange={(e) => setJabatanInput(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                <select
                  value={pendidikanInput}
                  onChange={(e) => setPendidikanInput(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3 (Doktor)</option>
                  <option value="D3">D3</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit Kerja / Fakultas</label>
              <input
                type="text"
                required
                value={bagianInput}
                onChange={(e) => setBagianInput(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Simpan Pegawai
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
