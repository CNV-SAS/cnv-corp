import { useMemo, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { icon } from '../../lib/icons';
import type { BookingCopy } from './copy';

// ============================================================================
// Asistente de reserva de la valoración en casa.
// ----------------------------------------------------------------------------
// Cuatro pasos (servicio → lugar → fecha → datos) y, al lado, una tarjeta tipo
// "pase" que se va llenando en vivo con lo que el paciente elige. El envío va a
// /api/agendar, que manda el correo al equipo y la confirmación al paciente.
//
// Es una SOLICITUD, no una cita confirmada: no hay agenda real detrás todavía.
// El equipo confirma a mano por WhatsApp o correo. La copia lo dice así.
//
// Estilos: clases `bk-*` definidas en BookingPage.astro (bajo .book-root),
// para que la isla comparta el lenguaje visual de CNV Care.
// ============================================================================

interface Props {
  t: BookingCopy['form'];
  lang: string;
  whatsappPhone: string;
}

type Status = 'idle' | 'loading' | 'done' | 'error';

const SLOT_HOURS: Record<string, [number, number]> = {
  temprano: [6, 9],
  manana: [9, 12],
  tarde: [14, 17],
};

// Código corto legible para identificar la solicitud (sin 0/O ni 1/I).
function makeCode() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return `CNV-${s}`;
}

const pad = (n: number) => String(n).padStart(2, '0');
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Cuatro semanas, de lunes a domingo, empezando en la semana actual. */
function buildCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Primer día reservable: pasado mañana (da tiempo de confirmar la visita).
  const first = new Date(today);
  first.setDate(first.getDate() + 2);
  const start = new Date(today);
  const dow = (start.getDay() + 6) % 7; // 0 = lunes
  start.setDate(start.getDate() - dow);
  const days: { date: Date; iso: string; enabled: boolean }[] = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const enabled = d >= first && d.getDay() !== 0;
    days.push({ date: d, iso: isoDay(d), enabled });
  }
  // Recorta la última semana si quedó entera deshabilitada.
  return days.slice(0, days.slice(28).some((d) => d.enabled) ? 35 : 28);
}

export default function BookingApp({ t, lang, whatsappPhone }: Props) {
  const locale = lang === 'en' ? 'en-US' : 'es-CO';
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [code, setCode] = useState(makeCode);
  const [token, setToken] = useState<string | null>(null);
  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

  const [f, setF] = useState({
    service: 'completa',
    country: t.countries[0],
    city: '',
    address: '',
    neighborhood: '',
    date: '',
    slot: '',
    virtualPref: t.virtual_prefs[0],
    name: '',
    docType: t.doc_types[0],
    docNumber: '',
    email: '',
    phone: '',
    reason: '',
    consent: false,
  });
  const set = (k: keyof typeof f, v: string | boolean) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const calendar = useMemo(buildCalendar, []);
  const weekdays = useMemo(() => {
    // El 1-ene-2024 fue lunes: sirve de base para los nombres de los días.
    return Array.from({ length: 7 }, (_, i) =>
      new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'narrow' }),
    );
  }, [locale]);

  const service = t.services.find((s) => s.id === f.service)!;
  const atHome = f.service !== 'virtual';
  const slots = atHome ? t.slots : t.slots.filter((s) => s.id !== 'temprano');
  const slot = t.slots.find((s) => s.id === f.slot);

  const longDate = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // ── Validación por paso ───────────────────────────────────────────────────
  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!f.city.trim()) e.city = t.required;
      if (atHome && !f.address.trim()) e.address = t.required;
    }
    if (s === 2) {
      if (!f.date) e.date = t.required;
      if (!f.slot) e.slot = t.required;
    }
    if (s === 3) {
      if (!f.name.trim()) e.name = t.required;
      if (!f.docNumber.trim()) e.docNumber = t.required;
      if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = f.email ? t.invalid_email : t.required;
      if (f.phone.replace(/\D/g, '').length < 7) e.phone = t.required;
      if (!f.consent) e.consent = t.consent_error;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setStep((s) => Math.min(3, s + 1));
    document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function chooseService(id: string) {
    set('service', id);
    // Si pasa a "solo virtual" con la franja temprana elegida, se limpia.
    if (id === 'virtual' && f.slot === 'temprano') set('slot', '');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(3)) return;
    if (siteKey && !token) {
      setErrors({ form: t.bot_error });
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          code,
          serviceLabel: service.title,
          slotLabel: slot ? `${slot.label} (${slot.hours})` : '',
          dateLabel: longDate(f.date),
          lang,
          turnstileToken: token,
          audit: {
            consent_given: true,
            consent_text_version: 'agendar-v1.0',
            source: 'cnvsystem.com/agendar',
            timestamp: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('done');
      document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setStatus('error');
    }
  }

  // ── Archivos de salida: .ics y WhatsApp ───────────────────────────────────
  function downloadIcs() {
    const [h0, h1] = SLOT_HOURS[f.slot] || [9, 10];
    const d = f.date.replace(/-/g, '');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const desc = t.ics_desc.replace('{code}', code).replace('{slot}', slot ? `${slot.label} ${slot.hours}` : '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Connected Nutrition Ventures//Agendar//ES',
      'BEGIN:VEVENT',
      `UID:${code}@cnvsystem.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${d}T${pad(h0)}0000`,
      `DTEND:${d}T${pad(h1)}0000`,
      `SUMMARY:${t.ics_title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${atHome ? [f.address, f.neighborhood, f.city].filter(Boolean).join(', ') : t.ticket_virtual}`,
      'STATUS:TENTATIVE',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${code}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }
  const waHref = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(t.wa_text.replace('{code}', code))}`;

  function reset() {
    setF((p) => ({ ...p, name: '', docNumber: '', email: '', phone: '', reason: '', consent: false, date: '', slot: '' }));
    setCode(makeCode());
    setStep(0);
    setStatus('idle');
    setToken(null);
  }

  const err = (k: string) => (errors[k] ? <span className="bk-err">{errors[k]}</span> : null);
  const firstName = f.name.trim().split(/\s+/)[0] || '';

  // ── Tarjeta resumen ───────────────────────────────────────────────────────
  const ticket = (
    <aside className={`bk-ticket ${status === 'done' ? 'is-done' : ''}`} aria-live="polite">
      <div className="bk-ticket-top">
        <span className="bk-ticket-brand">CNV · Care</span>
        <span className="bk-ticket-title">{t.ticket_title}</span>
      </div>
      <dl className="bk-ticket-rows">
        <div>
          <dt>{t.ticket_service}</dt>
          <dd>{service.title}</dd>
        </div>
        <div>
          <dt>{t.ticket_place}</dt>
          <dd className={f.city ? '' : 'is-pending'}>
            {f.city ? `${f.city}, ${f.country}` : t.ticket_pending}
          </dd>
        </div>
        <div>
          <dt>{atHome ? t.ticket_visit : t.ticket_virtual}</dt>
          <dd className={f.date ? '' : 'is-pending'}>
            {f.date ? (
              <>
                <span className="bk-cap">{longDate(f.date)}</span>
                {slot && <small>{slot.hours}</small>}
              </>
            ) : (
              t.ticket_pending
            )}
          </dd>
        </div>
        {atHome && (
          <div>
            <dt>{t.ticket_virtual}</dt>
            <dd>{f.virtualPref}</dd>
          </div>
        )}
      </dl>
      <div className="bk-ticket-tear" aria-hidden="true" />
      <div className="bk-ticket-foot">
        <div>
          <span className="bk-ticket-label">{t.ticket_code}</span>
          <span className="bk-ticket-code">{code}</span>
        </div>
        <ul className="bk-ticket-incl">
          {service.includes.map((x) => (
            <li key={x}>
              <span dangerouslySetInnerHTML={{ __html: icon('check', 14) }} />
              {x}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );

  // ── Pantalla final ────────────────────────────────────────────────────────
  if (status === 'done') {
    return (
      <div className="bk-grid">
        <div className="bk-panel bk-done">
          <div className="bk-done-mark" dangerouslySetInnerHTML={{ __html: icon('check', 34) }} />
          <p className="bk-kicker">{t.ok_kicker}</p>
          <h3>{t.ok_title.replace('{name}', firstName)}</h3>
          <p className="bk-muted">{t.ok_body.replace('{email}', f.email)}</p>
          <p className="bk-sub">{t.ok_next}</p>
          <ol className="bk-next">
            {t.ok_steps.map((s, i) => (
              <li key={i}>
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="bk-actions">
            <button type="button" className="bk-btn" onClick={downloadIcs}>
              {t.ok_calendar}
            </button>
            {whatsappPhone && (
              <a className="bk-btn bk-btn-ghost" href={waHref} target="_blank" rel="noopener">
                {t.ok_whatsapp}
              </a>
            )}
            <button type="button" className="bk-link" onClick={reset}>
              {t.ok_new}
            </button>
          </div>
        </div>
        {ticket}
      </div>
    );
  }

  // ── Asistente ─────────────────────────────────────────────────────────────
  return (
    <div className="bk-grid">
      <form className="bk-panel" onSubmit={submit} noValidate>
        <ol className="bk-steps">
          {t.steps.map((label, i) => (
            <li key={label} className={i === step ? 'on' : i < step ? 'ok' : ''}>
              <button
                type="button"
                disabled={i > step}
                onClick={() => i < step && setStep(i)}
              >
                <span className="bk-step-n">{i < step ? '✓' : i + 1}</span>
                <span className="bk-step-l">{label}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* PASO 1 — SERVICIO */}
        {step === 0 && (
          <div className="bk-body">
            <div className="bk-services">
              {t.services.map((s) => (
                <label key={s.id} className={`bk-service ${f.service === s.id ? 'on' : ''}`}>
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={f.service === s.id}
                    onChange={() => chooseService(s.id)}
                  />
                  <span className="bk-service-head">
                    <span className="bk-service-title">{s.title}</span>
                    {s.badge && <span className="bk-badge">{s.badge}</span>}
                  </span>
                  <span className="bk-service-body">{s.body}</span>
                  <span className="bk-service-incl">
                    {s.includes.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2 — LUGAR */}
        {step === 1 && (
          <div className="bk-body">
            <h3 className="bk-h">{t.where_title}</h3>
            {!atHome && <p className="bk-muted">{t.where_virtual}</p>}
            <div className="bk-row">
              <label className="bk-field">
                <span>{t.country}</span>
                <select value={f.country} onChange={(e) => set('country', e.target.value)}>
                  {t.countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="bk-field">
                <span>{t.city}</span>
                <input
                  value={f.city}
                  placeholder={t.city_ph}
                  onChange={(e) => set('city', e.target.value)}
                  aria-invalid={!!errors.city}
                  autoComplete="address-level2"
                />
                {err('city')}
              </label>
            </div>
            {atHome && (
              <>
                <label className="bk-field">
                  <span>{t.address}</span>
                  <input
                    value={f.address}
                    placeholder={t.address_ph}
                    onChange={(e) => set('address', e.target.value)}
                    aria-invalid={!!errors.address}
                    autoComplete="street-address"
                  />
                  {err('address')}
                </label>
                <label className="bk-field">
                  <span>{t.neighborhood}</span>
                  <input
                    value={f.neighborhood}
                    placeholder={t.neighborhood_ph}
                    onChange={(e) => set('neighborhood', e.target.value)}
                  />
                </label>
                <p className="bk-note">{t.coverage_note}</p>
              </>
            )}
          </div>
        )}

        {/* PASO 3 — FECHA */}
        {step === 2 && (
          <div className="bk-body">
            <h3 className="bk-h">{atHome ? t.when_title : t.when_virtual_title}</h3>
            <p className="bk-label">
              {t.pick_day} <small>· {t.sundays_off}</small>
            </p>
            <div className="bk-cal" role="grid">
              {weekdays.map((w, i) => (
                <span key={i} className="bk-cal-wd">
                  {w}
                </span>
              ))}
              {calendar.map((d, i) => {
                const showMonth = i === 0 || d.date.getDate() === 1;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    disabled={!d.enabled}
                    className={`bk-day ${f.date === d.iso ? 'on' : ''}`}
                    onClick={() => set('date', d.iso)}
                    aria-pressed={f.date === d.iso}
                    aria-label={longDate(d.iso)}
                  >
                    {showMonth && (
                      <small>{d.date.toLocaleDateString(locale, { month: 'short' }).replace('.', '')}</small>
                    )}
                    {d.date.getDate()}
                  </button>
                );
              })}
            </div>
            {err('date')}

            <p className="bk-label">{t.pick_slot}</p>
            <div className="bk-slots">
              {slots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`bk-slot ${f.slot === s.id ? 'on' : ''}`}
                  onClick={() => set('slot', s.id)}
                  aria-pressed={f.slot === s.id}
                >
                  <strong>{s.label}</strong>
                  <span>{s.hours}</span>
                  {s.note && <em>{s.note}</em>}
                </button>
              ))}
            </div>
            {err('slot')}

            {atHome && (
              <label className="bk-field">
                <span>{t.virtual_pref}</span>
                <select value={f.virtualPref} onChange={(e) => set('virtualPref', e.target.value)}>
                  {t.virtual_prefs.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <small className="bk-hint">{t.virtual_pref_hint}</small>
              </label>
            )}
          </div>
        )}

        {/* PASO 4 — DATOS */}
        {step === 3 && (
          <div className="bk-body">
            <h3 className="bk-h">{t.you_title}</h3>
            <label className="bk-field">
              <span>{t.name}</span>
              <input
                value={f.name}
                onChange={(e) => set('name', e.target.value)}
                aria-invalid={!!errors.name}
                autoComplete="name"
              />
              {err('name')}
            </label>
            <div className="bk-row bk-row-doc">
              <label className="bk-field">
                <span>{t.doc_type}</span>
                <select value={f.docType} onChange={(e) => set('docType', e.target.value)}>
                  {t.doc_types.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label className="bk-field">
                <span>{t.doc_number}</span>
                <input
                  value={f.docNumber}
                  inputMode="numeric"
                  onChange={(e) => set('docNumber', e.target.value)}
                  aria-invalid={!!errors.docNumber}
                />
                {errors.docNumber ? err('docNumber') : <small className="bk-hint">{t.doc_hint}</small>}
              </label>
            </div>
            <div className="bk-row">
              <label className="bk-field">
                <span>{t.email}</span>
                <input
                  type="email"
                  value={f.email}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                />
                {err('email')}
              </label>
              <label className="bk-field">
                <span>{t.phone}</span>
                <input
                  type="tel"
                  value={f.phone}
                  placeholder={t.phone_ph}
                  onChange={(e) => set('phone', e.target.value)}
                  aria-invalid={!!errors.phone}
                  autoComplete="tel"
                />
                {err('phone')}
              </label>
            </div>
            <label className="bk-field">
              <span>{t.reason}</span>
              <textarea
                rows={3}
                value={f.reason}
                placeholder={t.reason_ph}
                onChange={(e) => set('reason', e.target.value)}
              />
            </label>
            <label className={`bk-consent ${errors.consent ? 'is-err' : ''}`}>
              <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} />
              <span>
                {t.consent_a}
                <a href={lang === 'en' ? '/en/privacy-policy' : '/politica-privacidad'} target="_blank" rel="noopener">
                  {t.consent_link}
                </a>
                {t.consent_b}
              </span>
            </label>
            {err('consent')}
            {siteKey && (
              <div className="bk-turnstile">
                <Turnstile siteKey={siteKey} onSuccess={setToken} options={{ language: lang }} />
              </div>
            )}
            {errors.form && <p className="bk-alert">{errors.form}</p>}
            {status === 'error' && <p className="bk-alert">{t.error}</p>}
          </div>
        )}

        <div className="bk-nav">
          {step > 0 ? (
            <button type="button" className="bk-link" onClick={() => setStep((s) => s - 1)}>
              ← {t.back}
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button key="next" type="button" className="bk-btn" onClick={next}>
              {t.next} →
            </button>
          ) : (
            <button key="submit" type="submit" className="bk-btn" disabled={status === 'loading'}>
              {status === 'loading' ? t.sending : t.submit}
            </button>
          )}
        </div>
      </form>
      {ticket}
    </div>
  );
}
