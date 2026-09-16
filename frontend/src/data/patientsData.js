// Mock Pediatric Patients Cohort for RADIANT
export const MOCK_PATIENTS = [
  {
    id: "PAC-2026-081",
    nhc: "4829104",
    name: "Lucas Gómez V.",
    age: "4 años",
    ageMonths: 48,
    cohort: "Preescolar (2-6 años)",
    gender: "Masculino",
    weight: "16.2 kg",
    pediatrician: "Dr. Carlos Mendoza - C.S. Chamberí",
    riskScore: 91,
    riskLevel: "Muy Alto",
    status: "Pendiente",
    lastVisitDate: "14/09/2026",
    flareCount12m: 6,
    steroidEscalation: "Alta potencia (Betametasona dipropionato 0.05%) con refractariedad",
    sleepImpact: "Severo (despertares ≥5 noches/sem, llanto nocturno)",
    atopicMarch: ["Dermatitis atópica recurrente", "Asma alérgica episódica", "Rinitis alérgica"],
    currentTreatment: "Betametasona dipropionato tópica + Emolientes intensivos",
    keyTriggers: [
      "Refractariedad a corticoides tópicos de potencia media y escalado a clase III",
      "Marcha atópica completa: Asma bronquial infantil + Rinitis alérgica perenne",
      "Impacto crítico en descanso nocturno (>5 noches/semana con prurito incoercible)",
      "Frecuencia de brotes incontrolada (6 episodios registrados en 12 meses)"
    ],
    dupixentEligibility: {
      meetsAge: true, // >= 6 meses
      meetsSeverity: true, // DA moderada-severa
      failedTopicals: true, // Fracaso corticoides topicos
      score: "Candidato idóneo a evaluación biológica (Dupixent / dupilumab)"
    },
    evolutionNote: `Acude con su madre por nuevo empeoramiento agudo de lesiones eccematosas exudativas y liquenificadas en pliegues antecubitales, huecos poplíteos y cuello. Prurito incoercible con excoriaciones por rascado continuo que impide el descanso nocturno (duerme menos de 4 horas seguidas desde hace dos semanas). 
    
Antecedentes de asma bronquial con sibilancias recurrentes y rinitis alérgica perenne. 
    
Ha completado dos tandas de hidrocortisona 1% y furoato de mometasona sin remisión duradera. Se pautó betametasona dipropionato tópica hace 20 días con alivio transitorio, sufriendo recaída severa al espaciar aplicaciones. La madre refiere absentismo en escuela infantil y fatiga diurna acusada. Sospecha de DA moderada-severa pediátrica refractaria a corticoterapia tópica habitual.`,
    nlpEntities: [
      { text: "lesiones eccematosas exudativas y liquenificadas", category: "lesion", type: "Lesión clínica severa" },
      { text: "pliegues antecubitales, huecos poplíteos y cuello", category: "location", type: "Localización flexural típica" },
      { text: "Prurito incoercible con excoriaciones", category: "symptom", type: "Prurito refractario" },
      { text: "impide el descanso nocturno (duerme menos de 4 horas)", category: "sleep", type: "Disrupción severa del sueño" },
      { text: "asma bronquial con sibilancias recurrentes", category: "comorbidity", type: "Comorbilidad: Marcha atópica" },
      { text: "rinitis alérgica perenne", category: "comorbidity", type: "Comorbilidad atópica" },
      { text: "furoato de mometasona sin remisión duradera", category: "escalation", type: "Fracaso a corticoide potencia media" },
      { text: "betametasona dipropionato tópica hace 20 días con alivio transitorio", category: "escalation", type: "Escalado a corticoide potente (Clase III)" },
      { text: "recaída severa al espaciar aplicaciones", category: "rebound", type: "Efecto rebote / Refractariedad" },
      { text: "absentismo en escuela infantil", category: "qol", type: "Impacto en calidad de vida" }
    ],
    timeline: [
      { date: "Oct 2024", age: "2 años", event: "Diagnóstico inicial de eccema atópico en mejillas. Pautada hidrocortisona 1%." },
      { date: "Feb 2025", age: "2.5 años", event: "Brote flexural con prurito moderado. Primer episodio de bronquitis sibilante." },
      { date: "Jun 2025", age: "3 años", event: "Escalado a furoato de mometasona. Diagnóstico formal de rinitis alérgica (marcha atópica)." },
      { date: "Nov 2025", age: "3.5 años", event: "Dos brotes consecutivos en 4 semanas. Afectación del sueño. Consulta en urgencias por eccema sobreinfectado." },
      { date: "Abr 2026", age: "4 años", event: "Paso a betametasona dipropionato por falta de control. Corticodependencia evidente." },
      { date: "Sep 2026", age: "4 años", event: "Brote actual muy severo. RADIANT levanta alerta: Score 91% DA Moderada-Severa." }
    ],
    scores: {
      cdlqi: 19, // de 30 (impacto severo)
      flareScore: 95,
      steroidScore: 92,
      comorbidityScore: 88,
      sleepScore: 90
    }
  },
  {
    id: "PAC-2026-114",
    nhc: "5109281",
    name: "Sofía Martín D.",
    age: "18 meses",
    ageMonths: 18,
    cohort: "Lactantes (6m - 2 años)",
    gender: "Femenino",
    weight: "10.8 kg",
    pediatrician: "Dra. Isabel Benítez - C.S. Goya",
    riskScore: 84,
    riskLevel: "Alto",
    status: "Pendiente",
    lastVisitDate: "12/09/2026",
    flareCount12m: 4,
    steroidEscalation: "Uso continuo de hidrocortisona con corticofobia familiar",
    sleepImpact: "Severo (irritabilidad nocturna continua)",
    atopicMarch: ["Dermatitis atópica extensa", "Alergia a proteína leche vaca (APLV)"],
    currentTreatment: "Hidrocortisona acetato 1% intermitente + crema barrera",
    keyTriggers: [
      "Lactante de 18 meses con >4 brotes agudos en los últimos 6 meses",
      "Comorbilidad digestiva atópica confirmada (APLV)",
      "Corticofobia familiar por miedo a efectos secundarios sistémicos",
      "Afectación del ritmo de sueño y percentil de ganancia ponderal"
    ],
    dupixentEligibility: {
      meetsAge: true, // Dupilumab aprobado desde >= 6 meses
      meetsSeverity: true,
      failedTopicals: true,
      score: "Candidata pediátrica a evaluación especializada precoz"
    },
    evolutionNote: `Lactante de 18 meses traída por eccema recurrente facial, cuero cabelludo y cara anterior de extremidades. Madre desbordada: la niña llora y se rasca vigorosamente contra las sábanas por la noche, provocándose sangrado puntual. 
    
Diagnóstico previo de alergia a PLV a los 5 meses. 
    
Ha recibido múltiples tandas de hidrocortisona al 1%. Los padres refieren mucho temor a seguir aplicando corticoides en la cara por adelgazamiento de la piel (corticofobia). Emolientes no logran espaciar los brotes. Se observa estancamiento ponderal en las últimas revisiones atribuible al mal descanso y estrés crónico.`,
    nlpEntities: [
      { text: "eccema recurrente facial, cuero cabelludo y cara anterior de extremidades", category: "lesion", type: "Afectación facial y extremidades" },
      { text: "se rasca vigorosamente contra las sábanas por la noche", category: "sleep", type: "Prurito nocturno severo" },
      { text: "alergia a PLV a los 5 meses", category: "comorbidity", type: "Alergia alimentaria (APLV)" },
      { text: "múltiples tandas de hidrocortisona al 1%", category: "escalation", type: "Uso recurrente de corticoide" },
      { text: "temor a seguir aplicando corticoides en la cara (corticofobia)", category: "escalation", type: "Corticofobia familiar documentada" },
      { text: "estancamiento ponderal atribuible al mal descanso", category: "qol", type: "Afectación del desarrollo / Calidad de vida" }
    ],
    timeline: [
      { date: "May 2025", age: "5 meses", event: "Reacción APLV al iniciar lactancia mixta. Primeras placas de eccema." },
      { date: "Sep 2025", age: "9 meses", event: "Brote facial severo. Prescripción de hidrocortisona 1%." },
      { date: "Ene 2026", age: "13 meses", event: "Extensión a tronco y extremidades. Dificultad para conciliar el sueño." },
      { date: "Sep 2026", age: "18 meses", event: "Alerta RADIANT: Riesgo 84%. Detección de lactante candidata a derivación temprana." }
    ],
    scores: {
      cdlqi: 16,
      flareScore: 82,
      steroidScore: 79,
      comorbidityScore: 86,
      sleepScore: 89
    }
  },
  {
    id: "PAC-2026-042",
    nhc: "3920194",
    name: "Emma Torres P.",
    age: "13 años",
    ageMonths: 156,
    cohort: "Adolescentes (12+ años)",
    gender: "Femenino",
    weight: "44.5 kg",
    pediatrician: "Dr. Carlos Mendoza - C.S. Chamberí",
    riskScore: 94,
    riskLevel: "Muy Alto",
    status: "Aceptada",
    lastVisitDate: "09/09/2026",
    flareCount12m: 8,
    steroidEscalation: "Refractaria a tacrolimus tópico + 2 ciclos de deflazacort oral",
    sleepImpact: "Severo (insomnio de conciliación y mantenimiento)",
    atopicMarch: ["Dermatitis atópica severa crónica", "Asma persistente moderada", "Rinoconjuntivitis alérgica"],
    currentTreatment: "Tacrolimus 0.1% + Mometasona en cura oclusiva + Antihistamínico H1",
    keyTriggers: [
      "Dermatitis atópica severa con afectación persistente de manos, párpados y cuello",
      "Necesidad de corticoides orales de rescate (deflazacort)",
      "Refractaria a inhibidores tópicos de la calcineurina (tacrolimus)",
      "Severo impacto psicosocial y absentismo escolar documentado (CDLQI 24/30)"
    ],
    dupixentEligibility: {
      meetsAge: true,
      meetsSeverity: true,
      failedTopicals: true,
      score: "Candidata confirmada a Dupixent pediátrico (300mg / 200mg sc)"
    },
    evolutionNote: `Paciente de 13 años en seguimiento por DA severa recalcitrante. Presenta eccema generalizado con afectación facial desfigurante, párpados y manos agrietadas que limitan la escritura. Ha requerido dos ciclos cortos de deflazacort oral en lo que va de año por brotes hiperagudos. 
    
Fracaso a tacrolimus 0.1% por sensación urente intolerable y falta de aclaramiento cutáneo. Asocia asma mal controlada con uso frecuente de salbutamol de rescate. 
    
Evaluación psicológica refleja aislamiento social y rechazo a actividades físicas. Pediatra acuerda con dermatólogo la derivación urgente para inicio de terapia biológica sistémica.`,
    nlpEntities: [
      { text: "eccema generalizado con afectación facial desfigurante, párpados y manos", category: "lesion", type: "Afectación en áreas visibles y críticas" },
      { text: "dos ciclos cortos de deflazacort oral", category: "escalation", type: "Uso de corticoides sistémicos orales" },
      { text: "Fracaso a tacrolimus 0.1% por sensación urente y falta de control", category: "escalation", type: "Refractariedad a inhibidor de calcineurina" },
      { text: "asma mal controlada con uso frecuente de salbutamol", category: "comorbidity", type: "Asma atópica coexistente" },
      { text: "aislamiento social y rechazo a actividades físicas", category: "qol", type: "Impacto psicosocial severo" }
    ],
    timeline: [
      { date: "2018-2022", age: "5-9 años", event: "Evolución de eccema flexural controlado con corticoides intermitentes." },
      { date: "2023", age: "10 años", event: "Empeoramiento peripuberal. Primer ciclo de corticoterapia oral de rescate." },
      { date: "2024", age: "11 años", event: "Prueba terapéutica con tacrolimus tópico sin éxito. CDLQI > 20." },
      { date: "Sep 2026", age: "13 años", event: "Derivación aceptada por Dermatología Pediátrica tras alerta RADIANT 94%." }
    ],
    scores: {
      cdlqi: 24,
      flareScore: 98,
      steroidScore: 96,
      comorbidityScore: 92,
      sleepScore: 91
    }
  },
  {
    id: "PAC-2026-177",
    nhc: "6021845",
    name: "Mateo Ruiz L.",
    age: "7 años",
    ageMonths: 84,
    cohort: "Escolar (6-11 años)",
    gender: "Masculino",
    weight: "24.5 kg",
    pediatrician: "Dra. Isabel Benítez - C.S. Goya",
    riskScore: 76,
    riskLevel: "Moderado-Alto",
    status: "En Seguimiento",
    lastVisitDate: "05/09/2026",
    flareCount12m: 3,
    steroidEscalation: "Mometasona crema pautada en tandas periódicas",
    sleepImpact: "Moderado (prurito ocasional al acostarse)",
    atopicMarch: ["Dermatitis atópica flexural", "Rinitis alérgica a pólenes"],
    currentTreatment: "Furoato de mometasona crema + loción hidratante diaria",
    keyTriggers: [
      "Brotes moderados repetidos en cambios estacionales de primavera y otoño",
      "Comorbilidad de rinitis alérgica polínica",
      "Control parcial con corticoide tópico de potencia media",
      "Requiere monitorización activa de recurrencia en próximos 3 meses"
    ],
    dupixentEligibility: {
      meetsAge: true,
      meetsSeverity: false, // Actualmente en límite moderado
      failedTopicals: false, // Aun responde parcialmente a tópicos
      score: "Mantener en observación clínica con soporte RADIANT"
    },
    evolutionNote: `Niño de 7 años acude a revisión por lesiones descamativas en huecos poplíteos y dorso de tobillos tras campamento de verano. Prurito moderado que interfiere puntualmente con el inicio del sueño pero sin despertares frecuentes. 
    
Ha utilizado mometasona crema 5 días con remisión casi completa de la placa principal. Rinitis estacional en tratamiento con antihistamínico oral. 
    
No datos de infección bacteriana. Buen estado general. Se recomienda mantener hidratación con emoliente rico en ceramidas y control en 3 meses si no hay nuevos brotes.`,
    nlpEntities: [
      { text: "lesiones descamativas en huecos poplíteos y dorso de tobillos", category: "lesion", type: "Lesión flexural moderada" },
      { text: "Prurito moderado que interfiere puntualmente con el sueño", category: "sleep", type: "Afectación de sueño leve-moderada" },
      { text: "mometasona crema 5 días con remisión casi completa", category: "escalation", type: "Respuesta favorable a corticoide tópico" },
      { text: "Rinitis estacional con antihistamínico", category: "comorbidity", type: "Comorbilidad atópica controlada" }
    ],
    timeline: [
      { date: "May 2023", age: "4 años", event: "Primer brote flexural diagnosticado como dermatitis atópica." },
      { date: "Mar 2025", age: "6 años", event: "Rinitis alérgica a gramíneas y olivo." },
      { date: "Sep 2026", age: "7 años", event: "Score 76% (Moderado-Alto). En seguimiento activo." }
    ],
    scores: {
      cdlqi: 9,
      flareScore: 68,
      steroidScore: 64,
      comorbidityScore: 72,
      sleepScore: 55
    }
  },
  {
    id: "PAC-2026-203",
    nhc: "7219034",
    name: "Leo Navarro S.",
    age: "2 años",
    ageMonths: 24,
    cohort: "Preescolar (2-6 años)",
    gender: "Masculino",
    weight: "12.1 kg",
    pediatrician: "Dr. Carlos Mendoza - C.S. Chamberí",
    riskScore: 32,
    riskLevel: "Bajo",
    status: "Descartada",
    lastVisitDate: "02/09/2026",
    flareCount12m: 1,
    steroidEscalation: "Ninguno (solo emolientes y crema con hidrocortisona puntual)",
    sleepImpact: "Ninguno",
    atopicMarch: ["Eccema xerósico leve"],
    currentTreatment: "Bálsamo emoliente 2 veces al día",
    keyTriggers: [
      "Cuadro xerósico leve sin brotes refractarios",
      "Sin comorbilidades atópicas asociadas",
      "Excelente respuesta a medidas higiénicas y crema hidratante",
      "No requiere derivación a dermatología especializada"
    ],
    dupixentEligibility: {
      meetsAge: true,
      meetsSeverity: false,
      failedTopicals: false,
      score: "No indicado: Control adecuado en Atención Primaria"
    },
    evolutionNote: `Lactante de 24 meses traído para revisión del niño sano. La madre consulta por aspereza y sequedad cutánea generalizada con leve eritema en mejillas con el frío. No refiere rascado nocturno ni afectación del descanso.
    
No antecedentes de asma ni alergias alimentarias. Se mantiene con cremas hidratantes formuladas con avena coloidal y se pautó hidrocortisona al 0.5% en dos ocasiones aisladas hace 6 meses con resolución inmediata. 
    
Exploración: piel seca, sin signos de liquenificación ni eccema exudativo. Tranquilo y con percentil 60 de peso y talla.`,
    nlpEntities: [
      { text: "aspereza y sequedad cutánea generalizada", category: "lesion", type: "Xerosis cutánea simple" },
      { text: "No refiere rascado nocturno ni afectación del descanso", category: "sleep", type: "Sueño normal" },
      { text: "No antecedentes de asma ni alergias alimentarias", category: "comorbidity", type: "Ausencia de comorbilidades" },
      { text: "resolución inmediata con hidrocortisona suave", category: "escalation", type: "Respuesta plena a tratamiento básico" }
    ],
    timeline: [
      { date: "Ene 2025", age: "8 meses", event: "Xerosis invernal controlada con crema hidratante." },
      { date: "Sep 2026", age: "24 meses", event: "Score 32% (Bajo). Manejo estándar en consulta pediátrica." }
    ],
    scores: {
      cdlqi: 2,
      flareScore: 20,
      steroidScore: 15,
      comorbidityScore: 10,
      sleepScore: 10
    }
  }
];

export const MOCK_STATS = {
  totalAnalyzed: 184,
  moderateSevereAlerts: 18,
  pendingReview: 6,
  acceptedReferrals: 11,
  rejectedFalsePositives: 1,
  specialistAgreementRate: "91.6%",
  avgDiagnosisAnticipationMonths: "4.4 meses",
  driftStatus: "Estable (PSI < 0.05)"
};
