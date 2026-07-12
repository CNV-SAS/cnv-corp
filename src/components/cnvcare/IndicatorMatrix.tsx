'use client';
import type { Indicator, Rango, Tendencia } from '../../types/anibise';
import { TOKENS, ESTADO_COLOR, ESTADO_LABEL } from './tokens';

interface Props {
  indicators: Indicator[];
}

// Posicion del marcador en la franja critico(0) -> optimo(1), segun el ESTADO
// provisto por el sistema (no se inventan umbrales ni direccion por indicador).
const ZONA: Record<Indicator['estado'], number> = { critico: 0.16, alerta: 0.5, optimo: 0.84 };

function rangoTexto(r: Rango, unidad?: string): string {
  const u = unidad ? ' ' + unidad : '';
  if ('tipo' in r) return `objetivo ${r.valor} ± ${r.tol}${u}`;
  return `${r.min} a ${r.max}${u}`;
}

const TEND: Record<Tendencia, { s: string; c: string; t: string }> = {
  mejora: { s: '▲', c: TOKENS.optimo, t: 'Mejora' },
  estable: { s: '=', c: TOKENS.muted, t: 'Estable' },
  empeora: { s: '▼', c: TOKENS.critico, t: 'Empeora' },
};

function Gauge({ ind }: { ind: Indicator }) {
  const gid = `grad-${ind.codigo}`;
  const frac = ZONA[ind.estado];
  const W = 300;
  const mx = 6 + frac * (W - 12);
  return (
    <svg viewBox={`0 0 ${W} 42`} className="im-gauge" role="img"
         aria-label={`${ind.nombre}: ${ind.valor}${ind.unidad ? ' ' + ind.unidad : ''}, estado ${ESTADO_LABEL[ind.estado]}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={TOKENS.critico} />
          <stop offset="50%" stopColor={TOKENS.alerta} />
          <stop offset="100%" stopColor={TOKENS.optimo} />
        </linearGradient>
      </defs>
      <rect x="6" y="20" width={W - 12} height="8" rx="4" fill={`url(#${gid})`} opacity="0.85" />
      {/* Marcador (aguja) en el valor */}
      <g transform={`translate(${mx},0)`}>
        <polygon points="-6,14 6,14 0,20" fill={ESTADO_COLOR[ind.estado]} />
        <line x1="0" y1="18" x2="0" y2="30" stroke={ESTADO_COLOR[ind.estado]} strokeWidth="2.5" />
        <text x="0" y="10" textAnchor="middle" className="im-gval" fill={TOKENS.ink}>
          {ind.valor}{ind.unidad ? ` ${ind.unidad}` : ''}
        </text>
      </g>
    </svg>
  );
}

export default function IndicatorMatrix({ indicators }: Props) {
  return (
    <div className="im-root">
      <style>{`
        .im-root{display:grid;grid-template-columns:1fr 1fr;gap:16px;font-family:${TOKENS.body}}
        @media(max-width:760px){.im-root{grid-template-columns:1fr}}
        .im-card{background:#fff;border:1px solid ${TOKENS.line};border-radius:14px;padding:18px 18px 14px;display:flex;flex-direction:column;gap:6px}
        .im-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
        .im-code{font-family:${TOKENS.display};font-weight:800;font-size:18px;color:${TOKENS.navy}}
        .im-chip{font-family:${TOKENS.display};font-weight:700;font-size:11px;letter-spacing:.5px;color:#fff;padding:3px 10px;border-radius:999px;text-transform:uppercase}
        .im-name{font-size:13.5px;color:${TOKENS.ink};font-weight:500;line-height:1.3}
        .im-gauge{width:100%;height:auto;display:block;margin:2px 0}
        .im-gval{font-family:${TOKENS.display};font-weight:700;font-size:12px}
        .im-meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:12px;color:${TOKENS.muted};margin-top:2px}
        .im-formula{font-family:${TOKENS.display};font-weight:600;color:${TOKENS.tealD}}
        .im-tend{display:inline-flex;align-items:center;gap:4px;font-weight:700}
      `}</style>

      {indicators.map((ind) => (
        <div key={ind.codigo} className="im-card">
          <div className="im-top">
            <span className="im-code">{ind.codigo}</span>
            <span className="im-chip" style={{ background: ESTADO_COLOR[ind.estado] }}>{ESTADO_LABEL[ind.estado]}</span>
          </div>
          <div className="im-name">{ind.nombre}</div>
          <Gauge ind={ind} />
          <div className="im-meta">
            {ind.formula && <span>Fórmula: <span className="im-formula">{ind.formula}</span></span>}
            <span>Rango: {rangoTexto(ind.rango, ind.unidad)}</span>
            {ind.tendencia && (
              <span className="im-tend" style={{ color: TEND[ind.tendencia].c }}>
                {TEND[ind.tendencia].s} {TEND[ind.tendencia].t}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
