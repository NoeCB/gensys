import React from 'react';
import { Users, AlertTriangle, Zap, Clock, Info } from 'lucide-react';

export default function KPICards({ stats }) {
  // Valores por defecto si no vienen props
  const total = stats?.totalPatients || 184;
  const highRisk = stats?.highRiskCount || 18;
  const pending = stats?.pendingCount || 6;
  const timeSaved = stats?.timeSavedMinutes || 15;
  const timeAdvance = stats?.timeAdvanceMonths || 4.4;

  return (
    <div className="space-y-4 mb-6 font-sans text-xs">
      {/* Banner Legal / Clínico Superior con Neón */}
      <div className="bg-gradient-to-r from-[#060e1e] via-[#0b172e] to-[#040914] border-2 border-cyan-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.25)] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)]"></div>
        <div className="flex items-start gap-3 pl-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)] mt-0.5">
            <Info className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="font-mono font-black text-cyan-300 text-[11px] tracking-wider uppercase">
                PRINCIPIO CLÍNICO RADIANT:
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-200 border border-cyan-500/50 rounded-md tracking-wider uppercase">
                Modo Pediatría de Atención Primaria
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
              Sistema de soporte a la decisión clínica (CDSS) para cribado precoz de DA moderada-severa. <strong className="text-white font-bold">RADIANT no diagnostica</strong>; la valoración y decisión de derivación corresponde exclusivamente al facultativo médico.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas (KPIs) con Estética Cibernética Avanzada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tarjeta 1: Población Cribada */}
        <div className="bg-[#02050a] border-2 border-cyan-900/60 hover:border-cyan-500/60 transition-all duration-300 rounded-2xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Pacientes Pediátricos
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {total}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              ACTIVO 24/7
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1 pt-2 border-t border-slate-900">
            Población pediátrica 0-14 años analizada
          </p>
        </div>

        {/* Tarjeta 2: Alertas Críticas (Con Alarma Visual) */}
        <div className="bg-[#02050a] border-2 border-rose-900/60 hover:border-rose-500/60 transition-all duration-300 rounded-2xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Alertas DA Severa
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-rose-400 tracking-tight drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">
              {highRisk}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-black bg-rose-950 text-rose-300 border border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1 animate-ping"></span>
              {pending} PENDIENTES
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1 pt-2 border-t border-slate-900">
            Candidatos a derivación precoz a especialista
          </p>
        </div>

        {/* Tarjeta 3: Tiempo Ahorrado */}
        <div className="bg-[#02050a] border-2 border-emerald-900/60 hover:border-emerald-500/60 transition-all duration-300 rounded-2xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Eficiencia Asistencial
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
              ~{timeSaved} min
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1 pt-2 border-t border-slate-900">
            Redacción automática de informe en 1 clic
          </p>
        </div>

        {/* Tarjeta 4: Anticipación Diagnóstica */}
        <div className="bg-[#02050a] border-2 border-purple-900/60 hover:border-purple-500/60 transition-all duration-300 rounded-2xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Anticipación Clínica
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-purple-400 tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              {timeAdvance} m
            </span>
            <span className="text-[10px] font-mono text-purple-300 font-bold">
              DE ADELANTO
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1 pt-2 border-t border-slate-900">
            Evitando retraso en acceso a terapias avanzadas
          </p>
        </div>

      </div>
    </div>
  );
}