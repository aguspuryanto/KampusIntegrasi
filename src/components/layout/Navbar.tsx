import React, { useState } from 'react';
import { useSiakad } from '../../context/SiakadContext';
import { UserRole, NotificationCategory } from '../../types/siakad';
import {
  Bell,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  UserCheck,
  ChevronDown,
  Settings,
  CheckCheck,
  Trash2,
  BookOpen,
  Wallet,
  Calendar,
  FileCheck,
  LifeBuoy,
  Send,
} from 'lucide-react';
import { NotificationPreferencesModal } from '../notifications/NotificationPreferencesModal';

interface NavbarProps {
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    isCbtActive,
    cbtSession,
    notifikasiList,
    markNotifAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    setActiveModule,
    simulateNotificationEvent,
  } = useSiakad();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [selectedNotifCategory, setSelectedNotifCategory] = useState<string>('all');

  const unreadCount = notifikasiList.filter((n) => !n.dibaca).length;

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'mahasiswa', label: 'Mahasiswa', desc: 'Ahmad Faiz (2210511048)' },
    { role: 'dosen', label: 'Dosen / DPA', desc: 'Dr. Eng. Hendra Kurniawan' },
    { role: 'keuangan', label: 'Bagian Keuangan', desc: 'Siti Rahmawati, S.E.' },
    { role: 'baak', label: 'BAAK / Akademik', desc: 'Bambang Triatmojo, M.M.' },
    { role: 'sdm', label: 'Bagian Kepegawaian', desc: 'Dra. Nurul Hidayati' },
    { role: 'admin', label: 'Super Admin', desc: 'Lead Systems Architect' },
  ];

  const filteredNotifikasi = notifikasiList.filter((n) => {
    if (selectedNotifCategory === 'all') return true;
    return n.kategori === selectedNotifCategory;
  });

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'course_updates':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-600" />;
      case 'payment_reminders':
        return <Wallet className="w-3.5 h-3.5 text-emerald-600" />;
      case 'exam_schedules':
        return <Calendar className="w-3.5 h-3.5 text-amber-600" />;
      case 'application_status':
        return <FileCheck className="w-3.5 h-3.5 text-purple-600" />;
      case 'helpdesk_updates':
        return <LifeBuoy className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* University Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">SIAKAD PRIMA</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  Enterprise v4.2
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block">
                Universitas Prima Nusantara • Portal Akademik Terpadu
              </p>
            </div>
          </div>

          {/* Center / Warning CBT Status */}
          {isCbtActive && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 animate-pulse text-red-700 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>SESI UJIAN CBT AKTIF • PROCTORING ON (Pelanggaran: {cbtSession?.fokusPindahCount || 0})</span>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick AI status badge */}
            <button
              onClick={() => setActiveModule('ai-assistant')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isCbtActive
                  ? 'bg-slate-100 text-slate-700 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
              title={isCbtActive ? 'Siakad AI terkunci selama sesi ujian CBT' : 'Buka Siakad AI'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Siakad AI: {isCbtActive ? 'Terkunci (CBT)' : 'Siap'}</span>
            </button>

            {/* Analytics Quick Shortcut */}
            <button
              onClick={() => setActiveModule('analytics')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition-all"
              title="Laporan & Analitik Terpadu"
            >
              <span>Laporan & Analitik</span>
            </button>

            {/* Module Settings Modal Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
              title="Konfigurasi Modul Kampus"
            >
              <Sliders className="w-5 h-5" />
            </button>

            {/* Notifications Dropdown & Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 rounded-lg text-slate-700 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
                title="Notifikasi Sistem"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">Pusat Notifikasi</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setShowNotifDropdown(false);
                          setShowPreferencesModal(true);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        title="Atur Preferensi Notifikasi"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                        title="Tandai Semua Sudah Dibaca"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={clearAllNotifications}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                        title="Hapus Semua Riwayat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 py-2 overflow-x-auto text-[11px] font-semibold border-b border-slate-100">
                    {[
                      { id: 'all', label: 'Semua' },
                      { id: 'course_updates', label: 'Kuliah' },
                      { id: 'payment_reminders', label: 'Keuangan' },
                      { id: 'exam_schedules', label: 'Ujian' },
                      { id: 'application_status', label: 'Status' },
                      { id: 'helpdesk_updates', label: 'Helpdesk' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedNotifCategory(tab.id)}
                        className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                          selectedNotifCategory === tab.id
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Notification Items Feed */}
                  <div className="max-h-80 overflow-y-auto space-y-2 py-2">
                    {filteredNotifikasi.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada notifikasi dalam kategori ini.
                      </div>
                    ) : (
                      filteredNotifikasi.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotifAsRead(notif.id);
                            if (notif.actionModule) {
                              setActiveModule(notif.actionModule);
                              setShowNotifDropdown(false);
                            }
                          }}
                          className={`p-3 rounded-xl text-xs cursor-pointer transition-all border ${
                            notif.dibaca
                              ? 'bg-slate-50/60 border-slate-100 text-slate-600 hover:bg-slate-50'
                              : 'bg-indigo-50/70 border-indigo-200 text-slate-900 font-medium hover:bg-indigo-50 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              {getCategoryIcon(notif.kategori)}
                              <span className="line-clamp-1">{notif.judul}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.waktu}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {notif.pesan}
                          </p>

                          {/* Channels delivered indicators */}
                          {notif.channelsDelivered && notif.channelsDelivered.length > 0 && (
                            <div className="mt-1.5 flex items-center gap-2 text-[9px] text-slate-400 font-mono">
                              <span>Saluran: {notif.channelsDelivered.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Bottom Quick Test Dispatcher */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Uji Simulasi:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => simulateNotificationEvent('payment')}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold border border-emerald-200 text-[10px]"
                      >
                        + Tagihan
                      </button>
                      <button
                        onClick={() => simulateNotificationEvent('exam')}
                        className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold border border-amber-200 text-[10px]"
                      >
                        + Ujian
                      </button>
                      <button
                        onClick={() => simulateNotificationEvent('course')}
                        className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold border border-indigo-200 text-[10px]"
                      >
                        + Kuliah
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-indigo-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="w-2.5 h-2.5" />
                    <span>{currentRole}</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-700" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    Ganti Hak Akses / Pengguna
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setCurrentRole(r.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentRole === r.role ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{r.label}</div>
                        <div className="text-[10px] text-slate-700">{r.desc}</div>
                      </div>
                      {currentRole === r.role && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />
    </>
  );
};
