export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// ============================================================================
// POST /api/agendar — solicitud de valoración en casa + consulta virtual.
// ----------------------------------------------------------------------------
// Manda dos correos con Resend:
//   1) al equipo (CONTACT_EMAIL), con los datos y el registro de consentimiento;
//   2) al paciente, con su código y lo que sigue.
// Usa las MISMAS variables que /api/contact (RESEND_API_KEY, CONTACT_EMAIL,
// TURNSTILE_SECRET_KEY): no hay que configurar nada nuevo en Vercel.
//
// `process.env` y no `import.meta.env`: así la llave se lee en ejecución y no
// se hornea en el build (ver contact.ts e ia-diagnostico.ts).
// ============================================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'cnvcorporate@gmail.com';
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const esc = (v: unknown, max = 600) =>
  String(v ?? '')
    .slice(0, max)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const SERVICES = ['completa', 'seguimiento', 'virtual'];

export const POST: APIRoute = async ({ request }) => {
  try {
    const b = await request.json();

    // ── Validación ──────────────────────────────────────────────────────────
    const atHome = b.service !== 'virtual';
    const missing =
      !SERVICES.includes(b.service) ||
      !b.name?.trim() ||
      !b.docNumber?.trim() ||
      !/^\S+@\S+\.\S+$/.test(b.email || '') ||
      String(b.phone || '').replace(/\D/g, '').length < 7 ||
      !b.city?.trim() ||
      (atHome && !b.address?.trim()) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.date || '') ||
      !b.slot ||
      !b.consent ||
      !b.audit?.consent_given;
    if (missing) return json({ error: 'Missing or invalid fields' }, 400);

    const code = /^CNV-[A-Z0-9]{5}$/.test(b.code || '') ? b.code : `CNV-${Date.now().toString(36).slice(-5).toUpperCase()}`;

    // ── Turnstile (si está configurado) ────────────────────────────────────
    if (TURNSTILE_SECRET_KEY) {
      if (!b.turnstileToken) return json({ error: 'Missing security token' }, 400);
      const form = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: b.turnstileToken });
      const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
      if (ip) form.append('remoteip', ip);
      const cf = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
      const cfData = await cf.json();
      if (!cfData.success) return json({ error: 'Security verification failed' }, 403);
    }

    const en = b.lang === 'en';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'No detectada';
    const ua = request.headers.get('user-agent') || 'No detectado';

    // ── Correo al equipo ────────────────────────────────────────────────────
    const row = (label: string, value: string) =>
      value
        ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;width:150px;vertical-align:top"><strong style="color:#16324F;font-size:11px;text-transform:uppercase;letter-spacing:.08em">${label}</strong></td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#16324F">${value}</td></tr>`
        : '';

    const team = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;background:#fff">
        <div style="background:#16324F;padding:28px 32px">
          <p style="margin:0;color:#C9A961;font-size:11px;letter-spacing:.2em;text-transform:uppercase">Nueva solicitud de cita · ${esc(code)}</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:20px">${esc(b.serviceLabel)} — ${esc(b.name)}</h1>
        </div>
        <div style="border:2px solid #16324F;border-top:none;padding:28px 32px">
          <table style="width:100%;border-collapse:collapse">
            ${row('Servicio', esc(b.serviceLabel))}
            ${row(atHome ? 'Visita' : 'Videollamada', `${esc(b.dateLabel)} · ${esc(b.slotLabel)}`)}
            ${atHome ? row('Consulta virtual', esc(b.virtualPref)) : ''}
            ${row('Ciudad', `${esc(b.city)}, ${esc(b.country)}`)}
            ${atHome ? row('Dirección', `${esc(b.address)}${b.neighborhood ? ` — ${esc(b.neighborhood)}` : ''}`) : ''}
            ${row('Nombre', esc(b.name))}
            ${row('Documento', `${esc(b.docType)} ${esc(b.docNumber)}`)}
            ${row('Email', `<a href="mailto:${esc(b.email)}" style="color:#147F76">${esc(b.email)}</a>`)}
            ${row('WhatsApp', `<a href="https://wa.me/${esc(String(b.phone).replace(/\D/g, ''))}" style="color:#147F76">${esc(b.phone)}</a>`)}
            ${row('Motivo', esc(b.reason, 2000).replace(/\n/g, '<br>'))}
          </table>
          <p style="margin:20px 0 0;font-size:13px;color:#5B6B7A">Pendiente: confirmar profesional y hora, y enviar al paciente el enlace personal de la encuesta.</p>
        </div>
        <div style="background:#F6F4EF;padding:20px 32px;border:2px solid #16324F;border-top:none;font-size:11px;color:#475569">
          <strong style="text-transform:uppercase;letter-spacing:.08em">Consentimiento (Ley 1581 · datos sensibles)</strong><br>
          Otorgado · versión ${esc(b.audit.consent_text_version)} · ${esc(b.audit.timestamp)}<br>
          IP: ${esc(ip)} · Origen: ${esc(b.audit.source)} · Idioma: ${en ? 'EN' : 'ES'}<br>
          UA: <span style="font-family:monospace;word-break:break-all">${esc(ua, 300)}</span>
        </div>
      </div>`;

    // ── Correo al paciente ──────────────────────────────────────────────────
    const first = esc(String(b.name).trim().split(/\s+/)[0]);
    const patient = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;color:#1A2B3C">
        <div style="background:#16324F;padding:32px">
          <p style="margin:0;color:#C9A961;font-size:11px;letter-spacing:.2em;text-transform:uppercase">CNV Care</p>
          <h1 style="margin:10px 0 0;color:#fff;font-size:22px;line-height:1.25">${en ? `We have your request, ${first}.` : `Recibimos tu solicitud, ${first}.`}</h1>
        </div>
        <div style="padding:28px 32px;border:1px solid #E4DECF;border-top:none">
          <p style="margin:0 0 18px;line-height:1.6">${
            en
              ? 'Our team will contact you by WhatsApp or email to confirm the day, time and the professional who will visit you.'
              : 'Nuestro equipo te escribirá por WhatsApp o correo para confirmar el día, la hora y el profesional que te visitará.'
          }</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            ${row(en ? 'Code' : 'Código', `<strong style="font-family:monospace;font-size:16px">${esc(code)}</strong>`)}
            ${row(en ? 'Service' : 'Servicio', esc(b.serviceLabel))}
            ${row(en ? 'Preferred date' : 'Fecha preferida', `${esc(b.dateLabel)} · ${esc(b.slotLabel)}`)}
            ${row(en ? 'City' : 'Ciudad', `${esc(b.city)}, ${esc(b.country)}`)}
          </table>
          ${
            atHome
              ? `<p style="margin:22px 0 6px;font-weight:600;color:#16324F">${en ? 'Before the visit' : 'Antes de la visita'}</p>
                 <p style="margin:0;font-size:13px;line-height:1.6;color:#5B6B7A">${
                   en
                     ? '4-hour fast (water only), no intense exercise in the previous 12 h, no alcohol in the previous 24 h, empty bladder, and no rings, watches or creams on hands and feet.'
                     : 'Ayuno de 4 horas (sólo agua), sin ejercicio intenso en las 12 h previas, sin alcohol en las 24 h previas, vejiga vacía, y sin anillos, relojes ni cremas en manos y pies.'
                 }</p>`
              : ''
          }
          <p style="margin:22px 0 0;font-size:12px;color:#94a3b8">${
            en
              ? 'This is a request, not yet a confirmed appointment. Connected Nutrition Ventures S.A. · cnvsystem.com'
              : 'Esto es una solicitud, aún no una cita confirmada. Connected Nutrition Ventures S.A. · cnvsystem.com'
          }</p>
        </div>
      </div>`;

    if (!resend) {
      console.log('📅 [DEV MODE] Solicitud de cita:', { code, service: b.service, name: b.name, city: b.city, date: b.date });
      return json({ success: true, code, dev: true });
    }

    const sent = await resend.emails.send({
      from: 'CNV Web <noreply@cnvsystem.com>',
      to: [CONTACT_EMAIL],
      replyTo: b.email,
      subject: `[CNV] Cita ${code} — ${b.serviceLabel} — ${b.name} (${b.city})`,
      html: team,
    });
    if (sent.error) {
      console.error('Resend (equipo):', sent.error);
      return json({ error: 'Email failed' }, 502);
    }

    // La confirmación al paciente es secundaria: si falla, la solicitud ya llegó.
    const conf = await resend.emails.send({
      from: 'CNV Care <noreply@cnvsystem.com>',
      to: [b.email],
      replyTo: CONTACT_EMAIL,
      subject: en ? `Your CNV assessment request · ${code}` : `Tu solicitud de valoración CNV · ${code}`,
      html: patient,
    });
    if (conf.error) console.error('Resend (paciente):', conf.error);

    return json({ success: true, code });
  } catch (error) {
    console.error('agendar endpoint error:', error);
    return json({ error: 'Internal server error' }, 500);
  }
};
