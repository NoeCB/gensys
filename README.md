# RADIANT · IA para Derivación Pediátrica en Dermatitis Atópica (DA)

> **Reto propuesto por Sanofi · Sector: Farmacéutica / Inmunología / Salud**  
> *Detección temprana de dermatitis atópica moderada-severa en población pediátrica analizando historiales clínicos electrónicos (HCE) con IA, facilitando la derivación oportuna al especialista y el acceso a terapias avanzadas.*

---

## 🎯 Principio Fundamental de Diseño
> ⚠️ **RADIANT no diagnostica.**  
> Actúa como un **Sistema de Soporte a la Decisión Clínica (CDSS)** que levanta la mano ante patrones de sospecha clínica de DA moderada-severa en historiales pediátricos. La decisión facultativa y la derivación corresponden siempre al pediatra y dermatólogo.

---

## 🚀 Cómo ser diferentes y ganar el reto de Sanofi

| # | Factor Diferencial | ¿Por qué destaca ante Sanofi y los Pediatras? |
|---|-------------------|------------------------------------------------|
| **1** | **Explicabilidad Clínica Visual (XAI)** | El pediatra tiene 5 min por consulta. En vez de un número negro ("85%"), RADIANT le resalta exactamente las evidencias en el texto libre: *escalado de corticoide*, *impacto en sueño*, *marcha atópica* y *refractariedad*. |
| **2** | **Timeline de la Marcha Atópica** | La DA no es una foto fija: modelamos la trayectoria cronológica del paciente pediátrico (frecuencia de brotes, escalado de potencia y comorbilidades como asma y rinitis). |
| **3** | **Candidatura a Biológico Pediátrico** | Cruce objetivo con criterios de ficha técnica de **Dupixent (dupilumab)**: aprobado desde los 6 meses de edad en DA moderada-severa refractaria a tratamiento tópico convencional. |
| **4** | **Propuesta de Interconsulta en 1 Clic** | Genera automáticamente el borrador de informe de derivación a Dermatología Pediátrica con los criterios clínicos ya resumidos, listo para enviar o copiar en el HCE. |
| **5** | **Bucle de Aprendizaje y Validación (S4)** | El dermatólogo valida cada alerta (acierto / falso positivo con motivo), alimentando un dataset versionado con detección de *drift* (Evidently AI). |
| **6** | **Interoperabilidad FHIR R4 & Privacidad PII** | Modelo estándar de datos clínicos en salud y anonimización conforme al RGPD en pediatría. |

---

## 👥 Organización del Equipo y Ramas en Git

El repositorio cuenta con 3 ramas de trabajo activas coordinadas por sistemas:

```
main (producción y entregas consolidadas)
├── noe-dev     <-- [RAMA ACTIVA] Noelia: Frontend CDSS, UX Pediátrica & Interconsultas (Sistema 03)
├── ana-dev     <-- Ana: Ingesta, Anonimización PII & Normalización FHIR R4 (Sistema 01)
└── silvia-dev  <-- Silvia: NLP Clínico, Algoritmo de Scoring & Validación S4 (Sistema 02 & 04)
```

### 📍 Tu Rama (`noe-dev`) · Tareas y Próximos Pasos (Noelia)
- [x] **Frontend interactivo CDSS** completo en React 19 + Tailwind CSS + Lucide Icons.
- [x] **Bandeja de Triage Pediátrico** con filtros dinámicos (Riesgo, Cohorte etaria, Estado).
- [x] **Ficha del Paciente con Explicabilidad XAI**: Radar de las 4 señales cardinales, visor de texto clínico con entidades resaltadas y timeline de marcha atópica.
- [x] **Generador de Borrador de Interconsulta** para Dermatología Pediátrica en 1 clic.
- [x] **Simulador NLP en Vivo** con casos clínicos tipo para demos del jurado.
- [ ] Conectar con la API FastAPI que desarrollarán Ana y Silvia.
- [ ] Exportación de informes en PDF imprimibles / descargables.
- [ ] Modo "Widget Embebido" (simulador dentro de la interfaz de un HCE real como Diraya o Cerner).

---

## 💻 Puesta en Marcha del Frontend

```bash
# Entrar en la carpeta del frontend
cd frontend

# Instalar dependencias (si no se han instalado)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## 🏗️ Los 4 Sistemas Incrementales del Piloto

1. **Sistema 01 · Ingesta y normalización de historiales clínicos**  
   *Amazon S3 · pandas · FHIR R4 · Anonimización PII (Comprehend / Presidio)*
2. **Sistema 02 · Motor de detección de DA moderada-severa**  
   *Hugging Face Transformers / BioBERT · scikit-learn · Reglas clínicas AEPED/AEDV*
3. **Sistema 03 · Sistema de alertas a pediatras**  
   *FastAPI · React 19 · Tailwind CSS · Portal Web CDSS*
4. **Sistema 04 · Validación clínica y bucle de reentrenamiento**  
   *Feedback de especialistas · Evidently AI (drift) · MLflow / DVC*