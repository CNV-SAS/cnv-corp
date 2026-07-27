// Acceso a los comentarios públicos en Supabase.
// Se usa la API REST directamente con fetch para no añadir el SDK como
// dependencia: son dos llamadas y el contrato es estable.
//
// Variables de entorno (ver .env.example):
//   PUBLIC_SUPABASE_URL         · URL del proyecto (se puede exponer)
//   PUBLIC_SUPABASE_ANON_KEY    · clave anónima, sólo lee la vista pública
//   SUPABASE_SERVICE_ROLE_KEY   · clave de servicio, SÓLO en el servidor

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export interface ComentarioPublico {
  id: string;
  created_at: string;
  name: string;
  role: string | null;
  location: string | null;
  comment: string;
  lang: string;
}

export interface ComentarioNuevo {
  name: string;
  role: string;
  location: string;
  comment: string;
  email: string;
  lang: string;
  consent: boolean;
  ip: string;
  user_agent: string;
}

/** ¿Está configurada la base de datos? Si no, el sitio sigue funcionando sin ella. */
export const comentariosEnabled = () => Boolean(SUPABASE_URL && ANON_KEY);

/**
 * Lee los comentarios visibles para mostrarlos en la página.
 * Nunca lanza: si Supabase falla o no está configurado, devuelve [] y la
 * página se renderiza igual con los comentarios base.
 */
export async function getComentarios(lang: string, limit = 50): Promise<ComentarioPublico[]> {
  if (!comentariosEnabled()) return [];

  const url =
    `${SUPABASE_URL}/rest/v1/comentarios_publicos` +
    `?select=id,created_at,name,role,location,comment,lang` +
    `&lang=eq.${encodeURIComponent(lang)}` +
    `&order=created_at.desc&limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (!res.ok) {
      console.error('Supabase read failed:', res.status, await res.text());
      return [];
    }
    return (await res.json()) as ComentarioPublico[];
  } catch (err) {
    console.error('Supabase read error:', err);
    return [];
  }
}

/**
 * Guarda un comentario nuevo. Usa la service_role key, así que sólo debe
 * llamarse desde el servidor (endpoint /api/comentario).
 * Devuelve true si quedó guardado.
 */
export async function saveComentario(data: ComentarioNuevo): Promise<boolean> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.warn('⚠️ Supabase no configurado: el comentario sólo se envía por correo.');
    return false;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/comentarios`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error('Supabase insert failed:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase insert error:', err);
    return false;
  }
}
