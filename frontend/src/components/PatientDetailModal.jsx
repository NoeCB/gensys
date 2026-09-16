import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Share2,
  Sparkles,
  Flame,
  Pill,
  Moon,
  Activity,
  Send,
  HelpCircle,
  Check
} from 'lucide-react';

export default function PatientDetailModal({
  patient,
  onClose,
  onOpenReferral,
  onUpdateStatus,
  activeRole
}) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'nlp' | 'timeline' | 'validation'
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackReason, setFeedbackReason] = useState('da_confirmada');
  const [highlightCategory, setHighlightCategory] = useState('ALL');

  if (!patient) return null;

  const handleValidationAction = (status) => {
    onUpdateStatus(patient.id, status, {
      reason: feedbackReason,
      notes: feedbackNotes,
      validatorRole: activeRole,
      timestamp: new Date().toISOString()
    });
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'lesion':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'symptom':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'escalation':
      case 'rebound':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'comorbidity':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'sleep':
      case 'qol':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-850 flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                patient.riskScore >= 80
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {patient.riskScore}%
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-white">{patient.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                  NHC: {patient.nhc}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-300">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {patient.age} ({patient.gender}, {patient.weight}) • {patient.cohort} • Pediatra:{' '}
                <span className="text-slate-300">{patient.pediatrician}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CDSS Alert Banner */}
        <div
          className={`px-6 py-3 text-xs flex items-center justify-between ${
            patient.riskScore >= 80
              ? 'bg-rose-950/40 text-rose-200 border-b border-rose-900/40'
              : 'bg-amber-950/40 text-amber-200 border-b border-amber-900/40'
          }`}
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Alerta RADIANT:</strong> Probabilidad de DA moderada-severa no controlada:{' '}
              <strong className="underline">{patient.riskScore}%</strong>. Criterios de derivación precoz cumplidos según guías AEPED/ETFAD.
            </span>
          </div>
          <span className="hidden sm:inline-block font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {patient.status}
          </span>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-800 bg-slate-900/70 px-6 pt-2 space-x-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'summary'
                ? 'border-teal-400 text-teal-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Radar Clínico & Explicabilidad</span>
          </button>

          <button
            onClick={() => setActiveTab('nlp')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'nlp'
                ? 'border-teal-400 text-teal-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Visor NLP del Historial</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'timeline'
                ? 'border-teal-400 text-teal-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Marcha Atópica & Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('validation')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'validation'
                ? 'border-purple-400 text-purple-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Bucle Validación (S4)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {/* TAB 1: SUMMARY & CLINICAL RADAR */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* 4 Pillars Scoring Grid */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Las 4 Señales Cardinales Evaluadas por RADIANT
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pillar 1: Flare count */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
                      <span className="flex items-center">
                        <Flame className="w-4 h-4 mr-1.5 text-rose-400" />
                        Brotes Recurrentes
                      </span>
                      <span className="font-bold text-rose-400">{patient.scores.flareScore}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full"
                        style={{ width: `${patient.scores.flareScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400">
                      <strong>{patient.flareCount12m} episodios agudos</strong> en los últimos 12 meses. Criterio de severidad (&gt;3 brotes/año).
                    </p>
                  </div>

                  {/* Pillar 2: Steroid Escalation */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
                      <span className="flex items-center">
                        <Pill className="w-4 h-4 mr-1.5 text-indigo-400" />
                        Escalado de Corticoides Tópicos
                      </span>
                      <span className="font-bold text-indigo-400">{patient.scores.steroidScore}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${patient.scores.steroidScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400">
                      {patient.steroidEscalation}. Alerta de refractariedad y corticofobia.
                    </p>
                  </div>

                  {/* Pillar 3: Atopic March Comorbidities */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
                      <span className="flex items-center">
                        <Activity className="w-4 h-4 mr-1.5 text-purple-400" />
                        Marcha Atópica & Comorbilidades
                      </span>
                      <span className="font-bold text-purple-400">{patient.scores.comorbidityScore}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${patient.scores.comorbidityScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400">
                      Asociadas: {patient.atopicMarch.join(', ')}. Inflamación tipo 2 sistémica.
                    </p>
                  </div>

                  {/* Pillar 4: Sleep & QoL */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
                      <span className="flex items-center">
                        <Moon className="w-4 h-4 mr-1.5 text-teal-400" />
                        Disrupción del Sueño & CDLQI
                      </span>
                      <span className="font-bold text-teal-400">{patient.scores.sleepScore}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${patient.scores.sleepScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400">
                      CDLQI infantil estimado: <strong>{patient.scores.cdlqi}/30</strong> (Afectación severa de la calidad de vida).
                    </p>
                  </div>
                </div>
              </div>

              {/* Justification Triggers */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-400" />
                  Hallazgos Clínicos que Justifican la Alerta (Explicabilidad XAI)
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {patient.keyTriggers.map((trigger, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                      <span>{trigger}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dupixent/Biologic Pediatric Guideline Readiness */}
              <div className="bg-gradient-to-r from-indigo-950/40 to-slate-800/60 border border-indigo-500/30 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5 text-indigo-400" />
                    Criterios de Derivación a Terapia Biológica (Guías Pediátricas / Ficha Sanofi)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    Criterio Dupilumab Pediátrico
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mt-3">
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Edad ≥6 meses ({patient.age})</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>DA Moderada-Severa</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Refractario a tópicos</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-indigo-200/80">
                  {patient.dupixentEligibility.score}. Se recomienda interconsulta para estadiaje EASI formal e indicación de terapia sistémica.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: NLP CLINICAL VISOR */}
          {activeTab === 'nlp' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  Entidades clínicas detectadas por el modelo NLP sobre la nota de evolución libre:
                </span>
                {/* Category filters */}
                <div className="flex flex-wrap gap-1 text-xs">
                  <button
                    onClick={() => setHighlightCategory('ALL')}
                    className={`px-2 py-0.5 rounded ${
                      highlightCategory === 'ALL'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Todas ({patient.nlpEntities.length})
                  </button>
                  <button
                    onClick={() => setHighlightCategory('escalation')}
                    className={`px-2 py-0.5 rounded ${
                      highlightCategory === 'escalation'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Escalado
                  </button>
                  <button
                    onClick={() => setHighlightCategory('sleep')}
                    className={`px-2 py-0.5 rounded ${
                      highlightCategory === 'sleep'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Sueño / Calidad vida
                  </button>
                  <button
                    onClick={() => setHighlightCategory('comorbidity')}
                    className={`px-2 py-0.5 rounded ${
                      highlightCategory === 'comorbidity'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Comorbilidades
                  </button>
                </div>
              </div>

              {/* Raw Note Box */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 font-sans text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-line shadow-inner">
                {patient.evolutionNote}
              </div>

              {/* Extracted Entities List */}
              <div className="space-y-2 mt-4">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Desglose de Hallazgos NLP
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {patient.nlpEntities
                    .filter((e) => highlightCategory === 'ALL' || e.category === highlightCategory)
                    .map((entity, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-start justify-between ${getCategoryColor(
                          entity.category
                        )}`}
                      >
                        <div>
                          <span className="font-semibold block">{entity.text}</span>
                          <span className="text-xs opacity-80">{entity.type}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Línea temporal de la marcha atópica y escalado farmacológico registrado en el historial:
              </p>
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {patient.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-teal-400 group-hover:bg-teal-400 transition"></div>
                    <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl text-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="font-bold text-teal-300">{step.date}</span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-slate-300">
                          {step.age}
                        </span>
                      </div>
                      <p className="text-slate-200">{step.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VALIDATION (SISTEMA 04) */}
          {activeTab === 'validation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                <h4 className="text-xs font-bold text-purple-300 flex items-center mb-1">
                  <CheckCircle className="w-4 h-4 mr-1.5 text-purple-400" />
                  Cierre del Bucle de Validación Clínica (Sistema 04)
                </h4>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Cada confirmación o descarte por parte del clínico se incorpora al dataset de feedback versionado. Esto permite monitorizar el drift del modelo y programar ciclos de reentrenamiento continuo que refinan el umbral de detección por cohorte.
                </p>
              </div>

              <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 text-xs">
                <label className="block font-semibold text-slate-300">
                  Motivo de la Decisión Clínica:
                </label>
                <select
                  value={feedbackReason}
                  onChange={(e) => setFeedbackReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-400"
                >
                  <option value="da_confirmada">
                    Acierto: Confirmada DA moderada-severa candidata a especialista
                  </option>
                  <option value="buena_respuesta_topicos">
                    Falso positivo: Responde favorablemente con mejor adherencia a tópicos
                  </option>
                  <option value="dermatosis_infecciosa">
                    Falso positivo: Sospecha de escabiosis / impétigo sobreañadido
                  </option>
                  <option value="corticofobia_resuelta">
                    Falso positivo: Mejoría tras educación sobre uso adecuado de corticoides
                  </option>
                  <option value="otros">Otro criterio clínico</option>
                </select>

                <label className="block font-semibold text-slate-300 mt-2">
                  Observaciones facultativas (se anonimizan para reentrenamiento):
                </label>
                <textarea
                  rows="3"
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Ej: Se cita en dermatología preferente en 15 días con informe RADIANT adjunto..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-400"
                ></textarea>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleValidationAction('Aceptada')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center space-x-1.5 transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmar Alerta (Acierto)</span>
                  </button>

                  <button
                    onClick={() => handleValidationAction('Descartada')}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold flex items-center justify-center space-x-1.5 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rechazar Alerta (Falso Positivo)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Rol actual:{' '}
            <span className="font-semibold text-slate-200 capitalize">
              {activeRole === 'pediatra' ? 'Pediatra de Atención Primaria' : 'Dermatólogo Pediátrico'}
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenReferral(patient)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-teal-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-slate-950" />
              <span>Generar Interconsulta a Especialista</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
