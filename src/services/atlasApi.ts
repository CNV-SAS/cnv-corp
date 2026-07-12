// Capa de datos del Modelo ANI BIS-E.
// HOY: devuelve datos de ejemplo (semilla del guion visual).
// MAÑANA: getPacienteModelo pega contra la API real de ATLAS.
// Los componentes consumen SIEMPRE estas funciones, nunca datos embebidos.

import type { ModeloData } from '../types/anibise';

// Semilla: Annica J., 45a · Re 3.5, Ri 2.8, Rinf 1.9, C 75.2
// IFC 3.5, IRC 2.8, PABU 1.9 · Cm 2.67 -> 2.03
// DFI: Celular-Electrico y Conductual-Perceptual "a vigilar", resto "muy bien".
const DEMO: ModeloData = {
  steps: [
    { n: '01', titulo: 'Encuesta', descripcion: 'Puerta de entrada. Consentimiento informado y encuesta completa.' },
    { n: '02', titulo: 'Toma de datos', descripcion: 'Mediciones, historial y pruebas en los 8 determinantes.' },
    { n: '03', titulo: 'Diagnóstico Funcional Integrado', descripcion: 'Análisis de los sistemas por las 5 dimensiones del DFI.' },
    { n: '04', titulo: 'Rutas de tratamiento', descripcion: 'Planes personalizados de nutrición y terapia.' },
    { n: '05', titulo: 'Reporte / HC', descripcion: 'Informe final e historia clínica.' },
  ],

  determinants: [
    { id: 'D1', titulo: 'Patrón usual de consumo alimentario', icon: '🍽️', resumen: 'Frecuencia habitual de consumo de los grupos de alimentos que definen el patrón alimentario de la persona.' },
    { id: 'D2', titulo: 'Imagen corporal y conducta alimentaria', icon: '🪞', resumen: 'Percepción del propio cuerpo, satisfacción con el peso y conductas frente a la comida.' },
    { id: 'D3', titulo: 'Hábitos de vida', icon: '🏃', resumen: 'Actividad física, sueño, estrés y relación con el tabaco y el alcohol.' },
    { id: 'D4', titulo: 'Patrón horario alimentario', icon: '🕐', resumen: 'Distribución de comidas y ayunos a lo largo del día, clave para el ritmo metabólico.' },
    { id: 'D5', titulo: 'Determinantes y epigenética', icon: '🧬', resumen: 'Factores hereditarios y de estilo de vida que modulan la expresión de la salud.' },
    { id: 'D6', titulo: 'Salud digestiva', icon: '🩺', resumen: 'Función intestinal, síntomas y antecedentes que afectan la absorción y el metabolismo.' },
    { id: 'D7', titulo: 'Hidratación', icon: '💧', resumen: 'Balance de líquidos y equilibrio hídrico, base de la función celular.' },
    { id: 'D8', titulo: 'Contexto social y alimentario', icon: '🌐', resumen: 'Entorno, acceso a alimentos y determinantes sociales que condicionan la nutrición.' },
  ],

  dfi: {
    axes: [
      { eje: 'Celular-Eléctrico', valor: 55, estado: 'a_vigilar' },
      { eje: 'Metabólico-Estructural', valor: 78, estado: 'muy_bien' },
      { eje: 'Envejecimiento', valor: 72, estado: 'muy_bien' },
      { eje: 'Conductual-Perceptual', valor: 50, estado: 'a_vigilar' },
      { eje: 'Epigenético-Contextual', valor: 80, estado: 'muy_bien' },
    ],
    baseline: [46, 70, 66, 43, 74],
  },

  indicators: [
    {
      codigo: 'IFC', nombre: 'Índice de Función Celular', formula: 'C / Rinf',
      valor: 3.5, rango: { min: 3.5, max: 6.0 }, estado: 'alerta', tendencia: 'mejora',
    },
    {
      codigo: 'IRC', nombre: 'Índice de Reserva Celular', formula: 'Re / (Ri · C)',
      valor: 2.8, unidad: '×10', rango: { min: 2.0, max: 2.8 }, estado: 'alerta', tendencia: 'estable',
    },
    {
      codigo: 'PABU', nombre: 'Punto de Ajuste Bioeléctrico Universal', formula: 'converge a φ (1.618)',
      valor: 1.9, rango: { tipo: 'objetivo', valor: 1.618, tol: 0.15 }, estado: 'alerta', tendencia: 'mejora',
    },
    {
      codigo: 'IEHH', nombre: 'Índice IEHH (hídrico / homeostasis)',
      valor: 0.82, rango: { min: 0.75, max: 0.95 }, estado: 'optimo', tendencia: 'estable',
    },
    {
      codigo: 'ISCM', nombre: 'ISCM-BIS / CE (salud celular y muscular)',
      valor: 44, unidad: '%', rango: { min: 40, max: 60 }, estado: 'optimo', tendencia: 'mejora',
    },
    {
      codigo: 'EB', nombre: 'EB-BIS / IAE (balance bioeléctrico / edad estimada)',
      valor: 48, unidad: 'años', rango: { tipo: 'objetivo', valor: 45, tol: 2 }, estado: 'alerta', tendencia: 'mejora',
    },
  ],

  followUp: {
    capacitancia: [
      { consulta: '1ª', valor: 2.67 },
      { consulta: '2ª', valor: 2.34 },
      { consulta: '3ª', valor: 2.03 },
    ],
    pabu: [
      { consulta: '1ª', valor: 1.90 },
      { consulta: '2ª', valor: 1.78 },
      { consulta: '3ª', valor: 1.70 },
    ],
    resumen:
      'El área del DFI creció frente a la consulta previa y el PABU se acerca a φ (1.618). ' +
      'La capacitancia de membrana descendió de 2.67 a 2.03 nF, coherente con una mejora estimada de la función celular. ' +
      'Resultado de riesgo/estimación, no un diagnóstico definitivo.',
  },
};

// Copia defensiva para que los componentes no muten la semilla compartida.
function clone(data: ModeloData): ModeloData {
  return JSON.parse(JSON.stringify(data)) as ModeloData;
}

export function getModeloDemo(): ModeloData {
  return clone(DEMO);
}

// Futura: misma forma, contra la API real de ATLAS cuando exista sesión.
export async function getPacienteModelo(_pacienteId: string): Promise<ModeloData> {
  // TODO: reemplazar por fetch autenticado a la API de ATLAS.
  return clone(DEMO);
}
