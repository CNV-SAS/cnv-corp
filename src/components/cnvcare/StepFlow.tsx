'use client';
import type { Step } from '../../types/anibise';
import { TOKENS } from './tokens';

interface Props {
  steps: Step[];
  activeStep?: string;              // "01".."05" — resalta y colorea el progreso hasta ahi
  onStepClick?: (n: string) => void;
}

export default function StepFlow({ steps, activeStep, onStepClick }: Props) {
  const activeIndex = activeStep ? steps.findIndex((s) => s.n === activeStep) : -1;

  return (
    <div className="sf-root" role="list" aria-label="Los cinco pasos del modelo ANI BIS-E">
      <style>{`
        .sf-root{display:grid;grid-template-columns:repeat(5,1fr);gap:0;position:relative;font-family:${TOKENS.body}}
        .sf-item{position:relative;padding:0 10px}
        /* Conector horizontal detras de los nodos (progreso hasta el paso activo) */
        .sf-bar{position:absolute;top:27px;left:0;right:0;height:3px;background:${TOKENS.line};z-index:0}
        .sf-item:first-child .sf-bar{left:50%}
        .sf-item:last-child .sf-bar{right:50%}
        .sf-bar.done{background:${TOKENS.teal}}
        .sf-btn{all:unset;position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;
          text-align:center;cursor:pointer;width:100%;box-sizing:border-box}
        .sf-node{width:54px;height:54px;border-radius:50%;border:3px solid ${TOKENS.line};background:#fff;
          color:${TOKENS.navy};font-family:${TOKENS.display};font-weight:700;font-size:16px;
          display:grid;place-items:center;flex:0 0 auto;transition:transform .2s,border-color .2s,background .2s,color .2s}
        .sf-text{display:flex;flex-direction:column;margin-top:14px}
        .sf-titulo{font-family:${TOKENS.display};font-weight:700;font-size:15px;color:${TOKENS.navy};line-height:1.2}
        .sf-desc{font-size:13px;color:${TOKENS.muted};margin-top:8px;line-height:1.45}
        .sf-btn:hover .sf-node{transform:translateY(-3px);border-color:${TOKENS.teal}}
        .sf-btn:focus-visible{outline:3px solid ${TOKENS.teal};outline-offset:4px;border-radius:12px}
        .sf-item.active .sf-node{background:${TOKENS.navy};color:#fff;border-color:${TOKENS.navy};transform:scale(1.06)}
        .sf-item.active .sf-titulo{color:${TOKENS.navy}}
        @media(max-width:820px){
          .sf-root{grid-template-columns:1fr;gap:16px}
          .sf-bar{display:none}
          .sf-item{padding:0}
          .sf-btn{flex-direction:row;text-align:left;gap:14px;align-items:flex-start}
          .sf-text{margin-top:0}
        }
      `}</style>

      {steps.map((s, i) => {
        const isActive = s.n === activeStep;
        const done = activeIndex >= 0 && i <= activeIndex;
        return (
          <div key={s.n} className={`sf-item${isActive ? ' active' : ''}`} role="listitem">
            <span className={`sf-bar${done ? ' done' : ''}`} aria-hidden="true" />
            <button
              type="button"
              className="sf-btn"
              aria-label={`Paso ${s.n}: ${s.titulo}`}
              aria-current={isActive ? 'step' : undefined}
              onClick={() => onStepClick?.(s.n)}
            >
              <span className="sf-node">{s.n}</span>
              <span className="sf-text">
                <span className="sf-titulo">{s.titulo}</span>
                <span className="sf-desc">{s.descripcion}</span>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
