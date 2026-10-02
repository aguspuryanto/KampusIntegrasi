import React, { useState, useRef, useEffect } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  Sparkles,
  Send,
  ShieldAlert,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Cpu,
  BrainCircuit,
  HelpCircle,
  Clock,
} from 'lucide-react';

export const AiAssistantModule: React.FC = () => {
  const {
    currentUser,
    isCbtActive,
    cbtSession,
    aiMessages,
    aiModel,
    setAiModel,
    sendAiMessage,
    clearAiChat,
    setActiveModule,
  } = useSiakad();

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || loading || isCbtActive) return;

    const p = inputPrompt;
    setInputPrompt('');
    setLoading(true);
    await sendAiMessage(p);
    setLoading(false);
  };

  const handleQuickPrompt = (text: string) => {
    if (isCbtActive) return;
    setInputPrompt(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Model Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span>Siakad AI Assistant</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Konsultasi akademik cerdas berbasis Google Gemini & DeepSeek R1 untuk civitas akademika
          </p>
        </div>

        {/* Model Engine Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setAiModel('gemini')}
            disabled={isCbtActive}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              aiModel === 'gemini'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Google Gemini 3.8</span>
          </button>
          <button
            onClick={() => setAiModel('deepseek')}
            disabled={isCbtActive}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              aiModel === 'deepseek'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-blue-600" />
            <span>DeepSeek R1 Academic</span>
          </button>
        </div>
      </div>

      {/* CBT RESTRICTION BANNER IF ACTIVE */}
      {isCbtActive ? (
        <div className="p-8 rounded-2xl bg-red-50 border-2 border-red-300 text-center space-y-4 shadow-sm animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-red-600 animate-bounce" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-black text-red-900">
              AKSES SIAKAD AI DIBLOKIR SEMENTARA
            </h3>
            <p className="text-xs text-red-700 leading-relaxed">
              Anda saat ini sedang terdaftar dalam <strong>Sesi Ujian LMS / CBT Aktif</strong> ({cbtSession?.ujianId}).
              Sesuai pakta integritas akademik dan regulasi universitas anti-kecurangan, seluruh layanan asisten AI dinonaktifkan
              hingga ujian diselesaikan atau dikunci.
            </p>
            <div className="pt-2 text-xs font-semibold text-red-800">
              Perpindahan fokus/tab tercatat: {cbtSession?.fokusPindahCount || 0} kali.
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveModule('lms-cbt')}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Kembali ke Lembar Ujian CBT
            </button>
          </div>
        </div>
      ) : (
        /* CHAT INTERFACE */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Subheader */}
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-800">
                Mode Aktif: {aiModel === 'gemini' ? 'Google Gemini 3.8 Flash' : 'DeepSeek R1 Academic Specialist'}
              </span>
            </div>
            <button
              onClick={clearAiChat}
              className="text-xs text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
              title="Bersihkan Percakapan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gradient-to-tr from-indigo-700 to-sky-600 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 group relative ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  {msg.modelUsed && (
                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">
                      Engine: {msg.modelUsed}
                    </div>
                  )}

                  <div className="whitespace-pre-line prose prose-xs max-w-none">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        title="Salin teks"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-xl">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 to-sky-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                  <span>Siakad AI sedang memproses analisis akademik...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-6 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Saran Tanya:</span>
            {[
              'Berapa syarat SKS minimal untuk daftar sidang skripsi?',
              'Bagaimana aturan batas SKS berdasarkan IPS lalu?',
              'Kapan batas jatuh tempo SPP/UKT semester ini?',
              'Cara membuat pengajuan Surat Aktif Kuliah di BAAK',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(chip)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 shrink-0 transition-colors text-[11px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-3 items-center">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Tanyakan perihal kurikulum, KRS, skripsi, atau tagihan universitas..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
