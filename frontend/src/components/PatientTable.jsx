import React from 'react';
import { ChevronRight, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

const mockPatients = [
  {
    id: 'PAT-001',
    name: 'Mateo González',
    age: '4 años',
    score: 'Grave (SCORAD 62)',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/50',
    derivacion: 'Urgente a Dermatología',
    time: 'Hace 10 min',
    status: 'Pendiente'
  },
  {
    id: 'PAT-002',
    name: 'Lucía Fernández',
    age: '18 meses',
    score: 'Moderado (SCORAD 38)',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    derivacion: 'Tratamiento AP + Seguimiento',
    time: 'Hace 25 min',
    status: 'En evaluación'
  },
  {
    id: 'PAT-003',
    name: 'Leo Martín',
    age: '6 años',
    score: 'Leve (SCORAD 18)',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    derivacion: 'Cuidado Emoliente',
    time: 'Hace 45 min',
    status: 'Completado'
  },
  {
    id: 'PAT-004',
    name: 'Sofia Ruiz',
    age: '2 años',
    score: 'Grave (SCORAD 58)',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/50',
    derivacion: 'Urgente a Dermatología',
    time: 'Hace 1h',
    status: 'Pendiente'
  }
];

export default function PatientTable({ currentRole, onSelectPatient }) {
  return (
    <div className="bg-[#01040a] border border-cyan-950 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Bandeja de Entrada de Triage Pedriático
          </h2>
          <p className="text-xs text-slate-400">
            Pacientes evaluados por el algoritmo CDSS RADIANT
          </p>
        </div>
        <span className="px-3 py-1 bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded-full text-xs font-mono font-bold">
          {mockPatients.length} Pacientes en Cola
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#030a16] text-xs uppercase font-mono text-cyan-400 border-b border-cyan-900/50">
            <tr>
              <th className="px-4 py-3">ID / Paciente</th>
              <th className="px-4 py-3">Edad</th>
              <th className="px-4 py-3">Estratificación IA</th>
              <th className="px-4 py-3">Recomendación</th>
              <th className="px-4 py-3">Tiempo</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {mockPatients.map((patient) => (
              <tr 
                key={patient.id} 
                onClick={() => onSelectPatient && onSelectPatient(patient)}
                className="hover:bg-cyan-950/30 transition-colors cursor-pointer group"
              >
                <td className="px-4 py-3 font-medium text-white">
                  <div>{patient.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">{patient.id}</div>
                </td>
                <td className="px-4 py-3 text-slate-400">{patient.age}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono border ${patient.badgeColor}`}>
                    {patient.score}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 font-sans">{patient.derivacion}</td>
                <td className="px-4 py-3 text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {patient.time}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all">
                    Ver Historia SMART
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}