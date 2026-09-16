import React, { useState } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import PatientTable from './components/PatientTable';
import PatientDetailModal from './components/PatientDetailModal';
import ReferralModal from './components/ReferralModal';
import LivePlayground from './components/LivePlayground';
import ArchitectureView from './components/ArchitectureView';
import { MOCK_PATIENTS } from './data/patientsData';
import { GitBranch, Sparkles } from 'lucide-react';

export default function App() {
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [referralPatient, setReferralPatient] = useState(null);
  const [currentTab, setCurrentTab] = useState('triage'); // 'triage' | 'playground' | 'architecture'
  const [activeRole, setActiveRole] = useState('pediatra'); // 'pediatra' | 'dermatologo'

  // Update patient status (Aceptada / Descartada) with feedback
  const handleUpdatePatientStatus = (patientId, newStatus, feedbackData) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: newStatus,
            feedbackHistory: [...(p.feedbackHistory || []), feedbackData]
          };
        }
        return p;
      })
    );

    // If this patient was selected in modal, update selection
    setSelectedPatient((prev) => (prev && prev.id === patientId ? { ...prev, status: newStatus } : prev));
  };

  const handleOpenReferral = (patient) => {
    setReferralPatient(patient);
  };

  const handleConfirmReferral = (patientId) => {
    handleUpdatePatientStatus(patientId, 'Aceptada', {
      reason: 'derivacion_emitida',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Triage Tab */}
        {currentTab === 'triage' && (
          <div className="space-y-6">
            <KPICards activeRole={activeRole} />
            <PatientTable
              patients={patients}
              onSelectPatient={(patient) => setSelectedPatient(patient)}
            />
          </div>
        )}

        {/* Live Playground Tab */}
        {currentTab === 'playground' && <LivePlayground />}

        {/* Architecture & Team Tab */}
        {currentTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          activeRole={activeRole}
          onClose={() => setSelectedPatient(null)}
          onOpenReferral={(patient) => {
            setSelectedPatient(null);
            handleOpenReferral(patient);
          }}
          onUpdateStatus={handleUpdatePatientStatus}
        />
      )}

      {/* Referral Modal */}
      {referralPatient && (
        <ReferralModal
          patient={referralPatient}
          onClose={() => setReferralPatient(null)}
          onConfirmReferral={handleConfirmReferral}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">RADIANT</span>
            <span>•</span>
            <span>Piloto de IA para Derivación Pediátrica en Dermatitis Atópica</span>
            <span>•</span>
            <span className="text-teal-400 font-semibold">Sanofi Immunology</span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <span className="flex items-center text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-mono">
              <GitBranch className="w-3 h-3 mr-1" /> rama: noe-dev
            </span>
            <span>Equipos: ana-dev · silvia-dev · noe-dev</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
