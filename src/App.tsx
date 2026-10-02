import React, { useState } from 'react';
import { SiakadProvider, useSiakad } from './context/SiakadContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardModule } from './components/modules/DashboardModule';
import { AkademikModule } from './components/modules/AkademikModule';
import { KeuanganModule } from './components/modules/KeuanganModule';
import { AiAssistantModule } from './components/modules/AiAssistantModule';
import { HelpdeskModule } from './components/modules/HelpdeskModule';
import { ELabModule } from './components/modules/ELabModule';
import { KepegawaianModule } from './components/modules/KepegawaianModule';
import { LmsCbtModule } from './components/modules/LmsCbtModule';
import { NeoFeederModule } from './components/modules/NeoFeederModule';
import { PersuratanModule } from './components/modules/PersuratanModule';
import { MagangModule } from './components/modules/MagangModule';
import { SkripsiModule } from './components/modules/SkripsiModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { SdlcModule } from './components/modules/SdlcModule';
import { ModuleSettingsModal } from './components/modules/ModuleSettingsModal';
import { LiveToastContainer } from './components/notifications/LiveToastContainer';

const AppContent: React.FC = () => {
  const { activeModule, modulesConfig, currentRole } = useSiakad();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Check if active module is enabled in configuration
  const currentModConfig = modulesConfig.find((m) => m.id === activeModule);
  const isModuleEnabled = currentModConfig ? currentModConfig.aktif : true;
  const isRoleAllowed = currentModConfig ? currentModConfig.rolesAllowed.includes(currentRole) : true;

  const renderActiveModule = () => {
    if (!isModuleEnabled) {
      return (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-black text-xl">
            !
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Modul Ini Sedang Dinonaktifkan</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Modul <strong>{currentModConfig?.nama}</strong> dinonaktifkan oleh administrator kampus melalui panel modul setting.
          </p>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Buka Konfigurasi Modul
          </button>
        </div>
      );
    }

    if (!isRoleAllowed) {
      return (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto font-black text-xl">
            ✕
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Akses Dibatasi (RBAC)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Peran Anda saat ini (<strong>{currentRole}</strong>) tidak memiliki otorisasi untuk mengakses modul ini.
            Ganti hak akses Anda pada menu pojok kanan atas untuk melihat modul terkait.
          </p>
        </div>
      );
    }

    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'akademik':
        return <AkademikModule />;
      case 'keuangan':
        return <KeuanganModule />;
      case 'ai-assistant':
        return <AiAssistantModule />;
      case 'helpdesk':
        return <HelpdeskModule />;
      case 'e-lab':
        return <ELabModule />;
      case 'kepegawaian':
        return <KepegawaianModule />;
      case 'lms-cbt':
        return <LmsCbtModule />;
      case 'neo-feeder':
        return <NeoFeederModule />;
      case 'persuratan':
        return <PersuratanModule />;
      case 'magang':
        return <MagangModule />;
      case 'skripsi':
        return <SkripsiModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'sdlc':
        return <SdlcModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenSettings={() => setShowSettingsModal(true)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar onOpenSettings={() => setShowSettingsModal(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveModule()}
        </main>
      </div>

      <ModuleSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Real-time customizable toast notifications container */}
      <LiveToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SiakadProvider>
      <AppContent />
    </SiakadProvider>
  );
}
