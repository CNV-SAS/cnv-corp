'use client';
import type { FollowUp, SeriePunto } from '../../types/anibise';
import { TOKENS } from './tokens';

interface Props {
  followUp: FollowUp;
}

interface ChartProps {
  points: SeriePunto[];
  color: string;
  unidad: string;
  target?: number;      // linea de objetivo (p.ej. PABU = 1.618)
  tol?: number;         // semi-ancho de la banda optima
  ariaLabel: string;
}

const W = 360;
const H = 200;
const PAD = { l: 40, r: 14, t: 18, b: 30 };

function LineChart({ points, color, unidad, target, tol, ariaLabel }: ChartProps) {
  const vals = points.map((p) => p.valor);
  const extra: number[] = target !== undefined ? [target - (tol ?? 0), target + (tol ?? 0)] : [];
  let min = Math.min(...vals, ...extra);
  let max = Math.max(...vals, ...extra);
  const span = max - min || 1;
  min -= span * 0.15;
  max += span * 0.15;

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (v: number) => PAD.t + plotH - ((v - min) / (max - min)) * plotH;

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.valor).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="fu-svg" role="img" aria-label={ariaLabel}>
      {/* Banda optima (objetivo +- tol) */}
      {target !== undefined && tol !== undefined && (
        <rect x={PAD.l} y={y(target + tol)} width={plotW} height={Math.abs(y(target - tol) - y(target + tol))}
              fill={TOKENS.optimo} opacity="0.10" />
      )}
      {/* Linea de objetivo */}
      {target !== undefined && (
        <>
          <line x1={PAD.l} y1={y(target)} x2={W - PAD.r} y2={y(target)} stroke={TOKENS.optimo} strokeWidth="1.5" strokeDasharray="5 4" />
          <text x={W - PAD.r} y={y(target) - 5} textAnchor="end" className="fu-target">objetivo {target}</text>
        </>
      )}
      {/* Ejes */}
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke={TOKENS.line} />
      <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke={TOKENS.line} />
      <text x={PAD.l - 6} y={PAD.t + 4} textAnchor="end" className="fu-tick">{max.toFixed(2)}</text>
      <text x={PAD.l - 6} y={H - PAD.b} textAnchor="end" className="fu-tick">{min.toFixed(2)}</text>
      {/* Serie */}
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={p.consulta}>
          <circle cx={x(i)} cy={y(p.valor)} r="4.5" fill="#fff" stroke={color} strokeWidth="2.5" />
          <text x={x(i)} y={y(p.valor) - 10} textAnchor="middle" className="fu-val" fill={TOKENS.ink}>{p.valor}</text>
          <text x={x(i)} y={H - PAD.b + 16} textAnchor="middle" className="fu-x">{p.consulta}</text>
        </g>
      ))}
      <text x={PAD.l} y={PAD.t - 6} className="fu-unit">{unidad}</text>
    </svg>
  );
}

export default function FollowUpCharts({ followUp }: Props) {
  const cap = followUp.capacitancia;
  const capFirst = cap[0]?.valor;
  const capLast = cap[cap.length - 1]?.valor;
  const capDelta = capFirst !== undefined && capLast !== undefined ? capLast - capFirst : 0;
  const capDir = capDelta < 0 ? 'descenso' : capDelta > 0 ? 'ascenso' : 'estable';

  const pabu = followUp.pabu;
  const pabuTarget = 1.618;
  const pabuTol = 0.1;
  const pabuLast = pabu[pabu.length - 1]?.valor;
  const pabuFirst = pabu[0]?.valor;
  const acerca =
    pabuFirst !== undefined && pabuLast !== undefined
      ? Math.abs(pabuLast - pabuTarget) < Math.abs(pabuFirst - pabuTarget)
      : false;

  return (
    <div className="fu-root">
      <style>{`
        .fu-root{font-family:${TOKENS.body}}
        .fu-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        @media(max-width:820px){.fu-grid{grid-template-columns:1fr}}
        .fu-panel{background:#fff;border:1px solid ${TOKENS.line};border-radius:14px;padding:18px}
        .fu-h{font-family:${TOKENS.display};font-weight:700;font-size:16px;color:${TOKENS.navy}}
        .fu-sub{font-size:13px;color:${TOKENS.muted};margin-top:2px}
        .fu-svg{width:100%;height:auto;display:block;margin-top:8px;overflow:visible}
        .fu-tick{font-size:10px;fill:${TOKENS.muted}}
        .fu-x{font-size:11px;fill:${TOKENS.muted};font-weight:600}
        .fu-val{font-family:${TOKENS.display};font-weight:700;font-size:11px}
        .fu-unit{font-size:10px;fill:${TOKENS.muted}}
        .fu-target{font-size:10px;fill:${TOKENS.optimo};font-weight:600}
        .fu-delta{display:inline-block;margin-top:10px;font-size:13px;font-weight:600;color:${TOKENS.ink}}
        .fu-resumen{background:${TOKENS.soft};border:1px solid ${TOKENS.line};border-left:4px solid ${TOKENS.teal};
          border-radius:0 12px 12px 0;padding:16px 20px;margin-top:24px;font-size:14.5px;color:${TOKENS.ink};line-height:1.6}
        .fu-resumen b{font-family:${TOKENS.display};color:${TOKENS.navy}}
      `}</style>

      <div className="fu-grid">
        <div className="fu-panel">
          <div className="fu-h">Capacitancia de membrana (Cm)</div>
          <div className="fu-sub">Estado eléctrico de las membranas celulares por consulta.</div>
          <LineChart
            points={cap} color={TOKENS.teal} unidad="nF"
            ariaLabel={`Capacitancia de membrana: de ${capFirst} a ${capLast} nF, ${capDir}.`}
          />
          <span className="fu-delta">
            {capFirst} → {capLast} nF, {capDir}
          </span>
        </div>

        <div className="fu-panel">
          <div className="fu-h">PABU · convergencia a φ</div>
          <div className="fu-sub">Objetivo φ = {pabuTarget}. Banda óptima sombreada.</div>
          <LineChart
            points={pabu} color={TOKENS.navy} unidad="PABU" target={pabuTarget} tol={pabuTol}
            ariaLabel={`PABU: de ${pabuFirst} a ${pabuLast}, ${acerca ? 'acercándose' : 'alejándose'} del objetivo ${pabuTarget}.`}
          />
          <span className="fu-delta" style={{ color: acerca ? TOKENS.optimo : TOKENS.alerta }}>
            {acerca ? 'Se acerca al objetivo φ' : 'Se aleja del objetivo φ'}
          </span>
        </div>
      </div>

      {followUp.resumen && (
        <div className="fu-resumen"><b>Resumen de seguimiento.</b> {followUp.resumen}</div>
      )}
    </div>
  );
}
