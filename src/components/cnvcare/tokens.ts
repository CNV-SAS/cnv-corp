// Paleta y tipografia del Modelo ANI BIS-E (tokens de la especificacion).
import type { DFIEstado, IndicadorEstado } from '../../types/anibise';

export const TOKENS = {
  navy: '#0F2D52',
  teal: '#009B8E',
  tealD: '#00776C',
  green: '#5CB544',
  ink: '#1C2B3A',
  muted: '#5A6B7B',
  line: '#E5EBF0',
  bg: '#FFFFFF',
  soft: '#F4F7F9',
  optimo: '#2FA36B',
  alerta: '#E0A800',
  critico: '#D2483F',
  display: "'Poppins', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
} as const;

export const ESTADO_COLOR: Record<IndicadorEstado, string> = {
  optimo: TOKENS.optimo,
  alerta: TOKENS.alerta,
  critico: TOKENS.critico,
};

export const ESTADO_LABEL: Record<IndicadorEstado, string> = {
  optimo: 'Óptimo',
  alerta: 'Alerta',
  critico: 'Crítico',
};

export const DFI_ESTADO_COLOR: Record<DFIEstado, string> = {
  muy_bien: TOKENS.optimo,
  a_vigilar: TOKENS.alerta,
  critico: TOKENS.critico,
};

export const DFI_ESTADO_LABEL: Record<DFIEstado, string> = {
  muy_bien: 'Muy bien',
  a_vigilar: 'A vigilar',
  critico: 'Crítico',
};
