import React from 'react';
import { 
  Inbox, 
  LayoutGrid, 
  Sparkles, 
  Cpu, 
  Stethoscope, 
  UserCheck, 
  Activity,
  Terminal
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentRole, setCurrentRole }) {
  const tabs = [
    { id: 'triage', label: 'Bandeja de Triage', icon: Inbox },
    { id: 'ehr', label: 'Widget HCE (SMART)', icon: LayoutGrid },
    { id: 'nlp', label: 'Simulador NLP', icon: Sparkles },
    { id: 'arch', label: 'Arquitectura & Equipo', icon: Cpu }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#020612] border-b border-cyan-900/50 px-4 py-3 shadow-lg">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* LOGO + BRANDING */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono font-black text-lg text-white uppercase tracking-wider">
                RADIANT
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300 bg-cyan-950 border border-cyan-500/50 rounded">
                CDSS PEDIÁTRICO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              IA para detección temprana y derivación en Dermatitis Atópica
            </p>
          </div>
        </div>

        {/* MÓDULOS DE NAVEGACIÓN (BOTONES DE PESTAÑA) */}
        <div className="bg-[#01040a] p-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            // Detección robusta de pestaña activa (soporta activeTab o vista)
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (typeof setActiveTab === 'function') {
                    setActiveTab(tab.id);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer select-none ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105 border border-cyan-300'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 ml-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            FHIR R4 Conectado
          </div>
        </div>

        {/* SELECTOR DE ROL MÉDICO */}
        <div className="flex items-center gap-1.5 bg-[#01040a] p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setCurrentRole && setCurrentRole('pediatra')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              currentRole === 'pediatra' || !currentRole
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Pediatra AP
          </button>

          <button
            type="button"
            onClick={() => setCurrentRole && setCurrentRole('dermatologo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              currentRole === 'dermatologo'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Dermatólogo
          </button>
        </div>

      </div>
    </header>
  );
}