import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import {
  Activity,
  AlertTriangle,
  Camera,
  Check,
  ChevronRight,
  Cpu,
  Download,
  Eye,
  FileText,
  Heart,
  Pill,
  Radio,
  Send,
  Sliders,
  Sparkles,
  Thermometer,
  Zap
} from 'lucide-react';

// DATOS DE PRUEBA POR DEFECTO PARA QUE SIEMPRE MUESTRE INFORMACIÓN
const DEFAULT_PATIENTS = [
  {
    id: "PAT-001",
    name: "Sofía Martínez López",
    age: "4 años",
    gender: "Femenino",
    nhc: "894120",
    cohort: "Pediátrica - DA Severa",
    pediatrician: "Dr. Federico",
    riskScore: 88,
    flareScore: 85,
    steroidScore: 72,
    comorbidityScore: 40,
    sleepScore: 90,
    diagnosis: "Dermatitis Atópica grave refractaria",
    evolutionNote: "Paciente acude por empeoramiento de lesiones eccematosas en pliegues antecubitales y poplíteos. Intenso prurito nocturno que interfiere con la calidad del sueño. Sin respuesta a pauta habitual.",
    vitalSigns: { hr: 105, temp: 36.7 },
    flareCount12m: 6,
    corticotherapyLevel: "Alta Potencia",
    atopicMarch: ["Rinitis alérgica", "Asma bronquial leve"],
    prescriptions: [
      { name: "Betametasona dipropionato 0.05%", dosage: "1 app / 12h en brote", category: "Alta Potencia", status: "Refractario" },
      { name: "Emoliente barrera intensivo", dosage: "A demanda tras aseo", category: "Mantenimiento", status: "Continuo" }
    ],
    photoEvolution: [
      {
        id: "IMG-101",
        date: "24 SEP 2026",
        daysAgo: "Hace 6 días",
        location: "Pliegue antecubital derecho",
        imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
        aiSeverityScore: 88,
        aiDiagnosis: "Eritema severo con liquenificación e hiperpigmentación",
        aiComparison: "Punto de inicio de brote agudo",
        status: "Brote Severo",
        quality: "Óptima (Iluminación & Enfoque Validado)"
      },
      {
        id: "IMG-102",
        date: "27 SEP 2026",
        daysAgo: "Hace 3 días",
        location: "Pliegue antecubital derecho",
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
        aiSeverityScore: 74,
        aiDiagnosis: "Disminución moderada del eritema central",
        aiComparison: "▼ 14% reducción del área inflamatoria",
        status: "En Mejora",
        quality: "Óptima"
      },
      {
        id: "IMG-103",
        date: "30 SEP 2026",
        daysAgo: "Hoy",
        location: "Pliegue antecubital derecho",
        imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
        aiSeverityScore: 82,
        aiDiagnosis: "Rebrote papular focal con excoriación activa",
        aiComparison: "▲ 8% incremento en prurito/eritema",
        status: "Rebrote Activo",
        quality: "Óptima"
      }
    ]
  },
  {
    id: "PAT-002",
    name: "Lucas Hernández Gómez",
    age: "7 años",
    gender: "Masculino",
    nhc: "772109",
    cohort: "Pediátrica - Moderada",
    pediatrician: "Dr. Federico",
    riskScore: 62,
    flareScore: 55,
    steroidScore: 45,
    comorbidityScore: 30,
    sleepScore: 50,
    diagnosis: "Dermatitis Atópica moderada",
    evolutionNote: "Control evolutivo satisfactorio tras inicio de tacrolimus tópico. Disminución moderada del eritema en extremidades inferiores.",
    vitalSigns: { hr: 98, temp: 36.5 },
    flareCount12m: 3,
    corticotherapyLevel: "Potencia Media",
    atopicMarch: ["Alergia alimentaria (huevo)"],
    prescriptions: [
      { name: "Tacrolimus 0.03%", dosage: "1 app / 24h", category: "Inmunomodulador", status: "Activo" }
    ],
    photoEvolution: [
      {
        id: "IMG-201",
        date: "15 SEP 2026",
        daysAgo: "Hace 15 días",
        location: "Fosa poplítea izquierda",
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
        aiSeverityScore: 60,
        aiDiagnosis: "Eritema moderado xerótico",
        aiComparison: "Línea base",
        status: "Moderado",
        quality: "Aceptable"
      }
    ]
  }
];

export default function EHRWidgetView({ 
  patients = DEFAULT_PATIENTS, 
  selectedPatient: propSelectedPatient = null, 
  onSelectPatient, 
  onOpenReferral 
}) {
  // Garantizar que siempre haya una lista válida
  const safePatients = (patients && patients.length > 0) ? patients : DEFAULT_PATIENTS;

  const [selectedPatientId, setSelectedPatientId] = useState(
    propSelectedPatient?.id || safePatients[0]?.id || ''
  );
  const [widgetExpanded, setWidgetExpanded] = useState(true);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    if (propSelectedPatient?.id) {
      setSelectedPatientId(propSelectedPatient.id);
    }
  }, [propSelectedPatient]);

  const activePatient = 
    safePatients.find((p) => String(p.id) === String(selectedPatientId)) || 
    propSelectedPatient || 
    safePatients[0];

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

  const flareScore = activePatient.scores?.flareScore ?? activePatient.flareScore ?? 0;
  const steroidScore = activePatient.scores?.steroidScore ?? activePatient.steroidScore ?? 0;
  const comorbidityScore = activePatient.scores?.comorbidityScore ?? activePatient.comorbidityScore ?? 0;
  const sleepScore = activePatient.scores?.sleepScore ?? activePatient.sleepScore ?? 0;
  const riskScore = activePatient.riskScore ?? activePatient.scores?.riskScore ?? 0;

  const renderLedBar = (score, customColorClass = null) => {
    const totalSegments = 12;
    const filledSegments = Math.round((score / 100) * totalSegments);

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
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedPatientId(newId);
              const found = safePatients.find((p) => String(p.id) === String(newId));
              if (found && onSelectPatient) {
                onSelectPatient(found);
              }
            }}
            className="bg-[#070d19] border-2 border-cyan-600/60 text-cyan-200 font-mono text-xs font-black rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-lg transition"
          >
            {safePatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.age}) — CRITICALITY: {p.riskScore ?? p.scores?.riskScore ?? 0}%
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
            <span>FACULTATIVO: <strong className="text-slate-200">{activePatient.pediatrician || 'Dr. Federicos'}</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-bold">[ ENCRYPTION: ACTIVE ]</span>
          </div>
        </div>

        {/* Player / Patient Profile Bar */}
        <div className="bg-gradient-to-r from-[#070d1a] via-[#0c1830] to-[#040813] border-b border-slate-800 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border-2 border-cyan-400/60 flex items-center justify-center font-mono font-black text-cyan-300 text-2xl shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              {activePatient.name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-lg font-black text-slate-100 tracking-wide font-sans">{activePatient.name}</h1>
                <span className="font-mono text-[11px] font-extrabold text-cyan-300 bg-cyan-950 px-3 py-0.5 rounded-md border border-cyan-500/50">
                  NHC: {activePatient.nhc || activePatient.id}
                </span>
                <span className="text-[11px] font-bold text-slate-300 bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-700">
                  {activePatient.cohort || 'Cohorte Pediátrica'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px] mt-2 font-mono">
                <span>EDAD: <strong className="text-slate-200">{activePatient.age}</strong></span>
                <span>SEXO: <strong className="text-slate-200">{activePatient.gender || activePatient.sex || 'N/A'}</strong></span>
                <span>PESO: <strong className="text-slate-200">{activePatient.weight || '16.5 kg'}</strong></span>
                <span className="text-amber-400 font-sans font-semibold">
                  Alergias: {Array.isArray(activePatient.atopicMarch) ? activePatient.atopicMarch.join(', ') : activePatient.allergies || 'Sin datos'}
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
                    <span className="font-mono text-2xl font-black text-slate-100">
                      {activePatient.vitalSigns?.hr || 102}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">bpm</span>
                  </div>
                </div>

                <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl relative overflow-hidden shadow-inner group hover:border-cyan-500/50 transition">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Temp</span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="font-mono text-2xl font-black text-slate-100">
                      {activePatient.vitalSigns?.temp || 36.6}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">°C</span>
                  </div>
                </div>

                <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl relative overflow-hidden shadow-inner group hover:border-cyan-500/50 transition">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Brotes / 12M</span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="font-mono text-2xl font-black text-rose-400">
                      {activePatient.flareCount12m ?? 0}
                    </span>
                    <span className="text-[10px] text-rose-400/80 font-mono">ep.</span>
                  </div>
                </div>

                <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl relative overflow-hidden shadow-inner group hover:border-cyan-500/50 transition">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Pill className="w-4 h-4 text-emerald-400" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Corticotherapy</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-mono text-xs font-extrabold text-amber-300">
                      {activePatient.corticotherapyLevel || 'Alta Potencia'}
                    </span>
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
                <span className="text-[10px] font-mono text-slate-500">
                  TIMESTAMP: HOY, 10:14H
                </span>
              </div>
              <div className="bg-[#060c1a] border border-slate-800 p-4 rounded-xl text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap relative shadow-inner">
                {activePatient.evolutionNote || 'Sin registros de evolución recientes.'}
              </div>
            </div>
            {/* GALERÍA DE MONITOREO FOTOGRÁFICO EN HOGAR CON IA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-cyan-300 tracking-wider flex items-center gap-2 font-mono uppercase">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  [ PATIENT_HOME_TIMELINE // SEGUIMIENTO VISUAL IA ]
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  LIVE_SYNC_APP
                </span>
              </div>

              {activePatient.photoEvolution && activePatient.photoEvolution.length > 0 ? (
                <div className="space-y-4">
                  {/* Selector de fotos de la línea de tiempo */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {activePatient.photoEvolution.map((photo, idx) => (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`flex-1 min-w-[130px] p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                          selectedPhotoIndex === idx
                            ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'bg-[#060c1a] border-slate-800 hover:border-slate-700 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                          <span className="text-slate-400 font-bold">{photo.daysAgo}</span>
                          <span className="text-cyan-400 font-extrabold">{photo.date}</span>
                        </div>
                        <div className="relative h-16 rounded-lg overflow-hidden border border-slate-700/60 mb-1">
                          <img
                            src={photo.imageUrl}
                            alt={photo.location}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-rose-400 font-bold">
                            {photo.aiSeverityScore}%
                          </div>
                        </div>
                        <p className="text-[9px] font-mono text-slate-300 truncate font-semibold">
                          {photo.location}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Detalle ampliado de la foto seleccionada con análisis IA */}
                  {activePatient.photoEvolution[selectedPhotoIndex] && (
                    <div className="bg-[#050a16] border-2 border-cyan-900/50 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 relative overflow-hidden shadow-2xl">
                      
                      {/* Foto con recuadro táctico estilo HUD */}
                      <div className="md:col-span-5 relative group">
                        <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 shadow-inner h-48 bg-black flex items-center justify-center">
                          <img
                            src={activePatient.photoEvolution[selectedPhotoIndex].imageUrl}
                            alt="Lesión del paciente"
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Superposición táctica simulada por la IA */}
                          <div className="absolute inset-2 border-2 border-dashed border-cyan-400/70 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                            <div className="flex justify-between items-start">
                              <span className="bg-cyan-950/90 text-cyan-300 text-[8px] font-mono px-1.5 py-0.5 rounded border border-cyan-400 font-bold">
                                [ TARGET_ECZEMA_ZONE ]
                              </span>
                              <span className="bg-rose-950/90 text-rose-300 text-[8px] font-mono px-1.5 py-0.5 rounded border border-rose-500 font-bold">
                                SEVERITY: {activePatient.photoEvolution[selectedPhotoIndex].aiSeverityScore}%
                              </span>
                            </div>
                            <div className="text-[8px] font-mono text-emerald-300 bg-black/80 px-1.5 py-0.5 rounded self-start border border-emerald-500/50">
                              ✓ {activePatient.photoEvolution[selectedPhotoIndex].quality}
                            </div>
                          </div>
                        </div>
                        <p className="text-[9px] font-mono text-slate-400 mt-2 text-center">
                          Capturado en hogar vía app paciente • {activePatient.photoEvolution[selectedPhotoIndex].location}
                        </p>
                      </div>

                      {/* Tarjeta de interpretación de la IA */}
                      <div className="md:col-span-7 space-y-2.5 flex flex-col justify-between font-mono">
                        <div>
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                            <span className="text-[10px] text-cyan-300 font-extrabold flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                              DIAGNÓSTICO VISUAL DE LA IA
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-600">
                              {activePatient.photoEvolution[selectedPhotoIndex].status}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[11px]">
                            <p className="text-slate-200 font-sans leading-snug">
                              <strong className="text-cyan-400 font-mono">Patrón detectado:</strong>{' '}
                              {activePatient.photoEvolution[selectedPhotoIndex].aiDiagnosis}
                            </p>
                            <div className="bg-[#02050b] p-2 rounded-lg border border-slate-800 text-[10px]">
                              <span className="text-slate-400">Comparativa evolutiva: </span>
                              <span className="text-amber-300 font-bold">
                                {activePatient.photoEvolution[selectedPhotoIndex].aiComparison}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-lg text-[9px] text-slate-300 flex items-center justify-between">
                          <span>Confianza del modelo de visión: <strong>96.4%</strong></span>
                          <span className="text-cyan-400 font-bold">[ MODEL: CLAUDE-3.5-VISION ]</span>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-[#060c1a] border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
                  [ SIN FOTOS DE SEGUIMIENTO ENVIADAS DESDE EL HOGAR ]
                </div>
              )}
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
                    {activePatient.prescriptions && activePatient.prescriptions.length > 0 ? (
                      activePatient.prescriptions.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 font-bold text-slate-100">{med.name}</td>
                          <td className="p-3 font-mono text-[11px]">{med.dosage}</td>
                          <td className="p-3 font-mono text-[11px] text-rose-400 font-bold">{med.category}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/40">
                              {med.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="hover:bg-slate-900/50 transition">
                        <td className="p-3 font-bold text-slate-100">Tratamiento estándar</td>
                        <td className="p-3 font-mono text-[11px]">Según pauta</td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">Mantenimiento</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                            Activo
                          </span>
                        </td>
                      </tr>
                    )}
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
                  riskScore >= 80
                    ? 'bg-rose-950/30 border-rose-600/60 text-rose-200'
                    : 'bg-amber-950/30 border-amber-600/60 text-amber-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-rose-400" />
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400">Índice Severidad:</span>
                        <span className="font-mono font-black text-base text-rose-400 bg-rose-950/90 px-3 py-0.5 rounded border border-rose-500">
                          {riskScore}%
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-200 font-sans pt-1">
                        Compatibilidad clínica alta con <strong className="text-cyan-300">{activePatient.diagnosis || 'Dermatitis Atópica refractaria'}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN DE BARRAS LED CON CÓDIGO DE COLORES */}
                <div className="bg-[#02050a] border border-slate-800 rounded-xl p-4 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                      BARRAS LED DE RIESGO
                    </span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1.5">
                        <span className="text-slate-300 font-bold">FRECUENCIA DE BROTES</span>
                        <span className="text-rose-400 font-black">{flareScore}%</span>
                      </div>
                      {renderLedBar(flareScore, 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]')}
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1.5">
                        <span className="text-slate-300 font-bold">ESCALADO CORTICOIDEO</span>
                        <span className="text-amber-400 font-black">{steroidScore}%</span>
                      </div>
                      {renderLedBar(steroidScore, 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]')}
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1.5">
                        <span className="text-slate-300 font-bold">MARCHA ATÓPICA / COMORB.</span>
                        <span className="text-emerald-400 font-black">{comorbidityScore}%</span>
                      </div>
                      {renderLedBar(comorbidityScore, 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]')}
                    </div>

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
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-xl border border-cyan-400/50 shadow-xl shadow-cyan-950/60 flex items-center justify-center gap-2 transition-all duration-300 uppercase font-mono tracking-wider cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Emitir Interconsulta Directa</span>
                </button>

                <button
                  onClick={() => onSelectPatient && onSelectPatient(activePatient)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition duration-200 font-mono text-[11px] cursor-pointer"
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

