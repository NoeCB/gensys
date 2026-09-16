import React from 'react';
import { Layers, GitBranch, Lightbulb, Shield, Database, Cpu, Bell, RefreshCw, CheckCircle2, UserCheck, Star } from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Arquitectura RADIANT & Reparto de Trabajo</h2>
            <p className="text-xs text-slate-400">
              Piloto end-to-end incremental propuesto por Sanofi para el reto de DA Pediátrica
            </p>
          </div>
        </div>
      </div>

      {/* DIFERENCIACIÓN: CÓMO PODEMOS SER DIFERENTES */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-teal-950/30 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Estrategia de Valor · Cómo destacar ante Sanofi</span>
        </div>
        <h3 className="text-2xl font-black text-white mb-2">
          ¿Cómo podemos ser diferentes al resto de equipos?
        </h3>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed mb-6">
          La mayoría de participantes se limitarán a un script de Python con un LLM genérico que responde "sí/no". Para ganar el reto de Sanofi y convencer a los pediatras, RADIANT propone 5 pilares diferenciales:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Diff 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-400/60 transition">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold mb-2">
              1
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Explicabilidad Clínica Inmediata (XAI)</h4>
            <p className="text-slate-400 leading-relaxed">
              El pediatra tiene 5 minutos por paciente. En lugar de una cifra vacía, RADIANT le resalta exactamente las frases del historial que justifican la alerta ("Por qué levanto la mano hoy").
            </p>
          </div>

          {/* Diff 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/30 hover:border-teal-400/60 transition">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold mb-2">
              2
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Timeline de la Marcha Atópica</h4>
            <p className="text-slate-400 leading-relaxed">
              La DA pediátrica no es una foto fija: es una trayectoria. Modelamos la evolución temporal: escalado de potencia corticoidea, marcha atópica (asma, rinitis) y disrupción del sueño acumulada.
            </p>
          </div>

          {/* Diff 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400/60 transition">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold mb-2">
              3
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Candidatura a Biológico Pediátrico</h4>
            <p className="text-slate-400 leading-relaxed">
              Cruce automático con criterios de ficha técnica de Dupixent (aprobado desde 6 meses en DA moderada-severa no controlada), facilitando la justificación de acceso temprano al fármaco.
            </p>
          </div>

          {/* Diff 4 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400/60 transition">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-2">
              4
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Borrador de Interconsulta en 1 Clic</h4>
            <p className="text-slate-400 leading-relaxed">
              Elimina la fricción burocrática del pediatra: redacta la propuesta de derivación completa estructurada para pegar en el HCE o enviar telemáticamente al dermatólogo pediátrico.
            </p>
          </div>

          {/* Diff 5 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400/60 transition">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold mb-2">
              5
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Bucle Cerrado con Feedback y Drift</h4>
            <p className="text-slate-400 leading-relaxed">
              El especialista valida si la derivación fue acertada o no. Esto genera un dataset etiquetado real que monitoriza drift y recalibra el umbral de alerta (Sistema 04 completado).
            </p>
          </div>

          {/* Diff 6 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-400/60 transition">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold mb-2">
              6
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Estándar FHIR R4 & Privacidad PII</h4>
            <p className="text-slate-400 leading-relaxed">
              Diseñado conforme al estándar internacional de interoperabilidad clínica (FHIR R4 Patient, Condition, MedicationRequest) y anonimización conforme al RGPD en salud pediátrica.
            </p>
          </div>
        </div>
      </div>

      {/* 3 RAMAS DE GIT Y REPARTO DEL EQUIPO */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-4">
          <GitBranch className="w-5 h-5 text-teal-400" />
          <span>Organización del Equipo en Git (3 Ramas Creadas)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Noelia */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-teal-500/50 relative shadow-lg">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold border border-teal-500/30">
              RAMA ACTIVA
            </div>
            <div className="flex items-center space-x-2 text-teal-300 font-bold mb-1">
              <UserCheck className="w-4 h-4" />
              <span className="font-mono text-sm">noe-dev</span>
            </div>
            <span className="text-white font-bold text-sm block">Noelia · Front & Experiencia Clínica</span>
            <p className="text-slate-400 mt-2 leading-relaxed">
              <strong>Sistema 03 (Frontend & Alertas)</strong>:
            </p>
            <ul className="mt-2 space-y-1 text-slate-300 list-disc list-inside">
              <li>Portal clínico CDSS para Pediatras y Dermatólogos</li>
              <li>Explicabilidad de entidades NLP en notas clínicas</li>
              <li>Generador de informes de interconsulta rápida</li>
              <li>Integración del simulador de casos en tiempo real</li>
            </ul>
          </div>

          {/* Ana */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 relative">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold mb-1">
              <Database className="w-4 h-4" />
              <span className="font-mono text-sm">ana-dev</span>
            </div>
            <span className="text-white font-bold text-sm block">Ana · Ingesta & FHIR R4</span>
            <p className="text-slate-400 mt-2 leading-relaxed">
              <strong>Sistema 01 (Pipeline de Ingesta y Normalización)</strong>:
            </p>
            <ul className="mt-2 space-y-1 text-slate-300 list-disc list-inside">
              <li>Scripts de ingesta y lectura de HCE (CSV/JSON/FHIR)</li>
              <li>Módulo de anonimización de PII (nombres, fechas, NHC)</li>
              <li>Normalización a formato estructurado común FHIR R4</li>
              <li>Cálculo de métricas estructuradas (frecuencia de visitas)</li>
            </ul>
          </div>

          {/* Silvia */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 relative">
            <div className="flex items-center space-x-2 text-purple-300 font-bold mb-1">
              <Cpu className="w-4 h-4" />
              <span className="font-mono text-sm">silvia-dev</span>
            </div>
            <span className="text-white font-bold text-sm block">Silvia · NLP Médico & Validación</span>
            <p className="text-slate-400 mt-2 leading-relaxed">
              <strong>Sistema 02 & 04 (Scoring y Bucle de Aprendizaje)</strong>:
            </p>
            <ul className="mt-2 space-y-1 text-slate-300 list-disc list-inside">
              <li>Pipeline NLP médico (NER de síntomas, fármacos y sueño)</li>
              <li>Algoritmo de scoring multivariable de riesgo de DA</li>
              <li>Dataset versionado de feedback (DVC / MLflow)</li>
              <li>Detección de drift del modelo (Evidently AI)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* LOS 4 SISTEMAS INCREMENTALES */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-lg font-bold text-white mb-4">
          Itinerario Técnico Incremental: Los 4 Sistemas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* S1 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <span className="text-xs font-mono font-bold text-indigo-400">SISTEMA 01</span>
            <h4 className="font-bold text-white text-sm mt-1 mb-1">Ingesta & Normalización</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Ingesta historiales clínicos, anonimiza PII y normaliza a modelo común FHIR R4.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Stack: Python, pandas, Amazon S3 / JSON, FHIR R4
            </div>
          </div>

          {/* S2 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <span className="text-xs font-mono font-bold text-teal-400">SISTEMA 02</span>
            <h4 className="font-bold text-white text-sm mt-1 mb-1">Motor de Detección NLP</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Combina NLP médico en texto libre con reglas clínicas de escalado y marcha atópica.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Stack: scikit-learn, HuggingFace, regex clínico
            </div>
          </div>

          {/* S3 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <span className="text-xs font-mono font-bold text-purple-400">SISTEMA 03</span>
            <h4 className="font-bold text-white text-sm mt-1 mb-1">Alertas a Pediatras</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Emite alertas accionables y explicables con propuesta de derivación automática.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Stack: FastAPI, React 19, Tailwind CSS, Lucide
            </div>
          </div>

          {/* S4 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <span className="text-xs font-mono font-bold text-emerald-400">SISTEMA 04</span>
            <h4 className="font-bold text-white text-sm mt-1 mb-1">Validación & Reentrenamiento</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              El especialista valida cada alerta cerrando el bucle de feedback y active learning.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Stack: Evidently AI, MLflow, feedback dataset
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
