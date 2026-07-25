// ============================================================================
// FUENTE ÚNICA DE VERDAD — Catálogo comercial de nutracéuticos VITACELLEBIS
// ----------------------------------------------------------------------------
// Este archivo lo consume TANTO la tienda (/tienda) COMO el endpoint de pago
// (api/checkout-wompi.ts). El servidor SIEMPRE recalcula el precio desde aquí:
// nunca se confía en el precio que envía el navegador.
//
// Precios base (sin IVA), definidos por negocio:
//   · Línea líquida  →  $90.000 COP  + IVA
//   · Línea en polvo →  $140.000 COP + IVA
// IVA Colombia = 19%.
// ============================================================================

export const IVA_RATE = 0.19;

export const PRICE_BY_LINE = {
  liquida: 90000,
  polvo: 140000,
} as const;

export type Linea = keyof typeof PRICE_BY_LINE;

export interface Producto {
  id: string;          // slug estable — se usa como referencia interna
  img: number;         // número de frasco/etiqueta en /images/vitacellebis/bottle_XX.jpg
  ico: string;
  n: string;           // nombre comercial
  linea: Linea;
  eje: string;         // beneficio principal
  variedad: string;    // composición resumida
  forma: string;       // presentación
  invima: string;
}

// El orden coincide 1:1 con las imágenes bottle_01..bottle_10 ya publicadas.
export const PRODUCTOS: Producto[] = [
  { id: 'omega-complex',    img: 1,  ico: '🐟', n: 'OMEGA COMPLEX',    linea: 'liquida', eje: 'Antiinflamatorio / Cardioprotector', variedad: 'Omega 3, arándano, té verde y betaglucanos de avena', forma: 'Bebida a base de agua · porción 30 mL', invima: 'RSA-3987-2026' },
  { id: 'berberina-metabo', img: 2,  ico: '🌿', n: 'BERBERINA METABO', linea: 'liquida', eje: 'Metabolismo glucosa-insulina',          variedad: 'Arándano, inulina, canela, té verde y cromo',        forma: 'Bebida a base de agua · porción 30 mL', invima: 'RSA-3987-2026' },
  { id: 'curcumin-bioactiv', img: 3, ico: '🟡', n: 'CURCUMIN BIOACTIV', linea: 'liquida', eje: 'Modulación inflamatoria',              variedad: 'Cúrcuma, jengibre, pimienta negra, selenio y zinc',  forma: 'Bebida a base de agua · porción 30 mL', invima: 'RSA-3987-2026' },
  { id: 'mito-q10-plus',    img: 4,  ico: '⚡', n: 'MITO-Q10 PLUS',    linea: 'liquida', eje: 'Función mitocondrial',                 variedad: 'Remolacha, espinaca, jengibre, ajo negro y complejo B', forma: 'Bebida a base de agua · porción 30 mL', invima: 'RSA-3987-2026' },
  { id: 'hepa-detox',       img: 5,  ico: '🫀', n: 'HEPA-DETOX',       linea: 'liquida', eje: 'Hepatoprotección',                    variedad: 'Alcachofa, ajo negro, cisteína y colina',           forma: 'Bebida a base de agua · porción 30 mL', invima: 'RSA-3987-2026' },
  { id: 'adapto-stress',    img: 6,  ico: '🧠', n: 'ADAPTO-STRESS',    linea: 'liquida', eje: 'Eje HPA / Adaptogénico',              variedad: 'L-teanina, inositol, colina y omega-3',             forma: 'Bebida a base de agua · porción 30 mL', invima: 'RSA-3987-2026' },
  { id: 'multi-cell-base',  img: 7,  ico: '🌐', n: 'MULTI-CELL BASE',  linea: 'liquida', eje: 'Micronutrición basal universal',      variedad: 'Calostro bovino fortificado con vitaminas y minerales', forma: 'Bebida a base de agua · porción 30 mL', invima: 'RSA-3987-2026' },
  { id: 'sarco-protect',    img: 8,  ico: '💪', n: 'SARCO-PROTECT',    linea: 'polvo',   eje: 'Masa muscular / Anticatabólico',      variedad: 'BCAA, magnesio, zinc y vitaminas del complejo B',    forma: 'Polvo para bebida · porción 25 g',      invima: 'NSA-3618-2026' },
  { id: 'gut-immune-pro',   img: 9,  ico: '🦠', n: 'GUT-IMMUNE PRO',   linea: 'polvo',   eje: 'Barrera intestinal / Inmunidad',      variedad: 'Inulina, aloe vera, probióticos y vitamina A',       forma: 'Polvo para bebida · porción 20 g',      invima: 'NSA-3618-2026' },
  { id: 'd3-k2-osteo',      img: 10, ico: '🦴', n: 'D3-K2 OSTEO',      linea: 'polvo',   eje: 'Metabolismo óseo',                    variedad: 'Calcio, magnesio, vitamina D y vitamina K2',         forma: 'Polvo para bebida · porción 10 g',      invima: 'NSA-3618-2026' },
];

export const PRODUCTOS_BY_ID: Record<string, Producto> = Object.fromEntries(
  PRODUCTOS.map((p) => [p.id, p]),
);

/** Precio base (sin IVA) en COP de un producto. */
export const basePrice = (p: Producto) => PRICE_BY_LINE[p.linea];
/** Valor del IVA en COP. */
export const ivaAmount = (p: Producto) => Math.round(basePrice(p) * IVA_RATE);
/** Precio final con IVA en COP. */
export const totalPrice = (p: Producto) => basePrice(p) + ivaAmount(p);

/** Formatea un entero COP como "$107.100". */
export function formatCOP(value: number): string {
  return '$' + value.toLocaleString('es-CO');
}

/** Precio final con IVA convertido a USD (para PayPal, que no opera en COP). */
export function priceUSD(p: Producto, copPerUsd: number): number {
  return Math.round((totalPrice(p) / copPerUsd) * 100) / 100;
}
