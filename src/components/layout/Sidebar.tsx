import React from 'react';
import { useSiakad } from '../../context/SiakadContext';
import {
  LayoutDashboard,
  GraduationCap,
  Wallet,
  Sparkles,
  LifeBuoy,
  FlaskConical,
  Users,
  BookOpenCheck,
  Database,
  FileText,
  Briefcase,
  BookMarked,
  GitBranch,
  BarChart3,
  ShieldCheck,
  Power,
} from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const {
    activeModule,
    setActiveModule,
    modulesConfig,
    currentRole,
    selectedLabItemIds,
    transaksiList,
    tiketList,
    suratList,
    isCbtActive,
  } = useSiakad();

  const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
    GraduationCap: <GraduationCap className="w-4 h-4" />,
    Wallet: <Wallet className="w-4 h-4" />,
    Sparkles: <Sparkles className="w-4 h-4" />,
    LifeBuoy: <LifeBuoy className="w-4 h-4" />,
    FlaskConical: <FlaskConical className="w-4 h-4" />,
    Users: <Users className="w-4 h-4" />,
    BookOpenCheck: <BookOpenCheck className="w-4 h-4" />,
    Database: <Database className="w-4 h-4" />,
    FileText: <FileText className="w-4 h-4" />,
    Briefcase: <Briefcase className="w-4 h-4" />,
    BookMarked: <BookMarked className="w-4 h-4" />,
    BarChart3: <BarChart3 className="w-4 h-4" />,
    GitBranch: <GitBranch className="w-4 h-4" />,
  };

  // Badges for modules
  const getBadge = (moduleId: string) => {
    if (moduleId === 'e-lab' && selectedLabItemIds.size > 0) {
      return (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
          {selectedLabItemIds.size}
        </span>
      );
    }
    if (moduleId === 'keuangan') {
      const pendingValidation = transaksiList.filter((t) => t.status === 'Menunggu Konfirmasi').length;
      if (pendingValidation > 0 && (currentRole === 'keuangan' || currentRole === 'admin')) {
        return (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
            {pendingValidation}
          </span>
        );
      }
    }
    if (moduleId === 'helpdesk') {
      const openTickets = tiketList.filter((t) => t.status === 'Baru' || t.status === 'Dalam Penanganan').length;
      if (openTickets > 0) {
        return (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-700">
            {openTickets}
          </span>
        );
      }
    }
    if (moduleId === 'persuratan') {
      const pendingSurat = suratList.filter((s) => s.status === 'Diajukan' || s.status === 'Diverifikasi BAAK').length;
      if (pendingSurat > 0 && (currentRole === 'baak' || currentRole === 'admin')) {
        return (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
            {pendingSurat}
          </span>
        );
      }
    }
    if (moduleId === 'lms-cbt' && isCbtActive) {
      return (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse">
          LIVE
        </span>
      );
    }
    return null;
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 no-print select-none">
      <div className="py-4 overflow-y-auto">
        <div className="px-4 pb-3 mb-2 border-b border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Daftar Modul Kampus</span>
            <button
              onClick={onOpenSettings}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center gap-1"
            >
              <span>Kelola</span>
            </button>
          </div>
        </div>

        <nav className="px-2 space-y-1">
          {modulesConfig.map((mod) => {
            const isAccessible = mod.rolesAllowed.includes(currentRole);
            const isActive = activeModule === mod.id;

            if (!mod.aktif) {
              return (
                <div
                  key={mod.id}
                  className="px-3 py-2 rounded-lg text-xs flex items-center justify-between text-slate-600 opacity-60 cursor-not-allowed"
                  title="Modul dinonaktifkan dalam pengaturan sistem kampus"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {iconMap[mod.icon] || <LayoutDashboard className="w-4 h-4" />}
                    <span className="truncate">{mod.nama}</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-500">Off</span>
                </div>
              );
            }

            if (!isAccessible) {
              return (
                <div
                  key={mod.id}
                  className="px-3 py-2 rounded-lg text-xs flex items-center justify-between text-slate-600 opacity-50 cursor-not-allowed"
                  title={`Hanya dapat diakses oleh peran: ${mod.rolesAllowed.join(', ')}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {iconMap[mod.icon] || <LayoutDashboard className="w-4 h-4" />}
                    <span className="truncate">{mod.nama}</span>
                  </div>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                </div>
              );
            }

            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}>
                    {iconMap[mod.icon] || <LayoutDashboard className="w-4 h-4" />}
                  </span>
                  <span className="truncate">{mod.nama}</span>
                </div>
                {getBadge(mod.id)}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-300">Tahun Akademik</span>
          <span className="text-emerald-400 font-bold">2025/2026 Genap</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span>Server Status:</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
            Online (Node 01)
          </span>
        </div>
      </div>
    </aside>
  );
};
