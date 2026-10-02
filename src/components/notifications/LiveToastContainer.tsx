import React from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  Bell,
  X,
  ArrowRight,
  BookOpen,
  Wallet,
  Calendar,
  FileCheck,
  LifeBuoy,
  Sparkles,
} from 'lucide-react';
import { NotificationCategory } from '../../types/siakad';

export const LiveToastContainer: React.FC = () => {
  const { liveToasts, dismissToast, setActiveModule } = useSiakad();

  if (liveToasts.length === 0) return null;

  const getCategoryConfig = (cat: NotificationCategory) => {
    switch (cat) {
      case 'course_updates':
        return {
          icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
          badge: 'Perkuliahan',
          color: 'border-indigo-300 bg-indigo-50/95 text-indigo-900',
        };
      case 'payment_reminders':
        return {
          icon: <Wallet className="w-4 h-4 text-emerald-600" />,
          badge: 'Keuangan',
          color: 'border-emerald-300 bg-emerald-50/95 text-emerald-900',
        };
      case 'exam_schedules':
        return {
          icon: <Calendar className="w-4 h-4 text-amber-600" />,
          badge: 'Jadwal Ujian',
          color: 'border-amber-300 bg-amber-50/95 text-amber-900',
        };
      case 'application_status':
        return {
          icon: <FileCheck className="w-4 h-4 text-purple-600" />,
          badge: 'Status Berkas',
          color: 'border-purple-300 bg-purple-50/95 text-purple-900',
        };
      case 'helpdesk_updates':
        return {
          icon: <LifeBuoy className="w-4 h-4 text-blue-600" />,
          badge: 'Helpdesk',
          color: 'border-blue-300 bg-blue-50/95 text-blue-900',
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-slate-600" />,
          badge: 'SIAKAD',
          color: 'border-slate-300 bg-white/95 text-slate-900',
        };
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none no-print">
      {liveToasts.map((toast) => {
        const config = getCategoryConfig(toast.category);
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${config.color}`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-white/80 shadow-2xs shrink-0">
                  {config.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70">
                  {config.badge}
                </span>
                <span className="text-[10px] opacity-70">{toast.timestamp}</span>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs font-bold text-slate-900 leading-snug mb-1">
              {toast.title}
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed mb-2.5">
              {toast.message}
            </p>

            {toast.actionModule && (
              <button
                onClick={() => {
                  setActiveModule(toast.actionModule!);
                  dismissToast(toast.id);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-700 hover:text-indigo-900 underline underline-offset-2"
              >
                <span>Buka Modul Terkait</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
