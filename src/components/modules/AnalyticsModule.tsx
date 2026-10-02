import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Award,
  GraduationCap,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Building,
  Users,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  PieChart,
  HardDrive,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { AnalyticsFilter, CustomReportConfig } from '../../types/siakad';

export const AnalyticsModule: React.FC = () => {
  const {
    currentUser,
    getAcademicAnalytics,
    getFinancialAnalytics,
    getOperationalAnalytics,
    mahasiswaList,
    dosenList,
    tagihanList,
    transaksiList,
    tiketList,
    peminjamanLabList,
    suratList,
  } = useSiakad();

  const [activeTab, setActiveTab] = useState<'academic' | 'financial' | 'operational' | 'custom'>('academic');
  const [filterProdi, setFilterProdi] = useState<string>('Semua');
  const [filterSemester, setFilterSemester] = useState<string>('2025/2026 Genap');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'semester' | 'quarter' | 'year'>('semester');

  // Custom Report Builder State
  const [customReport, setCustomReport] = useState<CustomReportConfig>({
    reportTitle: 'Laporan Komprehensif Kinerja Akademik, Keuangan & Efisiensi Operasional',
    includeAcademic: true,
    includeFinancial: true,
    includeOperational: true,
    includeDetailTables: true,
    notes: 'Disusun untuk Rapat Koordinasi Pimpinan Universitas & Evaluasi Akreditasi Unggul Semester Genap 2025/2026.',
  });

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Compute analytics data based on active filters
  const filterParams: AnalyticsFilter = {
    prodi: filterProdi,
    semester: filterSemester,
    period: filterPeriod,
  };

  const academicData = getAcademicAnalytics(filterParams);
  const financialData = getFinancialAnalytics(filterParams);
  const operationalData = getOperationalAnalytics(filterParams);

  const handleExportCSV = () => {
    const csvContent = [
      ['KATEGORI', 'INDIKATOR', 'NILAI', 'SATUAN'],
      ['Akademik', 'Rata-Rata IPK', academicData.avgIpk, 'Skala 4.00'],
      ['Akademik', 'IPK Tertinggi', academicData.highestIpk, 'Skala 4.00'],
      ['Akademik', 'Kelulusan Tepat Waktu', `${academicData.graduationOnTimeRate}%`, 'Persen'],
      ['Keuangan', 'Total Tagihan Diterbitkan', financialData.totalBilled, 'IDR'],
      ['Keuangan', 'Total Pembayaran Diterima', financialData.totalCollected, 'IDR'],
      ['Keuangan', 'Sisa Piutang Tertunggak', financialData.totalOutstanding, 'IDR'],
      ['Keuangan', 'Tingkat Realisasi Pelunasan', `${financialData.collectionRate}%`, 'Persen'],
      ['Operasional', 'Kepatuhan SLA Helpdesk', `${operationalData.helpdeskResolvedRate}%`, 'Persen'],
      ['Operasional', 'Skor Kepuasan Layanan (CSAT)', operationalData.helpdeskCsatScore, 'Skala 5.0'],
      ['Operasional', 'Utilisasi Alat e-Lab', `${operationalData.eLabUtilizationRate}%`, 'Persen'],
      ['Operasional', 'Rata-Rata Penerbitan Surat', `${operationalData.suratAvgTurnaroundHours} Jam`, 'Durasi'],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SIAKAD_PRIMA_ANALYTICS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Berkas CSV Laporan Eksekutif berhasil diunduh.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      filter: filterParams,
      academic: academicData,
      financial: financialData,
      operational: operationalData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SIAKAD_PRIMA_DATASET_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Dataset JSON Laporan Analitik berhasil diekspor.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Global Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Laporan & Analitika Eksekutif Terpadu</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dasbor analitik lintas modul: performa akademik, kesehatan keuangan & piutang, serta efisiensi operasional
          </p>
        </div>

        {/* Global Export & Print Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF Resmi</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Unduh CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter Parameters Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Program Studi:</span>
            <select
              value={filterProdi}
              onChange={(e) => setFilterProdi(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800"
            >
              <option value="Semua">Semua Program Studi</option>
              <option value="Teknik Informatika">Teknik Informatika (S1)</option>
              <option value="Sistem Informasi">Sistem Informasi (S1)</option>
              <option value="Sains Data">Sains Data (S1)</option>
              <option value="Teknik Komputer">Teknik Komputer (S1)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>Semester:</span>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800"
            >
              <option value="2025/2026 Genap">2025/2026 Genap (Aktif)</option>
              <option value="2025/2026 Ganjil">2025/2026 Ganjil</option>
              <option value="2024/2025 Genap">2024/2025 Genap</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>Rentang:</span>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800"
            >
              <option value="semester">Satu Semester Penuh</option>
              <option value="quarter">Kuartal Berjalan</option>
              <option value="year">Tahun Akademik Penuh</option>
              <option value="all">Seluruh Riwayat (All Time)</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Data tersinkronisasi: {new Date().toLocaleDateString('id-ID')}
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'academic'
              ? 'bg-white text-indigo-700 shadow-xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>Kinerja Akademik (Academic)</span>
        </button>

        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'financial'
              ? 'bg-white text-emerald-700 shadow-xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span>Status Keuangan & Piutang (Financial)</span>
        </button>

        <button
          onClick={() => setActiveTab('operational')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'operational'
              ? 'bg-white text-purple-700 shadow-xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-600" />
          <span>Efisiensi Operasional & SLA (Operational)</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'custom'
              ? 'bg-white text-blue-700 shadow-xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Generator Laporan Kustom (Report Builder)</span>
        </button>
      </div>

      {/* TAB 1: ACADEMIC PERFORMANCE */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Rata-Rata IPK Kampus</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">{academicData.avgIpk.toFixed(2)}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span>▲ +0.08 dari semester ganjil lalu</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Kelulusan Tepat Waktu</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {academicData.graduationOnTimeRate}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Target akreditasi unggul: ≥ 90%</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Rentang IPK Mahasiswa</span>
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {academicData.lowestIpk.toFixed(2)} - {academicData.highestIpk.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Dari {academicData.activeStudentsCount} Mahasiswa Terdaftar</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Kepatuhan Beban Dosen (BKD)</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-purple-700">100%</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">● Seluruh Dosen Memenuhi 12 SKS</div>
            </div>
          </div>

          {/* Charts Row: IPK Distribution & Grade Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IPK Distribution Bracket */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Distribusi Kategori IPK Mahasiswa</h3>
                  <p className="text-xs text-slate-500">Persentase predikat kelulusan berdasarkan skala 4.00</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {academicData.ipkDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">{item.range}</span>
                      <span className="text-indigo-700">{item.count} Mahasiswa ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Grade Distribution */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Sebaran Huruf Mutu Nilai Kuliah</h3>
                  <p className="text-xs text-slate-500">Kalkulasi dari seluruh entri nilai UTS, UAS, dan tugas semester ini</p>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2 text-center">
                {academicData.gradeDistribution.map((g) => (
                  <div key={g.grade} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-black text-sm text-indigo-700">{g.grade}</div>
                    <div className="text-xs font-bold text-slate-900">{g.count} MK</div>
                    <div className="text-[10px] text-slate-500">{g.percentage}%</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-900 leading-relaxed">
                Tingkat kelulusan mata kuliah (Passing Rate) mencapai <strong>97.5%</strong>. Angka pengulangan (D/E) di bawah batas toleransi maksimal 5%.
              </div>
            </div>
          </div>

          {/* Program Studi Benchmark Performance Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Tabel Komparasi Performa Program Studi</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Program Studi</th>
                    <th className="p-3.5">Mahasiswa Aktif</th>
                    <th className="p-3.5">Rata-Rata IPK</th>
                    <th className="p-3.5">Tingkat Kelulusan MK</th>
                    <th className="p-3.5">Status Akreditasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {academicData.prodiPerformance.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{p.prodi}</td>
                      <td className="p-3.5">{p.studentCount} Orang</td>
                      <td className="p-3.5 font-bold text-indigo-700">{p.avgIpk.toFixed(2)}</td>
                      <td className="p-3.5 font-semibold text-emerald-700">{p.passingRate}%</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Unggul (A)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL STATUS & ARREARS */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tagihan (Billed)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                Rp {financialData.totalBilled.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-1">Target penerimaan semester genap</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pembayaran Masuk (Collected)</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                Rp {financialData.totalCollected.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">
                ● Realisasi Kas Masuk: {financialData.collectionRate}%
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sisa Piutang (Outstanding)</div>
              <div className="text-2xl font-black text-rose-600 mt-1">
                Rp {financialData.totalOutstanding.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-1">Tertunggak jatuh tempo</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Efisiensi Penagihan</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">92.4%</div>
              <div className="text-xs text-slate-500 mt-1">Rasio tagihan terbayar vs overdue</div>
            </div>
          </div>

          {/* Aging Arrears & Payment Channels Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aging Report */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Analisis Umur Piutang Mahasiswa (Aging Report)</h3>
              <div className="space-y-3">
                {financialData.agingArrears.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">{item.range}</span>
                      <span className="text-rose-600">Rp {item.amount.toLocaleString('id-ID')} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-500">{item.studentCount} Mahasiswa tertunggak</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Channel Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Distribusi Kanal & Gateway Pembayaran</h3>
              <div className="space-y-3">
                {financialData.channelBreakdown.map((ch, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">{ch.channel}</span>
                      <span className="text-indigo-700">Rp {ch.total.toLocaleString('id-ID')} ({ch.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${ch.percentage}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-500">{ch.count} Transaksi sukses</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prodi Financial Breakdown Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Rekapitulasi Keuangan per Program Studi</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Program Studi</th>
                    <th className="p-3.5">Total Tagihan</th>
                    <th className="p-3.5">Pembayaran Masuk</th>
                    <th className="p-3.5">Sisa Piutang</th>
                    <th className="p-3.5">Realisasi Lunas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financialData.prodiFinancials.map((pf, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{pf.prodi}</td>
                      <td className="p-3.5">Rp {pf.billed.toLocaleString('id-ID')}</td>
                      <td className="p-3.5 font-semibold text-emerald-700">Rp {pf.collected.toLocaleString('id-ID')}</td>
                      <td className="p-3.5 font-bold text-rose-600">Rp {pf.arrears.toLocaleString('id-ID')}</td>
                      <td className="p-3.5 font-extrabold text-indigo-700">{pf.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPERATIONAL EFFICIENCY & SLA */}
      {activeTab === 'operational' && (
        <div className="space-y-6">
          {/* Operational KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kepatuhan SLA Layanan</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {operationalData.helpdeskResolvedRate}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Rata-rata selesai: 18.6 Jam (SLA: 24-48 Jam)</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Indeks Kepuasan (CSAT)</div>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {operationalData.helpdeskCsatScore} / 5.0
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">● Sangat Memuaskan</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Penerbitan Surat BAAK</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">
                {operationalData.suratAvgTurnaroundHours} Jam
              </div>
              <div className="text-xs text-slate-500 mt-1">Dari pengajuan hingga e-sign selesai</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keandalan Neo Feeder</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {operationalData.neoFeederSuccessRate}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Sinkronisasi PDDikti tanpa konflik skema</div>
            </div>
          </div>

          {/* Service SLA Benchmark Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Matriks Kepatuhan Target Waktu Layanan (Service Level Agreement - SLA)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Nama Layanan Kampus</th>
                    <th className="p-3.5">Target SLA Resmi</th>
                    <th className="p-3.5">Realisasi Rata-Rata</th>
                    <th className="p-3.5">Tingkat Kepatuhan SLA</th>
                    <th className="p-3.5 text-right">Status Evaluasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {operationalData.serviceMetrics.map((sm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{sm.service}</td>
                      <td className="p-3.5 text-slate-600">{sm.slaTarget}</td>
                      <td className="p-3.5 font-mono font-bold text-indigo-700">{sm.actualAvg}</td>
                      <td className="p-3.5 font-bold text-emerald-700">{sm.complianceRate}%</td>
                      <td className="p-3.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Sesuai Standar
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOM REPORT BUILDER */}
      {activeTab === 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder Form (1 Col) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Konfigurasi Laporan Khusus</h3>
            <p className="text-xs text-slate-500">
              Pilih komponen dan format dokumen yang ingin dimasukkan ke dalam laporan resmi
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Laporan</label>
              <input
                type="text"
                value={customReport.reportTitle}
                onChange={(e) => setCustomReport({ ...customReport, reportTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Seksi yang Disertakan:</label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customReport.includeAcademic}
                  onChange={(e) => setCustomReport({ ...customReport, includeAcademic: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span className="text-xs font-bold text-slate-800">1. Analitika Kinerja Akademik & IPK</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customReport.includeFinancial}
                  onChange={(e) => setCustomReport({ ...customReport, includeFinancial: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span className="text-xs font-bold text-slate-800">2. Laporan Realisasi Keuangan & Piutang</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customReport.includeOperational}
                  onChange={(e) => setCustomReport({ ...customReport, includeOperational: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span className="text-xs font-bold text-slate-800">3. Matriks Efisiensi Operasional & SLA</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customReport.includeDetailTables}
                  onChange={(e) => setCustomReport({ ...customReport, includeDetailTables: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span className="text-xs font-bold text-slate-800">4. Lampiran Tabel Rinci per Program Studi</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Rekomendasi Rektorat</label>
              <textarea
                rows={3}
                value={customReport.notes}
                onChange={(e) => setCustomReport({ ...customReport, notes: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowPrintModal(true)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Buka Lembar Cetak Laporan Resmi</span>
              </button>
            </div>
          </div>

          {/* Live Document Preview (2 Cols) */}
          <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="font-serif font-black text-slate-900 text-base uppercase tracking-wider">
                UNIVERSITAS PRIMA NUSANTARA
              </div>
              <div className="text-xs font-bold text-slate-700">
                PUSAT PENJAMINAN MUTU & LAPORAN ANALITIKA EKSEKUTIF
              </div>
              <div className="text-[10px] text-slate-500">
                Periode: {filterSemester} • Program Studi: {filterProdi}
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-extrabold text-sm uppercase underline decoration-slate-900">
                {customReport.reportTitle}
              </h3>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Dokumen ID: REP-UPN-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}
              </div>
            </div>

            {/* Academic Section */}
            {customReport.includeAcademic && (
              <div className="space-y-2 border-t border-slate-200 pt-3 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>I. Kinerja Akademik Mahasiswa</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-slate-700">
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Rata-Rata IPK: <strong>{academicData.avgIpk.toFixed(2)}</strong></div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Kelulusan Tepat Waktu: <strong>{academicData.graduationOnTimeRate}%</strong></div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Mahasiswa Terdaftar: <strong>{academicData.activeStudentsCount} Org</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Section */}
            {customReport.includeFinancial && (
              <div className="space-y-2 border-t border-slate-200 pt-3 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>II. Realisasi Pendapatan & Piutang</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-slate-700">
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Total Tagihan: <strong>Rp {financialData.totalBilled.toLocaleString('id-ID')}</strong></div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Kas Masuk: <strong className="text-emerald-700">Rp {financialData.totalCollected.toLocaleString('id-ID')}</strong></div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Sisa Piutang: <strong className="text-rose-700">Rp {financialData.totalOutstanding.toLocaleString('id-ID')}</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* Operational Section */}
            {customReport.includeOperational && (
              <div className="space-y-2 border-t border-slate-200 pt-3 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span>III. Efisiensi Operasional & SLA Kampus</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-slate-700">
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Kepatuhan SLA: <strong>{operationalData.helpdeskResolvedRate}%</strong></div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Kepuasan CSAT: <strong>{operationalData.helpdeskCsatScore}/5.0</strong></div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border">
                    <div>Keandalan Neo Feeder: <strong>{operationalData.neoFeederSuccessRate}%</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="border-t border-slate-200 pt-3 text-xs text-slate-600">
              <span className="font-bold text-slate-900">Catatan Pimpinan:</span>
              <p className="mt-1 italic">{customReport.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Official Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header Universitas */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="font-serif font-black text-slate-900 text-lg uppercase tracking-wider">
                UNIVERSITAS PRIMA NUSANTARA
              </div>
              <div className="font-bold text-xs text-slate-800">
                PUSAT DATA & PENJAMINAN MUTU AKADEMIK TERPADU
              </div>
              <div className="text-[10px] text-slate-500">
                Kampus Terpadu: Jl. Cendekia No. 1 • Telp (021) 7891234 • Akreditasi Institusi: Unggul
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base underline uppercase text-slate-900">
                {customReport.reportTitle}
              </h3>
              <div className="text-xs font-mono text-slate-500">
                Periode: {filterSemester} • Program Studi: {filterProdi}
              </div>
            </div>

            {/* Report Highlights Table */}
            <div className="space-y-4 text-xs">
              <div className="font-bold text-slate-900">1. Ringkasan Eksekutif Indikator Kinerja Utama (IKU)</div>
              <table className="w-full text-left border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Indikator</th>
                    <th className="p-2 border-r border-slate-300">Target BAN-PT</th>
                    <th className="p-2 border-r border-slate-300">Capaian Riil</th>
                    <th className="p-2">Evaluasi Mutu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border-r border-slate-200">Rata-Rata IPK Kelulusan</td>
                    <td className="p-2 border-r border-slate-200">≥ 3.25</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-indigo-700">{academicData.avgIpk.toFixed(2)}</td>
                    <td className="p-2 text-emerald-700 font-bold">Memenuhi Standar Unggul</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-200">Kelulusan Tepat Waktu (KTW)</td>
                    <td className="p-2 border-r border-slate-200">≥ 85%</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-indigo-700">{academicData.graduationOnTimeRate}%</td>
                    <td className="p-2 text-emerald-700 font-bold">Sangat Baik</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-200">Kolektibilitas Tagihan UKT</td>
                    <td className="p-2 border-r border-slate-200">≥ 90%</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-indigo-700">{financialData.collectionRate}%</td>
                    <td className="p-2 text-emerald-700 font-bold">Terkontrol</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-200">Kepuasan Layanan Kemahasiswaan</td>
                    <td className="p-2 border-r border-slate-200">≥ 4.0 / 5.0</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-indigo-700">{operationalData.helpdeskCsatScore} / 5.0</td>
                    <td className="p-2 text-emerald-700 font-bold">Sangat Memuaskan</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-2 text-slate-700 leading-relaxed">
                <span className="font-bold">Catatan Pimpinan Rektorat:</span>
                <p className="mt-1 italic">{customReport.notes}</p>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="pt-6 border-t-2 border-slate-900 text-xs">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="space-y-12">
                  <div className="font-semibold text-slate-700">Kepala Pusat Penjaminan Mutu,</div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold underline text-slate-900">Dr. Eng. Hendra Kurniawan, M.T.</div>
                    <div className="text-[10px] text-slate-500 font-mono">NIDN. 0012048201</div>
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="font-semibold text-slate-700">Wakil Rektor I Bidang Akademik,</div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold underline text-slate-900">Prof. Dr. Ir. Wahyu Triyono, M.Sc.</div>
                    <div className="text-[10px] text-slate-500 font-mono">NIP. 197503111999031001</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
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
