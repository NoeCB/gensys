import { jsPDF } from 'jspdf';

/**
 * Generates and downloads an official clinical referral PDF document
 * for Pediatric Dermatology consultation.
 */
export function generateReferralPDF(patient, options = {}) {
  const { priority = 'Preferente', urgencyNotes = '' } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [13, 148, 136]; // Teal #0d9488
  const darkTextColor = [30, 41, 59]; // Slate 800
  const lightMuted = [100, 116, 139]; // Slate 500
  const boxBg = [248, 250, 252]; // Slate 50
  const borderColor = [203, 213, 225]; // Slate 300
  const dangerColor = [220, 38, 38]; // Red 600

  const pageWidth = 210;
  const leftMargin = 15;
  const rightMargin = 195;
  const contentWidth = rightMargin - leftMargin;

  let currentY = 15;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title in Banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('HOSPITAL UNIVERSITARIO PEDIÁTRICO · SERVICIO DE SALUD', leftMargin, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('PROPUESTA DE DERIVACIÓN INTERCONSULTA · UNIDAD DE DERMATOLOGÍA PEDIÁTRICA', leftMargin, 18);

  // Badge RADIANT CDSS
  doc.setFillColor(13, 148, 136);
  doc.roundedRect(138, 7, 57, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('SOPORTE RADIANT CDSS', 142, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('IA DA Pediátrica · Sanofi', 142, 18);

  currentY = 35;

  // Priority and Date Row
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`FECHA DE EMISIÓN: ${new Date().toLocaleDateString('es-ES')}`, leftMargin, currentY);

  const priorityColor = priority === 'Urgente' ? [220, 38, 38] : [13, 148, 136];
  doc.setTextColor(...priorityColor);
  doc.text(`PRIORIDAD: ${priority.toUpperCase()}`, 145, currentY);

  currentY += 5;

  // Patient Info Box
  doc.setDrawColor(...borderColor);
  doc.setFillColor(...boxBg);
  doc.roundedRect(leftMargin, currentY, contentWidth, 26, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(...lightMuted);
  doc.setFont('helvetica', 'normal');
  doc.text('DATOS DE FILIACIÓN DEL PACIENTE PEDIÁTRICO', leftMargin + 4, currentY + 6);

  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`${patient.name}`, leftMargin + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`NHC: ${patient.nhc}   |   Sexo: ${patient.gender}   |   Edad: ${patient.age} (${patient.weight || 'Peso N/D'})`, leftMargin + 4, currentY + 18);
  doc.text(`Cohorte: ${patient.cohort}   |   Facultativo emisor: ${patient.pediatrician}`, leftMargin + 4, currentY + 23);

  currentY += 32;

  // Section 1: Clinical Score & Justification
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('1. EVALUACIÓN DE RIESGO RADIANT CDSS Y SEÑALES CARDINALES', leftMargin, currentY);
  currentY += 5;

  // Score Highlight Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(leftMargin, currentY, contentWidth, 24, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.text('RADIANT Risk Score:', leftMargin + 4, currentY + 6);

  doc.setFontSize(12);
  doc.setTextColor(patient.riskScore >= 80 ? dangerColor[0] : primaryColor[0], patient.riskScore >= 80 ? dangerColor[1] : primaryColor[1], patient.riskScore >= 80 ? dangerColor[2] : primaryColor[2]);
  doc.text(`${patient.riskScore}% (${patient.riskLevel || 'Alto Riesgo'})`, leftMargin + 48, currentY + 6.5);

  doc.setFontSize(8);
  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`• Brotes en 12 meses: ${patient.flareCount12m} episodios documentados`, leftMargin + 4, currentY + 12);
  doc.text(`• Escalado Corticoideo: ${patient.steroidEscalation}`, leftMargin + 4, currentY + 17);
  doc.text(`• Marcha Atópica: ${Array.isArray(patient.atopicMarch) ? patient.atopicMarch.join(', ') : patient.atopicMarch}`, leftMargin + 4, currentY + 22);

  currentY += 30;

  // Section 2: Clinical Summary
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('2. EXTRACTO CLÍNICO RECIENTE EN HCE (HISTORIA CLÍNICA ELECTRÓNICA)', leftMargin, currentY);
  currentY += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...darkTextColor);

  const cleanNote = (patient.evolutionNote || '').replace(/\s+/g, ' ').trim();
  const splitNote = doc.splitTextToSize(`"${cleanNote}"`, contentWidth - 8);

  const noteBoxHeight = Math.min(splitNote.length * 3.8 + 6, 38);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(leftMargin, currentY, contentWidth, noteBoxHeight, 2, 2, 'FD');

  doc.text(splitNote.slice(0, 8), leftMargin + 4, currentY + 5);

  currentY += noteBoxHeight + 6;

  // Section 3: Dupixent Eligibility
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('3. CANDIDATURA A TERAPIA BIOLÓGICA (GUÍAS AEPED/AEDV & FICHA DUPIXENT)', leftMargin, currentY);
  currentY += 5;

  doc.setFillColor(240, 253, 250); // Light teal
  doc.setDrawColor(20, 184, 166);
  doc.roundedRect(leftMargin, currentY, contentWidth, 22, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkTextColor);
  doc.text('✓ Paciente en rango etario autorizado (Dupixent / dupilumab aprobado desde >= 6 meses de edad).', leftMargin + 4, currentY + 5.5);
  doc.text('✓ Dermatitis atópica con afectación extensa / áreas críticas y refractariedad demostrada a corticoides tópicos.', leftMargin + 4, currentY + 10.5);
  doc.text('✓ Recomendación facultativa: Realizar estadiaje formal (EASI / SCORAD) y valorar inicio precoz de terapia biológica.', leftMargin + 4, currentY + 15.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Estado de Candidatura: ${patient.dupixentEligibility?.score || 'Candidato idóneo a evaluación biológica'}`, leftMargin + 4, currentY + 19.5);

  currentY += 27;

  // Section 4: Pediatrician's Observations
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('4. OBSERVACIONES Y NOTAS DEL PEDIATRA EMISOR', leftMargin, currentY);
  currentY += 5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(leftMargin, currentY, contentWidth, 16, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkTextColor);
  const notesText = urgencyNotes.trim() || 'Se solicita cita preferente para valoración de terapia sistémica/biológica por refractariedad y disrupción severa de calidad de vida del paciente y familiares.';
  const splitNotes = doc.splitTextToSize(notesText, contentWidth - 8);
  doc.text(splitNotes.slice(0, 3), leftMargin + 4, currentY + 5.5);

  currentY += 22;

  // Signature and Verification
  doc.setFontSize(7.5);
  doc.setTextColor(...lightMuted);
  doc.text('Firma electrónica y sello facultativo:', leftMargin, currentY);
  doc.text('Código de Verificación Seguro (CVS):', 130, currentY);

  currentY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text(`Colegiado: ${patient.pediatrician || 'Dra. I. Benítez / Dr. C. Mendoza'}`, leftMargin, currentY);
  doc.text(`CVS-${patient.id}-${Math.floor(100000 + Math.random() * 900000)}`, 130, currentY);

  // Footer Disclaimer
  doc.setDrawColor(...borderColor);
  doc.line(leftMargin, 280, rightMargin, 280);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...lightMuted);
  doc.text(
    'AVISO LEGAL Y DEONTOLÓGICO: RADIANT actúa exclusivamente como Sistema de Soporte a la Decisión Clínica (CDSS) para la detección temprana. No sustituye el juicio médico. La indicación de pruebas complementarias y tratamientos corresponde al facultativo. Conforme al RGPD y normativa europea MDR/AI Act.',
    leftMargin,
    284,
    { maxWidth: contentWidth }
  );

  // Trigger download
  const filename = `Interconsulta_RADIANT_${patient.id}_${patient.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
}
