import html2pdf from 'html2pdf.js';
import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  Cpu,
  Crosshair,
  Download,
  FileText,
  Heart,
  Pill,
  Radio,
  Send,
  ShieldAlert,
  Sliders,
  Sparkles,
  Terminal,
  Thermometer,
  Zap
} from 'lucide-react';

export default function EHRWidgetView({ patients = [], onSelectPatient, onOpenReferral }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [widgetExpanded, setWidgetExpanded] = useState(true);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const descargarInformePDF = () => {
    const elemento = document.getElementById('contenido-widget-hce');
    if (!elemento) return;

    const opciones = {
      margin: 5,
      filename: `Informe_HUD_RADIANT_${activePatient?.name?.replace(/\s+/g, '_') || 'Paciente'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setPdfDownloaded(true);
    html2pdf().set(opciones).from(elemento).save();

    setTimeout(() => {
      setPdfDownloaded(false);
    }, 3000);
  };

  if (!activePatient) return null;

  // Extracción de métricas
  const flareScore = activePatient.scores?.flareScore ?? 0;
  const steroidScore = activePatient.scores?.steroidScore ?? 0;
  const comorbidityScore = activePatient.scores?.comorbidityScore ?? 0;
  const sleepScore = activePatient.scores?.sleepScore ?? 0;

  // Renderizador de Barras LED Segmentadas con Código de Color (Verde / Amarillo / Rojo)
  const renderLedBar = (score, customColorClass = null) => {
    const totalSegments = 12;
    const filledSegments = Math.round((score / 100) * totalSegments);

    // Selección dinámica de color LED si no se especifica uno fijo
    let ledBg = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
    if (!customColorClass) {
      if (score > 70) {
        ledBg = 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]';
      } else if (score > 40) {
        ledBg = 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]';
      }
    } else {
      ledBg = customColorClass;
    }

    return (
      <div className="flex gap-1.5 items-center w-full bg-[#02050a] p-1.5 rounded-lg border border-slate-800 shadow-inner">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-xs transition-all duration-300 ${
              i < filledSegments
                ? ledBg
                : 'bg-slate-900/80 border border-slate-800/50'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5 text-slate-100 font-sans text-xs bg-[#010307] p-4 sm:p-6 rounded-3xl border border-cyan-900/40 shadow-[0_0_60px_rgba(0,0,0,0.95)]">
      
      {/* HEADER: CYBER GAME COMMAND CONSOLE */}
      <div className="bg-gradient-to-r from-[#060e1e] via-[#0b172e] to-[#040914] border-2 border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_25px_rgba(6,182,212,0.2)] relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Cpu className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-cyan-300 text-sm tracking-widest uppercase">
                RADIANT // GAMEDEV_HUD_ENGINE
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-black bg-cyan-950 text-cyan-300 border border-cyan-400/60 rounded tracking-widest uppercase">
                SYSTEM_ONLINE
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-tight font-mono mt-0.5">
              CONSOLA TÁCTICA DE MONITORIZACIÓN Y ASISTENCIA DIAGNÓSTICA
            </p>
          </div>
        </div>

        {/* Target Selector Station */}
        <div className="flex flex-wrap items-center gap-3 bg-[#02050b] p-2 px-4 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              TARGET_PATIENT:
            </span>
          </div>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-[#070d19] border-2 border-cyan-600/60 text-cyan-200 font-mono text-xs font-black rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-lg transition"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.age}) — CRITICALITY: {p.riskScore}%
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN GAME HUD CONTAINER */}
      <div id="contenido-widget-hce" className="bg-[#030712] border-2 border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Top Status Bar */}
        <div className="bg-[#060b17] border-b border-slate-800 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse"></span>
            <span className="font-extrabold text-slate-200 tracking-wider">DIRAYA MATRIX ENGINE</span>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-400 font-bold">NODE: C.S. CHAMBERÍ</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>FACULTATIVO: <strong className="text-slate-200">{activePatient.pediatrician || 'Dra. Merino'}</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-bold">[ ENCRYPTION: ACTIVE ]</span>
          </div>
        </div>

        {/* Player / Patient Profile Bar */}
        <div className="bg-gradient-to-r from-[#070d1a] via-[#0c1830] to-[#040813] border-b border-slate-800 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border-2 border-cyan-400/60 flex items-center justify-center font-mono font-black text-cyan-300 text-2xl shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              {activePatient.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-lg font-black text-slate-100 tracking-wide font-sans">{activePatient.name}</h1>
                <span className="font-mono text-[11px] font-extrabold text-cyan-300 bg-cyan-950 px-3 py-0.5 rounded-md border border-cyan-500/50">
                  NHC: {activePatient.nhc}
                </span>
                <span className="text-[11px] font-bold text-slate-300 bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-700">
                  {activePatient.cohort}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px] mt-2 font-mono">
                <span>EDAD: <strong className="text-slate-200">{activePatient.age}</strong></span>
                <span>SEXO: <strong className="text-slate-200">{activePatient.gender}</strong></span>
                <span>PESO: <strong className="text-slate-200">{activePatient.weight}</strong></span>
                <span className="text-amber-400 font-sans font-semibold">
                  Alergias: {Array.isArray(activePatient.atopicMarch) ? activePatient.atopicMarch.join(', ') : 'Sin datos'}
                </span>
              </div>
            </div>
          </div>

          {/* HUD Action Controls */}
          <div className="flex items-center gap-3" data-html2canvas-ignore="true">
            <button
              onClick={descargarInformePDF}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 flex items-center gap-2 transition-all duration-300 shadow-lg ${
                pdfDownloaded
                  ? 'bg-emerald-950 text-emerald-200 border-emerald-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-500/50'
              }`}
            >
              {pdfDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-cyan-400" />}
              <span className="font-mono">{pdfDownloaded ? 'EXPORTADO' : 'EXPORTAR PDF'}</span>
            </button>

            <button
              onClick={() => setWidgetExpanded(!widgetExpanded)}
              className="px-4 py-2.5 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-200 rounded-xl border-2 border-cyan-500/50 flex items-center gap-2 transition-all duration-300 shadow-lg font-mono text-xs font-bold"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{widgetExpanded ? '[ OCULTAR RADIANT ]' : '[ DESPLEGAR RADIANT ]'}</span>
            </button>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border-slate-800">
          
          {/* IZQUIERDA: HISTORIAL Y METRICAS BIOMÉTRICAS */}
          <div className={`${widgetExpanded ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'} p-5 sm:p-6 space-y-6 bg-[#030712]`}>
            
            {/* Constantes de Salud */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs font-black text-cyan-400 tracking-wider font-mono flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  [ VITAL_SIGNS // TELEMETRÍA ]
                </span>
                <span className="text-[9px] font-mono text-slate-500">[ LIVE_FEED ]</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl relative overflow-hidden shadow-inner group hover:border-cyan-500/50 transition">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">FC Reposo</span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="font-mono text-2xl font-black text-slate-100">102</span>
                    <span className="text-[10px] text-slate-500 font-mono">bpm</span>
                  </div>
                </div>

                <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl relative overflow-hidden shadow-inner group hover:border-cyan-500/50 transition">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Temp</span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="font-mono text-2xl font-black text-slate-100">36.6</span>
                    <span className="text-[10px] text-slate-500 font-mono">°C</span>
                  </div>
                </div>

                <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl relative overflow-hidden shadow-inner group hover:border-cyan-500/50 transition">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Brotes / 12M</span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="font-mono text-2xl font-black text-rose-400">{activePatient.flareCount12m}</span>
                    <span className="text-[10px] text-rose-400/80 font-mono">ep.</span>
                  </div>
                </div>

                <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl relative overflow-hidden shadow-inner group hover:border-cyan-500/50 transition">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Pill className="w-4 h-4 text-emerald-400" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Corticoterapia</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-mono text-xs font-extrabold text-amber-300">Alta Potencia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evolución clínica */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-200 tracking-wider flex items-center gap-2 font-mono">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  [ CLINICAL_LOGS // NOTA DE EVOLUCIÓN ]
                </span>
                <span className="text-[10px] font-mono text-slate-500">TIMESTAMP: HOY, 10:14H</span>
              </div>
              <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap relative shadow-inner">
                {activePatient.evolutionNote}
              </div>
            </div>

            {/* Prescripciones Médicas */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-200 tracking-wide flex items-center gap-2 font-mono">
                <Pill className="w-4 h-4 text-emerald-400" />
                [ INVENTORY // TRATAMIENTOS PRESCRITOS ]
              </span>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#060c1a]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#030712] text-slate-400 border-b border-slate-800 font-mono text-[9px] uppercase tracking-wider">
                      <th className="p-3">Fármaco</th>
                      <th className="p-3">Pauta</th>
                      <th className="p-3">Categoría</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
                    <tr className="hover:bg-slate-900/50 transition">
                      <td className="p-3 font-bold text-slate-100">Betametasona dipropionato 0.05%</td>
                      <td className="p-3 font-mono text-[11px]">1 app / 12h en brote</td>
                      <td className="p-3 font-mono text-[11px] text-rose-400 font-bold">Alta Potencia</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/40">
                          Refractario
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/50 transition">
                      <td className="p-3 font-bold text-slate-100">Emoliente barrera intensivo</td>
                      <td className="p-3 font-mono text-[11px]">A demanda tras aseo</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">Mantenimiento</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                          Continuo
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* DERECHA: PANEL INTELIGENTE RADIANT CON BARRAS LED A COLOR */}
          {widgetExpanded && (
            <div className="lg:col-span-5 xl:col-span-4 bg-[#050a16] p-5 sm:p-6 space-y-5 flex flex-col justify-between border-t lg:border-t-0 border-slate-800">
              
              <div className="space-y-5">
                {/* Header CDSS */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 animate-pulse" />
                    <span className="font-black text-sm text-slate-100 tracking-widest font-mono uppercase">
                      RADIANT CDSS
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-black text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/50 uppercase tracking-widest">
                    AI_ANALYZER
                  </span>
                </div>

                {/* Cuadro de Alerta Severa */}
                <div className={`p-4 rounded-xl border-2 shadow-xl relative overflow-hidden ${
                  activePatient.riskScore >= 80
                    ? 'bg-rose-950/30 border-rose-600/60 text-rose-200'
                    : 'bg-amber-950/30 border-amber-600/60 text-amber-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-rose-400" />
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400">Índice Severidad:</span>
                        <span className="font-mono font-black text-base text-rose-400 bg-rose-950/90 px-3 py-0.5 rounded border border-rose-500">
                          {activePatient.riskScore}%
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-200 font-sans pt-1">
                        Compatibilidad clínica alta con <strong className="text-cyan-300">Dermatitis Atópica refractaria a tratamiento convencional</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN DE BARRAS LED CON CÓDIGO DE COLORES (ROJO / AMARILLO / VERDE) */}
                <div className="bg-[#02050a] border border-slate-800 rounded-xl p-4 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                      BARRAS LED DE RIESGO
                    </span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>

                  <div className="space-y-4">
                    {/* Brotes - Rojo Crítico */}
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1.5">
                        <span className="text-slate-300 font-bold">FRECUENCIA DE BROTES</span>
                        <span className="text-rose-400 font-black">{flareScore}%</span>
                      </div>
                      {renderLedBar(flareScore, 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]')}
                    </div>

                    {/* Corticoides - Amarillo Alerta */}
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1.5">
                        <span className="text-slate-300 font-bold">ESCALADO CORTICOIDEO</span>
                        <span className="text-amber-400 font-black">{steroidScore}%</span>
                      </div>
                      {renderLedBar(steroidScore, 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]')}
                    </div>

                    {/* Marcha Atópica - Verde Óptimo */}
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1.5">
                        <span className="text-slate-300 font-bold">MARCHA ATÓPICA / COMORB.</span>
                        <span className="text-emerald-400 font-black">{comorbidityScore}%</span>
                      </div>
                      {renderLedBar(comorbidityScore, 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]')}
                    </div>

                    {/* Calidad de Sueño - Azul / Cian */}
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1.5">
                        <span className="text-slate-300 font-bold">IMPACTO CALIDAD SUEÑO</span>
                        <span className="text-cyan-400 font-black">{sleepScore}%</span>
                      </div>
                      {renderLedBar(sleepScore, 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]')}
                    </div>
                  </div>
                </div>

                {/* Recuadro de Elegibilidad */}
                <div className="bg-cyan-950/40 border-2 border-cyan-500/50 rounded-xl p-3.5 text-[11px] space-y-1 shadow-lg">
                  <div className="text-cyan-300 font-black font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Elegibilidad Especializada Confirmada</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
                    Cumple criterios para derivación prioritaria a <strong className="text-white">Dermatología Pediátrica</strong> / Evaluación de terapia biológica.
                  </p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800" data-html2canvas-ignore="true">
                <button
                  onClick={() => onOpenReferral && onOpenReferral(activePatient)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-xl border border-cyan-400/50 shadow-xl shadow-cyan-950/60 flex items-center justify-center gap-2 transition-all duration-300 uppercase font-mono tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>Emitir Interconsulta Directa</span>
                </button>

                <button
                  onClick={() => onSelectPatient && onSelectPatient(activePatient)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition duration-200 font-mono text-[11px]"
                >
                  <span>Ver Análisis XAI Explícito</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}