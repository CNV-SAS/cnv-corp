// Tipos del Modelo ANI BIS-E (vitrina pública de ATLAS en CNV Care).
// Los componentes consumen SIEMPRE estas formas; nunca datos embebidos.

export interface Step {
  n: string;          // "01".."05" — la numeracion codifica orden, no decora
  titulo: string;
  descripcion: string;
}

export interface Determinant {
  id: string;         // "D1".."D8"
  titulo: string;
  resumen: string;
  icon: string;       // emoji/glifo representativo
}

export type DFIEstado = 'muy_bien' | 'a_vigilar' | 'critico';

export interface DFIAxis {
  eje: string;
  valor: number;      // 0..100
  estado: DFIEstado;
}

export interface DFI {
  axes: DFIAxis[];        // 5 ejes, orden fijo
  baseline?: number[];    // 5 valores de la consulta previa (capa comparativa)
}

export type IndicadorEstado = 'optimo' | 'alerta' | 'critico';
export type Tendencia = 'mejora' | 'estable' | 'empeora';

export type Rango =
  | { min: number; max: number }
  | { tipo: 'objetivo'; valor: number; tol: number };

export interface Indicator {
  codigo: string;         // IFC, IRC, PABU, IEHH, ISCM, EB
  nombre: string;         // nombre completo INAMOVIBLE
  formula?: string;
  valor: number;
  unidad?: string;
  rango: Rango;
  estado: IndicadorEstado;
  tendencia?: Tendencia;
}

export interface SeriePunto {
  consulta: string;       // "1a", "2a"...
  valor: number;
}

export interface FollowUp {
  capacitancia: SeriePunto[];   // Cm en nF
  pabu: SeriePunto[];           // objetivo phi = 1.618
  resumen?: string;
}

export interface ModeloData {
  steps: Step[];
  determinants: Determinant[];
  dfi: DFI;
  indicators: Indicator[];
  followUp: FollowUp;
}

// Umbrales de IR dependientes de sexo — se reciben por props, no se hardcodean.
export interface IRThresholds {
  optimoMax: number;
  alertaMax: number;
}
