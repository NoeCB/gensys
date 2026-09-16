import React from 'react';
import { Activity, ShieldCheck, Stethoscope, Sparkles, Building2 } from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole, currentTab, setCurrentTab }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">RADIANT</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full">
                  CDSS Pediátrico
                </span>
                <span className="hidden md:inline-flex items-center text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                  <Building2 className="w-3 h-3 mr-1 text-indigo-400" /> Sanofi Immunology Challenge
                </span>
              </div>
              <p className="text-xs text-slate-400">
                IA para detección temprana y derivación en Dermatitis Atópica moderada-severa
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/70 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setCurrentTab('triage')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'triage'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Bandeja de Triage
            </button>
            <button
              onClick={() => setCurrentTab('playground')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'playground'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Simulador NLP
              </span>
            </button>
            <button
              onClick={() => setCurrentTab('architecture')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'architecture'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Arquitectura & Equipo
            </button>
          </nav>

          {/* Role selector & FHIR badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FHIR R4 Conectado</span>
            </div>

            <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setActiveRole('pediatra')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center transition ${
                  activeRole === 'pediatra'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Vista de Pediatra de Atención Primaria"
              >
                <Stethoscope className="w-3.5 h-3.5 mr-1" />
                Pediatra AP
              </button>
              <button
                onClick={() => setActiveRole('dermatologo')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center transition ${
                  activeRole === 'dermatologo'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Vista de Dermatólogo Pediátrico (Validador Sistema 04)"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Dermatólogo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-900/90 px-4 py-2 justify-around text-xs">
        <button
          onClick={() => setCurrentTab('triage')}
          className={`px-3 py-1 rounded ${currentTab === 'triage' ? 'text-teal-400 font-bold' : 'text-slate-400'}`}
        >
          Triage
        </button>
        <button
          onClick={() => setCurrentTab('playground')}
          className={`px-3 py-1 rounded ${currentTab === 'playground' ? 'text-teal-400 font-bold' : 'text-slate-400'}`}
        >
          Simulador NLP
        </button>
        <button
          onClick={() => setCurrentTab('architecture')}
          className={`px-3 py-1 rounded ${currentTab === 'architecture' ? 'text-teal-400 font-bold' : 'text-slate-400'}`}
        >
          Estrategia
        </button>
      </div>
    </header>
  );
}
