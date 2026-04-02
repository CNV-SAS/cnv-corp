import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
// Usamos el email del entorno, o un fallback seguro por si se olvida configurarlo
const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL || 'cnvcorporate@gmail.com'; 

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, profession, institution, country, message, profile, lang } = body;

    if (!name || !email || !profile) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const profileLabel = lang === 'es' ? 'Perfil' : 'Profile';
    const emailContent = `
      <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #102545; padding: 32px; margin-bottom: 0;">
          <h1 style="color: white; font-size: 20px; margin: 0; font-weight: 800;">
            ${lang === 'es' ? 'Nueva solicitud — CNV' : 'New request — CNV'}
          </h1>
        </div>
        <div style="border: 2px solid #102545; border-top: none; padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">${profileLabel}</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${profile}</td>
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
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${email}</td>
            </tr>
            ${profession ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Profesión</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${profession}</td></tr>` : ''}
            ${institution ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Institución</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${institution}</td></tr>` : ''}
            ${country ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">País</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #102545;">${country}</td></tr>` : ''}
            ${message ? `<tr><td colspan="2" style="padding: 16px 0;"><strong style="color: #102545; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Mensaje</strong><p style="color: #102545; margin: 0; line-height: 1.6;">${message}</p></td></tr>` : ''}
          </table>
        </div>
      </div>
    `;

    if (!resend) {
      console.log('📧 [DEV MODE] Email:', { to: CONTACT_EMAIL, name, email, profile });
      return new Response(JSON.stringify({ success: true, dev: true }), { status: 200 });
    }

    const { data, error } = await resend.emails.send({
      from: 'CNV Web <noreply@cnvcorp.com>', 
      to: [CONTACT_EMAIL], // Usamos la variable de entorno
      replyTo: email,
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