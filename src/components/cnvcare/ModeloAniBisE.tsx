'use client';
import { useMemo, useState } from 'react';
import { getModeloDemo } from '../../services/atlasApi';
import { TOKENS } from './tokens';
import StepFlow from './StepFlow';
import DeterminantsOctagon from './DeterminantsOctagon';
import DFIPentagon from './DFIPentagon';
import IndicatorMatrix from './IndicatorMatrix';
import FollowUpCharts from './FollowUpCharts';

// Proxy proporcional al area del pentagono (mismo R y angulos) para comparar consultas.
function areaProxy(values: number[]): number {
  let s = 0;
  for (let i = 0; i < values.length; i++) s += values[i] * values[(i + 1) % values.length];
  return s;
}

interface Props {
  /** Titulo de seccion (kicker). */
  kicker?: string;
}

export default function ModeloAniBisE({ kicker = 'Cómo funciona' }: Props) {
  // HOY consumimos el mock; MAÑANA getPacienteModelo(pacienteId) con la misma forma.
  const data = useMemo(() => getModeloDemo(), []);
  const [activeStep, setActiveStep] = useState<string | undefined>(undefined);
  const [area, setArea] = useState<number | null>(null);

  const mejoraArea = useMemo(() => {
    if (!data.dfi.baseline) return null;
    return areaProxy(data.dfi.axes.map((a) => a.valor)) > areaProxy(data.dfi.baseline);
  }, [data]);

  const SectionHead = ({ n, titulo, desc }: { n: string; titulo: string; desc: string }) => (
    <header className="mb-head">
      <span className="mb-kick">{kicker}</span>
      <h3 className="mb-h3"><span className="mb-n">{n}</span>{titulo}</h3>
      <p className="mb-desc">{desc}</p>
    </header>
  );

  return (
    <section className="mb-root" aria-label="Modelo ANI BIS-E">
      <style>{`
        .mb-root{background:${TOKENS.bg};color:${TOKENS.ink};font-family:${TOKENS.body};padding:20px 0 8px}
        .mb-wrap{max-width:1080px;margin:0 auto;padding:0 24px}
        .mb-block{padding:56px 0;border-top:1px solid ${TOKENS.line}}
        .mb-block:first-of-type{border-top:none}
        .mb-head{margin-bottom:30px}
        .mb-kick{font-family:${TOKENS.body};font-weight:600;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${TOKENS.teal}}
        .mb-h3{font-family:${TOKENS.display};font-weight:800;font-size:clamp(22px,3.2vw,32px);color:${TOKENS.navy};line-height:1.15;margin:10px 0 0;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
        .mb-n{font-family:${TOKENS.display};font-weight:800;font-size:16px;color:#fff;background:${TOKENS.teal};border-radius:8px;padding:3px 10px;letter-spacing:1px}
        .mb-desc{font-size:16px;color:${TOKENS.muted};max-width:680px;margin-top:12px;line-height:1.6}
        .mb-intro{background:${TOKENS.navy};color:#fff;border-radius:20px;padding:clamp(28px,5vw,52px)}
        .mb-intro .k{font-weight:600;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${TOKENS.green}}
        .mb-root .mb-intro h2{font-family:${TOKENS.display};font-weight:800;font-size:clamp(26px,4.6vw,46px);line-height:1.08;margin:14px 0 0;max-width:18ch;color:#E9C46A}
        .mb-intro p{font-size:clamp(16px,2vw,19px);color:#cdd9e6;max-width:660px;margin-top:20px;line-height:1.65}
        .mb-badge{display:inline-flex;align-items:center;gap:8px;background:${TOKENS.soft};border:1px solid ${TOKENS.line};
          border-radius:999px;padding:7px 14px;font-size:13px;color:${TOKENS.ink};font-weight:600;margin-bottom:14px}
        .mb-dot{width:9px;height:9px;border-radius:50%;background:${TOKENS.optimo}}
        .mb-disclaimer{font-size:13.5px;color:${TOKENS.muted};border-left:3px solid ${TOKENS.teal};padding-left:14px;margin-top:22px;line-height:1.55;max-width:760px}
        .mb-copy{text-align:center;font-size:12.5px;color:${TOKENS.muted};padding:30px 0 10px;letter-spacing:.3px}
      `}</style>

      <div className="mb-wrap">

        {/* 1. Intro del modelo */}
        <div className="mb-block">
          <div className="mb-intro">
            <div className="k">Modelo ANI BIS-E</div>
            <h2>La ciencia de ATLAS, en funcionamiento.</h2>
            <p>
              El Modelo de Atención en Salud, Alimentación y Nutrición Informado, basado en Bioimpedancia
              Espectroscópica y Epigenética convierte la medición eléctrica de la célula en decisiones clínicas. Esta es su vitrina
              pública: cada figura se dibuja en vivo desde datos, con un caso de ejemplo cuando no hay sesión de
              paciente. Los resultados son de riesgo y estimación, nunca un diagnóstico definitivo.
            </p>
          </div>
        </div>

        {/* 2. Los 5 pasos */}
        <div className="mb-block">
          <SectionHead n="01–05" titulo="Los cinco pasos del modelo" desc="Una secuencia real. La numeración codifica el orden. Toca un paso para resaltarlo." />
          <StepFlow steps={data.steps} activeStep={activeStep} onStepClick={setActiveStep} />
        </div>

        {/* 3. Paso 02: los 8 determinantes */}
        <div className="mb-block">
          <SectionHead n="02" titulo="La encuesta: Recopilación de ocho determinantes" desc="El día de la toma de datos se capturan ocho determinantes alrededor de la persona. Toca cada sector para ver su detalle." />
          <DeterminantsOctagon determinants={data.determinants} />
        </div>

        {/* 4. Paso 03: DFI, 5 dimensiones */}
        <div className="mb-block">
          <SectionHead n="03" titulo="Diagnóstico Funcional Integrado" desc="Cinco dimensiones se integran en un radar dibujado con los valores del paciente. La capa gris es la consulta previa." />
          {area !== null && (
            <div className="mb-badge">
              <span className="mb-dot" />
              Área funcional (relativa): {Math.round(area)}
              {mejoraArea !== null && ` · ${mejoraArea ? 'mayor' : 'menor'} que la consulta previa`}
            </div>
          )}
          <DFIPentagon dfi={data.dfi} onAreaComputed={setArea} />
        </div>

        {/* 5. Matriz de indicadores */}
        <div className="mb-block">
          <SectionHead n="ANI BIS-E" titulo="Matriz de indicadores" desc="Valor vivo, fórmula, rango de normalidad y estado con color. Los nombres de los indicadores son inamovibles." />
          <IndicatorMatrix indicators={data.indicators} />
          <p className="mb-disclaimer">
            Los indicadores ANI BIS-E expresan riesgo y estimación de la función celular; no constituyen un
            diagnóstico definitivo ni un sustituto del juicio clínico.
          </p>
        </div>

        {/* 6. Seguimiento */}
        <div className="mb-block">
          <SectionHead n="04–05" titulo="Seguimiento entre consultas" desc="Dos curvas calculadas: capacitancia de membrana y convergencia del PABU al número áureo φ." />
          <FollowUpCharts followUp={data.followUp} />
        </div>

        <div className="mb-copy">Modelo ANI BIS-E © Gildardo de Jesús Uribe Gil, 2026</div>
      </div>
    </section>
  );
}
