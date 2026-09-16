import React, { useState } from 'react';
import { Sparkles, Play, RotateCcw, AlertTriangle, CheckCircle, Info, Flame, Pill, Moon, Activity } from 'lucide-react';

const PRESET_CASES = [
  {
    title: 'Caso 1: Candidato Claro (DA Severa Refractaria)',
    age: '3 años',
    description: 'Brote flexural intenso, betametasona fallida, insomnio por prurito y asma concomitante.',
    text: `Niño de 3 años que acude acompañado por sus padres por empeoramiento severo de eccema flexural generalizado en pliegues de brazos y piernas, con exudación y lesiones de rascado sangrantes. 
    
La madre refiere que el niño no duerme más de 3-4 horas por noche debido al prurito constante y llanto incontrolable. 

Tratado previamente con hidrocortisona pomada y posteriormente betametasona dipropionato al 0.05% durante 3 semanas, experimentando recaída inmediata tras suspender (efecto rebote). 

Presenta además episodios frecuentes de bronquitis sibilante y rinitis alérgica. Se sospecha dermatitis atópica moderada-severa con necesidad de valoración en dermatología pediátrica para escalado terapéutico.`
  },
  {
    title: 'Caso 2: DA Leve Controlable en AP',
    age: '14 meses',
    description: 'Xerosis y placas eritematosas leves en mejillas, buena respuesta a emolientes, sueño conservado.',
    text: `Lactante de 14 meses en revisión rutinaria. Presenta xerosis cutánea moderada y pequeñas placas eritematosas en ambas mejillas de instauración coincidiendo con la bajada de temperaturas. 

No se observan excoriaciones de rascado ni signos de sobreinfección. El descanso nocturno y la alimentación se mantienen sin alteraciones. 

Se recomendó aplicación diaria de crema emoliente con ceramidas tras el baño y pomada con hidrocortisona al 1% en mejillas durante 3 días si hay eritema visible, con mejoría clínica completa. No antecedentes de asma ni alergias.`
  },
  {
    title: 'Caso 3: Sospecha Diagnóstico Diferencial (Escabiosis)',
    age: '5 años',
    description: 'Prurito familiar generalizado de predominio interdigital y palmar, respuesta nula a corticoides.',
    text: `Paciente de 5 años derivado para despistaje de eccema atópico severo por prurito muy intenso nocturno de 4 semanas de evolución. 

En la exploración física se aprecian pápulas eritematosas y surcos acarinos en espacios interdigitales de manos, muñecas y zona genital. 

La madre y el hermano mayor refieren sintomatología pruriginosa idéntica iniciada en las mismas fechas. Se descarta dermatitis atópica primaria y se orienta hacia sospecha diagnóstica de escabiosis (sarna) comunitaria. Se pauta permetrina 5% tópica a todos los convivientes.`
  }
];

export default function LivePlayground() {
  const [inputText, setInputText] = useState(PRESET_CASES[0].text);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = (textToAnalyze = inputText) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const lower = textToAnalyze.toLowerCase();

      // Detection logic rules
      const hasSevereLesions =
        lower.includes('exudaci') || lower.includes('sangrante') || lower.includes('liquenific') || lower.includes('generalizado');
      const hasSleepDisruption =
        lower.includes('sueño') || lower.includes('no duerme') || lower.includes('despert') || lower.includes('llanto') || lower.includes('nocturno');
      const hasHighPotencySteroid =
        lower.includes('betametasona') || lower.includes('clobetasol') || lower.includes('mometasona') || lower.includes('deflazacort');
      const hasReboundOrRefractory =
        lower.includes('rebote') || lower.includes('refractari') || lower.includes('recaída') || lower.includes('sin remisi') || lower.includes('empeoramiento');
      const hasComorbidities =
        lower.includes('asma') || lower.includes('sibilan') || lower.includes('rinitis') || lower.includes('alergia');
      const isScabiesOrDifferential =
        lower.includes('escabiosis') || lower.includes('sarna') || lower.includes('interdigital') || lower.includes('permetrina');

      let score = 25;
      const detectedSignals = [];

      if (isScabiesOrDifferential) {
        score = 15;
        detectedSignals.push({
          title: 'Posible diagnóstico alternativo detectado (Escabiosis / Sarna)',
          type: 'differential',
          impact: 'Baja probabilidad de DA primaria'
        });
      } else {
        if (hasSevereLesions) {
          score += 20;
          detectedSignals.push({
            title: 'Lesiones eccematosas con signos de severidad o extensión',
            type: 'lesion',
            impact: '+20% severidad'
          });
        }
        if (hasSleepDisruption) {
          score += 22;
          detectedSignals.push({
            title: 'Disrupción severa del descanso nocturno / llanto continuo',
            type: 'sleep',
            impact: '+22% impacto vital'
          });
        }
        if (hasHighPotencySteroid) {
          score += 20;
          detectedSignals.push({
            title: 'Uso de corticoide tópico de potencia media/alta (Betametasona/Mometasona)',
            type: 'escalation',
            impact: '+20% escalado farmacológico'
          });
        }
        if (hasReboundOrRefractory) {
          score += 18;
          detectedSignals.push({
            title: 'Efecto rebote o refractariedad al tratamiento prescrito',
            type: 'rebound',
            impact: '+18% refractariedad'
          });
        }
        if (hasComorbidities) {
          score += 15;
          detectedSignals.push({
            title: 'Comorbilidades de la marcha atópica (Asma / Rinitis / Alergias)',
            type: 'comorbidity',
            impact: '+15% marcha atópica'
          });
        }
      }

      const finalScore = Math.min(Math.max(score, 12), 95);

      setAnalysisResult({
        score: finalScore,
        riskLevel: finalScore >= 80 ? 'Muy Alto' : finalScore >= 55 ? 'Moderado-Alto' : 'Bajo',
        isReferralRecommended: finalScore >= 70,
        detectedSignals,
        dupixentCandidate: finalScore >= 80 && !isScabiesOrDifferential
      });
      setIsAnalyzing(false);
    }, 600);
  };

  const handleSelectPreset = (preset) => {
    setInputText(preset.text);
    runAnalysis(preset.text);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>Simulador NLP Clínico en Tiempo Real</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Prueba el motor de scoring de RADIANT pegando una evolución médica libre o seleccionando casos típicos pediátricos.
            </p>
          </div>
          <div className="text-xs bg-teal-500/10 text-teal-300 px-3 py-1.5 rounded-xl border border-teal-500/20 font-medium">
            Sistema 02 · Motor de Detección DA
          </div>
        </div>

        {/* Presets Row */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {PRESET_CASES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 hover:border-teal-500/50 transition group"
            >
              <span className="text-xs font-bold text-slate-200 block group-hover:text-teal-300">
                {preset.title}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1 line-clamp-2">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Textarea */}
        <div className="lg:col-span-7 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Texto libre de la evolución médica pediátrica:
            </label>
            <button
              onClick={() => {
                setInputText('');
                setAnalysisResult(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          </div>

          <textarea
            rows="12"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe o pega aquí la nota médica de la consulta..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3.5 text-slate-200 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 flex-1 resize-none"
          ></textarea>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {inputText.split(/\s+/).filter(Boolean).length} palabras analizadas
            </span>
            <button
              onClick={() => runAnalysis()}
              disabled={isAnalyzing || !inputText.trim()}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-teal-500/20 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Extrayendo entidades clínicas...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Analizar con RADIANT AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Results Preview */}
        <div className="lg:col-span-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Resultado de Inferencia & Scoring
            </h3>

            {!analysisResult ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
                <p className="text-xs text-slate-400">
                  Haz clic en "Analizar con RADIANT AI" para evaluar el texto clínico.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Score Gauge Card */}
                <div
                  className={`p-4 rounded-2xl border flex items-center space-x-4 ${
                    analysisResult.score >= 80
                      ? 'bg-rose-950/30 border-rose-500/40'
                      : analysisResult.score >= 55
                      ? 'bg-amber-950/30 border-amber-500/40'
                      : 'bg-emerald-950/30 border-emerald-500/40'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${
                      analysisResult.score >= 80
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : analysisResult.score >= 55
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {analysisResult.score}%
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide block text-slate-300">
                      Riesgo DA Moderada-Severa: {analysisResult.riskLevel}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {analysisResult.isReferralRecommended
                        ? '🚨 Cumple criterios para sugerir derivación precoz a especialista.'
                        : '✅ Compatible con manejo y seguimiento en Atención Primaria.'}
                    </span>
                  </div>
                </div>

                {/* Detected Signals */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Factores Clínicos Detectados ({analysisResult.detectedSignals.length})
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.detectedSignals.map((signal, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-start justify-between text-xs"
                      >
                        <span className="text-slate-300 font-medium">{signal.title}</span>
                        <span className="text-teal-400 font-semibold shrink-0 ml-2">
                          {signal.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Biologic Recommendation Box */}
                {analysisResult.dupixentCandidate && (
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
                    <span className="font-bold text-indigo-300 block mb-1 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Evaluación Candidatura a Terapia Biológica
                    </span>
                    <p className="text-indigo-200/80">
                      El historial refleja refractariedad a corticoides tópicos y alto impacto vital. Candidato adecuado para interconsulta preferente con Dermatología Pediátrica para valorar Dupixent (dupilumab).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center">
            <Info className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
            <span>
              Prototipo de scoring híbrido (NLP semántico + reglas de guías clínicas AEPED/AEDV).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
