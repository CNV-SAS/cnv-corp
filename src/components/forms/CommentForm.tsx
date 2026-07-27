import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

// Formulario para que los integrantes de la red dejen su comentario del modelo.
// Los textos llegan desde Astro (ya resueltos por idioma) para no duplicar i18n
// dentro de la isla de React.
interface Labels {
  f_name: string;
  f_role: string;
  f_role_ph: string;
  f_location: string;
  f_email: string;
  f_email_help: string;
  f_comment: string;
  f_comment_ph: string;
  f_consent: string;
  f_consent_error: string;
  submit: string;
  sending: string;
  ok_title: string;
  ok_body: string;
  err: string;
  err_fields: string;
  err_captcha: string;
}

interface Props {
  labels: Labels;
  lang: string;
}

export default function CommentForm({ labels, lang }: Props) {
  const [form, setForm] = useState({ name: '', role: '', location: '', email: '', comment: '' });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.comment.trim()) {
      setError(labels.err_fields);
      return;
    }
    if (!consent) {
      setError(labels.f_consent_error);
      return;
    }
    // Si Turnstile está configurado, exigimos el token antes de enviar.
    if (siteKey && !turnstileToken) {
      setError(labels.err_captcha);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/comentario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consent, lang, turnstileToken }),
      });
      if (!res.ok) throw new Error('request_failed');
      setStatus('success');
    } catch {
      setStatus('error');
      setError(labels.err);
    }
  };

  const inputClasses =
    'w-full border-2 border-slate-200 px-4 py-3 text-sm font-600 text-cnv-core outline-none transition-colors bg-white focus:border-cnv-generate';

  const labelClasses =
    'block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2';

  if (status === 'success') {
    return (
      <div className="rounded-2xl border-2 border-cnv-generate/30 bg-white p-10 text-center">
        <div className="text-4xl mb-4" aria-hidden="true">✓</div>
        <h3 className="text-2xl font-800 text-cnv-core">{labels.ok_title}</h3>
        <p className="mt-4 text-sm text-cnv-core/70 leading-relaxed max-w-md mx-auto">
          {labels.ok_body}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses} htmlFor="c-name">{labels.f_name} *</label>
          <input id="c-name" type="text" name="name" required value={form.name}
            onChange={handleChange} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="c-email">{labels.f_email} *</label>
          <input id="c-email" type="email" name="email" required value={form.email}
            onChange={handleChange} className={inputClasses} />
          <p className="mt-2 text-xs text-cnv-core/45">{labels.f_email_help}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses} htmlFor="c-role">{labels.f_role}</label>
          <input id="c-role" type="text" name="role" value={form.role}
            placeholder={labels.f_role_ph} onChange={handleChange} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="c-location">{labels.f_location}</label>
          <input id="c-location" type="text" name="location" value={form.location}
            onChange={handleChange} className={inputClasses} />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="c-comment">{labels.f_comment} *</label>
        <textarea id="c-comment" name="comment" required rows={5} maxLength={2000}
          value={form.comment} placeholder={labels.f_comment_ph}
          onChange={handleChange} className={`${inputClasses} resize-y`} />
        <p className="mt-2 text-xs text-cnv-core/35 text-right">{form.comment.length} / 2000</p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 flex-shrink-0 accent-cnv-generate" />
        <span className="text-xs text-cnv-core/60 leading-relaxed">{labels.f_consent}</span>
      </label>

      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
          options={{ language: lang === 'en' ? 'en' : 'es' }}
        />
      )}

      {error && (
        <p className="text-sm font-600 text-red-600" role="alert">{error}</p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="btn-primary text-sm self-start px-7 py-3 disabled:opacity-50">
        {status === 'loading' ? labels.sending : labels.submit}
      </button>
    </form>
  );
}
