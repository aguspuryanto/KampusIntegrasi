import React from 'react';
import { useSiakad } from '../../context/SiakadContext';
import { X, Check, Power, Sliders, Shield, RefreshCw } from 'lucide-react';

interface ModuleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModuleSettingsModal: React.FC<ModuleSettingsModalProps> = ({ isOpen, onClose }) => {
  const { modulesConfig, toggleModuleActive, resetToDefault } = useSiakad();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Manajemen Aktivasi Modul SIAKAD</h3>
              <p className="text-xs text-slate-500">
                Aktifkan atau nonaktifkan modul kampus sesuai kebutuhan operasional universitas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Module Toggles List */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="text-xs text-slate-500 font-medium mb-2">
            Klik saklar switch untuk mengubah status ketersediaan modul di navigasi kampus:
          </div>

          {modulesConfig.map((mod) => (
            <div
              key={mod.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                mod.aktif
                  ? 'bg-white border-slate-200 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm">{mod.nama}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      mod.aktif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {mod.aktif ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{mod.deskripsi}</p>
                <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span>Akses: {mod.rolesAllowed.join(', ')}</span>
                </div>
              </div>

              {/* Switch button */}
              <button
                onClick={() => toggleModuleActive(mod.id)}
                disabled={mod.id === 'dashboard' || mod.id === 'sdlc'}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  mod.id === 'dashboard' || mod.id === 'sdlc'
                    ? 'opacity-50 cursor-not-allowed bg-indigo-600'
                    : mod.aktif
                    ? 'bg-indigo-600'
                    : 'bg-slate-300'
                }`}
                title={
                  mod.id === 'dashboard' || mod.id === 'sdlc'
                    ? 'Modul inti tidak dapat dinonaktifkan'
                    : 'Klik untuk ubah status'
                }
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    mod.aktif ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={resetToDefault}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Konfigurasi Default</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
