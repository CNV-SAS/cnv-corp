'use client';
import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

interface FormTranslations {
  profile_label: string;
  profile_options: readonly string[];
  name: string;
  email: string;
  profession: string;
  institution: string;
  country: string;
  message: string;
  message_institution: string;
  message_patient: string;
  legal_consent: string;
  legal_error: string;
  submit: string;
  sending: string;
  response_time: string;
  success: string;
  success_subtitle: string;
  error: string;
}

interface ExclusivityTranslations {
  tag: string;
  title: string;
  subtitle: string;
  requirements: readonly string[];
}

interface Props {
  t: FormTranslations;
  exclusivity: ExclusivityTranslations;
  lang: string;
}

// ARQUITECTURA LIMPIA: Strings completos para que Tailwind los compile
const PROFILES_CONFIG = [
  { 
    icon: '⚕',
    btnClass: 'border-cnv-execute bg-cnv-execute/10 text-cnv-execute',
    inputClass: 'focus:border-cnv-execute focus:ring-1 focus:ring-cnv-execute',
    excBorder: 'border-cnv-execute',
    excBg: 'bg-cnv-execute/5',
    excText: 'text-cnv-execute'
  },
  { 
    icon: '🏛',
    // CORRECCIÓN: Usamos cnv-transfer (Azul claro) en lugar del verde
    btnClass: 'border-cnv-transfer bg-cnv-transfer/10 text-cnv-transfer',
    inputClass: 'focus:border-cnv-transfer focus:ring-1 focus:ring-cnv-transfer',
    excBorder: 'border-cnv-transfer',
    excBg: 'bg-cnv-transfer/5',
    excText: 'text-cnv-transfer'
  },
  { 
    icon: '🧬',
    btnClass: 'border-cnv-generate bg-cnv-generate/10 text-cnv-generate',
    inputClass: 'focus:border-cnv-generate focus:ring-1 focus:ring-cnv-generate',
    excBorder: 'border-cnv-generate',
    excBg: 'bg-cnv-generate/5',
    excText: 'text-cnv-generate'
  },
];

export default function ContactForm({ t, exclusivity, lang }: Props) {
  const [profile, setProfile] = useState<0 | 1 | 2>(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [consentError, setConsentError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    institution: '',
    country: '',
    message: '',
    consent: false,
  });

  const profileLabels = t.profile_options;
  const activeConf = PROFILES_CONFIG[profile];
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
    if (e.target.name === 'consent' && value) setConsentError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validación estricta del consentimiento
    if (!formData.consent) {
      setConsentError(true);
      return;
    }

    if (!turnstileToken) {
      setStatus('error'); // Opcional: Podrías crear un estado de error específico para "Por favor verifica que eres humano"
      return;
    }

    setStatus('loading');

    // Metadatos de auditoría (Nivel Alto)
    const auditData = {
      consent_given: true,
      consent_text_version: 'v1.0',
      source: 'cnvsystem.com/contact',
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          profile: profileLabels[profile], 
          lang,
          audit: auditData,
          turnstileToken
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const messageLabel = profile === 0 ? t.message : profile === 1 ? t.message_institution : t.message_patient;
  
  // Clase base para inputs (combinada con el focus dinámico)
  const inputClasses = `w-full border-2 border-slate-200 px-4 py-3 text-sm font-600 text-cnv-core outline-none transition-colors bg-white ${activeConf.inputClass}`;

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 border-2 ${activeConf.excBg} ${activeConf.excBorder}`}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 14l7 7 11-13" stroke="currentColor" className={activeConf.excText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-800 text-cnv-core mb-3">
          {t.success}
        </h3>
        <p className="text-sm text-cnv-core/50 font-600">
          {t.success_subtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Profile selector */}
      <div className="mb-10">
        <p className="text-xs font-700 tracking-[0.2em] uppercase text-cnv-core/40 mb-4">
          {t.profile_label}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profileLabels.map((label, i) => {
            const conf = PROFILES_CONFIG[i];
            const isActive = profile === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setProfile(i as 0 | 1 | 2)}
                className={`flex items-center gap-3 p-4 border-2 text-left transition-all duration-300 text-sm font-700 ${
                  isActive 
                    ? conf.btnClass 
                    : 'border-slate-200 text-cnv-core hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="text-xl">{conf.icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exclusivity box for professionals */}
      {profile === 0 && (
        <div className={`mb-10 p-6 border-l-4 animate-fade-in ${activeConf.excBorder} ${activeConf.excBg}`}>
          <p className={`text-xs font-700 tracking-[0.2em] uppercase mb-3 ${activeConf.excText}`}>
            {exclusivity.tag}
          </p>
          <p className="text-sm font-700 text-cnv-core mb-4">
            {exclusivity.subtitle}
          </p>
          <div className="flex flex-col gap-2">
            {exclusivity.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3 text-sm font-500 text-cnv-core/80">
                <svg className={`flex-shrink-0 mt-0.5 ${activeConf.excText}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
              {t.name} *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
              {t.email} *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {profile === 0 && (
            <div className="animate-fade-in">
              <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
                {t.profession}
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          )}
          {profile === 1 && (
            <div className="animate-fade-in">
              <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
                {t.institution}
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
              {t.country}
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
            {messageLabel}
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Checkbox Legal (Prueba de Consentimiento) */}
        <div className="flex items-start gap-3 mt-2">
          <div className="flex items-center h-5">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleChange}
              className={`w-4 h-4 border-2 rounded-sm appearance-none cursor-pointer transition-colors flex items-center justify-center
                ${formData.consent ? 'bg-cnv-execute border-cnv-execute' : 'border-slate-300 bg-white'}
                ${consentError ? 'border-red-500' : ''}
              `}
            />
            {/* SVG Checkmark custom para que se vea elegante */}
            {formData.consent && (
              <svg className="absolute w-3 h-3 text-white pointer-events-none ml-0.5 mt-0.5" viewBox="0 0 14 14" fill="none">
                <path d="M3 7.5L6 10.5L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className="text-xs text-cnv-core/60 leading-relaxed font-500">
            <label htmlFor="consent" className="cursor-pointer">
              {/* Reemplazamos los corchetes por un enlace real a la política */}
              {t.legal_consent.split('[')[0]}
              <a href={lang === 'es' ? '/politica-privacidad' : '/en/privacy-policy'} target="_blank" className="font-700 text-cnv-execute hover:underline">
                {t.legal_consent.match(/\[(.*?)\]/)?.[1] || 'Política de Tratamiento de Datos Personales'}
              </a>
              {t.legal_consent.split(']')[1]}
            </label>
          </div>
        </div>

        {consentError && (
          <p className="text-xs font-700 text-red-500 animate-fade-in">{t.legal_error}</p>
        )}

        {status === 'error' && (
          <p className="text-sm font-700 text-red-600 bg-red-50 p-3 border-l-2 border-red-600">{t.error}</p>
        )}

        {/* Widget de Seguridad Turnstile */}
        <div className="flex justify-start my-4">
          <Turnstile 
            siteKey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY} 
            onSuccess={(token) => setTurnstileToken(token)}
            options={{
              theme: 'light',
              language: lang // Para que el widget salga en EN o ES
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`inline-flex items-center gap-2 px-8 py-4 text-sm font-800 tracking-wide text-white transition-all duration-300 ${
              status === 'loading' 
                ? 'bg-cnv-core/50 cursor-not-allowed' 
                : 'bg-cnv-core hover:bg-cnv-core-alt cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2"/>
                  <path d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {t.sending}
              </>
            ) : (
              <>
                {t.submit}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
          <p className="text-xs font-700 text-cnv-core/30 uppercase tracking-widest">
            {t.response_time}
          </p>
        </div>
      </form>
    </div>
  );
}