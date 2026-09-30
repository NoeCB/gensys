import React, { useState } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import PatientTable from './components/PatientTable';
import EHRWidgetView from './components/EHRWidgetView';
import LivePlayground from './components/LivePlayground';
import ArchitectureView from './components/ArchitectureView';

export default function App() {
  const [activeTab, setActiveTab] = useState('triage');
  const [currentRole, setCurrentRole] = useState('pediatra');
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="min-h-screen bg-[#020612] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Barra de navegación superior */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentRole={currentRole} 
        setCurrentRole={setCurrentRole} 
      />

      {/* Contenido según la pestaña activa */}
      <main className="max-w-[1700px] mx-auto p-4 sm:p-6">
        
        {/* PESTAÑA 1: Bandeja de Triage */}
        {activeTab === 'triage' && (
          <div className="space-y-6">
            <KPICards />
            <PatientTable 
              currentRole={currentRole} 
              onSelectPatient={(patient) => {
                setSelectedPatient(patient);
                setActiveTab('ehr');
              }} 
            />
          </div>
        )}

        {/* PESTAÑA 2: Widget HCE (SMART) */}
        {activeTab === 'ehr' && (
          <div>
            <EHRWidgetView 
              patient={selectedPatient} 
              currentRole={currentRole}
              onBack={() => setActiveTab('triage')} 
            />
          </div>
        )}

        {/* PESTAÑA 3: Simulador NLP */}
        {activeTab === 'nlp' && (
          <div>
            <LivePlayground />
          </div>
        )}

        {/* PESTAÑA 4: Arquitectura & Equipo */}
        {activeTab === 'arch' && (
          <div>
            <ArchitectureView />
          </div>
        )}

      </main>
    </div>
  );
}