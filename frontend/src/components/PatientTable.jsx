import React, { useState } from 'react';
import { Search, Filter, AlertCircle, ChevronRight, Sparkles, Moon, Flame, Pill } from 'lucide-react';

export default function PatientTable({ patients, onSelectPatient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [cohortFilter, setCohortFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nhc.includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk =
      riskFilter === 'ALL' ||
      (riskFilter === 'HIGH' && p.riskScore >= 80) ||
      (riskFilter === 'MODERATE' && p.riskScore >= 50 && p.riskScore < 80) ||
      (riskFilter === 'LOW' && p.riskScore < 50);

    const matchesCohort =
      cohortFilter === 'ALL' || p.cohort.toLowerCase().includes(cohortFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || p.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRisk && matchesCohort && matchesStatus;
  });

  const getRiskBadge = (score) => {
    if (score >= 85) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-rose-500 animate-ping"></span>
          {score}% · Muy Alto Riesgo
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-amber-500"></span>
          {score}% · Riesgo Alto
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-yellow-500"></span>
          {score}% · Moderado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
        <span className="w-2 h-2 mr-1.5 rounded-full bg-emerald-400"></span>
        {score}% · Bajo / Leve
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendiente':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Pendiente Revisión
          </span>
        );
      case 'Aceptada':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Derivación Emitida
          </span>
        );
      case 'En Seguimiento':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            En Seguimiento AP
          </span>
        );
      case 'Descartada':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600">
            Descartada / Control
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur">
      {/* Header & Filters */}
      <div className="p-4 sm:p-6 border-b border-slate-700/80 bg-slate-800/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Bandeja de Triage Pediátrico</span>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                {filteredPatients.length} pacientes filtrados
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Pacientes con detección automática de señales de DA moderada-severa en sus HCE
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre, NHC o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 text-slate-100 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-700/50 text-xs">
          <span className="text-slate-400 font-medium flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filtros:
          </span>

          {/* Risk */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">Nivel de Riesgo: Todos</option>
            <option value="HIGH">Muy Alto / Alto (≥70%)</option>
            <option value="MODERATE">Moderado (50-69%)</option>
            <option value="LOW">Bajo (&lt;50%)</option>
          </select>

          {/* Cohort */}
          <select
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">Cohorte de Edad: Todas</option>
            <option value="Lactantes">Lactantes (6m - 2a)</option>
            <option value="Preescolar">Preescolar (2 - 6a)</option>
            <option value="Escolar">Escolar (6 - 11a)</option>
            <option value="Adolescentes">Adolescentes (12+ a)</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">Estado de Alerta: Todos</option>
            <option value="Pendiente">Pendiente de Revisión</option>
            <option value="Aceptada">Derivación Emitida</option>
            <option value="En Seguimiento">En Seguimiento AP</option>
            <option value="Descartada">Descartada</option>
          </select>

          {(searchTerm || riskFilter !== 'ALL' || cohortFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRiskFilter('ALL');
                setCohortFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs text-teal-400 hover:text-teal-300 underline ml-2"
            >
              Restablecer
            </button>
          )}
        </div>
      </div>

      {/* List / Cards */}
      <div className="divide-y divide-slate-800">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500 mb-2" />
            <p className="font-medium text-slate-300">No se encontraron pacientes con los filtros seleccionados</p>
            <p className="text-xs mt-1">Prueba a restablecer los criterios de búsqueda.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="p-4 sm:p-5 hover:bg-slate-800/70 transition-colors cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Column: Patient basic info */}
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold shrink-0 ${
                    patient.riskScore >= 80
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : patient.riskScore >= 50
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {patient.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm sm:text-base hover:text-teal-300">
                      {patient.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700/50">
                      NHC: {patient.nhc}
                    </span>
                    {getStatusBadge(patient.status)}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span>Edad: <strong className="text-slate-200">{patient.age}</strong> ({patient.weight})</span>
                    <span>•</span>
                    <span>Cohorte: <strong className="text-slate-200">{patient.cohort}</strong></span>
                    <span>•</span>
                    <span>Última visita: {patient.lastVisitDate}</span>
                  </div>

                  {/* Clinical highlights row */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {/* Flares indicator */}
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-slate-900/80 text-amber-300 border border-slate-700/60">
                      <Flame className="w-3 h-3 mr-1 text-rose-400" />
                      {patient.flareCount12m} brotes / año
                    </span>

                    {/* Steroid escalation badge */}
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/60">
                      <Pill className="w-3 h-3 mr-1 text-indigo-400" />
                      {patient.steroidEscalation.includes('Alta potencia') ? 'Escalado Potencia Alta' : 'Corticoterapia Tópica'}
                    </span>

                    {/* Sleep disruption badge */}
                    {patient.sleepImpact.includes('Severo') && (
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-slate-900/80 text-purple-300 border border-slate-700/60">
                        <Moon className="w-3 h-3 mr-1 text-purple-400" />
                        Disrupción del sueño severa
                      </span>
                    )}

                    {/* Biologic eligibility indicator */}
                    {patient.dupixentEligibility.meetsSeverity && (
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                        <Sparkles className="w-3 h-3 mr-1 text-teal-400" />
                        Criterios Biológico Pediátrico
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Score, Key Signal & Action */}
              <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pl-16 lg:pl-0 border-t lg:border-t-0 border-slate-800 pt-2 lg:pt-0">
                <div className="text-right">
                  <div className="flex justify-end">{getRiskBadge(patient.riskScore)}</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-xs truncate hidden sm:block">
                    {patient.keyTriggers[0]}
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-700/60 hover:bg-teal-500 hover:text-slate-950 text-slate-200 text-xs font-semibold flex items-center transition-all group"
                  >
                    <span className="hidden sm:inline mr-1">Ver Análisis</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
