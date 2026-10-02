import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  BookOpenCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Lock,
  Play,
  Check,
  Radio,
  FileCheck,
  Send,
  EyeOff,
  Monitor,
} from 'lucide-react';

export const LmsCbtModule: React.FC = () => {
  const {
    currentUser,
    materiLmsList,
    ujianCbt,
    cbtSession,
    isCbtActive,
    startCbtExam,
    recordCbtFocusViolation,
    finishCbtExam,
  } = useSiakad();

  const [activeTab, setActiveTab] = useState<'materi' | 'cbt'>('cbt');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<number | null>(null);

  const handleSelectAnswer = (qIndex: number, choiceIndex: number) => {
    if (!isCbtActive || cbtSession?.statusSesi === 'Terkunci') return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: choiceIndex }));
  };

  const handleSubmitExam = () => {
    // Calculate score
    let correctCount = 0;
    ujianCbt.soalList.forEach((soal, idx) => {
      if (userAnswers[idx] === soal.kunciJawaban) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / ujianCbt.soalList.length) * 100);
    setScoreResult(finalScore);
    setExamSubmitted(true);
    finishCbtExam();
  };

  const currentQ = ujianCbt.soalList[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-indigo-600" />
            <span>LMS & Ujian CBT Anti-Cheat</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Akses materi perkuliahan online, tugas, dan simulasi ujian CBT dengan proctoring perpindahan fokus
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cbt')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'cbt' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ujian CBT Online {isCbtActive && '● LIVE'}
          </button>
          <button
            onClick={() => setActiveTab('materi')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'materi' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Materi & Tugas Kuliah
          </button>
        </div>
      </div>

      {/* TAB 1: UJIAN CBT ONLINE */}
      {activeTab === 'cbt' && (
        <div className="space-y-6">
          {/* Proctoring Rules Alert */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Protokol Keamanan & Anti-Cheat Browser Lock
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Sesi terkunci pada 1 perangkat. Berpindah tab/jendela akan otomatis tercatat di log ujian proctoring.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Toleransi Pindah Jendela:</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-amber-400 border border-slate-700">
                Maksimal {ujianCbt.toleransiPindahFokus}x
              </span>
            </div>
          </div>

          {!cbtSession ? (
            /* Pre-exam Start Card */
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{ujianCbt.judul}</h3>
                <p className="text-xs text-slate-500 mt-1">{ujianCbt.mataKuliah} • Dosen: {ujianCbt.dosen}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Durasi Pengerjaan:</span>
                  <span className="font-bold text-slate-900">{ujianCbt.durasiMenit} Menit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah Soal:</span>
                  <span className="font-bold text-slate-900">{ujianCbt.totalSoal} Butir Soal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aturan Proctoring:</span>
                  <span className="font-bold text-rose-600">Akses AI & Pindah Tab DILARANG</span>
                </div>
              </div>

              <button
                onClick={startCbtExam}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Sesi Ujian CBT Sekarang</span>
              </button>
            </div>
          ) : (
            /* Active / Completed CBT Exam Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question & Choices (2 Cols) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Active Exam Status Header */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800">
                      Soal No. {currentQuestionIndex + 1} dari {ujianCbt.totalSoal}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Simulated Focus Switch Button for Manual Verification */}
                    <button
                      onClick={recordCbtFocusViolation}
                      disabled={cbtSession.statusSesi !== 'Aktif'}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold hover:bg-amber-100 transition-colors flex items-center gap-1"
                      title="Simulasi deteksi peserta beralih jendela/tab"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Uji Tab-Switch</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Sisa: 48 Menit</span>
                    </div>
                  </div>
                </div>

                {/* Question Body */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
                  {/* Warning if Locked */}
                  {cbtSession.statusSesi === 'Terkunci' ? (
                    <div className="p-6 rounded-xl bg-red-50 border-2 border-red-300 text-center space-y-3">
                      <ShieldAlert className="w-10 h-10 text-red-600 mx-auto" />
                      <h4 className="text-sm font-extrabold text-red-900">
                        UJIAN CBT TERKUNCI OTOMATIS
                      </h4>
                      <p className="text-xs text-red-700 leading-relaxed">
                        Anda telah melakukan perpindahan tab / jendela sebanyak{' '}
                        <strong>{cbtSession.fokusPindahCount} kali</strong>, melampaui batas toleransi ujian.
                        Lembar jawaban Anda telah dibekukan dan dilaporkan ke Dosen Pengampu & BAAK.
                      </p>
                      <button
                        onClick={handleSubmitExam}
                        className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        Kirimkan Jawaban Apa Adanya
                      </button>
                    </div>
                  ) : examSubmitted ? (
                    <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h4 className="text-base font-extrabold text-emerald-900">
                        Ujian Telah Berhasil Dikumpulkan!
                      </h4>
                      <div className="text-2xl font-black text-emerald-700">
                        Nilai Hasil CBT: {scoreResult} / 100
                      </div>
                      <p className="text-xs text-emerald-800">
                        Hasil jawaban Anda telah dienkripsi dan disimpan ke basis data akademik.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                        {currentQ.pertanyaan}
                      </div>

                      {/* Options */}
                      <div className="space-y-2.5">
                        {currentQ.pilihan.map((choice, cIdx) => {
                          const isSelected = userAnswers[currentQuestionIndex] === cIdx;
                          return (
                            <button
                              key={cIdx}
                              onClick={() => handleSelectAnswer(currentQuestionIndex, cIdx)}
                              className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition-all ${
                                isSelected
                                  ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {String.fromCharCode(65 + cIdx)}
                              </div>
                              <span className="flex-1">{choice}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation between questions */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                        >
                          Sebelumnya
                        </button>

                        {currentQuestionIndex < ujianCbt.soalList.length - 1 ? (
                          <button
                            onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                          >
                            Selanjutnya
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitExam}
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm"
                          >
                            Selesai & Kumpulkan Ujian
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar: Proctoring Logs & Question Grid */}
              <div className="space-y-4">
                {/* Question Grid */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nomor Soal</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {ujianCbt.soalList.map((_, idx) => {
                      const answered = userAnswers[idx] !== undefined;
                      const active = currentQuestionIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`h-9 rounded-xl text-xs font-bold transition-all ${
                            active
                              ? 'ring-2 ring-indigo-600 font-black'
                              : ''
                          } ${
                            answered
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time Focus Violation Log (Proctoring) */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Log Pengawasan Proctoring
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cbtSession.fokusPindahCount > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {cbtSession.fokusPindahCount} Pelanggaran
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div>Browser: {cbtSession.browserFingerprint}</div>
                    <div>Waktu Mulai: {cbtSession.waktuMulai}</div>
                    <div>Status Sesi: {cbtSession.statusSesi}</div>
                  </div>

                  {cbtSession.logPelanggaran.length > 0 ? (
                    <div className="max-h-36 overflow-y-auto space-y-1 text-[10px] text-red-700 font-mono">
                      {cbtSession.logPelanggaran.map((log, i) => (
                        <div key={i} className="p-1.5 rounded bg-red-50/70 border border-red-100">
                          {log}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Fokus jendela stabil. Tidak ada kecurigaan.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MATERI & TUGAS */}
      {activeTab === 'materi' && (
        <div className="space-y-4">
          {materiLmsList.map((materi) => (
            <div key={materi.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Pertemuan ke-{materi.pertemuan}
                </span>
                <span className="text-xs font-semibold text-slate-500">{materi.mataKuliahNama}</span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{materi.judul}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{materi.deskripsi}</p>
              </div>

              {materi.fileLampiran && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>{materi.fileLampiran}</span>
                  </div>
                  <button
                    onClick={() => alert(`Mengunduh berkas materi perkuliahan: ${materi.fileLampiran}`)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    Unduh PDF
                  </button>
                </div>
              )}

              {/* Assignment Box if present */}
              {materi.tugas && (
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{materi.tugas.judulTugas}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        materi.tugas.statusPengumpulan === 'Terkumpul'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {materi.tugas.statusPengumpulan}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Deadline: <strong>{materi.tugas.deadline}</strong></span>
                    {materi.tugas.nilai && (
                      <span className="font-bold text-emerald-700">Nilai: {materi.tugas.nilai} / 100</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
