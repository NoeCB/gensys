import React, { useState } from 'react';
import { X, Copy, Check, Send, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function ReferralModal({ patient, onClose, onConfirmReferral }) {
  const [copied, setCopied] = useState(false);
  const [priority, setPriority] = useState('Preferente');
  const [urgencyNotes, setUrgencyNotes] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!patient) return null;

  const referralReport = `PROPUESTA DE DERIVACIÓN INTERCONSULTAS · DERMATOLOGÍA PEDIÁTRICA
Generado con el soporte de RADIANT CDSS (Sistema de Detección de DA Moderada-Severa)
---------------------------------------------------------------------------------
Fecha: ${new Date().toLocaleDateString('es-ES')} | Prioridad: ${priority}
Paciente: ${patient.name} | NHC: ${patient.nhc} | Sexo: ${patient.gender}
Edad: ${patient.age} (${patient.weight}) | Cohorte: ${patient.cohort}
Facultativo Emisor: ${patient.pediatrician}
Servicio Receptor: Dermatología Pediátrica / Unidad de Eccemas Refractarios

1. MOTIVO DE INTERCONSULTA:
Sospecha fundada de Dermatitis Atópica (DA) moderada-severa recalcitrante con fracaso a tratamiento tópico convencional y alto impacto funcional. RADIANT Risk Score: ${patient.riskScore}% (Candidato a derivación temprana).

2. CRITERIOS CLÍNICOS DETECTADOS EN HISTORIAL:
- Frecuencia de brotes agudos: ${patient.flareCount12m} brotes documentados en últimos 12 meses.
- Escalado farmacológico: ${patient.steroidEscalation}.
- Comorbilidades de la marcha atópica: ${patient.atopicMarch.join(', ')}.
- Afectación de calidad de vida: ${patient.sleepImpact}. Score CDLQI estimado: ${patient.scores.cdlqi}/30 (Severo).

3. RESUMEN CLÍNICO RECIENTE (HCE):
"${patient.evolutionNote.trim()}"

4. EVALUACIÓN DE CANDIDATURA A TERAPIA BIOLÓGICA (Guías AEPED/AEDV & Ficha Dupixent):
- Paciente pediátrico en rango etario autorizado (aprobado a partir de 6 meses de edad).
- Dermatitis atópica con afectación extensa o en áreas visibles/funcionales no controlada adecuadamente con tratamientos tópicos de prescripción.
- Sugerencia clínica: Valorar estadiaje EASI / SCORAD en consulta monográfica e indicación de dupilumab si procede.

5. NOTAS ADICIONALES DEL PEDIATRA:
${urgencyNotes || 'Ninguna observación complementaria.'}
---------------------------------------------------------------------------------
Documento generado como soporte a la toma de decisión clínica.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirm = () => {
    setSentSuccess(true);
    setTimeout(() => {
      onConfirmReferral(patient.id);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Borrador de Interconsulta a Dermatología</h3>
              <p className="text-xs text-slate-400">
                Pre-redacción automatizada de informe clínico para derivación temprana
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {sentSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">¡Derivación Registrada con Éxito!</h4>
              <p className="text-slate-300 text-xs">
                Se ha actualizado el estado de la alerta a "Derivación Emitida" y se ha sincronizado con el bucle de validación.
              </p>
            </div>
          ) : (
            <>
              {/* Configuration bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Prioridad de Derivación:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-teal-400"
                  >
                    <option value="Preferente">Preferente (Cita en &lt;15-30 días)</option>
                    <option value="Ordinaria">Ordinaria (Cita rutinaria)</option>
                    <option value="Urgente">Urgente (Brote eritrodérmico o sobreinfección)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Notas adicionales del pediatra (opcional):
                  </label>
                  <input
                    type="text"
                    value={urgencyNotes}
                    onChange={(e) => setUrgencyNotes(e.target.value)}
                    placeholder="Ej: Familia muy angustiada por prurito nocturno..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Text Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-300">
                    Vista previa del informe (listo para copiar a HCE o enviar por FHIR ServiceRequest):
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-teal-400 hover:text-teal-300 flex items-center space-x-1 font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar texto</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-72">
                  {referralReport}
                </pre>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!sentSuccess && (
          <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-end space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copiado al Portapapeles' : 'Copiar para HCE'}</span>
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-teal-500/20 transition"
            >
              <Send className="w-3.5 h-3.5 text-slate-950" />
              <span>Emitir Derivación a Dermatología</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
