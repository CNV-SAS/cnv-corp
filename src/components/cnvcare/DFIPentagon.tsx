'use client';
import { useEffect, useMemo } from 'react';
import type { DFI } from '../../types/anibise';
import { TOKENS, DFI_ESTADO_COLOR, DFI_ESTADO_LABEL } from './tokens';

interface Props {
  dfi: DFI;
  onAreaComputed?: (area: number) => void;
}

const CX = 200;
const CY = 200;
const R = 150;
const RINGS = [20, 40, 60, 80, 100];

function axisPoint(valuePct: number, i: number): [number, number] {
  const theta = ((-90 + i * 72) * Math.PI) / 180;
  const r = (valuePct / 100) * R;
  return [CX + r * Math.cos(theta), CY + r * Math.sin(theta)];
}

function polygon(values: number[]): string {
  return values.map((v, i) => axisPoint(v, i).join(',')).join(' ');
}

// Area del poligono por la formula del cordon (shoelace).
function shoelace(values: number[]): number {
  const pts = values.map((v, i) => axisPoint(v, i));
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

export default function DFIPentagon({ dfi, onAreaComputed }: Props) {
  const values = dfi.axes.map((a) => a.valor);
  const area = useMemo(() => shoelace(values), [values.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onAreaComputed?.(area);
  }, [area, onAreaComputed]);

  return (
    <div className="dfi-root">
      <style>{`
        .dfi-root{display:grid;grid-template-columns:minmax(300px,1fr) 280px;gap:36px;align-items:center;font-family:${TOKENS.body}}
        @media(max-width:900px){.dfi-root{grid-template-columns:1fr}}
        .dfi-svg{width:100%;max-width:460px;margin:0 auto;display:block;overflow:visible}
        .dfi-ring{fill:none;stroke:${TOKENS.line}}
        .dfi-axis{stroke:${TOKENS.line}}
        .dfi-base{fill:${TOKENS.muted};opacity:.16;stroke:${TOKENS.muted};stroke-opacity:.5;stroke-width:1.5}
        .dfi-poly{fill:${TOKENS.teal};fill-opacity:.20;stroke:${TOKENS.teal};stroke-width:2.5;transform-origin:${CX}px ${CY}px;animation:dfiGrow .4s ease-out both}
        .dfi-node{stroke:#fff;stroke-width:2;cursor:default;transition:r .15s}
        .dfi-node:hover{r:8}
        .dfi-alabel{font-family:${TOKENS.display};font-weight:600;font-size:12.5px;fill:${TOKENS.navy}}
        .dfi-astate{font-family:${TOKENS.body};font-size:11px}
        @keyframes dfiGrow{from{transform:scale(0)}to{transform:scale(1)}}
        @media(prefers-reduced-motion:reduce){.dfi-poly{animation:none}}
        .dfi-legend{display:flex;flex-direction:column;gap:10px}
        .dfi-lg{display:flex;align-items:center;gap:10px;background:${TOKENS.soft};border:1px solid ${TOKENS.line};border-radius:10px;padding:10px 12px}
        .dfi-dot{width:12px;height:12px;border-radius:50%;flex:0 0 auto}
        .dfi-lg .nm{font-family:${TOKENS.display};font-weight:600;font-size:13.5px;color:${TOKENS.navy};line-height:1.2;flex:1}
        .dfi-lg .vl{font-family:${TOKENS.display};font-weight:700;font-size:14px;color:${TOKENS.ink}}
        .dfi-lg .st{font-size:11px;color:${TOKENS.muted}}
      `}</style>

      <svg className="dfi-svg" viewBox="0 0 400 400" role="img"
           aria-label={`Diagnóstico Funcional Integrado. ${dfi.axes.map((a) => `${a.eje}: ${a.valor} de 100, ${DFI_ESTADO_LABEL[a.estado]}`).join('. ')}.`}>
        {/* Anillos de referencia */}
        {RINGS.map((lvl) => (
          <polygon key={lvl} className="dfi-ring" points={polygon([lvl, lvl, lvl, lvl, lvl])} />
        ))}
        {/* Ejes */}
        {dfi.axes.map((_, i) => {
          const [x, y] = axisPoint(100, i);
          return <line key={i} className="dfi-axis" x1={CX} y1={CY} x2={x} y2={y} />;
        })}
        {/* Baseline (consulta previa) por debajo */}
        {dfi.baseline && dfi.baseline.length === 5 && (
          <polygon className="dfi-base" points={polygon(dfi.baseline)} />
        )}
        {/* Poligono del paciente */}
        <polygon className="dfi-poly" points={polygon(values)} />
        {/* Nodos por estado + etiquetas */}
        {dfi.axes.map((a, i) => {
          const [nx, ny] = axisPoint(a.valor, i);
          const [lx, ly] = axisPoint(114, i);
          const c = Math.cos(((-90 + i * 72) * Math.PI) / 180);
          const s = Math.sin(((-90 + i * 72) * Math.PI) / 180);
          const anchor = c < -0.2 ? 'end' : c > 0.2 ? 'start' : 'middle';
          const baseline = s < -0.4 ? 'baseline' : s > 0.4 ? 'hanging' : 'middle';
          return (
            <g key={a.eje}>
              <circle className="dfi-node" cx={nx} cy={ny} r={6} fill={DFI_ESTADO_COLOR[a.estado]}>
                <title>{`${a.eje}: ${a.valor}/100 · ${DFI_ESTADO_LABEL[a.estado]}`}</title>
              </circle>
              <text className="dfi-alabel" x={lx} y={ly} textAnchor={anchor} dominantBaseline={baseline}>
                {a.eje}
              </text>
              <text className="dfi-astate" x={lx} y={ly + 15} textAnchor={anchor} dominantBaseline={baseline}
                    fill={DFI_ESTADO_COLOR[a.estado]}>
                {DFI_ESTADO_LABEL[a.estado]} · {a.valor}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="dfi-legend">
        {dfi.axes.map((a) => (
          <div key={a.eje} className="dfi-lg">
            <span className="dfi-dot" style={{ background: DFI_ESTADO_COLOR[a.estado] }} />
            <span className="nm">{a.eje}<br /><span className="st">{DFI_ESTADO_LABEL[a.estado]}</span></span>
            <span className="vl">{a.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
