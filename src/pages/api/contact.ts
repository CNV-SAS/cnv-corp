export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL || 'cnvcorporate@gmail.com';
const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Mejora de Seguridad (Sanitización básica para prevenir XSS en el cliente de correo)
const sanitizeInput = (input: string) => {
  if (!input) return '';
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    let { name, email, profession, institution, country, message, profile, lang, audit, turnstileToken } = body;

    // Validación de seguridad de backend estricta
    if (!name || !email || !profile || !audit || !audit.consent_given || !turnstileToken) {
      return new Response(JSON.stringify({ error: 'Missing required fields, consent, or security token' }), { status: 400 });
    }

    // VALIDACIÓN CRIPTOGRÁFICA DE CLOUDFLARE
    if (TURNSTILE_SECRET_KEY) {
      const formData = new URLSearchParams();
      formData.append('secret', TURNSTILE_SECRET_KEY);
      formData.append('response', turnstileToken);
      // Opcional pero recomendado: enviar la IP del usuario a Cloudflare para mayor seguridad
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
      if (ipAddress) formData.append('remoteip', ipAddress);

      const cfResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      });

      const cfData = await cfResult.json();

      if (!cfData.success) {
        console.error('Turnstile verification failed:', cfData);
        return new Response(JSON.stringify({ error: 'Security verification failed (Bot detected)' }), { status: 403 });
      }
    } else {
      console.warn('⚠️ TURNSTILE_SECRET_KEY no configurada. Saltando verificación de seguridad en modo DEV.');
    }

    // Sanitización de entradas
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    profession = sanitizeInput(profession);
    institution = sanitizeInput(institution);
    country = sanitizeInput(country);
    message = sanitizeInput(message);
    profile = sanitizeInput(profile);

    // Captura Forense de Datos (Vercel / Cloudflare headers)
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'Localhost / IP no detectada';
    const userAgent = request.headers.get('user-agent') || 'User-Agent no detectado';

    const profileLabel = lang === 'es' ? 'Perfil' : 'Profile';
    
    // RESTAURACIÓN DEL CUERPO DEL CORREO
    const emailContent = `
      <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
        
        <!-- Header -->
        <div style="background: #102545; padding: 32px; margin-bottom: 0;">
          <h1 style="color: white; font-size: 20px; margin: 0; font-weight: 800;">
            ${lang === 'es' ? 'Nueva solicitud — CNV' : 'New request — CNV'}
          </h1>
        </div>

        <!-- Body de Información del Usuario -->
        <div style="border: 2px solid #102545; border-top: none; padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; width: 120px;">
                <strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">${profileLabel}</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;"><strong>${profile}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Nombre</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Email</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
              </td>
            </tr>
            ${profession ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Profesión</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${profession}</td></tr>` : ''}
            ${institution ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Institución</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${institution}</td></tr>` : ''}
            ${country ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">País</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${country}</td></tr>` : ''}
            ${message ? `<tr><td colspan="2" style="padding: 16px 0;"><strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Mensaje / Interés</strong><p style="color: #102545; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p></td></tr>` : ''}
          </table>
        </div>
        
        <!-- BLOQUE DE AUDITORÍA LEGAL (Uso Interno) -->
        <div style="background: #f8fafc; padding: 24px 32px; border: 2px solid #102545; border-top: none;">
          <h2 style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin: 0 0 12px 0;">
            Log de Auditoría y Consentimiento (Ley 1581)
          </h2>
          <table style="width: 100%; font-size: 11px; color: #475569; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; width: 120px;"><strong>Consentimiento:</strong></td>
              <td style="padding: 4px 0; color: #059669;">✔ Otorgado (Versión: ${audit.consent_text_version})</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Timestamp:</strong></td>
              <td style="padding: 4px 0; font-family: monospace;">${audit.timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Dirección IP:</strong></td>
              <td style="padding: 4px 0; font-family: monospace;">${ipAddress}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Origen (Source):</strong></td>
              <td style="padding: 4px 0;">${audit.source}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; vertical-align: top;"><strong>User Agent:</strong></td>
              <td style="padding: 4px 0; font-family: monospace; word-break: break-all;">${userAgent}</td>
            </tr>
          </table>
        </div>

      </div>
    `;

    if (!resend) {
      console.log('📧 [DEV MODE] Email:', { to: CONTACT_EMAIL, name, email, profile });
      return new Response(JSON.stringify({ success: true, dev: true }), { status: 200 });
    }

    const { data, error } = await resend.emails.send({
      from: 'CNV Web <noreply@cnvsystem.com>', 
      to: [CONTACT_EMAIL], 
      replyTo: email, // El "Reply-to" permite que si le das a "Responder" en Gmail, le respondas directo al cliente
      subject: `[CNV] Nueva solicitud — ${profile} — ${name}`,
      html: emailContent,
    });

    if (error) {
      console.error('Resend Error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });

  } catch (error) {
    console.error('Contact endpoint error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};