import React from 'react';
import { Users, AlertTriangle, CheckCircle2, Clock, Info, ShieldCheck, Stethoscope, Zap } from 'lucide-react';
import { MOCK_STATS } from '../data/patientsData';

export default function KPICards({ activeRole }) {
  const isPediatra = activeRole === 'pediatra';

  return (
    <div className="mb-6">
      {/* CDSS Non-diagnostic Notice with Role Context */}
      <div className="mb-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 flex items-start space-x-3 text-xs text-indigo-200">
        <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-0.5">
            <span className="font-semibold text-indigo-300">Principio Clínico RADIANT:</span>
            <span className="flex items-center text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {isPediatra ? (
                <>
                  <Stethoscope className="w-3 h-3 mr-1" /> Modo Pediatría de Atención Primaria
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 mr-1" /> Modo Dermatología Especializada (Validador S4)
                </>
              )}
            </span>
          </div>
          <div>
            Sistema de soporte a la decisión clínica (CDSS) para cribado precoz de DA moderada-severa.{' '}
            <strong className="text-white">RADIANT no diagnostica</strong>; la valoración y decisión de derivación corresponde exclusivamente al facultativo médico.
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {isPediatra ? 'Pacientes Pediátricos Cribados' : 'Interconsultas Recibidas'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">
              {isPediatra ? MOCK_STATS.totalAnalyzed : (MOCK_STATS.acceptedReferrals + MOCK_STATS.pendingReview)}
            </span>
            <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
              {isPediatra ? 'Activo 24/7' : 'Cohorte HCE'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {isPediatra ? 'Población pediátrica 0-14 años analizada' : 'Derivaciones desde Atención Primaria'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-4 shadow-sm backdrop-blur relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {isPediatra ? 'Alertas DA Moderada-Severa' : 'Candidatos Biológico (Dupixent)'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-400">
              {isPediatra ? MOCK_STATS.moderateSevereAlerts : '4 prioritarios'}
            </span>
            <span className="text-xs text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">
              {MOCK_STATS.pendingReview} pendientes
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {isPediatra ? 'Candidatos a derivación precoz a especialista' : 'Refractarios a corticoides tópicos clase III'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {isPediatra ? 'Tiempo Ahorrado Asistencial' : 'Concordancia Especialista (PPV)'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              {isPediatra ? <Zap className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400">
              {isPediatra ? '~15 min' : MOCK_STATS.specialistAgreementRate}
            </span>
            <span className="text-xs text-slate-400">
              {isPediatra ? 'por interconsulta' : `(${MOCK_STATS.acceptedReferrals} confirmadas)`}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {isPediatra ? 'Redacción automática en 1 clic' : 'Bucle continuo de validación (Sistema 04)'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {isPediatra ? 'Anticipación Diagnóstica Media' : 'Reducción Demora Terapéutica'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-indigo-300">
              {isPediatra ? MOCK_STATS.avgDiagnosisAnticipationMonths : '6.2 meses'}
            </span>
            <span className="text-xs text-indigo-400 font-medium">
              {isPediatra ? 'de adelanto' : 'más rápido'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {isPediatra ? 'Evitando retraso en acceso a terapias avanzadas' : 'Acceso temprano a tratamiento sistémico'}
          </p>
        </div>
      </div>
    </div>
  );
}
