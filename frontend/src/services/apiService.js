/**
 * apiService.js
 * ============
 * Capa de abstracción de datos para RADIANT CDSS (Sistema 03).
 * 
 * Permite al frontend operar en modo dual transparente:
 * 1. MOCK_MODE (por defecto): Carga inmediata de la cohorte pediátrica sintética
 *    y simulación NLP reactiva para demostraciones fluidas al jurado.
 * 2. LIVE_API: Cuando el backend FastAPI (desarrollado por Ana y Silvia) esté activo,
 *    se sincroniza automáticamente con los endpoints `/api/patients`, `/api/analyze`
 *    y `/api/feedback`.
 */

import { MOCK_PATIENTS, MOCK_STATS } from '../data/patientsData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.isBackendAvailable = false;
    this.checkBackendHealth();
  }

  /**
   * Comprueba si el servidor FastAPI está respondiendo
   */
  async checkBackendHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      this.isBackendAvailable = response.ok;
    } catch {
      this.isBackendAvailable = false;
    }
    return this.isBackendAvailable;
  }

  /**
   * Obtiene la cohorte de pacientes pediátricos
   */
  async getPatients() {
    if (this.isBackendAvailable) {
      try {
        const response = await fetch(`${API_BASE_URL}/patients`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Fallo al conectar con FastAPI, recurriendo a cohorte local:', err);
      }
    }
    return MOCK_PATIENTS;
  }

  /**
   * Obtiene las métricas KPI agregadas
   */
  async getStats() {
    if (this.isBackendAvailable) {
      try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Fallo al cargar stats de API:', err);
      }
    }
    return MOCK_STATS;
  }

  /**
   * Analiza una nota clínica de evolución con el motor NLP
   */
  async analyzeNote(clinicalText) {
    if (this.isBackendAvailable) {
      try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clinicalText })
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Fallo en /api/analyze, recurriendo a motor heurístico:', err);
      }
    }

    // Heurística local de respaldo para demo offline
    const lower = (clinicalText || '').toLowerCase();
    const hasSevereLesions = lower.includes('exudaci') || lower.includes('sangrante') || lower.includes('liquenific') || lower.includes('generalizado');
    const hasSleepDisruption = lower.includes('sueño') || lower.includes('no duerme') || lower.includes('despert') || lower.includes('llanto') || lower.includes('nocturno');
    const hasHighPotencySteroid = lower.includes('betametasona') || lower.includes('clobetasol') || lower.includes('mometasona');
    const hasRebound = lower.includes('rebote') || lower.includes('refractari') || lower.includes('recaída') || lower.includes('sin remisi');
    const hasComorbidities = lower.includes('asma') || lower.includes('sibilan') || lower.includes('rinitis') || lower.includes('alergia');

    let score = 30;
    if (hasHighPotencySteroid) score += 25;
    if (hasSevereLesions) score += 20;
    if (hasSleepDisruption) score += 15;
    if (hasRebound) score += 15;
    if (hasComorbidities) score += 10;
    score = Math.min(Math.max(score, 10), 96);

    return {
      riskScore: score,
      riskLevel: score >= 80 ? 'Muy Alto' : score >= 60 ? 'Alto' : score >= 40 ? 'Moderado' : 'Bajo',
      isCandidate: score >= 60,
      signalsDetected: {
        severeLesions: hasSevereLesions,
        sleepDisruption: hasSleepDisruption,
        highPotencySteroid: hasHighPotencySteroid,
        rebound: hasRebound,
        atopicMarch: hasComorbidities
      }
    };
  }

  /**
   * Envía feedback clínico facultativo (Sistema 04)
   */
  async submitFeedback(feedbackPayload) {
    if (this.isBackendAvailable) {
      try {
        await fetch(`${API_BASE_URL}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackPayload)
        });
      } catch (err) {
        console.warn('Fallo al persistir feedback en API:', err);
      }
    }
    return { success: true, timestamp: new Date().toISOString() };
  }
}

export const apiService = new ApiService();
