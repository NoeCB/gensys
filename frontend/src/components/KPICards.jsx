import React from 'react';
import { Users, AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';
import { MOCK_STATS } from '../data/patientsData';

export default function KPICards({ activeRole }) {
  return (
    <div className="mb-6">
      {/* CDSS Non-diagnostic Notice */}
      <div className="mb-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 flex items-start space-x-3 text-xs text-indigo-200">
        <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-indigo-300">Principio Clínico RADIANT:</span> Sistema de soporte a la decisión clínica (CDSS) que identifica patrones compatibles con DA moderada-severa en historiales pediátricos. <strong className="text-white">RADIANT no diagnostica</strong>; la valoración y decisión de derivación corresponde exclusivamente al facultativo médico.
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyzed */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pacientes Pediátricos Cribados</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{MOCK_STATS.totalAnalyzed}</span>
            <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
              Activo 24/7
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Población pediátrica 0-14 años analizada</p>
        </div>

        {/* Alerts */}
        <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-4 shadow-sm backdrop-blur relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Alertas DA Moderada-Severa</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-400">{MOCK_STATS.moderateSevereAlerts}</span>
            <span className="text-xs text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">
              {MOCK_STATS.pendingReview} pendientes
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Candidatos a derivación precoz a especialista</p>
        </div>

        {/* Specialist Agreement (Sistema 04) */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Concordancia Especialista (PPV)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400">{MOCK_STATS.specialistAgreementRate}</span>
            <span className="text-xs text-slate-400">
              ({MOCK_STATS.acceptedReferrals} confirmadas)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Bucle continuo de validación (Sistema 04)</p>
        </div>

        {/* Diagnosis Anticipation */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Anticipación Diagnóstica Media</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-indigo-300">{MOCK_STATS.avgDiagnosisAnticipationMonths}</span>
            <span className="text-xs text-indigo-400 font-medium">de adelanto</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Evitando retraso en acceso a terapias avanzadas</p>
        </div>
      </div>
    </div>
  );
}
