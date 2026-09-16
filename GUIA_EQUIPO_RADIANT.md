# GUÍA DE TRABAJO Y HOJA DE RUTA · EQUIPO RADIANT
**Reto Sanofi: IA para Derivación Pediátrica en Dermatitis Atópica**

---

## 📌 Reparto por Ramas y Roles

### 1. Rama `noe-dev` (Noelia) — Frontend & Experiencia Médica (Sistema 03)
**Objetivo principal:** Construir la interfaz que enamore a los evaluadores de Sanofi y demuestre que el sistema es intuitivo, no invasivo y ahorra tiempo al pediatra.

**Lo que ya tienes listo en tu rama:**
- Aplicación completa en React 19 + Tailwind CSS + Lucide Icons dentro de `/frontend`.
- Bandeja de triage con filtrado multivariable (Score de riesgo, cohortes desde lactantes hasta adolescentes, estados de derivación).
- Ficha clínica profunda con:
  - Radar de las 4 señales cardinales (Brotes, Corticoides, Marcha Atópica, Sueño/Calidad de vida).
  - Visor NLP de la evolución médica con resaltado semántico.
  - Timeline cronológico de la progresión del paciente pediátrico.
  - Verificador de candidatura a terapia biológica (Dupixent).
  - Modal de interconsulta en 1 clic para copiar o exportar al HCE.
- Simulador NLP en tiempo real para que el jurado escriba notas libres y vea cómo el modelo calcula el riesgo al instante.

**Próximos pasos que puedes hacer tú en `noe-dev`:**
1. **Personalizar el diseño o añadir más casos clínicos** en `frontend/src/data/patientsData.js`.
2. **Exportar a PDF:** Añadir una librería como `jspdf` o `html2pdf.js` para que el botón de "Descargar Interconsulta" genere un PDF oficial con membrete del hospital/centro de salud.
3. **Modo "Widget EHR / SMART on FHIR":** Crear una vista que simule una pequeña ventana flotante lateral incrustada dentro de un programa médico real (ej. Diraya o Cerner), demostrando que el pediatra no tiene que cambiar de aplicación para recibir la alerta.
4. **Conectar con la API:** En cuanto Ana y Silvia preparen el backend en FastAPI, cambiar los mocks por llamadas `fetch('/api/patients')` y `fetch('/api/analyze')`.

---

### 2. Rama `ana-dev` (Ana) — Ingesta, Anonimización PII & FHIR (Sistema 01)
**Objetivo principal:** Crear el pipeline de datos que toma historiales clínicos crudos (estructurados + texto libre) y los deja limpios, anonimizados y normalizados.

**Tareas recomendadas para Ana:**
1. Crear un script en Python (ej. `backend/ingestion/anonymizer.py`):
   - Eliminar PII (identificadores personales: nombres de pacientes, médicos, números de teléfono, DNI) mediante expresiones regulares o Microsoft Presidio / spaCy en español.
2. Generar o normalizar historiales a recursos **FHIR R4**:
   - `Patient` (edad en meses, sexo, identificador anonimizado).
   - `Condition` (CIE-10: L20.9 Dermatitis atópica, J45 Asma, J30 Rinitis alérgica).
   - `MedicationRequest` (fármacos tópicos prescritos, corticoides por grupo de potencia, antihistamínicos).
3. Crear un script generador de datos sintéticos realistas para que el equipo cuente con un dataset de 100+ pacientes pediátricos sin infringir el RGPD.

---

### 3. Rama `silvia-dev` (Silvia) — Motor de Scoring NLP & Validación (Sistemas 02 y 04)
**Objetivo principal:** Desarrollar el motor de inteligencia artificial que calcula la probabilidad de DA moderada-severa y la infraestructura de reentrenamiento continuo.

**Tareas recomendadas para Silvia:**
1. **NLP Médico sobre Texto Libre (Sistema 02):**
   - Extracción de entidades nombradas (NER clínico):
     - Mención de zonas corporales críticas (pliegues flexurales, cara, párpados, manos).
     - Términos de severidad: "exudación", "liquenificación", "sangrado", "prurito incoercible".
     - Disrupción del sueño: "despertares nocturnos", "llanto", "insomnio".
     - Frecuencia y refractariedad: "efecto rebote", "sin mejoría", "corticofobia".
   - Puede usar modelos Hugging Face biomédicos en español (ej. `PlanTL-GOB-ES/roberta-base-biomedical-clinical-es`).
2. **Algoritmo de Scoring Híbrido:**
   - Combinación ponderada de señales:
     $$\text{Score} = w_1 \cdot \text{Brotes} + w_2 \cdot \text{Escalado Corticoideo} + w_3 \cdot \text{Marcha Atópica} + w_4 \cdot \text{Sueño/QoL}$$
3. **Bucle de Validación & Detección de Drift (Sistema 04):**
   - Estructura para registrar los aciertos y falsos positivos comunicados por los pediatras/dermatólogos.
   - Script con **Evidently AI** para monitorizar si cambia la distribución de los pacientes a lo largo del tiempo (Data Drift / Concept Drift).

---

## 🌟 Las 5 Claves para Ganar el Reto de Sanofi

1. **No ser una "caja negra":** El pediatra nunca derivará a un niño solo porque un algoritmo diga "Score 88%". Necesita la justificación clínica transparente (XAI) que ya tienes implementada en el front.
2. **El concepto de la "Marcha Atópica":** Enfatizar ante el jurado que la dermatitis atópica moderada-severa no tratada abre la puerta al asma y las alergias alimentarias. Derivar a tiempo previene comorbilidades.
3. **Criterios de Biológico Pediátrico (Dupixent):** Sanofi busca que los pacientes que realmente lo necesitan lleguen a la terapia adecuada. Identificar a los refractarios a corticoides tópicos es la clave del caso de uso.
4. **Ahorro de tiempo asistencial:** El generador de interconsultas en 1 clic transforma un proceso burocrático de 15 minutos en 10 segundos.
5. **Cumplimiento normativo estricto:** Recordar siempre que el sistema apoya pero **no diagnostica**, respetando el marco regulatorio europeo para software médico (MDR / AI Act).
