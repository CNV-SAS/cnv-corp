'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Determinant } from '../../types/anibise';
import { TOKENS } from './tokens';

interface Props {
  determinants: Determinant[];
  onSelect?: (id: string) => void;
}

const CX = 200;
const CY = 200;
const R_OUT = 188;
const R_IN = 82;

function pt(r: number, thetaDeg: number): [number, number] {
  const t = (thetaDeg * Math.PI) / 180;
  return [CX + r * Math.cos(t), CY + r * Math.sin(t)];
}

// Sector anular (dona) entre R_IN y R_OUT, de a0 a a1 grados.
function sectorPath(rIn: number, rOut: number, a0: number, a1: number): string {
  const [x1, y1] = pt(rOut, a0);
  const [x2, y2] = pt(rOut, a1);
  const [x3, y3] = pt(rIn, a1);
  const [x4, y4] = pt(rIn, a0);
  const laf = a1 - a0 > 180 ? 1 : 0;
  return `M${x1},${y1} A${rOut},${rOut} 0 ${laf} 1 ${x2},${y2} L${x3},${y3} A${rIn},${rIn} 0 ${laf} 0 ${x4},${y4} Z`;
}

export default function DeterminantsOctagon({ determinants, onSelect }: Props) {
  const [selected, setSelected] = useState<string>(determinants[0]?.id ?? '');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const sel = useMemo(
    () => determinants.find((d) => d.id === selected) ?? determinants[0],
    [determinants, selected],
  );

  const pick = (id: string) => {
    setSelected(id);
    onSelect?.(id);
  };

  // Fallback movil: 8 tarjetas en grilla de 2 columnas.
  if (isMobile) {
    return (
      <div className="oct-grid">
        <style>{`
          .oct-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;font-family:${TOKENS.body}}
          .oct-c{background:#fff;border:1px solid ${TOKENS.line};border-radius:12px;padding:14px}
          .oct-c .ic{font-size:24px}
          .oct-c .id{font-family:${TOKENS.display};font-weight:700;font-size:12px;color:${TOKENS.teal};margin-top:6px}
          .oct-c .tt{font-family:${TOKENS.display};font-weight:600;font-size:14px;color:${TOKENS.navy};margin-top:2px;line-height:1.2}
          .oct-c .rs{font-size:12.5px;color:${TOKENS.muted};margin-top:8px;line-height:1.45}
        `}</style>
        {determinants.map((d) => (
          <div key={d.id} className="oct-c">
            <div className="ic" aria-hidden="true">{d.icon}</div>
            <div className="id">{d.id}</div>
            <div className="tt">{d.titulo}</div>
            <div className="rs">{d.resumen}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="oct-root">
      <style>{`
        .oct-root{display:grid;grid-template-columns:minmax(320px,1fr) 1fr;gap:40px;align-items:center;font-family:${TOKENS.body}}
        @media(max-width:900px){.oct-root{grid-template-columns:1fr;gap:28px}}
        .oct-svg{width:100%;max-width:440px;margin:0 auto;display:block}
        .oct-sector{cursor:pointer;transition:opacity .2s,transform .2s;transform-origin:${CX}px ${CY}px}
        .oct-sector:hover{opacity:.92}
        .oct-sector.sel{transform:scale(1.03)}
        .oct-sector:focus-visible{outline:none}
        .oct-sector:focus-visible .oct-shape{stroke:${TOKENS.navy};stroke-width:3}
        .oct-num{font-family:${TOKENS.display};font-weight:700;fill:#fff;font-size:13px;pointer-events:none}
        .oct-ic{font-size:22px;pointer-events:none}
        .oct-hub{fill:${TOKENS.navy}}
        .oct-hub-t{fill:#fff;font-family:${TOKENS.display};font-weight:800;font-size:26px;pointer-events:none}
        .oct-hub-s{fill:${TOKENS.teal};font-family:${TOKENS.body};font-weight:600;font-size:9.5px;letter-spacing:1.5px;pointer-events:none}
        .oct-panel{background:${TOKENS.soft};border:1px solid ${TOKENS.line};border-radius:16px;padding:26px}
        .oct-panel .pid{font-family:${TOKENS.display};font-weight:700;font-size:12px;letter-spacing:2px;color:${TOKENS.teal};text-transform:uppercase}
        .oct-panel .pic{font-size:34px;margin:6px 0 2px}
        .oct-panel h4{font-family:${TOKENS.display};font-weight:700;font-size:22px;color:${TOKENS.navy};line-height:1.15;margin:0}
        .oct-panel p{font-size:15px;color:${TOKENS.ink};margin-top:12px;line-height:1.6}
      `}</style>

      <svg className="oct-svg" viewBox="0 0 400 400" role="group" aria-label="Los ocho determinantes de la toma de datos">
        {determinants.slice(0, 8).map((d, i) => {
          const center = -90 + i * 45;
          const a0 = center - 22.5;
          const a1 = center + 22.5;
          const isSel = d.id === selected;
          const [lx, ly] = pt((R_OUT + R_IN) / 2, center);
          return (
            <g
              key={d.id}
              className={`oct-sector${isSel ? ' sel' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${d.id}. ${d.titulo}`}
              aria-pressed={isSel}
              onClick={() => pick(d.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(d.id); }
              }}
            >
              <title>{`${d.id}. ${d.titulo}`}</title>
              <path
                className="oct-shape"
                d={sectorPath(R_IN, R_OUT, a0, a1)}
                fill={isSel ? TOKENS.teal : '#DCE7EC'}
                stroke="#fff"
                strokeWidth={2}
              />
              <text className="oct-ic" x={lx} y={ly - 8} textAnchor="middle" dominantBaseline="central">{d.icon}</text>
              <text className="oct-num" x={lx} y={ly + 14} textAnchor="middle" dominantBaseline="central" fill={isSel ? '#fff' : TOKENS.navy}>{d.id}</text>
            </g>
          );
        })}
        {/* Nucleo central: marca CNV */}
        <circle className="oct-hub" cx={CX} cy={CY} r={R_IN - 8} />
        <text className="oct-hub-t" x={CX} y={CY - 4} textAnchor="middle" dominantBaseline="central">CNV</text>
        <text className="oct-hub-s" x={CX} y={CY + 20} textAnchor="middle" dominantBaseline="central">ANI BIS-E</text>
      </svg>

      <aside className="oct-panel" aria-live="polite">
        <div className="pid">Determinante {sel?.id}</div>
        <div className="pic" aria-hidden="true">{sel?.icon}</div>
        <h4>{sel?.titulo}</h4>
        <p>{sel?.resumen}</p>
      </aside>
    </div>
  );
}
