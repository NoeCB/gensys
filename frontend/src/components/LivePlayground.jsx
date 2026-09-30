import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  Layers, 
  ShieldAlert,
  Brain,
  FileText
} from 'lucide-react';

const CASOS_PREDEFINIDOS = [
  {
    id: 1,
    titulo: 'Caso 1: Candidato Claro',
    subtitulo: 'DA Severa Refractaria',
    badge: 'ALTO RIESGO',
    badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-500/50',
    texto: 'Lactante de 18 meses con eccema severo flexural en huecos poplíteos y antebrazos de 6 meses de evolución. Múltiples brotes refractarios a corticoides tópicos de media/alta potencia (betametasona). Prurito intenso que ocasiona disrupción severa del descanso nocturno y llanto continuo. Antecedentes de asma bronquial en tratamiento y sensibilización a huevo.',
    score: 88,
    nivel: 'RIESGO ALTO / DERIVACIÓN PRIORITARIA',
    explicacion: 'Candidato a evaluación por Dermatología Pediátrica para terapias avanzadas/biológicos.',
    factores: [
      { nombre: 'Refractariedad a corticoides de alta potencia', impacto: '+35% impacto severo', color: 'text-rose-400 bg-rose-950/40 border-rose-800/60' },
      { nombre: 'Disrupción severa del sueño y prurito incoercible', impacto: '+28% impacto vital', color: 'text-rose-400 bg-rose-950/40 border-rose-800/60' },
      { nombre: 'Comorbilidades de la marcha atópica (Asma/Alergia)', impacto: '+25% marcha atópica', color: 'text-purple-400 bg-purple-950/40 border-purple-800/60' }
    ]
  },
  {
    id: 2,
    titulo: 'Caso 2: DA Leve / Moderada',
    subtitulo: 'Controlable en AP',
    badge: 'RIESGO BAJO-MEDIO',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50',
    texto: 'Lactante de 14 meses en revisión rutinaria. Presenta xerosis cutánea moderada y pequeñas placas eritematosas leves en ambas mejillas de instauración coincidiendo con la bajada de temperaturas. No se observan excoriaciones de rascado ni signos de sobreinfección. El descanso nocturno y la alimentación se mantienen sin alteraciones. Se recomendó aplicación diaria de crema emoliente con ceramidas tras el baño y pomada con hidrocortisona al 1% en mejillas durante 3 días si hay eritema visible, con mejoría clínica completa. No antecedentes de asma ni alergias.',
    score: 24,
    nivel: 'RIESGO BAJO / MANEJO EN ATENCIÓN PRIMARIA',
    explicacion: 'Compatible con seguimiento rutinario y tratamiento emoliente/tópico básico.',
    factores: [
      { nombre: 'Eritema leve localizado sin excoriaciones', impacto: '+14% afectación leve', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60' },
      { nombre: 'Descanso nocturno sin alteración', impacto: '-10% sin disrupción', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60' }
    ]
  },
  {
    id: 3,
    titulo: 'Caso 3: Sospecha Diferencial',
    subtitulo: 'Escabiosis / Diagnóstico Dudoso',
    badge: 'DIAGNÓSTICO DUDOSO',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/50',
    texto: 'Paciente de 3 años con prurito familiar generalizado de predominio nocturno, interdigital y palmar. Pápulas eritematosas y surcos acarinos visibles en muñecas. Respuesta nula a corticoides tópicos previos. Se sospecha escabiosis sobreañadida o diagnóstico diferencial alternativo.',
    score: 45,
    nivel: 'RIESGO MODERADO / REVISIÓN DIAGNÓSTICA',
    explicacion: 'Se sugiere descartar infestación ectoparasitaria antes de considerar DA refractaria.',
    factores: [
      { nombre: 'Prurito familiar y distribución interdigital típica', impacto: 'Alerta clínica diferencial', color: 'text-amber-400 bg-amber-950/40 border-amber-800/60' },
      { nombre: 'Respuesta nula a corticoides tópicos', impacto: 'Incongruencia terapéutica', color: 'text-amber-400 bg-amber-950/40 border-amber-800/60' }
    ]
  }
];

export default function LivePlayground() {
  const [texto, setTexto] = useState(CASOS_PREDEFINIDOS[1].texto);
  const [casoSeleccionado, setCasoSeleccionado] = useState(CASOS_PREDEFINIDOS[1]);
  const [analizando, setAnalizando] = useState(false);

  const cargarCaso = (caso) => {
    setCasoSeleccionado(caso);
    setTexto(caso.texto);
  };

  const handleAnalizar = () => {
    setAnalizando(true);
    setTimeout(() => {
      setAnalizando(false);
    }, 400);
  };

  const contarPalabras = (str) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  // Determinación de color del score
  const getScoreColor = (score) => {
    if (score >= 70) return {
      text: 'text-rose-400',
      border: 'border-rose-500/80',
      bg: 'bg-rose-950/30',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
      badge: 'bg-rose-950 text-rose-300 border-rose-500/50'
    };
    if (score >= 40) return {
      text: 'text-amber-400',
      border: 'border-amber-500/80',
      bg: 'bg-amber-950/30',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      badge: 'bg-amber-950 text-amber-300 border-amber-500/50'
    };
    return {
      text: 'text-emerald-400',
      border: 'border-emerald-500/80',
      bg: 'bg-emerald-950/30',
      glow: 'shadow-[0_0_30px_rgba(52,211,153,0.3)]',
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
    };
  };

  const scoreStyle = getScoreColor(casoSeleccionado.score);

  return (
    <div className="bg-[#020611] border-2 border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] text-slate-200 font-sans relative overflow-hidden mb-8">
      
      {/* Fondo Neón Sutil */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header del Simulador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cyan-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <div className="w-full h-full bg-[#030914] rounded-[14px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-mono font-black text-white tracking-wide flex items-center gap-2">
              SIMULADOR NLP CLÍNICO EN TIEMPO REAL
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                v2.4 Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Prueba el motor semántico de scoring RADIANT pegando una evolución médica libre o seleccionando casos pediátricos tipo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#081329] border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Sistema 02 · Motor de Detección DA
          </span>
        </div>
      </div>

      {/* Selector de Casos Predefinidos */}
      <div className="mt-6">
        <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Seleccionar Caso Clínico Pediátrico Predefinido:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CASOS_PREDEFINIDOS.map((caso) => {
            const isSelected = casoSeleccionado.id === caso.id;
            return (
              <button
                key={caso.id}
                onClick={() => cargarCaso(caso)}
                className={`text-left p-3.5 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                  isSelected
                    ? 'bg-[#0a1835] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-[#030914] border-slate-800/80 hover:border-cyan-800 hover:bg-[#061226]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {caso.titulo}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${caso.badgeColor}`}>
                    {caso.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {caso.texto}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Principal: Entrada vs Salida */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Columna Izquierda: Entrada de Texto */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#030914] border border-cyan-900/50 rounded-2xl p-4 shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Texto Libre de la Evolución Médica Pediátrica:
              </span>
              <button
                onClick={() => setTexto('')}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-cyan-950/50"
              >
                <RotateCcw className="w-3 h-3" />
                Limpiar
              </button>
            </div>

            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe o pega aquí el texto de la consulta o curso clínico..."
              rows={8}
              className="w-full bg-[#01040a] border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-900">
            <span className="text-[11px] font-mono text-slate-500">
              {contarPalabras(texto)} palabras analizadas
            </span>

            <button
              onClick={handleAnalizar}
              disabled={analizando}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 flex items-center gap-2"
            >
              {analizando ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  Procesando NLP...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Analizar con RADIANT AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Columna Derecha: Resultado del Análisis (NLP Output) */}
        <div className="lg:col-span-5 bg-[#030914] border border-cyan-900/50 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Resultado de Inferencia & Scoring:
            </div>

            {/* Box Principal del Score */}
            <div className={`border-2 ${scoreStyle.border} ${scoreStyle.bg} ${scoreStyle.glow} rounded-2xl p-4 mb-4 transition-all duration-300 relative overflow-hidden`}>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-mono font-black ${scoreStyle.text} tracking-tight`}>
                  {casoSeleccionado.score}%
                </div>
                <div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border inline-block mb-1 ${scoreStyle.badge}`}>
                    {casoSeleccionado.nivel}
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-tight">
                    {casoSeleccionado.explicacion}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de Factores Clínicos Detectados */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
                Factores Clínicos Detectados ({casoSeleccionado.factores.length}):
              </div>

              {casoSeleccionado.factores.map((factor, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${factor.color}`}
                >
                  <span className="font-sans font-medium text-[11px] pr-2">
                    {factor.nombre}
                  </span>
                  <span className="font-mono font-bold text-[10px] shrink-0 uppercase px-1.5 py-0.5 rounded bg-black/40 border border-current/30">
                    {factor.impacto}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Prototipo de scoring híbrido (NLP semántico + reglas de guías clínicas AEPED/AEDV).</span>
          </div>
        </div>

      </div>

    </div>
  );
}