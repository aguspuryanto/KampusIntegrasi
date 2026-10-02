import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  Bell,
  X,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  CheckCircle2,
  Sliders,
  Sparkles,
  BookOpen,
  Wallet,
  Calendar,
  FileCheck,
  LifeBuoy,
  Clock,
  Moon,
} from 'lucide-react';
import { NotificationPreferences } from '../../types/siakad';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notificationPreferences,
    updateNotificationPreferences,
    simulateNotificationEvent,
  } = useSiakad();

  const [emailInput, setEmailInput] = useState(notificationPreferences.emailDestination);
  const [phoneInput, setPhoneInput] = useState(notificationPreferences.phoneDestination);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveContact = () => {
    updateNotificationPreferences({
      emailDestination: emailInput,
      phoneDestination: phoneInput,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Preferensi & Saluran Notifikasi</h3>
              <p className="text-xs text-indigo-200">
                Konfigurasikan jenis pembaruan, kanal pengiriman, dan frekuensi notifikasi SIAKAD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan preferensi berhasil disimpan!</span>
            </div>
          )}

          {/* SECTION 1: KATEGORI NOTIFIKASI */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-600" />
                <span>Kategori Pembaruan Sistem (Categories)</span>
              </h4>
              <span className="text-[11px] text-slate-500">Pilih topik yang ingin Anda terima</span>
            </div>

            <div className="space-y-2">
              {/* 1. Course Updates */}
              <div className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Pembaruan Perkuliahan (Course Updates)</div>
                    <div className="text-[11px] text-slate-500">
                      Jadwal pengganti, silabus baru, upload slide PDF dosen, dan tugas online
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.courseUpdates}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        courseUpdates: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {/* 2. Payment Reminders */}
              <div className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Pengingat Pembayaran & Tagihan (Payment Reminders)</div>
                    <div className="text-[11px] text-slate-500">
                      Pemberitahuan jatuh tempo UKT/SPP, status verifikasi bukti transfer, dan kwitansi
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.paymentReminders}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        paymentReminders: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {/* 3. Exam Schedules */}
              <div className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Jadwal Ujian CBT (Exam Schedules)</div>
                    <div className="text-[11px] text-slate-500">
                      Rilis jadwal UTS/UAS, pembukaan sesi ujian online, dan peringatan proctoring
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.examSchedules}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        examSchedules: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {/* 4. Application Status */}
              <div className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Perubahan Status Pengajuan (Application Status)</div>
                    <div className="text-[11px] text-slate-500">
                      Persetujuan KRS oleh DPA, verifikasi surat BAAK, ACC bimbingan skripsi, dan magang
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.applicationStatus}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        applicationStatus: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {/* 5. Helpdesk Ticket Updates */}
              <div className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Pembaruan Tiket Layanan (Helpdesk Updates)</div>
                    <div className="text-[11px] text-slate-500">
                      Penugasan teknisi kampus, respons staf, dan status penyelesaian tiket
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.helpdeskUpdates}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        helpdeskUpdates: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: SALURAN PENGIRIMAN (CHANNELS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Saluran Pengiriman Notifikasi (Delivery Channels)</span>
              </h4>
              <span className="text-[11px] text-slate-500">Multi-channel routing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* In-App */}
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  notificationPreferences.channels.inApp
                    ? 'bg-indigo-50/60 border-indigo-300 text-indigo-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold">In-App Toast Banner</div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.channels.inApp}
                    onChange={(e) =>
                      updateNotificationPreferences({
                        channels: { ...notificationPreferences.channels, inApp: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Notifikasi mengambang seketika saat portal aktif.</p>
              </label>

              {/* Email */}
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  notificationPreferences.channels.email
                    ? 'bg-blue-50/60 border-blue-300 text-blue-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Kampus</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.channels.email}
                    onChange={(e) =>
                      updateNotificationPreferences({
                        channels: { ...notificationPreferences.channels, email: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Kirim salinan ringkasan ke inbox email terdaftar.</p>
              </label>

              {/* WhatsApp */}
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  notificationPreferences.channels.whatsapp
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp / SMS Gateway</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.channels.whatsapp}
                    onChange={(e) =>
                      updateNotificationPreferences({
                        channels: { ...notificationPreferences.channels, whatsapp: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Pesan darurat langsung ke nomor seluler sivitas.</p>
              </label>
            </div>

            {/* Destination inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Penerima Notifikasi:</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-indigo-500"
                  placeholder="nama@mhs.prima.ac.id"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nomor WhatsApp Gateway:</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-indigo-500"
                  placeholder="+62 812-xxxx-xxxx"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveContact}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px]"
              >
                Perbarui Kontak Saluran
              </button>
            </div>
          </div>

          {/* SECTION 3: FREKUENSI & AUDIO CHIME */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Frekuensi & Pengaturan Tambahan</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery Frequency Radio */}
              <div className="space-y-2">
                <div className="font-bold text-slate-800">Frekuensi Pengiriman Rangkuman:</div>
                <div className="space-y-1.5">
                  {[
                    { val: 'instant', label: 'Instant Real-time', desc: 'Langsung dikirim segera saat kejadian terjadi' },
                    { val: 'daily', label: 'Daily Digest (Harian)', desc: 'Rangkuman sekali sehari pukul 08:00 WIB' },
                    { val: 'weekly', label: 'Weekly Summary (Mingguan)', desc: 'Rangkuman setiap hari Senin pagi' },
                  ].map((freq) => (
                    <label
                      key={freq.val}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer ${
                        notificationPreferences.frequency === freq.val
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        checked={notificationPreferences.frequency === freq.val}
                        onChange={() => updateNotificationPreferences({ frequency: freq.val as any })}
                        className="text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{freq.label}</div>
                        <div className="text-[10px] text-slate-500">{freq.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sound & Quiet Hours */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {notificationPreferences.enableSound ? (
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900">Bunyi Nada Notifikasi (Chime Sound)</div>
                      <div className="text-[10px] text-slate-500">Putar nada lonceng saat toast masuk</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.enableSound}
                    onChange={(e) => updateNotificationPreferences({ enableSound: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="font-bold text-slate-900">Mode Jangan Ganggu (Quiet Hours)</div>
                        <div className="text-[10px] text-slate-500">Senapkan notifikasi di jam istirahat</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationPreferences.quietHoursEnabled}
                      onChange={(e) =>
                        updateNotificationPreferences({ quietHoursEnabled: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                  </div>
                  {notificationPreferences.quietHoursEnabled && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600">
                      <span>Mulai:</span>
                      <input
                        type="time"
                        value={notificationPreferences.quietHoursStart}
                        onChange={(e) =>
                          updateNotificationPreferences({ quietHoursStart: e.target.value })
                        }
                        className="p-1 border rounded"
                      />
                      <span>s.d.</span>
                      <input
                        type="time"
                        value={notificationPreferences.quietHoursEnd}
                        onChange={(e) => updateNotificationPreferences({ quietHoursEnd: e.target.value })}
                        className="p-1 border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: SIMULASI PENGUJIAN NOTIFIKASI */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulasi Pengiriman Notifikasi Real-time</span>
              </span>
              <span className="text-[10px] text-slate-500">Klik untuk menguji toast dan filter preferensi</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => simulateNotificationEvent('course')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 text-[11px] font-semibold"
              >
                + Simulasi Course Update
              </button>
              <button
                type="button"
                onClick={() => simulateNotificationEvent('payment')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 text-[11px] font-semibold"
              >
                + Simulasi Payment Reminder
              </button>
              <button
                type="button"
                onClick={() => simulateNotificationEvent('exam')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-amber-300 text-[11px] font-semibold"
              >
                + Simulasi Exam Schedule
              </button>
              <button
                type="button"
                onClick={() => simulateNotificationEvent('application')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-purple-300 text-[11px] font-semibold"
              >
                + Simulasi Status Pengajuan
              </button>
              <button
                type="button"
                onClick={() => simulateNotificationEvent('helpdesk')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-300 text-[11px] font-semibold"
              >
                + Simulasi Helpdesk Update
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Perubahan preferensi diterapkan seketika pada sesi aktif Anda
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
          >
            Selesai & Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
