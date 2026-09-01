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
//   GEMINI_API_KEY   · llave de aistudio.google.com. La usan los modelos `gemini-*`,
//                      que son los del diagnóstico: su plan gratuito da 250.000
//                      tokens por minuto, frente a los 8.000 de Groq.
//   GROQ_API_KEY     · llave de console.groq.com. La usan el resto de modelos, y
//                      Qwen en particular, que es quien lee la captura de la
//                      pantalla de espectroscopía porque acepta imágenes.
//   Hace falta al menos una de las dos; cada consulta exige la de su proveedor.
//   ATLAS_IA_TOKEN   · opcional pero recomendada. Si se define, ATLAS debe enviarla
//                      en la cabecera x-atlas-token; sin ella el endpoint queda
//                      abierto y un tercero podría consumir tu cuota.

// Se leen con `process.env`, en EJECUCIÓN, y no con `import.meta.env`, que Astro
// resuelve en TIEMPO DE COMPILACIÓN. Con `import.meta.env` el valor se hornea en
// el build: si la variable no está presente en el entorno de construcción, el
// despliegue nace con la llave en `undefined` y el endpoint responde 503 aunque
// la variable sí exista en el proyecto. Eso fue lo que pasó el 18-ago-2026 —un
// push que sólo tocaba iconos redesplegó el sitio y dejó sin IA al módulo de
// tratamiento, al diagnóstico y a la lectura de espectroscopía de ATLAS—.
// Leyéndolas en ejecución, rotar la llave tampoco obliga a reconstruir.
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ATLAS_IA_TOKEN = process.env.ATLAS_IA_TOKEN;

// Sólo se permiten estos modelos y este techo de tokens: si alguien alcanzara el
// endpoint, no podría pedir modelos caros ni respuestas ilimitadas.
//
// Qwen acepta imágenes y es el que lee la captura de la pantalla de espectroscopía
// del Biody BIS: propone los siete parámetros y el profesional los confirma o los
// corrige antes de que entren al cálculo. Para eso se queda.
//
// Para TEXTO (el diagnóstico) se añaden los GPT-OSS, y la razón es de tiempo de
// consulta. Los dos Llama responden 404 «does not exist or you do not have access
// to it»: la cuenta no los tiene, aunque Groq los liste como activos. Eso dejaba
// como única opción de texto a Qwen, que es un modelo de RAZONAMIENTO: antepone su
// borrador entre <think>…</think>, gasta ahí la mayor parte del presupuesto y del
// tiempo, y el diagnóstico completo tardaba cinco minutos. Un profesional no puede
// esperar eso con el paciente delante. El 20B va a 1.000 tokens/s —contra los 280
// del Llama 70B— y no razona en voz alta: todo el presupuesto va a la respuesta.
// El 120B queda como alternativa si el 20B se queda corto en calidad.
// Los `gemini-*` van a Google; el resto, a Groq. El proveedor se elige por el
// nombre del modelo, así que ATLAS solo cambia esa cadena para moverse de uno a
// otro. Google entra porque el plan gratuito de Groq da 8.000 tokens POR MINUTO y
// una consulta de diagnóstico completa gasta ~8.230 entre sus cuatro pasos: no
// cabe por diseño, y ningún ajuste de presupuesto lo arregla. El plan gratuito de
// Gemini da 250.000 por minuto. Groq se conserva como respaldo y porque Qwen es
// quien lee la captura de la pantalla del Biody BIS, que necesita imágenes.
const MODELOS_PERMITIDOS = new Set([
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'qwen/qwen3.6-27b',
]);
const esGemini = (m: string) => m.startsWith('gemini-');
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
  // La llave se exige según con quién se vaya a hablar, no antes: si falta la de
  // Groq, las consultas a Gemini deben seguir funcionando, y al revés.
  if (!GROQ_API_KEY && !GEMINI_API_KEY) {
    return json(
      { error: 'No hay ninguna llave de IA configurada en el servidor (GEMINI_API_KEY o GROQ_API_KEY). Añádela en Vercel y vuelve a desplegar.' },
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

  // Por defecto, el modelo de texto que la cuenta sí tiene y que no razona en voz alta.
  const { messages, model = 'openai/gpt-oss-20b', max_tokens = 2048, temperature = 0.3 } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'Falta el arreglo messages.' }, 400);
  }
  if (!MODELOS_PERMITIDOS.has(model)) {
    return json({ error: `Modelo no permitido: ${model}` }, 400);
  }

  // ── GOOGLE GEMINI ────────────────────────────────────────────────────────
  // Habla distinto que Groq: el mensaje de sistema va aparte, los turnos se
  // llaman `contents` con `parts`, y el rol del modelo es "model", no "assistant".
  // La respuesta se traduce al contrato de Groq —choices[0].message.content— para
  // que ATLAS no tenga que saber con quién está hablando.
  if (esGemini(model)) {
    if (!GEMINI_API_KEY) {
      return json(
        { error: 'GEMINI_API_KEY no configurada en el servidor. Añádela en Vercel y vuelve a desplegar.' },
        503
      );
    }
    try {
      const sys = messages.filter((m: any) => m.role === 'system').map((m: any) => m.content).join('\n\n');
      const turnos = messages
        .filter((m: any) => m.role !== 'system')
        .map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(m.content ?? '') }],
        }));

      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
          body: JSON.stringify({
            ...(sys ? { system_instruction: { parts: [{ text: sys }] } } : {}),
            contents: turnos,
            generationConfig: {
              maxOutputTokens: Math.min(Number(max_tokens) || 2048, MAX_TOKENS_TECHO),
              temperature: Number(temperature) ?? 0.3,
              // Sin esto, la serie 2.5 razona antes de responder y se gasta el
              // presupuesto en el borrador, igual que hacía Qwen: la respuesta
              // salía vacía y la pantalla en blanco.
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
        }
      );

      const data: any = await r.json();
      if (!r.ok) {
        console.error('Gemini error:', r.status, data);
        return json({ error: data?.error?.message || 'Error de Gemini', status: r.status }, r.status);
      }

      const cand = data?.candidates?.[0];
      const texto = (cand?.content?.parts || []).map((p: any) => p?.text || '').join('');
      const u = data?.usageMetadata || {};
      return json({
        model,
        choices: [{
          index: 0,
          message: { role: 'assistant', content: texto },
          finish_reason: cand?.finishReason === 'MAX_TOKENS' ? 'length' : 'stop',
        }],
        usage: {
          prompt_tokens: u.promptTokenCount ?? 0,
          completion_tokens: u.candidatesTokenCount ?? 0,
          total_tokens: u.totalTokenCount ?? 0,
        },
      });
    } catch (err: any) {
      console.error('ia-diagnostico (gemini):', err);
      return json({ error: 'No se pudo contactar a Gemini.' }, 502);
    }
  }

  // ── GROQ ─────────────────────────────────────────────────────────────────
  if (!GROQ_API_KEY) {
    return json(
      { error: 'GROQ_API_KEY no configurada en el servidor. Añádela en Vercel y vuelve a desplegar.' },
      503
    );
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
