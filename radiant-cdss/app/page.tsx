'use client';

import React, { useState } from 'react';
import {
  Activity,
  Brain,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Heart,
  ImageIcon,
  Info,
  Loader2,
  Mic,
  Sparkles,
  Stethoscope,
  Thermometer,
  User,
  Wifi,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─────────────────────────────────────────────────────────────────────────────
// Utility: cn() — className merger (shadcn style)
// ─────────────────────────────────────────────────────────────────────────────
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────────────────────
// Types — Clinical Data Models
// ─────────────────────────────────────────────────────────────────────────────
interface VitalSigns {
  frequencyCardiaca: number; // bpm
  presionArterial: string; // "120/80"
  temperatura: number; // °C
  saturacionOxigeno: number; // %
  frecuenciaRespiratoria: number; // rpm
}

interface Patient {
  id: string;
  edad: number;
  sexo: 'M' | 'F';
  antecedentes: string[];
  constantes: VitalSigns;
}

interface Finding {
  id: string;
  tipo: string;
  localizacion: string;
  confianza: number; // 0-100
  severidad: 'baja' | 'media' | 'alta';
}

interface AnalysisResult {
  probabilidadMalignidad: number;
  scoreRiesgo: number;
  hallazgos: Finding[];
  explicabilidad: string;
  timestamp: string;
}

type UIState = 'idle' | 'analyzing' | 'results_ready';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data — Realistic Clinical Scenarios
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PATIENT: Patient = {
  id: 'PAC-84920',
  edad: 58,
  sexo: 'M',
  antecedentes: [
    'Hipertensión arterial',
    'DM tipo 2',
    'Ex fumador (20 paq/año)',
    'Antecedente familiar de CA pulmonar',
  ],
  constantes: {
    frequencyCardiaca: 78,
    presionArterial: '142/88',
    temperatura: 36.8,
    saturacionOxigeno: 96,
    frecuenciaRespiratoria: 16,
  },
};

const MOCK_PENDING_CASES = [
  { id: 'PAC-84920', status: 'active', label: 'Caso activo' },
  { id: 'PAC-85103', status: 'pending', label: 'Pendiente revisión' },
  { id: 'PAC-84792', status: 'pending', label: 'Pendiente revisión' },
  { id: 'PAC-85341', status: 'pending', label: 'Pendiente revisión' },
];

const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  probabilidadMalignidad: 78.4,
  scoreRiesgo: 72,
  timestamp: new Date().toISOString(),
  hallazgos: [
    {
      id: 'HAL-001',
      tipo: 'Nódulo sólido',
      localizacion: 'Lóbulo superior derecho (S2)',
      confianza: 94.2,
      severidad: 'alta',
    },
    {
      id: 'HAL-002',
      tipo: 'Opacidad en vidrio esmerilado',
      localizacion: 'Lóbulo medio ipsilateral',
      confianza: 67.8,
      severidad: 'media',
    },
    {
      id: 'HAL-003',
      tipo: 'Adenopatía hiliar',
      localizacion: 'Hil derecho',
      confianza: 82.1,
      severidad: 'media',
    },
  ],
  explicabilidad:
    'El modelo ha identificado un nódulo sólido de 12mm en el lóbulo superior derecho con márgenes spiculados, característica altamente sugestiva de malignidad. La presencia de opacidad en vidrio esmerilada adyacente y adenopatía hiliar ipsilateral incrementa significativamente el score de probabilidad. El patrón morfológico coincide con un 78.4% de probabilidad de carcinoma broncogénico no de células pequeñas (NSCLC), preferentemente subtype adenocarcinoma.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Components — UI Primitives (shadcn/ui style)
// ─────────────────────────────────────────────────────────────────────────────

function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('bg-white rounded-lg border border-slate-200 shadow-sm', className)}>
      {children}
    </div>
  );
}

function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('px-4 py-3 border-b border-slate-200', className)}>{children}</div>;
}

function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('p-4', className)}>{children}</div>;
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
    secondary: 'bg-cyan-700 text-white hover:bg-cyan-800 focus:ring-cyan-500',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component: VitalSignsBar
// ─────────────────────────────────────────────────────────────────────────────
function VitalSignsBar({ constants }: { constants: VitalSigns }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5 text-slate-600">
        <Heart className="w-4 h-4 text-red-500" />
        <span className="font-medium">{constants.frequencyCardiaca}</span>
        <span className="text-slate-400">lpm</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-600">
        <Activity className="w-4 h-4 text-cyan-600" />
        <span className="font-medium">{constants.presionArterial}</span>
        <span className="text-slate-400">mmHg</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-600">
        <Thermometer className="w-4 h-4 text-amber-500" />
        <span className="font-medium">{constants.temperatura}°C</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-600">
        <Activity className="w-4 h-4 text-teal-500" />
        <span className="font-medium">{constants.saturacionOxigeno}%</span>
        <span className="text-slate-400">SpO₂</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component: ProbabilityGauge
// ─────────────────────────────────────────────────────────────────────────────
function ProbabilityGauge({ value }: { value: number }) {
  const getColor = (val: number) => {
    if (val >= 70) return 'text-red-600';
    if (val >= 40) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getBgColor = (val: number) => {
    if (val >= 70) return 'bg-red-100';
    if (val >= 40) return 'bg-amber-100';
    return 'bg-emerald-100';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={value >= 70 ? '#dc2626' : value >= 40 ? '#d97706' : '#10b981'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-2xl font-bold', getColor(value))}>{value.toFixed(1)}%</span>
        <span className="text-xs text-slate-500">probabilidad</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component: RiskScoreIndicator
// ─────────────────────────────────────────────────────────────────────────────
function RiskScoreIndicator({ score }: { score: number }) {
  const getRiskLevel = (s: number) => {
    if (s >= 70) return { label: 'ALTO', color: 'bg-red-500', text: 'text-red-700' };
    if (s >= 40) return { label: 'MODERADO', color: 'bg-amber-500', text: 'text-amber-700' };
    return { label: 'BAJO', color: 'bg-emerald-500', text: 'text-emerald-700' };
  };

  const risk = getRiskLevel(score);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-1000', risk.color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn('font-semibold text-sm min-w-[80px]', risk.text)}>{risk.label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component: ImageViewer (Placeholder with controls)
// ─────────────────────────────────────────────────────────────────────────────
function ImageViewer({
  showOverlay,
  onToggleOverlay,
}: {
  showOverlay: boolean;
  onToggleOverlay: () => void;
}) {
  const [zoom, setZoom] = useState(100);
  const [contrast, setContrast] = useState(50);
  const [series, setSeries] = useState(1);

  return (
    <Card className="flex-1 flex flex-col min-h-0">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-slate-500" />
          <span className="font-medium text-slate-700">TC Torácico — Corte axial</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">Serie 1/4</Badge>
          <Badge variant="default">Corte 45/120</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative overflow-hidden bg-slate-900">
        {/* Placeholder de imagen médica */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-4/5 h-4/5 bg-slate-800 rounded-lg overflow-hidden">
            {/* Simulación de TC con mapa de calor overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
              {/* Estructuras simuladas */}
              <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-slate-600 rounded-full opacity-60" />
              <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-slate-500 rounded-full opacity-50" />
              <div className="absolute top-1/2 left-2/5 w-24 h-32 bg-slate-600/40 rounded-lg opacity-40" />

              {/* Heatmap overlay si está activo */}
              {showOverlay && (
                <>
                  <div className="absolute top-1/4 left-1/3 w-20 h-20 rounded-full bg-gradient-to-r from-red-500/60 to-orange-500/40 animate-pulse" />
                  <div className="absolute top-1/3 left-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-amber-500/50 to-yellow-500/30" />
                  <div className="absolute top-1/3 left-[55%] w-8 h-8 rounded-full bg-gradient-to-r from-red-600/70 to-pink-500/50 animate-pulse" />
                </>
              )}
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-slate-700/30" />
              ))}
            </div>
          </div>
        </div>

        {/* Controles de visualización */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-slate-800/90 backdrop-blur px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-300 w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Contraste</span>
            <input
              type="range"
              min="0"
              max="100"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSeries((s) => Math.max(1, s - 1))}
              disabled={series === 1}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <span className="text-xs text-slate-300">Serie {series}</span>
            <button
              onClick={() => setSeries((s) => Math.min(4, s + 1))}
              disabled={series === 4}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <button
            onClick={onToggleOverlay}
            aria-pressed={showOverlay}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors',
              showOverlay ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            )}
          >
            {showOverlay ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Heatmap
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component: AnalysisPanel (AI Copilot)
// ─────────────────────────────────────────────────────────────────────────────
function AnalysisPanel({
  state,
  result,
  showOverlay,
  onToggleOverlay,
}: {
  state: UIState;
  result: AnalysisResult | null;
  showOverlay: boolean;
  onToggleOverlay: () => void;
}) {
  if (state === 'idle') {
    return (
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-teal-600" />
            <span className="font-medium text-slate-700">IA Copilot & Detección</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-700 font-medium mb-2">Sin análisis activo</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Seleccione un caso y ejecute el análisis de IA para obtener asistencia en la detección
            de anomalías.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (state === 'analyzing') {
    return (
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-teal-600 animate-pulse" />
            <span className="font-medium text-slate-700">IA Copilot & Detección</span>
            <Badge variant="warning">Procesando</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <Loader2 className="w-16 h-16 text-teal-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-teal-100 rounded-full animate-pulse" />
            </div>
          </div>
          <h3 className="text-slate-700 font-medium mb-2">Análisis en curso</h3>
          <div className="space-y-2 text-sm text-slate-500">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              Preprocesando imagen DICOM...
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              Ejecutando modelo de detección...
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              Generando explicabilidad (XAI)...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // results_ready
  return (
    <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-teal-600" />
            <span className="font-medium text-slate-700">IA Copilot & Detección</span>
            <Badge variant="success">Resultados listos</Badge>
          </div>
          <button
            onClick={onToggleOverlay}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors',
              showOverlay ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' : 'bg-slate-100 text-slate-600 border border-slate-300'
            )}
          >
            {showOverlay ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Heatmap
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Probability & Risk Score */}
        <div className="flex items-start gap-6">
          <ProbabilityGauge value={result!.probabilidadMalignidad} />
          <div className="flex-1 space-y-3">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider">Score de Riesgo</label>
              <RiskScoreIndicator score={result!.scoreRiesgo} />
            </div>
            <div className="text-xs text-slate-400">
              Análisis completado: {new Date(result!.timestamp).toLocaleTimeString('es-ES')}
            </div>
          </div>
        </div>

        {/* Hallazgos */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
            Hallazgos Asistidos
          </label>
          <div className="space-y-2">
            {result!.hallazgos.map((hallazgo) => (
              <div
                key={hallazgo.id}
                className="bg-slate-50 rounded-lg p-3 border border-slate-200"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-slate-700 text-sm">{hallazgo.tipo}</span>
                  <Badge
                    variant={
                      hallazgo.severidad === 'alta'
                        ? 'danger'
                        : hallazgo.severidad === 'media'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {hallazgo.confianza.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{hallazgo.localizacion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explicabilidad XAI */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
            <Info className="w-3 h-3" />
            Razonamiento (XAI)
          </label>
          <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
            <p className="text-sm text-slate-700 leading-relaxed">{result!.explicabilidad}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component: ActionBar
// ─────────────────────────────────────────────────────────────────────────────
function ActionBar({
  state,
  onValidate,
  onModify,
  onAddNotes,
  onSign,
  onAnalyze,
}: {
  state: UIState;
  onValidate: () => void;
  onModify: () => void;
  onAddNotes: () => void;
  onSign: () => void;
  onAnalyze: () => void;
}) {
  return (
    <div className="bg-white border-t border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {state === 'idle' && (
            <Button variant="primary" size="lg" onClick={onAnalyze}>
              <Brain className="w-4 h-4 mr-2" />
              Ejecutar Análisis IA
            </Button>
          )}
          {state === 'results_ready' && (
            <>
              <Button variant="primary" onClick={onValidate}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Validar Hallazgos
              </Button>
              <Button variant="outline" onClick={onModify}>
                <FileText className="w-4 h-4 mr-2" />
                Modificar Diagnóstico
              </Button>
              <Button variant="outline" onClick={onAddNotes}>
                <Stethoscope className="w-4 h-4 mr-2" />
                Añadir Notas Clínicas
              </Button>
              <Button variant="secondary" onClick={onSign}>
                <Mic className="w-4 h-4 mr-2" />
                Firmar Informe
              </Button>
            </>
          )}
        </div>
        <div className="text-xs text-slate-400">
          El médico siempre tiene la última palabra
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component: Header
// ─────────────────────────────────────────────────────────────────────────────
function Header({
  patient,
  pendingCases,
  selectedCase,
  onSelectCase,
  pipelineStatus,
}: {
  patient: Patient;
  pendingCases: typeof MOCK_PENDING_CASES;
  selectedCase: string;
  onSelectCase: (id: string) => void;
  pipelineStatus: 'active' | 'inactive' | 'error';
}) {
  const [caseDropdownOpen, setCaseDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="max-w-7xl mx-auto">
        {/* Top row: Logo, Case selector, Pipeline status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800">RADIANT</span>
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-slate-200" />

            {/* Case selector */}
            <div className="relative">
              <button
                onClick={() => setCaseDropdownOpen(!caseDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700">{selectedCase}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {caseDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {pendingCases.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCase(c.id);
                        setCaseDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between',
                        c.id === selectedCase && 'bg-teal-50'
                      )}
                    >
                      <span className="font-medium text-slate-700">{c.id}</span>
                      <Badge variant={c.status === 'active' ? 'success' : 'default'}>
                        {c.label}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pipeline status */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
                pipelineStatus === 'active' && 'bg-emerald-100 text-emerald-800',
                pipelineStatus === 'inactive' && 'bg-slate-100 text-slate-600',
                pipelineStatus === 'error' && 'bg-red-100 text-red-800'
              )}
            >
              <Wifi className="w-4 h-4" />
              <span className="font-medium">
                {pipelineStatus === 'active' && 'Pipeline AWS Activo'}
                {pipelineStatus === 'inactive' && 'Pipeline inactivo'}
                {pipelineStatus === 'error' && 'Error de conexión'}
              </span>
              {pipelineStatus === 'active' && (
                <span className="text-xs opacity-75">• Inferencia en tiempo real</span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom row: Patient info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-lg">{patient.id}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">
                {patient.edad} años • {patient.sexo === 'M' ? 'Masculino' : 'Femenino'}
              </span>
            </div>
            <div className="w-px h-4 bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Antecedentes:</span>
              <div className="flex gap-1">
                {patient.antecedentes.slice(0, 2).map((ant, i) => (
                  <Badge key={i} variant="default">
                    {ant}
                  </Badge>
                ))}
                {patient.antecedentes.length > 2 && (
                  <Badge variant="default">+{patient.antecedentes.length - 2}</Badge>
                )}
              </div>
            </div>
          </div>
          <VitalSignsBar constants={patient.constantes} />
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function RadiantDashboard() {
  const [uiState, setUiState] = useState<UIState>('idle');
  const [selectedCase, setSelectedCase] = useState('PAC-84920');
  const [pipelineStatus] = useState<'active' | 'inactive' | 'error'>('active');
  const [showOverlay, setShowOverlay] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleRunAnalysis = () => {
    setUiState('analyzing');
    setShowOverlay(false);

    // Simulate AI pipeline processing
    setTimeout(() => {
      setAnalysisResult(MOCK_ANALYSIS_RESULT);
      setUiState('results_ready');
      setShowOverlay(true);
    }, 2500);
  };

  const handleValidate = () => {
    alert('Hallazgos validados por el clínico. Se registrará en el sistema.');
  };

  const handleModify = () => {
    alert('Modal de modificación de diagnóstico abierto.');
  };

  const handleAddNotes = () => {
    alert('Panel de notas clínicas activado.');
  };

  const handleSign = () => {
    alert('Informe firmado electrónicamente.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        patient={MOCK_PATIENT}
        pendingCases={MOCK_PENDING_CASES}
        selectedCase={selectedCase}
        onSelectCase={setSelectedCase}
        pipelineStatus={pipelineStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        <div className="flex gap-6 h-[calc(100vh-220px)] min-h-[500px]">
          <ImageViewer
            showOverlay={showOverlay}
            onToggleOverlay={() => setShowOverlay((v) => !v)}
          />
          <AnalysisPanel
            state={uiState}
            result={analysisResult}
            showOverlay={showOverlay}
            onToggleOverlay={() => setShowOverlay((v) => !v)}
          />
        </div>
      </main>

      <ActionBar
        state={uiState}
        onValidate={handleValidate}
        onModify={handleModify}
        onAddNotes={handleAddNotes}
        onSign={handleSign}
        onAnalyze={handleRunAnalysis}
      />
    </div>
  );
}