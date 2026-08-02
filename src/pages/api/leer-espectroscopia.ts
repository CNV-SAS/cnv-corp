export const prerender = false;
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

// Lectura asistida de la pantalla "DATOS DE ESPECTROSCOPIA" del Biody BIS.
//
// Fase 2 de CC_espectroscopia_antropometria.txt: un modelo de visión propone los
// siete parámetros de Cole-Cole leídos de la captura; el profesional los confirma
// o corrige en ATLAS antes de que entren al cálculo. Ningún valor propuesto aquí
// llega a un indicador sin esa confirmación.
//
// La llave vive solo en las variables de entorno de Vercel. ATLAS es un archivo
// local que se le entrega a cada profesional: si la llave estuviera dentro,
// cualquiera que abriera el HTML podría leerla.
//
// Variables de entorno:
//   ANTHROPIC_API_KEY · obligatoria.
//   ATLAS_IA_TOKEN    · opcional. Si se define, ATLAS debe enviarla en la
//                       cabecera x-atlas-token.

const ANTHROPIC_API_KEY = import.meta.env.ANTHROPIC_API_KEY;
const ATLAS_IA_TOKEN = import.meta.env.ATLAS_IA_TOKEN;

const cors = {
  // ATLAS se abre como archivo local, así que su Origin es "null" y no se puede
  // restringir por dominio. La protección real es el token, no el origen.
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-atlas-token',
  'Access-Control-Max-Age': '86400',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: cors });

const PROMPT =
  'La imagen es la pantalla "DATOS DE ESPECTROSCOPIA" de un equipo de bioimpedancia Biody. ' +
  'Lee EXACTAMENTE los siete valores del panel. No calcules nada, no corrijas nada: transcribe lo que ves. ' +
  'Si un valor no se lee con certeza, devuélvelo como null en lugar de adivinarlo.';

const ESQUEMA = {
  type: 'object',
  properties: {
    Rinf: { type: ['number', 'null'], description: 'R∞, resistencia a frecuencia infinita, en ohmios' },
    Re: { type: ['number', 'null'], description: 'Resistencia extracelular, en ohmios' },
    Ri: { type: ['number', 'null'], description: 'Resistencia intracelular, en ohmios' },
    C: { type: ['number', 'null'], description: 'Capacitancia de membrana, en nF' },
    Fo: { type: ['number', 'null'], description: 'Frecuencia característica, en kHz' },
    Rc: { type: ['number', 'null'], description: 'Resistencia del centro del círculo, en ohmios' },
    Xcc: { type: ['number', 'null'], description: 'Reactancia del centro del círculo, negativa, en ohmios' },
  },
  required: ['Rinf', 'Re', 'Ri', 'C', 'Fo', 'Rc', 'Xcc'],
  additionalProperties: false,
};

const MEDIOS_VALIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

export const POST: APIRoute = async ({ request }) => {
  if (!ANTHROPIC_API_KEY) {
    return json(
      { error: 'ANTHROPIC_API_KEY no configurada en el servidor. Añádela en Vercel y vuelve a desplegar.' },
      503
    );
  }
  if (ATLAS_IA_TOKEN && request.headers.get('x-atlas-token') !== ATLAS_IA_TOKEN) {
    return json({ error: 'Token de acceso inválido.' }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Cuerpo JSON inválido.' }, 400);
  }

  // Se acepta la imagen como data URL, que es lo que produce un FileReader.
  const imagen: string = body?.imagen || '';
  const m = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(imagen);
  if (!m) {
    return json({ error: 'Falta la imagen, o no viene como data URL en base64.' }, 400);
  }
  const media = m[1].toLowerCase();
  const datos = m[2];
  if (!MEDIOS_VALIDOS.includes(media as any)) {
    return json({ error: `Formato de imagen no admitido: ${media}` }, 400);
  }
  // El límite de ATLAS es 10 MB; en base64 eso son ~13,4 MB de texto.
  if (datos.length > 14_000_000) {
    return json({ error: 'La imagen supera el límite de 10 MB.' }, 413);
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  try {
    const respuesta = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1024,
      output_config: { format: { type: 'json_schema', schema: ESQUEMA } },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: media as any, data: datos } },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    });

    if (respuesta.stop_reason === 'refusal') {
      return json({ error: 'El modelo declinó procesar la imagen.' }, 422);
    }

    const texto = respuesta.content.find((b) => b.type === 'text');
    if (!texto || texto.type !== 'text') {
      return json({ error: 'El modelo no devolvió texto.' }, 502);
    }

    let valores: Record<string, number | null>;
    try {
      valores = JSON.parse(texto.text);
    } catch {
      return json({ error: 'El modelo no devolvió un JSON legible.' }, 502);
    }

    const leidos = Object.values(valores).filter((v) => typeof v === 'number' && isFinite(v)).length;
    if (leidos === 0) {
      return json({ error: 'No se pudo leer ningún valor de la imagen.' }, 422);
    }

    return json({ valores, leidos, modelo: respuesta.model });
  } catch (err: any) {
    console.error('leer-espectroscopia:', err);
    const status = typeof err?.status === 'number' ? err.status : 502;
    return json({ error: err?.message || 'No se pudo contactar al servicio de lectura.' }, status);
  }
};
