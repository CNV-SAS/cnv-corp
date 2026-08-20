export const prerender = false;
import type { APIRoute } from 'astro';

// Proxy de IA para ATLAS.
//
// ATLAS_v7.html es un archivo local que se abre en el navegador del profesional.
// Si la llave de Groq viviera dentro de ese HTML, cualquiera que lo abriera podría
// leerla y usar la cuenta. Por eso la llave vive SÓLO aquí, en las variables de
// entorno de Vercel, y ATLAS llama a este endpoint.
//
// Variables de entorno:
//   GROQ_API_KEY     · obligatoria. Llave de console.groq.com. Nunca en el cliente.
//   ATLAS_IA_TOKEN   · opcional pero recomendada. Si se define, ATLAS debe enviarla
//                      en la cabecera x-atlas-token; sin ella el endpoint queda
//                      abierto y un tercero podría consumir tu cuota de Groq.

// Se leen con `process.env`, en EJECUCIÓN, y no con `import.meta.env`, que Astro
// resuelve en TIEMPO DE COMPILACIÓN. Con `import.meta.env` el valor se hornea en
// el build: si la variable no está presente en el entorno de construcción, el
// despliegue nace con la llave en `undefined` y el endpoint responde 503 aunque
// la variable sí exista en el proyecto. Eso fue lo que pasó el 18-ago-2026 —un
// push que sólo tocaba iconos redesplegó el sitio y dejó sin IA al módulo de
// tratamiento, al diagnóstico y a la lectura de espectroscopía de ATLAS—.
// Leyéndolas en ejecución, rotar la llave tampoco obliga a reconstruir.
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ATLAS_IA_TOKEN = process.env.ATLAS_IA_TOKEN;

// Sólo se permiten estos modelos y este techo de tokens: si alguien alcanzara el
// endpoint, no podría pedir modelos caros ni respuestas ilimitadas.
// Los dos primeros son de texto (diagnóstico). Qwen es el único modelo de la
// cuenta que acepta imágenes: lee la captura de la pantalla de espectroscopía del
// Biody BIS y propone los siete parámetros, que el profesional confirma o corrige
// antes de que entren al cálculo.
const MODELOS_PERMITIDOS = new Set([
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'qwen/qwen3.6-27b',
]);
const MAX_TOKENS_TECHO = 4096;

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

export const POST: APIRoute = async ({ request }) => {
  if (!GROQ_API_KEY) {
    return json(
      { error: 'GROQ_API_KEY no configurada en el servidor. Añádela en Vercel y vuelve a desplegar.' },
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

  const { messages, model = 'llama-3.3-70b-versatile', max_tokens = 2048, temperature = 0.3 } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'Falta el arreglo messages.' }, 400);
  }
  if (!MODELOS_PERMITIDOS.has(model)) {
    return json({ error: `Modelo no permitido: ${model}` }, 400);
  }

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: Math.min(Number(max_tokens) || 2048, MAX_TOKENS_TECHO),
        temperature: Number(temperature) ?? 0.3,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      console.error('Groq error:', r.status, data);
      return json({ error: data?.error?.message || 'Error de Groq', status: r.status }, r.status);
    }

    // Se devuelve el mismo contrato de la API de Groq para que ATLAS no cambie
    // su forma de leer la respuesta (d.choices[0].message.content).
    return json(data);
  } catch (err: any) {
    console.error('ia-diagnostico:', err);
    return json({ error: 'No se pudo contactar al proveedor de IA.' }, 502);
  }
};
