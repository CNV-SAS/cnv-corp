export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Recibe los comentarios que dejan los integrantes de la red en /comentarios.
// NO publica nada: envía el comentario por correo para que CNV lo revise y
// decida si lo agrega a t.testimonials.items. La moderación es deliberada:
// es el sitio de una empresa de salud, no un muro abierto.

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL || 'cnvcorporate@gmail.com';
const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const sanitizeInput = (input: string) => {
  if (!input) return '';
  return String(input).replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// Límites para que un envío no pueda inflar el correo ni el log.
const MAX = { name: 120, role: 120, location: 120, email: 160, comment: 2000 };
const clamp = (v: string, max: number) => (v || '').slice(0, max);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    let { name, role, location, email, comment, consent, lang, turnstileToken } = body;

    if (!name || !email || !comment) {
      return new Response(JSON.stringify({ error: 'missing_fields' }), { status: 400 });
    }

    // Sin consentimiento explícito no se puede publicar, así que no se acepta.
    if (!consent) {
      return new Response(JSON.stringify({ error: 'missing_consent' }), { status: 400 });
    }

    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'missing_token' }), { status: 400 });
    }

    // Verificación anti-bot de Cloudflare (misma que el formulario de contacto).
    if (TURNSTILE_SECRET_KEY) {
      const formData = new URLSearchParams();
      formData.append('secret', TURNSTILE_SECRET_KEY);
      formData.append('response', turnstileToken);
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
      if (ip) formData.append('remoteip', ip);

      const cfResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      });
      const cfData = await cfResult.json();

      if (!cfData.success) {
        console.error('Turnstile verification failed:', cfData);
        return new Response(JSON.stringify({ error: 'captcha_failed' }), { status: 403 });
      }
    } else {
      console.warn('⚠️ TURNSTILE_SECRET_KEY no configurada. Saltando verificación en modo DEV.');
    }

    name = sanitizeInput(clamp(name, MAX.name));
    role = sanitizeInput(clamp(role, MAX.role));
    location = sanitizeInput(clamp(location, MAX.location));
    email = sanitizeInput(clamp(email, MAX.email));
    comment = sanitizeInput(clamp(comment, MAX.comment));

    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-connecting-ip') ||
      'IP no detectada';
    const userAgent = request.headers.get('user-agent') || 'User-Agent no detectado';
    const timestamp = new Date().toISOString();

    // Bloque listo para copiar y pegar en es.ts / en.ts si se aprueba.
    const snippet = `{ name: '${name.replace(/'/g, "\\'")}', role: '${role.replace(/'/g, "\\'")}', location: '${location.replace(/'/g, "\\'")}', quote: '${comment.replace(/'/g, "\\'")}' },`;

    const emailContent = `
      <div style="font-family: Montserrat, sans-serif; max-width: 620px; margin: 0 auto; background: white;">

        <div style="background: #102545; padding: 32px;">
          <h1 style="color: white; font-size: 20px; margin: 0; font-weight: 800;">
            Nuevo comentario para revisión — CNV
          </h1>
          <p style="color: #9fb3cc; font-size: 12px; margin: 8px 0 0;">
            No se ha publicado nada. Revisa el contenido antes de agregarlo al sitio.
          </p>
        </div>

        <div style="border: 2px solid #102545; border-top: none; padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; width: 130px;"><strong style="color:#102545;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Nombre</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color:#102545;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color:#102545;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Perfil</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color:#102545;">${role || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color:#102545;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Ciudad</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color:#102545;">${location || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color:#102545;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Email</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 20px 0 0;">
                <strong style="color:#102545;font-size:11px;text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:8px;">Comentario</strong>
                <p style="color:#102545;margin:0;line-height:1.65;white-space:pre-wrap;">${comment}</p>
              </td>
            </tr>
          </table>
        </div>

        <div style="background:#f1f5f9;padding:20px 32px;border:2px solid #102545;border-top:none;">
          <h2 style="font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#64748b;margin:0 0 10px;">
            Para publicarlo: pega esto en testimonials.items de es.ts / en.ts
          </h2>
          <code style="display:block;font-family:monospace;font-size:11px;color:#0f172a;background:#fff;border:1px solid #cbd5e1;padding:12px;word-break:break-word;white-space:pre-wrap;">${snippet}</code>
        </div>

        <div style="background:#f8fafc;padding:24px 32px;border:2px solid #102545;border-top:none;">
          <h2 style="font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#64748b;margin:0 0 12px;">
            Log de auditoría y consentimiento (Ley 1581)
          </h2>
          <table style="width:100%;font-size:11px;color:#475569;border-collapse:collapse;">
            <tr><td style="padding:4px 0;width:130px;"><strong>Autorización:</strong></td><td style="padding:4px 0;color:#059669;">✔ Otorgada para publicar nombre, perfil y ciudad</td></tr>
            <tr><td style="padding:4px 0;"><strong>Timestamp:</strong></td><td style="padding:4px 0;font-family:monospace;">${timestamp}</td></tr>
            <tr><td style="padding:4px 0;"><strong>Dirección IP:</strong></td><td style="padding:4px 0;font-family:monospace;">${ipAddress}</td></tr>
            <tr><td style="padding:4px 0;"><strong>Idioma:</strong></td><td style="padding:4px 0;">${lang === 'en' ? 'EN' : 'ES'}</td></tr>
            <tr><td style="padding:4px 0;vertical-align:top;"><strong>User Agent:</strong></td><td style="padding:4px 0;font-family:monospace;word-break:break-all;">${userAgent}</td></tr>
          </table>
        </div>

      </div>
    `;

    if (!resend) {
      console.log('📧 [DEV MODE] Comentario:', { to: CONTACT_EMAIL, name, role, email });
      return new Response(JSON.stringify({ success: true, dev: true }), { status: 200 });
    }

    const { data, error } = await resend.emails.send({
      from: 'CNV Web <noreply@cnvsystem.com>',
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `[CNV] Nuevo comentario — ${role || 'sin perfil'} — ${name}`,
      html: emailContent,
    });

    if (error) {
      console.error('Resend Error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    console.error('Comentario endpoint error:', error);
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500 });
  }
};
