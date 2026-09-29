import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  FileText,
  Heart,
  Pill,
  Send,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Zap
} from 'lucide-react';

export default function EHRWidgetView({ patients, onSelectPatient, onOpenReferral }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [widgetExpanded, setWidgetExpanded] = useState(true);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  if (!activePatient) return null;

  return (
    <div className="space-y-6">
      {/* Intro Banner for Sanofi Evaluators */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border border-teal-500/30 rounded-2xl p-5 shadow-lg backdrop-blur">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">Simulador de Integración HCE / SMART on FHIR</h2>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                  Zero-Friction UX
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Demostración de cómo <strong>RADIANT CDSS</strong> se incrusta de forma no invasiva como panel lateral dentro de un sistema de Historia Clínica Electrónica hospitalario real (tipo Diraya, Cerner Millennium o SAP Salud). El pediatra <strong>no cambia de pestaña ni memoriza contraseñas</strong>: la alerta se activa automáticamente al abrir la ficha del paciente.
              </p>
            </div>
          </div>

          {/* Quick patient switch */}
          <div className="shrink-0 w-full sm:w-auto">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Simular Paciente en Consulta:
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full sm:w-64 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-teal-400 shadow-inner"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.age}) - Score: {p.riskScore}%
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Simulated Hospital EHR Desktop Window */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Hospital OS / EHR Header Toolbar */}
        <div className="bg-slate-950 border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="text-slate-500">|</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-200">DIRAYA SALUD PEDIÁTRICA</span>
              <span className="text-slate-500 text-[10px]">v4.8.2-PROD</span>
              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono">
                C.S. Chamberí · Consulta Pediatría 02
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Facultativo: <strong className="text-slate-200">{activePatient.pediatrician}</strong></span>
            <span>Turno: <strong className="text-emerald-400">Mañana (En curso)</strong></span>
          </div>
        </div>

        {/* Patient Demographic Banner inside EHR */}
        <div className="bg-slate-850 border-b border-slate-800 p-4 px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
              {activePatient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-base font-bold text-white">{activePatient.name}</h3>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-xs border border-slate-700">
                  NHC: {activePatient.nhc}
                </span>
                <span className="bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {activePatient.cohort}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                <span>Edad: <strong className="text-slate-200">{activePatient.age}</strong></span>
                <span>Sexo: <strong className="text-slate-200">{activePatient.gender}</strong></span>
                <span>Peso: <strong className="text-slate-200">{activePatient.weight}</strong></span>
                <span className="text-rose-400 font-semibold">
                  Alergias: {Array.isArray(activePatient.atopicMarch) ? activePatient.atopicMarch.join(', ') : 'Ninguna conocida'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setWidgetExpanded(!widgetExpanded)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 flex items-center space-x-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>{widgetExpanded ? 'Ocultar Widget RADIANT' : 'Mostrar Widget RADIANT'}</span>
            </button>
          </div>
        </div>

        {/* EHR Main Layout: Left Main EHR + Right RADIANT SMART Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* LEFT: Simulated Standard EHR Interface (7 or 8 columns) */}
          <div className={`${widgetExpanded ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'} p-6 space-y-6 bg-slate-900 border-r border-slate-800 overflow-y-auto`}>
            {/* EHR Subtabs */}
            <div className="flex space-x-2 border-b border-slate-800 pb-3 text-xs font-medium text-slate-400">
              <span className="text-teal-400 font-bold border-b-2 border-teal-400 pb-3 -mb-3 px-1">
                Episodio Clínico Actual
              </span>
              <span className="hover:text-slate-200 cursor-pointer px-2">Constantes & Triaje</span>
              <span className="hover:text-slate-200 cursor-pointer px-2">Histórico de Prescripciones</span>
              <span className="hover:text-slate-200 cursor-pointer px-2">Informes Previos</span>
            </div>

            {/* Vital Signs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <div>
                  <span className="text-[10px] text-slate-500 block">FC en reposo</span>
                  <span className="font-bold text-slate-200">102 bpm (Normal)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Temperatura</span>
                  <span className="font-bold text-slate-200">36.6 °C</span>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Activity className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Brotes (12 meses)</span>
                  <span className="font-bold text-rose-400">{activePatient.flareCount12m} episodios</span>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Pill className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Corticoterapia</span>
                  <span className="font-bold text-amber-300">Potencia Alta</span>
                </div>
              </div>
            </div>

            {/* Clinical Free Text Note (Doctor's Note in EHR) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                  Evolución y Anamnesis Actual (HCE):
                </label>
                <span className="text-[11px] text-slate-500">Última modificación: Hoy, 10:14 h</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 text-xs leading-relaxed font-sans whitespace-pre-wrap">
                {activePatient.evolutionNote}
              </div>
            </div>

            {/* Current Active Prescriptions Table in EHR */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center">
                <Pill className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                Prescripciones Activas Registradas en Farmacia:
              </h4>
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/80 text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Fármaco / Principio Activo</th>
                      <th className="p-3">Pauta</th>
                      <th className="p-3">Grupo Potencia</th>
                      <th className="p-3">Evolución</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                    <tr>
                      <td className="p-3 font-semibold text-white">Betametasona dipropionato 0.05%</td>
                      <td className="p-3">1 aplicación / 12h en brote</td>
                      <td className="p-3 text-rose-400 font-bold">Alta Potencia (Clase III)</td>
                      <td className="p-3 text-amber-300">Refractario / Rebote</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Crema emoliente intensiva barrera</td>
                      <td className="p-3">Aplicación libre tras baño</td>
                      <td className="p-3 text-slate-400">Emoliente base</td>
                      <td className="p-3 text-emerald-400">Mantenimiento</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: Embedded RADIANT SMART on FHIR CDSS Widget */}
          {widgetExpanded && (
            <div className="lg:col-span-5 xl:col-span-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-5 space-y-4 flex flex-col justify-between border-l border-teal-500/30">
              <div className="space-y-4">
                {/* Widget Header with pulsating Copilot badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-white text-xs">RADIANT COPILOT</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      </div>
                      <span className="text-[10px] text-teal-400 font-mono">SMART on FHIR v2</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    Background NLP
                  </span>
                </div>

                {/* Main Alert Card */}
                <div className={`p-4 rounded-2xl border ${
                  activePatient.riskScore >= 80
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <ShieldAlert className={`w-5 h-5 mt-0.5 shrink-0 ${
                      activePatient.riskScore >= 80 ? 'text-rose-400' : 'text-amber-400'
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs uppercase tracking-wider">
                          Alerta CDSS Activa
                        </span>
                        <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                          activePatient.riskScore >= 80
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          Score {activePatient.riskScore}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 mt-1 font-medium leading-snug">
                        Patrón clínico altamente compatible con <strong>Dermatitis Atópica moderada-severa refractaria</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Cardinal Signals Progress Breakdown */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Señales Cardinales Detectadas:
                  </span>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Frecuencia de brotes (12m)</span>
                        <span className="text-rose-400 font-bold">{activePatient.scores?.flareScore || 95}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full"
                          style={{ width: `${activePatient.scores?.flareScore || 95}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Escalado corticoideo</span>
                        <span className="text-indigo-400 font-bold">{activePatient.scores?.steroidScore || 92}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${activePatient.scores?.steroidScore || 92}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Marcha atópica (Comorbilidades)</span>
                        <span className="text-purple-400 font-bold">{activePatient.scores?.comorbidityScore || 88}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full"
                          style={{ width: `${activePatient.scores?.comorbidityScore || 88}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Disrupción de sueño / QoL</span>
                        <span className="text-teal-400 font-bold">{activePatient.scores?.sleepScore || 90}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-400 h-1.5 rounded-full"
                          style={{ width: `${activePatient.scores?.sleepScore || 90}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Biologic Eligibility Stamp (Dupixent) */}
                <div className="bg-teal-950/20 border border-teal-500/30 rounded-2xl p-3.5 text-xs space-y-1.5">
                  <div className="flex items-center space-x-2 text-teal-300 font-bold text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Candidatura a Biológico (Dupixent)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Cumple criterios de ficha técnica pediátrica (≥ 6 meses, fracaso a corticoides tópicos y alto impacto funcional).
                  </p>
                </div>
              </div>

              {/* Action Buttons inside Widget */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onOpenReferral(activePatient)}
                  className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 transition"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>Emitir Interconsulta en 1 Clic</span>
                </button>

                <button
                  onClick={() => onSelectPatient(activePatient)}
                  className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Ver Explicabilidad XAI Detallada</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
